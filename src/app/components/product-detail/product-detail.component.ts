import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ProductDetail } from 'src/app/interfaces/products';
import { ProductsService } from 'src/app/services/products.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  @Input() productId!: number; // 接收父組件傳入的商品ID
  @Output() close = new EventEmitter<void>(); // 用於通知父組件關閉彈窗

  productDetail!: ProductDetail; // 用來存放 API 回傳的資料
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private productService: ProductsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId) {
      this.loadProductDetail();
    }
  }
  loadProductDetail(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getProductDetail(this.productId).subscribe({
      next: (data) => {
        this.productDetail = data;
        this.isLoading = false;
        //console.log(data);
      },
      error: (err) => {
        this.errorMessage = '無法載入商品詳情，請稍後再試';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  closeModal(): void {
    this.close.emit(); // 發出關閉事件，通知父元件
    ($('#productDetailModal') as any).modal('hide'); // 使用 Bootstrap 4 的方式隱藏模態框
  }

}
