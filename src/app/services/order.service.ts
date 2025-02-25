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

  // ✅ 新增 `createOrder()`
  createOrder(userId: number, selectedItems: any[]): Observable<{ orderId: number }> {
    const url = `${this.baseAddress}api/TOrders/createOrder`;
    const body = { userId, selectedItems };

    return this.http.post<{ orderId: number }>(url, body, { withCredentials: true });
  }

  // 📌 現有方法保持不變

  checkOut(order: CheckoutRequest): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders`
    return this.http.post<{ message: string }>(url, order, { withCredentials: true });
  }

  getBuyerOrder(): Observable<buyerOrderAll[]> {
    const url = `${this.baseAddress}api/TOrders/getBuyerOrder`
    return this.http.get<buyerOrderAll[]>(url, { withCredentials: true });
  }

  getOrderDetail(orderId: number): Observable<OrderDetailsResponse> {
    const url = `${this.baseAddress}api/TOrders/details/${orderId}`
    return this.http.get<OrderDetailsResponse>(url);
  }

  getSellerOrders(): Observable<sellerOrderAll[]> {
    const url = `${this.baseAddress}api/TOrders/getSellerOrder`
    return this.http.get<sellerOrderAll[]>(url, { withCredentials: true });
  }

  shipOrder(orderId: number, extraInfo: string): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/shipOrder/${orderId}`
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ extraInfo });
    return this.http.put<{ message: string }>(url, body, { headers });
  }

  buyerUpdateAddress(orderId: number, FShipAddress: string): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/buyerUpdateAddress/${orderId}`
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ FShipAddress });
    return this.http.put<{ message: string }>(url, body, { headers });
  }

  completeOrder(orderId: number): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/completeOrder/${orderId}`
    return this.http.put<{ message: string }>(url, orderId);
  }

  //賣家端產生QRCode
  getQRcode(orderId: number): Observable<Blob> {
    const url = `${this.baseAddress}api/TOrders/generateQR/${orderId}`
    return this.http.get<Blob>(url, { responseType: 'blob' as 'json' });
  }

  //賣家用QR更新訂單
  shipOrderByQR(orderId: number): Observable<{ message: string }> {
    const url = `${this.baseAddress}api/TOrders/shipOrderByQR/${orderId}`
    return this.http.put<{ message: string }>(url, orderId);
  }



}


