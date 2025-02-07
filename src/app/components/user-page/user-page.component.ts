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
    this.loadUser(2);
  }

  loadUser(userId: number) {
    this.userService.getUser(userId).subscribe(
      (data) => {
        this.user = data;

        console.log(data);
        console.log(this.user);
      }
    )
  }


}




