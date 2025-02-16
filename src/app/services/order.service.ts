import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckoutRequest } from '../interfaces/shoppingCart';
import { Observable } from 'rxjs';
import { buyerOrderAll, OrderDetailsResponse } from '../interfaces/order';

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

  getOrderDetail(orderId: number): Observable<OrderDetailsResponse> {
    const url = `${this.baseAddress}api/TOrders/details/${orderId}`
    return this.http.get<OrderDetailsResponse>(url)
  }
}

