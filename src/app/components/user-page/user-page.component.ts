import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { userEditMaterial, userMaterial, userRankMaterial } from './../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { data, error } from 'jquery';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {


  user: userMaterial | null = null;  // 用來儲存用戶資料
  userId: number | null = null;  // 儲存從本地存儲中取得的 userId

  userRank: userRankMaterial = {
    fUserName: "",
    fUserNickName: "",
    fUserRankId: 0
  };


  constructor(private userService: UserService, private router: Router, private authService: AuthService, private Swal: SweetAlert2Service) { }


  fUserName = "你的名字";
  fUserNickName = "你的暱稱";
  fUserImage = "assets/images/noImage.jpg"
  fUserSex = "女";
  fUserBirthday = "2000-01-01";
  fUserComeDate = "";


  ngOnInit(): void {
    this.loadUser();
    window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  //找登入者的資料
  loadUser() {
    this.userService.getLoginUser().subscribe({
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
    this.router.navigate(['/products/cart']);
  }
  //前往修改資料
  goToUserEdit() {
    this.router.navigate(['/user/edit']);
  }



  //註銷帳號
  setRank() {
    this.Swal.showYesNo("確認要註銷帳號嗎?").then((a) => {
      if (a.isConfirmed) {

        this.Swal.showEasyWarning("用戶已刪除");
        setTimeout(() => {
          this.setRankTo2();
          this.logout();
        }, 2000);
      }
    });
    // if (confirm('確定要刪除嗎？')) {
    //   alert("用戶已刪除");
    //   this.setRankTo2();
    //   this.logout();
    // }
  }

  setRankTo2() {
    this.userRank.fUserName = this.user!.fUserName;
    this.userRank.fUserNickName = this.user!.fUserNickName;
    this.userRank.fUserRankId = 2;
    console.log(this.userRank);

    this.userService.putuserRank(this.userRank).subscribe({
      next: () => {
        console.log("修改成功", this.userRank);
      },
      error: (error) => {
        console.log("修改失敗", error);
      }
    })
  }


  //登出按鈕
  logOut() {
    this.Swal.showYesNo('確定要登出嗎？').then((a) => {
      if (a.isConfirmed) {
        this.Swal.showEasySuccess("用戶已登出");
        setTimeout(() => {
          this.logout();
        }, 2000);
      }
    });
    // if (confirm('確定要登出嗎？')) {
    //   alert("用戶已登出");
    //   this.logout();
    // };
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/user/login']).then(() => { window.location.reload(); });
      },
      error: (error) => {
        // console.error("登出 API 失敗:", error);
        // alert("登出失敗，請稍後再試！");
        this.Swal.showEasyError("登出失敗，請稍後再試！");
      }
    });
  }


}




