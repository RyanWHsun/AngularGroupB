import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IUser } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7112/api/auth';

  constructor(private httpClient: HttpClient) { }

  // 檢查是否登入
  isLogin() {
    return this.httpClient.get(`${this.apiUrl}/checkAuth`, { withCredentials: true })
  }

  //登入
  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  // 登出
  logout() {
    return this.httpClient.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  // 驗證是不是管理者
  isAdmin(){
    return this.httpClient.get(`${this.apiUrl}/isAdmin`, {withCredentials: true});
  }
}
