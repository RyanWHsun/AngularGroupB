import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlert2Service {

  constructor() { }

  showEasySuccess(message: string) {
    Swal.fire({
      title: message,
      position: 'center',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  showEasyWarning(message: string) {
    Swal.fire({
      title: message,
      position: 'center',
      icon: 'warning',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  showEasyError(message: string) {
    Swal.fire({
      title: message,
      position: 'center',
      icon: 'error',
      showConfirmButton: false,
      timer: 2000,
    });
  }


  //帶是否的
  showYesNo(message: string) {
    return Swal.fire({
      title: "警告",
      text: message,
      position: 'center',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: "確認",//確認按鈕上的文字
      denyButtonText: "取消",//取消按鈕上的文字
      customClass: {
        confirmButton: 'btn-primary', // 確認按鈕的樣式
        denyButton: 'btn-secondary' // 取消按鈕的樣式
      }
    });
  }





}
