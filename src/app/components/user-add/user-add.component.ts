import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {

  ComeDate = "";

  // 存放輸入的表單資料
  user = {
    fUserName: '',
    fUserNickName: '',
    fUserRankId: 1,
    fUserEmail: '',
    fUserPassword: '',
    fUserComeDate: '',
    fUserBirthday: '',
    fUserPhone: '',
    fUserSex: '',
    fUserAddress: '',
    fUserImage: ''
  };


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.setTodayDate();
  }

  //設置創建日期
  setTodayDate() {
    const nowDate = new Date;

    const year = nowDate.getFullYear();
    const month = (nowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = nowDate.getDate().toString().padStart(2, '0');

    this.ComeDate = `${year}-${month}-${day}`;
    this.user.fUserComeDate = this.ComeDate;
  }

  // 送出表單資料
  submit() {
    console.log('送出的資料:', this.user);
    this.userService.adduser(this.user).subscribe({
      next: (response) => {
        console.log('成功:', response);
        alert('帳號創建成功！');
      },
      error: (error) => {
        console.log('錯誤:', error);
        alert('帳號創建失敗，請稍後再試！');
      }
    })
  }







}
