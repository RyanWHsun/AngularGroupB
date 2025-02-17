import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { allUsersMaterial } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-admin-edit',
  templateUrl: './user-admin-edit.component.html',
  styleUrls: ['./user-admin-edit.component.css']
})
export class UserAdminEditComponent {

  passwordType = "password";

  user: allUsersMaterial = {
    fUserId: 0,
    fUserRankId: 0,
    fUserName: "",
    fUserNickName: "",
    fUserImage: "",
    fUserSex: "不願透露",
    fUserBirthday: "",
    fUserPhone: "",
    fUserEmail: "",
    fUserAddress: "",
    fUserComeDate: "",
    fUserPassword: "",
  }
  userId!: number;  // 儲存從本地存儲中取得的 userId

  updatePassword: boolean = false;

  img = "assets/images/noImage.jpg"


  constructor(private router: Router, private userService: UserService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((p) => {
      this.userId = +p.get('id')!;
      console.log('Received userId:', this.userId);
    })
    this.loadUser(this.userId);
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
  //更換圖片
  changeImg(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      // 使用 FileReader 读取文件内容，并将其转化为 Base64 格式的 Data URL
      reader.readAsDataURL(file);
      // 读取完成后，触发 onload 事件
      reader.onload = () => {
        // 当文件读取完成时，更新 imageSrc 属性为文件的 Base64 编码，图片就会显示在界面上
        // reader.result 是读取到的文件内容（Base64 编码的图片数据）
        this.user.fUserImage = reader.result as string;  // 强制转换为字符串类型，赋值给 imageSrc
        this.img = this.user.fUserImage;
      };
    } else {
      // 如果选择的文件不是图片，弹出警告提示
      alert('請選擇有效的圖片文件');
    }
  }

  // 綁上資料
  loadUser(userId: number) {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        console.log(data);

        if (data) {  // 確保資料存在
          this.user = data;  // 存入 user
          this.user.fUserImage = data.fUserImage ? `data:image/png;base64,${data.fUserImage}` : "";
          this.user.fUserBirthday = data.fUserBirthday ? data.fUserBirthday.split("T")[0] : "2000-01-01";
        }
      },
      error: (error) => {
        console.log("找不到用戶", error);
      }
    })
  }


  showPassword() {
    this.updatePassword = !this.updatePassword;
    if (!this.updatePassword) {
      this.user.fUserPassword = "";
    }
  }


  //修改開始
  updateUser(userId: number) {

    if (this.user.fUserImage != null) {
      this.user.fUserImage = this.user.fUserImage.replace("data:image/png;base64,", "");
      this.user.fUserImage = this.user.fUserImage.replace("data:image/jpg;base64,", "");
      this.user.fUserImage = this.user.fUserImage.replace("data:image/jpeg;base64,", "");
      console.log(this.user.fUserImage);
    }

    this.userService.putUser(userId, this.user).subscribe({
      next: (response) => {
        console.log('成功:', response);
        alert('帳號修改成功！');
        this.goToUser();
        window.scrollTo(0, 0);
      },
      error: (error) => {
        console.log('錯誤:', error);
        alert('帳號修改失敗，請稍後再試！');
      }
    })
  }





  goToUser() {
    this.router.navigate(['/user/editUsers']);
  }

  submit(form: NgForm) {
    if (form.invalid) {  // 檢查表單是否有效
      console.log('表單驗證不通過');
      alert('請確保所有欄位都正確填寫！');
      Object.values(form.control).forEach(p => { p.markAsTouched(); });
      return;  // 如果表單無效，阻止提交
    }

    // console.log(this.user);
    this.updateUser(this.user.fUserId);
  }


}
