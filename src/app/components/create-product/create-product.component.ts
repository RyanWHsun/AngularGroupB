import { ProductsService } from 'src/app/services/products.service';
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { createProduct } from 'src/app/interfaces/products';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  selectedImages: File[] = [];
  imagePreviews: string[] = []; //預覽圖片
  categories: { fProductCategoryId: number; fCategoryName: string; }[] = [];
  maxImages: number = 6;


  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    // 初始化表單
    this.productForm = this.fb.group({
      fProductCategoryId: [1, Validators.required], // 預設類別 ID
      fProductName: ['', [Validators.required, Validators.minLength(3)]],
      fProductPrice: [1, [Validators.required, Validators.min(1), Validators.pattern('^[1-9][0-9]*$')]],
      fProductDescription: [''],
      fIsOnSales: [true, Validators.required],
      fStock: [1, [Validators.required, Validators.min(1), Validators.pattern('^[1-9][0-9]*$')]],
      fImage: [[]], // 存放圖片 Base64
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('沒載到類別哦', error);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      if (event.dataTransfer.files.length + this.imagePreviews.length > this.maxImages) {
        alert('最多只能上傳 6 張圖片');
        return;
      }
      this.handleImageUpload(event.dataTransfer.files);
    }
  }

  onImageSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length + this.imagePreviews.length > this.maxImages) {
      alert('最多只能上傳 6 張圖片');
      return;
    }
    this.handleImageUpload(files);
  }


  handleImageUpload(files: FileList): void {
    Array.from(files).forEach(file => {
      if (this.imagePreviews.length < this.maxImages) {
        this.selectedImages.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
          console.log("目前預覽圖片:", this.imagePreviews);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 移除圖片
  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  // 送出表單
  async submitForm(): Promise<void> {
    if (this.productForm.invalid) {
      alert('請填寫完整的商品資訊');
      return;
    }

    console.log("開始轉換圖片為 Base64...");
    const base64Images = await this.convertImagesToBase64();
    console.log("轉換完成的 Base64 圖片:", base64Images);

    if (base64Images.length === 0) {
      alert('請至少上傳一張圖片');
      return;
    }

    this.productForm.patchValue({
      fImage: base64Images
    });

    // 發送 API
    const productData: createProduct = this.productForm.value as createProduct;
    console.log("即將發送的商品資料:", productData);

    this.productService.createProduct(productData).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.router.navigate(['/products/myProduct']);
      },
      error: (error) => {
        console.error('新增商品失敗:', error);
        alert(error.message);
      },
    });
  }


  private async convertImagesToBase64(): Promise<string[]> {
    if (this.selectedImages.length === 0) {
      console.warn("沒有圖片可轉換");
      return [];
    }

    console.log("開始轉換 Base64，圖片數量:", this.selectedImages.length);

    return Promise.all(
      this.selectedImages.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            console.log("圖片讀取成功:", file.name);
            resolve((reader.result as string).split(',')[1]); // 只取 Base64
          };
          reader.onerror = () => {
            console.error("讀取圖片失敗:", file.name);
            reject("讀取失敗");
          };
          reader.readAsDataURL(file);
        });
      })
    );
  }

}
