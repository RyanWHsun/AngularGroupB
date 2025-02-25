import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import * as nodemailer from 'nodemailer';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  fUserEmail = "";
  fUserPassword = "";

  passwordType = "password";

  constructor(private router: Router, private authService: AuthService, private cartService: CartService, private Swal: SweetAlert2Service) { }

  ngOnInit(): void {
  }


  // DEMO
  setDEMO() {
    this.fUserEmail = "IAmTheNullPeople111@gmail.com";
    this.fUserPassword = "123456";
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
      // alert("請輸入帳號密碼");
      this.Swal.showEasyWarning("請輸入帳號密碼");
      return;
    }
    this.authService.login(this.fUserEmail, this.fUserPassword).subscribe({
      next: (response) => {
        // console.log("成功", response);
        // alert("登入成功!");
        Swal.fire({
          title: "登入成功!",
          position: 'center',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          this.cartService.loadCartCount();  // 登入成功後，刷新購物車數量
          this.router.navigate(['/user/page']).then(() => { window.location.reload(); });
        })

      },
      error: (error) => {
        // console.log(error);
        // alert(error.error.message);
        this.Swal.showEasyError(error.error.message);
      }
    })
  }




  autoFillAccount() {
    this.fUserEmail = "aminglin311@gmail.com";
    this.fUserPassword = "123456";
  }
  autoFillAccount2() {
    this.fUserEmail = "123@gmail.com";
    this.fUserPassword = "123456";
  }
}


