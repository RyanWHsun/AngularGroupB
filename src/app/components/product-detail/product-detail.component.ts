import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ProductDetail } from 'src/app/interfaces/products';
import { ProductsService } from 'src/app/services/products.service';
import { addProductToCart } from 'src/app/interfaces/shoppingCart';
import { CartService } from 'src/app/services/cart.service';
declare var $: any;  // 確保 jQuery 可用

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
  quantity: number = 1; //數量
  modalInstance: any;

  constructor(private productService: ProductsService, private cartService: CartService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId) {
      this.loadProductDetail();
    }
  }

  ngOnDestroy() {
    // 在元件銷毀時確保數量重置
    this.resetQuantity();
  }

  loadProductDetail(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getProductDetail(this.productId).subscribe({
      next: (data) => {
        this.productDetail = data;
        this.isLoading = false;
        //console.log(data);
        // 等待 DOM 渲染完成後初始化 carousel
        setTimeout(() => {
          ($('#productCarousel') as any).carousel({
            interval: 2000,
            ride: 'carousel', // 啟動自動輪播
            pause: "hover"   // 滑鼠停留時暫停
          });
        }, 500); // 延遲確保 HTML 渲染完成
      },
      error: (err) => {
        this.errorMessage = '無法載入商品詳情，請稍後再試';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  increaseQty() {
    if (this.quantity < this.productDetail.fStock) {
      this.quantity++;
    }
    console.log(this.quantity);
  }
  // 減少數量，最低為 1
  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    const item: addProductToCart = {
      fItemType: 'product',
      fItemId: this.productDetail.fProductId,
      fQuantity: this.quantity,
      fPrice: this.productDetail.fProductPrice
    };
    //console.log(item);
    this.cartService.addProductToCart(item).subscribe({
      next: (response) => {
        //console.log(response);
        alert(response.message);
        this.cartService.loadCartCount();
      }, error: (error) => {
        console.log('加入購物車錯誤:', error);
        alert(error.error.message);
      }
    })
    this.resetQuantity();
  }

  resetQuantity() {
    this.quantity = 1; // 重設數量為 1
  }
}
