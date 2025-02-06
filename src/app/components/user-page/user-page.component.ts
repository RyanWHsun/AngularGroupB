import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

  constructor(private userService: UserService) { }


  fUserName = "你的名字";
  fUserNickName = "你的暱稱";
  fUserImage = "assets/images/noImage.jpg"
  fUserSex = "女";
  fUserBirthday = "2000-01-01";
  fUserComeDate = "2025-02-06";



}
