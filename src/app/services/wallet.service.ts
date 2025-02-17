import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userWallet } from '../interfaces/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  baseAddress = 'https://localhost:7112/';
  constructor(private http: HttpClient) { }

  getUserWallet(): Observable<userWallet[]> {
    const url = `${this.baseAddress}api/TWallets`
    return this.http.get<userWallet[]>(url, { withCredentials: true })
  }
}
