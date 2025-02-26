import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ 確保引入 environment

@Injectable({
  providedIn: 'root'
})
export class LinePayService {
  private apiUrl = `${environment.apiUrl}/payment`; // ✅ 確保 API 路徑正確

  constructor(private http: HttpClient) { }

  requestPayment(paymentRequest: any): Observable<any> {
    const token = localStorage.getItem('token'); // ✅ 取得 JWT Token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // ✅ 自動加入 Token
      'Content-Type': 'application/json'
    });

    console.log("📌 發送請求 Headers：", headers); // ✅ Debug

    return this.http.post(`${this.apiUrl}/request`, paymentRequest, { headers });
  }
}



