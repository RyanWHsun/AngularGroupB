import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ 確保引入 environment

@Injectable({
  providedIn: 'root'
})
export class LinePayService {
  private linePayApiUrl = `${environment.linePayApiUrl}/payment`; // ✅ 確保 API 路徑正確

  constructor(private http: HttpClient) { }


  requestPayment(paymentRequest: any): Observable<any> {
    return this.http.post('https://localhost:7112/api/payment/request', paymentRequest, { withCredentials: true })
  }
}



