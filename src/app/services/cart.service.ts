import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { addProductToCart, ShoppingCartItem } from '../interfaces/shoppingCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseAddress = 'https://localhost:7112/';

  constructor(private http: HttpClient) { }

  getCartItems(): Observable<ShoppingCartItem[]> {
    const url = `${this.baseAddress}api/TShoppingCarts`
    return this.http.get<ShoppingCartItem[]>(url, { withCredentials: true })
  }

  addProductToCart(item: addProductToCart): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TShoppingCarts/addProductToCart`
    return this.http.post<{ message: string }>(url, item, { withCredentials: true })
  }
}

