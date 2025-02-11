import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
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

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }


  fUserName = "你的名字";
  fUserNickName = "你的暱稱";
  fUserImage = "assets/images/noImage.jpg"
  fUserSex = "女";
  fUserBirthday = "2000-01-01";
  fUserComeDate = "";


  ngOnInit(): void {
    this.loadUser(0);
    window.scrollTo(0, 0);
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
          if (data.fUserBirthday != null) {
            this.fUserBirthday = data.fUserBirthday.split("T")[0];
          };
          this.fUserComeDate = data.fUserComeDate.split("T")[0];;
        }
      },
      error: (error) => {
        console.log("找不到用戶", error);
      }
    })
  }



  //前往購物車
  goToShoppingCart() {
    this.router.navigate(['']);
  }
  //前往修改資料
  goToUserEdit() {
    this.router.navigate(['/user/edit']);
  }




  logOut() {
    if (confirm('確定要登出嗎？')) {
      this.authService.logout().subscribe({
        next: (a) => {
          //清除本地儲存的 Token
          localStorage.removeItem('jwt_token');
          sessionStorage.removeItem('jwt_token');
          alert("Token 已刪除，開始登出");
          this.router.navigate(['/user/login']);
        },
        error: (error) => {
          console.error("登出 API 失敗:", error);
          alert("登出失敗，請稍後再試！");
        }
      });
    };
  }

}




