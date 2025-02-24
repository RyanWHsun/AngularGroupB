import { UserService } from './../../services/user.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { userEditMaterial } from 'src/app/interfaces/user';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {

  user: userEditMaterial = {
    fUserRankId: 0,
    fUserName: "",
    fUserImage: "",//照片
    fUserNickName: "",
    fUserSex: "",
    fUserPhone: "",
    fUserBirthday: "2000-01-01",
    fUserAddress: ""
  };
  userId: number | null = null;  // 儲存從本地存儲中取得的 userId


  img = "assets/images/noImage.jpg"
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private userService: UserService, private router: Router, private Swal: SweetAlert2Service) { }

  ngOnInit(): void {
    this.loadUser();
    // window.scrollTo(0, 400);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }


  changeImgDiv() {
    this.fileInput.nativeElement.click();
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
      // alert('請選擇有效的圖片文件');
      this.Swal.showEasyWarning('請選擇有效的圖片文件');
      this.user.fUserImage = "";
    }
  }

  // 綁上資料
  loadUser() {
    this.userService.getLoginUser().subscribe({
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



  //修改開始
  updateUser(userId: number) {

    if (this.user.fUserImage != null) {
      // 移除 Base64 頭部資訊
      const base64 = this.user.fUserImage.split(',');
      this.user.fUserImage = base64[1];
    }

    this.userService.putLoginUser(this.user).subscribe({
      next: (response) => {
        // console.log('成功:', response);
        // alert('帳號修改成功！');
        this.Swal.showEasySuccess('帳號修改成功！');
        this.goToUserPage();
        // window.scrollTo(0, 0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.log('錯誤:', error);
        // alert('帳號修改失敗，請稍後再試！');
        this.Swal.showEasyError('帳號修改失敗，請稍後再試！');
      }
    })
  }




  //前往用戶頁
  goToUserPage() {
    this.router.navigate(['/user/page']);
  }



  submitUserEdit(form: NgForm) {
    if (form.invalid) {  // 檢查表單是否有效
      // console.log('表單驗證不通過');
      // alert('請確保所有欄位都正確填寫！');
      this.Swal.showEasyWarning('請確保所有欄位都正確填寫！');
      Object.values(form.control).forEach(p => { p.markAsTouched(); });
      return;  // 如果表單無效，阻止提交
    }
    // console.log('送出的資料:', this.user);
    this.updateUser(this.userId!);
  }



}
