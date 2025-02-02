import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userclient: HttpClient) { }

  userid = 0;
  editData = {
    FUserId: 0,
    FUserName: "",
    FUserRankId: 1,
    FUserNickName: "",
    FUserEmail: "",
    FUserBirthday: "",
    FUserPhone: "",
    FUserSex: "",
    FUserAddress: "",
    FUserImage: [],
    FUserComeDate: "",
    FUserPassword: "",
  }


  // 取得資料
  getUser() {
    this.userclient.get(`https://localhost:7112/api/TUsers/${this.userid}`);
  }

  //修改資料
  putuser() {
    this.userclient.put(`https://localhost:7112/api/TUsers/${this.userid}`, this.editData)
  }

  //新增資料
  adduser() {
    this.userclient.post("https://localhost:7112/api/TUsers", this.editData)
  }

}
