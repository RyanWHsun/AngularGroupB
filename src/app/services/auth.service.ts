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

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  // Writer: Li-Chun Chen
  getUserInfo(){
    return this.httpClient.get<IUser>(`${this.apiUrl}/userInfo`, {withCredentials:true});
  }
  // Writer: Li-Chun Chen
}
