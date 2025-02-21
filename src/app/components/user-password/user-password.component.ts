import { userPasswordMaterial } from './../../interfaces/user';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent {

  user: userPasswordMaterial =
    {
      email: "",
      password: "",
    };

  passwordType = "password";
  chackPassword: string = '';


  constructor(private userService: UserService, private router: Router, private Swal: SweetAlert2Service) { }


  // 密碼顯示
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
    if (this.user.password != this.chackPassword) {
      this.Swal.showEasyWarning("密碼與再次輸入不相同");
      return;
    }

    // console.log(this.user);

    // 密碼修改
    this.userService.putUserPassword(this.user).subscribe({
      next: (data) => {
        this.Swal.showEasySuccess("修改成功! 將返回登入頁面!");
        setTimeout(() => {
          this.router.navigate(['/user/login'])
        }
          , 1500)
      }
      , error: (err) => {
        this.Swal.showEasyError("修改失敗!");
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
