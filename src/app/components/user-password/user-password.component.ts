import { sendEmail, userPasswordMaterial } from './../../interfaces/user';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { data, error } from 'jquery';
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

  theEmail: sendEmail = {
    Email: "",
    Subject: "旅勸步町-密碼修改驗證",
  };

  passwordType = "password";
  chackPassword: string = '';
  sendEmail: number = 1;
  VerificationCode = "";
  isLoding = false;

  constructor(private userService: UserService, private router: Router, private Swal: SweetAlert2Service) { }



  ngOnInit(): void {
    window.scrollTo(0, 400);
  }

  // 密碼顯示
  seePassword() {
    if (this.passwordType == "password") {
      this.passwordType = "text";
    }
    else if (this.passwordType == "text") {
      this.passwordType = "password";
    }
  }




  // 送出email表單資料
  submitEmail(form: NgForm) {
    if (form.invalid) {
      this.Swal.showEasyWarning('請確保所有欄位都正確填寫！');
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.theEmail.Email = this.user.email;
    console.log(this.user.email);
    //送出去囉
    this.isLoding = true;
    this.userService.sendEmail(this.theEmail).subscribe({
      next: () => {
        this.isLoding = false;
        this.Swal.showEasySuccess('驗證信發送成功！');
        this.sendEmail = 2;
      }, error: (e) => {
        // console.log(e);
        this.isLoding = false;
        this.Swal.showEasyError(e.error.message);
        // this.Swal.showEasyError('發送驗證信失敗！');
      }
    })
  }

  //輸入驗證碼
  keyupVerification() {
    if (this.VerificationCode.length == 6) {
      this.theEmail.Email = this.user.email;
      this.theEmail.verification = this.VerificationCode;
      this.userService.verificationCheck(this.theEmail).subscribe({
        next: () => {
          this.Swal.showEasySuccess('驗證成功！');
          this.sendEmail = 3;
        }, error: (err) => {
          // console.log(err.message);
          // console.log(this.theEmail);
          this.Swal.showEasyError(err.error.message);
        }
      })
    }
  }





  // 送出密碼表單資料
  submit(form: NgForm) {
    if (form.invalid) {
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
      // window.scrollTo(0, 400);
      window.scrollTo({ top: 400, behavior: 'smooth' });

    });
  }


}
