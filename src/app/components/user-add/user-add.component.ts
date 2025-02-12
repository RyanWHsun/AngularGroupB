import { error } from 'jquery';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {

  emailHelpText = "請輸入電子郵件";
  // 存放輸入的表單資料
  user = {
    fUserName: null,
    fUserNickName: null,
    fUserRankId: 1,
    fUserSex: "不願透露",
    fUserEmail: null,
    fUserPassword: null,
  };


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  // 送出表單資料
  submit(form: NgForm) {
    if (form.invalid) {  // 檢查表單是否有效
      console.log('表單驗證不通過');
      alert('請確保所有欄位都正確填寫！');
      Object.values(form.controls).forEach(control => {
        control.markAsTouched(); // ✅ 標記所有欄位為 `touched`
      });
      return;  // 如果表單無效，阻止提交
    }
    console.log('送出的資料:', this.user);
    this.userService.adduser(this.user).subscribe({
      next: (response) => {
        console.log('成功:', response);
        alert('帳號創建成功！');
        this.router.navigate(['/user/user']);
        window.scrollTo(0, 0);
      },
      error: (error) => {
        console.log('錯誤:', error);
        alert(error.error.message);
        alert('帳號創建失敗，請稍後再試！');
      }
    })
  }







}
