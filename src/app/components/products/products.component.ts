import { addProductToCart } from './../../interfaces/shoppingCart';
import { CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { latestProducts, Products } from 'src/app/interfaces/products';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  categories: { fProductCategoryId: number; fCategoryName: string; productCount: number }[] = [];
  products: Products[] = []; // 用來存放 API 回傳多筆的商品資料
  keyword: string = '';
  currentPage: number = 1; // 當前頁碼
  pageSize: number = 6; // 每頁顯示 6 筆資料
  pages: number[] = []; // 用於生成分頁按鈕
  hasMorePages: boolean = true;
  selectedCategoryId: number | null = null; //表示尚未篩選
  selectedCategoryName: string = '全部商品'; // 默認顯示標題
  totalProductCount: number = 1;  //所有商品數量
  selectedProductId: number | null = null;  // 當前選中的商品
  hotKeywords: string[] = ['行李箱', 'RIWAWA', '露營', '爆爆瑪特', '外套', '娃娃', 'Golumbia', '帳篷', '日本', '登山', '公仔', '台灣', '手錶', '麻將', 'Germès']
  latestProducts: latestProducts[] = []; //最新商品

  constructor(private productService: ProductsService, private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts(); // 初始化加載商品
    this.loadCategories(); // 加載分類數據
    this.loadLatestProducts();//加載最新商品
  }

  // 加載分類
  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // 計算總商品數量
        this.totalProductCount = this.categories.reduce((sum, category) => sum + category.productCount, 0);
      },
      error: (error) => {
        console.error('沒載到類別哦', error);
      }
    });
  }


  loadProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize, this.keyword, this.selectedCategoryId).subscribe({
      next: (data) => {
        //console.log(data);
        this.products = data.map(product => ({
          ...product,
          fUserImage: product.fUserImage || null, // 保留 Base64 值，若為 null 則不處理
          fImage: product.fImage || null,
        }))

        this.hasMorePages = data.length === this.pageSize; // 如果返回的商品數量等於 pageSize，說明還有更多頁面
        //console.log(this.products);
        this.showTheTitle();
      },
      error: (error) => {
        console.error('沒抓到資料辣!', error);
      },
    });
  }

  // 切換到下一頁
  nextPage(): void {
    if (this.hasMorePages) {
      this.currentPage++;
      this.loadProducts();
      // 滾動到頁面頂部
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  }

  // 切換到上一頁
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
      // 滾動到頁面頂部
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  }
  // 搜尋
  searchProducts(): void {
    this.currentPage = 1; // 重置到第一頁
    this.loadProducts();
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId; // 設置當前選擇的類別
    this.currentPage = 1; // 重置到第一頁
    this.showTheTitle();
    this.keyword = '';
    this.loadProducts(); // 載入篩選後的商品列表
  }

  showTheTitle() {
    // 更新標題顯示邏輯
    if (this.keyword && this.keyword.trim() !== '') {
      this.selectedCategoryName = `"${this.keyword}" 的搜尋結果`;
    } else if (this.selectedCategoryId) {
      this.selectedCategoryName = this.categories.find(c => c.fProductCategoryId === this.selectedCategoryId)?.fCategoryName || '全部商品';
      this.keyword = '';
    } else {
      this.selectedCategoryName = '全部商品';
      this.keyword = '';
    }
  }

  resetFilters(): void {
    this.keyword = ''; // 清空關鍵字
    this.selectedCategoryId = null; // 重置類別選擇
    this.currentPage = 1; // 回到第一頁
    this.loadProducts(); // 重新加載商品列表
  }

  // 設定選中的商品
  openProductDetail(productId: number): void {
    this.selectedProductId = productId; // 設定當前商品資料
    //console.log(productId);
  }

  // 關閉彈窗
  closeProductDetail(): void {
    this.selectedProductId = null;
    console.log('click!');
  }

  addToCart(product: Products) {
    const item: addProductToCart = {
      fItemType: 'product',
      fItemId: product.fProductId,
      fQuantity: 1,
      fPrice: product.fProductPrice
    };
    //console.log(item);
    this.cartService.addProductToCart(item).subscribe({
      next: (response) => {
        //console.log(response);
        alert(response.message);
        this.cartService.loadCartCount();
      }, error: (error) => {
        if (error.status === 401) {
          console.log(error);
          console.warn('沒登入，顯示提示訊息');
          alert('請先登入哦!');
          this.router.navigate(['user/login']);
        } else {
          console.log('加入購物車錯誤:', error);
          alert(error.error.message);
        }
      }
    })
  }

  loadLatestProducts(): void {
    this.productService.getLatestProducts().subscribe({
      next: (data) => {
        this.latestProducts = data;
        console.log(this.latestProducts);
      },
      error: (error) => {
        console.error('最新商品載入錯誤:', error)
      }
    })
  }
}

