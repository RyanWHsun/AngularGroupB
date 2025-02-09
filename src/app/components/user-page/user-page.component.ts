import { userMaterial } from './../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { data, error } from 'jquery';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {


  user: userMaterial | null = null;  // 用來儲存用戶資料
  userId: number | null = null;  // 儲存從本地存儲中取得的 userId

  constructor(private userService: UserService) { }


  fUserName = "你的名字";
  fUserNickName = "你的暱稱";
  fUserImage = "assets/images/noImage.jpg"
  fUserSex = "女";
  fUserBirthday = "2000-01-01";
  fUserComeDate = "2025-02-06";


  ngOnInit(): void {
    this.loadUser(0);
  }

  //找登入者的資料
  loadUser(userId: number) {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        console.log(data);

        if (data) {  // 確保資料存在
          this.user = data;  // 存入 user
          this.fUserName = data.fUserName;
          this.fUserNickName = data.fUserNickName;
          this.fUserImage = data.fUserImage ? `data:image/png;base64,${data.fUserImage}` : "assets/images/noImage.jpg";
          this.fUserSex = data.fUserSex;
          this.fUserBirthday = data.fUserBirthday.split("T")[0];;
          this.fUserComeDate = data.fUserComeDate.split("T")[0];;
        }
      },
      error: (error) => {
        console.log("找不到用戶", error);
      }
    })
  }


}




