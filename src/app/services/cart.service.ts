import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { addProductToCart, ShoppingCartItem, storeSelected, userInfo } from '../interfaces/shoppingCart';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseAddress = 'https://localhost:7112/';
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable().pipe(
    debounceTime(500), //避免短時間內多次請求
    distinctUntilChanged() //只有當數量變更才通知
  );

  constructor(private http: HttpClient) {
    this.loadCartCount();
  }

  getCartItems(): Observable<ShoppingCartItem[]> {
    const url = `${this.baseAddress}api/TShoppingCarts`
    return this.http.get<ShoppingCartItem[]>(url, { withCredentials: true })
  }

  addProductToCart(item: addProductToCart): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TShoppingCarts/addProductToCart`
    return this.http.post<{ message: string }>(url, item, { withCredentials: true })
  }

  getCartItemCount(): Observable<{ count: number }> {
    const url = `${this.baseAddress}api/TShoppingCarts/ItemCount`
    return this.http.get<{ count: number }>(url, { withCredentials: true })
  }

  loadCartCount(): void {
    this.getCartItemCount().subscribe({
      next: (response) => {
        //console.log("購物車數量:", response.count),
        this.cartItemCount.next(response.count)
      },
      error: (error) => {
        //console.error('無法獲取數量', error);
        this.cartItemCount.next(0);
      }
    });
  }

  removeCartItem(cartItemId: number): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TShoppingCarts/remove/${cartItemId}`;
    return this.http.delete<{ message: string }>(url, { withCredentials: true });
  }

  removeCartItems(cartItemIds: number[]): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TShoppingCarts/removeBatch`
    return this.http.post<{ message: string }>(url, cartItemIds, { withCredentials: true })
  }

  getUserInfo(): Observable<userInfo> {
    const url = `${this.baseAddress}api/TOrders/getUserInfo`
    return this.http.get<userInfo>(url, { withCredentials: true })
  }

  //old
  openStoreMap(): Observable<{ mapUrl: string }> {
    const url = `${this.baseAddress}api/ECPayLogistics/openStoreMap`
    return this.http.post<{ mapUrl: string }>(url, {});
  }

  //取得門市網站(Uni)
  openUniStoreMap(): Observable<any> {
    const url = `${this.baseAddress}api/UniLogistic/openStoreMap`
    return this.http.post<any>(url, {});
  }

  // 取得選擇的門市資訊
  getSelectedStore(): Observable<storeSelected> {
    const url = `${this.baseAddress}api/UniLogistic/uniPay/storeInfoCache`
    return this.http.get<storeSelected>(url);
  }
}

