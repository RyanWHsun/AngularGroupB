import { myProductList } from './../../interfaces/products';
import { ProductsService } from './../../services/products.service';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-product',
  templateUrl: './my-product.component.html',
  styleUrls: ['./my-product.component.css']
})
export class MyProductComponent {
  myProducts: myProductList[] = []; // 存放 API 回傳的商品列表
  selectedProducts: number[] = []; // 存放選取的商品 ID
  categories: { fProductCategoryId: number; fCategoryName: string; }[] = [];
  selectedFilter: string = 'all';
  filteredProducts: myProductList[] = [];
  onSaleCount: number = 0;
  offSaleCount: number = 0;
  searchKeyword: string = '';
  selectedCategory: number | '' = ''; // 預設為所有分類
  isAllSelected: boolean = false; // 預設未全選


  constructor(private productsService: ProductsService, private authService: AuthService) { };

  ngOnInit(): void {
    this.loadMyProduct();
    this.loadCategories();
  }

  loadMyProduct() {
    this.productsService.getMyProduct().subscribe({
      //console.log('myProduct', data);
      next: (data) => {
        //console.log(data);
        this.myProducts = data;
        this.updateProductCounts();
        this.filterProductsByStatus('all') //預設顯示全部商品
      },
      error: (error) => {
        console.log('沒抓到商品哦', error);
      }
    })
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
    if (this.selectedCategory) {
      //console.log(this.selectedCategory);
      this.filteredProducts = this.myProducts.filter(p => p.fProductCategoryId == this.selectedCategory)
    } else {
      this.filteredProducts = [...this.myProducts]; // 顯示全部
    }
  }

  searchProducts(): void {
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
    if (filterType === 'all') {
      this.filteredProducts = [...this.myProducts]; // 重新賦值，確保畫面更新
    } else if (filterType === 'onSale') {
      this.filteredProducts = this.myProducts.filter(p => p.fIsOnSales);
    } else if (filterType === 'offSale') {
      this.filteredProducts = this.myProducts.filter(p => !p.fIsOnSales);
    }
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchKeyword = '';
    this.filteredProducts = [...this.myProducts]; // 重置為全部
  }

  // 切換全選狀態
  toggleSelectAll(event: Event): void {
    this.isAllSelected = (event.target as HTMLInputElement).checked;
    this.myProducts.forEach(product => product.selected = this.isAllSelected);
  }
  // 監聽個別 checkbox 變化
  updateSelectAllStatus(): void {
    this.isAllSelected = this.myProducts.every(product => product.selected);
    console.log();
  }

  // 取得所有被選中的商品 ID
  getSelectedProductIds(): number[] {
    return this.myProducts.filter(product => product.selected).map(product => product.fProductId);
  }

  // 測試回傳選中的商品 ID
  logSelectedProducts(): void {
    console.log(this.getSelectedProductIds());
  }
}
