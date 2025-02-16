import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckoutRequest } from '../interfaces/shoppingCart';
import { Observable } from 'rxjs';
import { buyerOrderAll, OrderDetailsResponse, sellerOrderAll } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseAddress = 'https://localhost:7112/';
  constructor(private http: HttpClient) { }

  //建立訂單
  checkOut(order: CheckoutRequest): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders`
    return this.http.post<{ message: string }>(url, order, { withCredentials: true })
  }

  //買家訂單
  getBuyerOrder(): Observable<buyerOrderAll[]> {
    const url = `${this.baseAddress}api/TOrders/getBuyerOrder`
    return this.http.get<buyerOrderAll[]>(url, { withCredentials: true })
  }

  //買家訂單明細
  getOrderDetail(orderId: number): Observable<OrderDetailsResponse> {
    const url = `${this.baseAddress}api/TOrders/details/${orderId}`
    return this.http.get<OrderDetailsResponse>(url)
  }

  //賣家訂單
  getSellerOrders(): Observable<sellerOrderAll[]> {
    const url = `${this.baseAddress}api/TOrders/getSellerOrder`
    return this.http.get<sellerOrderAll[]>(url, { withCredentials: true })
  }
}

