import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import * as nodemailer from 'nodemailer';



@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  fUserEmail = "";
  fUserPassword = "";

  passwordType = "password";

  constructor(private router: Router, private authService: AuthService, private cartService: CartService) { }

  ngOnInit(): void {
  }

  seePassword() {
    if (this.passwordType == "password") {
      this.passwordType = "text";
    }
    else if (this.passwordType == "text") {
      this.passwordType = "password";
    }

  }



  submit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(a => {
        a.markAllAsTouched();
      });
      alert("請輸入帳號密碼");
      return;
    }
    this.authService.login(this.fUserEmail, this.fUserPassword).subscribe({
      next: (response) => {
        console.log("成功", response);
        alert("登入成功!");
        this.cartService.loadCartCount();  // 登入成功後，刷新購物車數量
        this.router.navigate(['/user/page']).then(() => { window.location.reload(); });
      },
      error: (error) => {
        console.log(error);
        alert(error.error.message);
      }
    })
  }


  editPassWord() { }

  autoFillAccount() {
    this.fUserEmail = "aminglin311@gmail.com";
    this.fUserPassword = "123456";
  }
  autoFillAccount2() {
    this.fUserEmail = "123@gmail.com";
    this.fUserPassword = "123456";
  }
}


