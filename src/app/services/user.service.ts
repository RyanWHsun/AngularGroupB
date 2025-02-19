import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { allUsersMaterial, userEditMaterial, userMaterial, userRankMaterial } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseAddress = 'https://localhost:7112/';

  constructor(private userclient: HttpClient) { }


  //取得所有資料
  getUsers(page: number, pageSize: number, userRank: number, search: string): Observable<allUsersMaterial> {
    return this.userclient.get<allUsersMaterial>(`${this.baseAddress}api/TUsers?page=${page}&pageSize=${pageSize}&userRank=${userRank}&search=${search}`, { withCredentials: true })
  }


  // 管理員取得資料
  getUser(userId: number): Observable<allUsersMaterial> {
    return this.userclient.get<allUsersMaterial>(`${this.baseAddress}api/TUsers/${userId}`, { withCredentials: true });
  }

  // 管理員修改資料
  putUser(userId: number, user: allUsersMaterial): Observable<allUsersMaterial> {
    return this.userclient.put<allUsersMaterial>(`${this.baseAddress}api/TUsers/${userId}`, user, { withCredentials: true })
  }


  // 取得LoginUser資料
  getLoginUser(): Observable<userMaterial> {
    return this.userclient.get<userMaterial>(`${this.baseAddress}api/TUsers/loginUser`, { withCredentials: true });
  }

  // 修改LoginUser資料
  putLoginUser(user: userEditMaterial): Observable<userEditMaterial> {
    return this.userclient.put<userEditMaterial>(`${this.baseAddress}api/TUsers/loginUser`, user, { withCredentials: true })
  }

  //修改LoginUser的Rank
  putuserRank(user: userRankMaterial): Observable<userRankMaterial> {
    return this.userclient.put<userRankMaterial>(`${this.baseAddress}api/TUsers/loginUserRank`, user, { withCredentials: true })
  }

  //新增資料
  adduser(editData: any): Observable<any> {
    return this.userclient.post(`${this.baseAddress}api/TUsers`, editData, { headers: { 'Content-Type': 'application/json' } });
  }

}
