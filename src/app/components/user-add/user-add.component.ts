import { error } from 'jquery';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {

  // emailHelpText = "請輸入電子郵件";
  // 存放輸入的表單資料
  user = {
    fUserName: null,
    fUserNickName: null,
    fUserRankId: 1,
    fUserSex: "不願透露",
    fUserEmail: null,
    fUserPassword: null,
  };
  passwordType = "password";
  chackPassword: string = '';

  constructor(private userService: UserService, private router: Router, private Swal: SweetAlert2Service) { }

  ngOnInit(): void {
    window.scrollTo(0, 400);
  }



  seePassword() {
    if (this.passwordType == "password") {
      this.passwordType = "text";
    }
    else if (this.passwordType == "text") {
      this.passwordType = "password";
    }
  }




  // 送出表單資料
  submit(form: NgForm) {

    // 檢查表單是否有效
    if (form.invalid) {
      // console.log('表單驗證不通過');
      // alert('請確保所有欄位都正確填寫！');
      this.Swal.showEasyWarning('請確保所有欄位都正確填寫！');
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    // 密碼與再次輸入
    if (this.user.fUserPassword != this.chackPassword) {
      this.Swal.showEasyWarning("密碼與再次輸入不相同");
      return;
    }

    // 帳號創建
    this.userService.adduser(this.user).subscribe({
      next: (response) => {
        // console.log('成功:', response);
        // alert('帳號創建成功！');
        this.Swal.showEasySuccess('帳號創建成功！');
        this.router.navigate(['/user']);
        window.scrollTo(0, 0);
      },
      error: (error) => {
        console.log('錯誤:', error);
        // alert(error.error.message);
        if (error) {
          this.Swal.showYesNo(`${error.error.message}帳號創建失敗，請稍後再試！`);
        } else {
          // alert('帳號創建失敗，請稍後再試！');
          this.Swal.showEasyError('帳號創建失敗，請稍後再試！');
        }

      }
    })
  }



  //前往登入
  goToUserPage() {
    this.router.navigate(['/user']).then(() => {
      window.scrollTo(0, 400);
    });
  }



}
