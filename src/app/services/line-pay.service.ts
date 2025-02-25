import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ 使用 environment 變數

@Injectable({
  providedIn: 'root'
})
export class LinePayService {
  private apiUrl = `${environment.apiUrl}/linepay`; // ✅ 確保這個 URL 來自 environment

  constructor(private http: HttpClient) { }

  requestPayment(paymentRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-payment`, paymentRequest);
  }
}


