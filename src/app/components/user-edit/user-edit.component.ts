import { Component } from '@angular/core';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {

  img = "assets/images/noImage.jpg"


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
        this.img = reader.result as string;  // 强制转换为字符串类型，赋值给 imageSrc
      };
    } else {
      // 如果选择的文件不是图片，弹出警告提示
      alert('請選擇有效的圖片文件');
    }
  }
}


