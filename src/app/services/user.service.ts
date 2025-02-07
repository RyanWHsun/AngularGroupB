import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userMaterial } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseAddress = 'https://localhost:7112/';

  constructor(private userclient: HttpClient) { }

  // 取得資料
  getUser(userId: number): Observable<userMaterial[]> {
    return this.userclient.get<userMaterial[]>(`${this.baseAddress}api/TUsers/${userId}`, { withCredentials: true });
  }

  //修改資料
  putuser(userid: any): Observable<any> {
    return this.userclient.put(`${this.baseAddress}api/TUsers/${userid}`, userid)
  }

  //新增資料
  adduser(editData: any): Observable<any> {
    return this.userclient.post(`${this.baseAddress}api/TUsers`, editData)
  }

}
