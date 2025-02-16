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
}
