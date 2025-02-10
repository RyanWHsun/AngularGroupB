import { ProductsService } from 'src/app/services/products.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createProduct } from 'src/app/interfaces/products';
import { ActivatedRoute, Router } from '@angular/router';
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
  isEditMode = false;
  productId!: number; //存要編輯的商品ID
  titleName = '新增商品'


  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.initForm();

    //取得參數(productId)
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.isEditMode = true;
        this.titleName = '編輯商品'
        this.productId = parseInt(id, 10);
        this.loadProductDetails(this.productId);
      }
    })
    setTimeout(() => {
      const scrollY = window.innerHeight * 0.2; //視窗高度百分比
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }, 200);
  }
  // 初始化表單
  initForm(): void {
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

  loadProductDetails(productId: number): void {
    this.productService.getProductWithUserId(productId).subscribe({
      next: (product) => {
        //console.log("API 回傳的商品資料:", product);
        this.productForm.patchValue({
          fProductCategoryId: product.fProductCategoryId,
          fProductName: product.fProductName,
          fProductPrice: product.fProductPrice,
          fProductDescription: product.fProductDescription,
          fIsOnSales: product.fIsOnSales,
          fStock: product.fStock
        });
        //圖片
        if (product.fImage && product.fImage.length > 0) {
          this.imagePreviews = product.fImage.map(img => `data:image/png;base64,${img}`);
          console.log(this.imagePreviews);
        }

      },
      error: (error) => {
        alert(error.error)
        console.error('獲取商品失敗', error);
      }
    })
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
    // 轉換圖片為 Base64
    let base64Images = await this.convertImagesToBase64();

    // 確保不會產生重複圖片
    const existingImages = this.imagePreviews
      .filter(img => !this.selectedImages.some(file => img.includes(file.name)))
      .map(img => img.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));

    base64Images = [...new Set([...existingImages, ...base64Images])]; // 確保不重複
    if (base64Images.length === 0 && this.imagePreviews.length === 0) {
      alert('請至少上傳一張圖片');
      return;
    }
    this.productForm.patchValue({
      fImage: base64Images
    });

    // 發送 API
    const productData: createProduct = this.productForm.value as createProduct;
    console.log("即將發送的商品資料:", productData);

    if (this.isEditMode) {
      productData.fProductId = this.productId;
      this.productService.updateProduct(productData).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.router.navigate(['/products/myProduct']);
        }, error: (error) => {
          alert(error.message);
          console.error('修改商品失敗', error);
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.router.navigate(['/products/myProduct']);
        },
        error: (error) => {
          alert(error.message);
          console.error('新增商品失敗:', error);
        },
      });
    }
  }

  private async convertImagesToBase64(): Promise<string[]> {
    if (this.selectedImages.length === 0) {
      console.warn("沒有新圖片可轉換，將使用現有圖片");
      return [];
    }
    return Promise.all(
      this.selectedImages.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            //console.log("圖片讀取成功:", file.name);
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
