import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ProductDetail, Products } from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})


export class ProductsService {
  baseAddress = 'https://localhost:7112/';

  constructor(private http: HttpClient) { }

  getProducts(page: number = 1, pageSize: number = 6, keyword?: string, categoryId: number | null = null,): Observable<Products[]> {
    // 基本的 API URL
    let url = `${this.baseAddress}api/TProducts?page=${page}&pageSize=${pageSize}`;

    // 如果 keyword 有值，追加到 URL
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    // 如果 categoryId 有值，追加到 URL
    if (categoryId !== undefined && categoryId !== null) {
      url += `&categoryId=${categoryId}`;
    }

    return this.http.get<Products[]>(url);
  }

  getCategories(): Observable<{ fProductCategoryId: number; fCategoryName: string; productCount: number }[]> {
    const url = `${this.baseAddress}api/TProductCategories`;
    return this.http.get<{ fProductCategoryId: number; fCategoryName: string; productCount: number }[]>(url);
  }

  // 呼叫 API，傳入 productId
  getProductDetail(productId: number): Observable<ProductDetail> {
    const url = `${this.baseAddress}api/TProducts/${productId}`;
    return this.http.get<ProductDetail>(url);
  }
}
