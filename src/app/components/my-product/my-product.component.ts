import { SweetAlert2Service } from './../../services/sweet-alert2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { myProductList, ProductDetail } from './../../interfaces/products';
import { ProductsService } from './../../services/products.service';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-product',
  templateUrl: './my-product.component.html',
  styleUrls: ['./my-product.component.css']
})
export class MyProductComponent {
  myProducts: myProductList[] = []; // 存放 API 回傳的商品列表
  selectedProducts: number[] = []; // 存放選取的商品 ID
  selectedProduct: ProductDetail | null = null; //單筆商品
  categories: { fProductCategoryId: number; fCategoryName: string; }[] = [];
  selectedFilter: string = 'all';
  filteredProducts: myProductList[] = [];
  onSaleCount: number = 0;
  offSaleCount: number = 0;
  searchKeyword: string = '';
  selectedCategory: number | '' = ''; // 預設為所有分類
  isAllSelected: boolean = false; // 預設未全選


  constructor(private productsService: ProductsService, private authService: AuthService, private router: Router, private swal: SweetAlert2Service) { };

  ngOnInit(): void {
    this.loadMyProduct();
    this.loadCategories();
  }

  loadMyProduct() {
    this.productsService.getMyProduct().subscribe({
      next: (data) => {
        //console.log(data);
        this.myProducts = data;
        this.updateProductCounts();
        this.filterProductsByStatus('all') //預設顯示全部商品
        //console.log(this.myProducts);
      },
      error: (error) => {
        console.log('沒抓到商品哦', error);
        this.swal.showEasyWarning('請先登入會員!');
        this.router.navigate(['user/login']);
      }
    })
    setTimeout(() => {
      const scrollY = window.innerHeight * 0.2; //視窗高度百分比
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }, 200);
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('沒載到類別哦', error);
      }
    });
  }

  filterByCategory() {
    // 清空所有選中的商品
    this.myProducts.forEach(product => product.selected = false);
    this.isAllSelected = false; // 取消全選
    if (this.selectedCategory) {
      //console.log(this.selectedCategory);
      this.filteredProducts = this.myProducts.filter(p => p.fProductCategoryId == this.selectedCategory)
    } else {
      this.filteredProducts = [...this.myProducts]; // 顯示全部
    }
  }

  searchProducts(): void {
    // 清空所有選中的商品
    this.myProducts.forEach(product => product.selected = false);
    this.isAllSelected = false; // 取消全選
    if (this.searchKeyword.trim() !== '') {
      this.filteredProducts = this.myProducts.filter(p =>
        p.fProductName.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.myProducts]; // 顯示全部
    }
  }

  updateProductCounts(): void {
    this.onSaleCount = this.myProducts.filter(p => p.fIsOnSales).length;
    this.offSaleCount = this.myProducts.filter(p => !p.fIsOnSales).length;
  }

  filterProductsByStatus(filterType: string): void {
    this.selectedFilter = filterType;
    // 清空所有選中的商品
    this.myProducts.forEach(product => product.selected = false);
    this.isAllSelected = false; // 取消全選
    if (filterType === 'all') {
      this.filteredProducts = [...this.myProducts]; // 重新賦值，確保畫面更新
    } else if (filterType === 'onSale') {
      this.filteredProducts = this.myProducts.filter(p => p.fIsOnSales);
    } else if (filterType === 'offSale') {
      this.filteredProducts = this.myProducts.filter(p => !p.fIsOnSales);
    }
  }

  resetFilters(): void {
    // 清空所有選中的商品
    this.myProducts.forEach(product => product.selected = false);
    this.isAllSelected = false; // 取消全選
    this.selectedCategory = '';
    this.searchKeyword = '';
    this.filteredProducts = [...this.myProducts]; // 重置為全部
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: '確定要刪除這個商品嗎?',
      text: '刪除後無法復原。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      confirmButtonColor: '#28a746',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(productId).subscribe({
          next: (response) => {
            this.swal.showEasySuccess(response.message);
            this.loadMyProduct(); // 重新載入商品列表
          },
          error: (error: HttpErrorResponse) => {
            this.swal.showEasyError(error.error.message)
            console.log('刪除商品失敗:', error);
          }
        });
      }
    });

  }

  editProduct(productId: number): void {
    this.productsService.getProductWithUserId(productId).subscribe({
      next: (product) => {
        this.router.navigate(['/products/editProduct', productId]);
        console.log(productId);
      }, error: (error) => {
        console.error('商品獲取失敗:', error);
      }
    });
  }

  //批次切換狀態
  batchChangeStatus(): void {
    const selectedIds = this.getSelectedProductIds();
    if (selectedIds.length === 0) {
      this.swal.showEasyWarning('請至少選擇一筆商品!');
      return;
    }
    this.productsService.batchUpdateStatus(selectedIds).subscribe({
      next: (response) => {
        this.swal.showEasySuccess(response.message)
        this.loadMyProduct();
      },
      error: (error) => {
        console.log('批次更新失敗', error);
        this.swal.showEasyError('批次更新失敗');
      }
    });
  }

  // 切換全選狀態
  toggleSelectAll(event: Event): void {
    this.isAllSelected = (event.target as HTMLInputElement).checked;
    this.filteredProducts.forEach(product => product.selected = this.isAllSelected);
  }
  // 監聽個別 checkbox 變化
  updateSelectAllStatus(): void {
    this.isAllSelected = this.filteredProducts.every(product => product.selected);
  }

  // 取得所有被選中的商品 ID
  getSelectedProductIds(): number[] {
    return this.filteredProducts.filter(product => product.selected).map(product => product.fProductId);
  }

  // 測試回傳選中的商品 I D
  logSelectedProducts(): void {
    console.log(this.getSelectedProductIds());
  }
}
