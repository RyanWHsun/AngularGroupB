import { ProductsService } from 'src/app/services/products.service';
import { Component, OnInit } from '@angular/core';
import { createProduct } from 'src/app/interfaces/products';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 初始化表單
    this.productForm = this.fb.group({
      fProductCategoryId: [1, Validators.required], // 預設類別 ID
      fProductName: ['', [Validators.required, Validators.minLength(3)]],
      fProductPrice: [0, [Validators.required, Validators.min(1)]],
      fProductDescription: [''],
      fIsOnSales: [true, Validators.required],
      fStock: [0, [Validators.required, Validators.min(0)]],
      fImage: [[]], // 存放圖片 Base64
    });
  }

  // 當使用者選擇圖片時
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // 讀取圖片並轉成 Base64
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.productForm.patchValue({
          fImage: [this.imagePreview.split(',')[1]], // 轉換為 base64
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // 送出表單
  submitForm(): void {
    if (this.productForm.invalid) {
      alert('請填寫完整的商品資訊');
      return;
    }
    const productData: createProduct = this.productForm.value as createProduct;
    console.log(productData);
    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        alert('商品新增成功!');
        this.router.navigate(['/products/myProduct']);
      },
      error: (error) => {
        console.error('新增商品失敗:', error);
        alert('新增失敗，請檢查輸入!');
      },
    });
  }
}
