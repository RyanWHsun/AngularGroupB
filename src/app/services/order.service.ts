import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  //賣家修改狀態
  shipOrder(orderId: number, extraInfo: string): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/shipOrder/${orderId}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ extraInfo }); // 封裝成 JSON
    //console.log('傳送中', body);
    return this.http.put<{ message: string }>(url, body, { headers })
  }

  //買家修改地址
  buyerUpdateAddress(orderId: number, FShipAddress: string): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/buyerUpdateAddress/${orderId}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ FShipAddress }); // 封裝成 JSON
    //console.log('傳送中', body);
    return this.http.put<{ message: string }>(url, body, { headers })
  }

  //買家完成訂單
  completeOrder(orderId: number): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/completeOrder/${orderId}`
    return this.http.put<{ message: string }>(url, orderId)
  }
}

