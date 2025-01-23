import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  account = '';
  password = '';
  constructor(private authService: AuthService) { };
  submit() {
    this.authService.login(this.account, this.password)
      .pipe(
        catchError(err => {
          // 顯示錯誤提示
          alert('登入失敗，請檢查帳號或密碼！');
          console.error('Login error:', err); // 可選：在控制台記錄錯誤
          return of(null); // 返回空的 observable，以防止後續流程中斷
        })
      )
      .subscribe(data => {
        if (data) {
          console.log('登入成功：', data);
        }
      });
  }
}
