import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { CartService } from './services/cart.service';
import { error } from 'jquery';
import { SweetAlert2Service } from './services/sweet-alert2.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'AngularGroupB';
  cartItemCount: number = 0;
  isLogin: boolean = false;
  router: any;
  isAdmin: boolean = false;

  constructor(private cartService: CartService, private authService: AuthService, private routter: Router, private Swal: SweetAlert2Service) { }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngAfterViewInit() {
    $('.nav-item.dropdown').each(function () {
      const $dropdown = $(this);
      const $menu = $dropdown.find('.dropdown-menu');

      $dropdown.on('mouseenter', function () {
        $menu.addClass('show');
      });

      $dropdown.on('mouseleave', function () {
        $menu.removeClass('show');
      });
    });
  }
  ngOnInit() {
    this.cartService.loadCartCount();
    this.cartService.cartItemCount$.subscribe({
      next: (count) => {
        //console.log(count);
        this.cartItemCount = count;
      },
      error: (error) => {
        console.error('購物車數量獲取失敗', error);
      },
    });
    this.authService.isLogin().subscribe({
      next: (a) => {
        this.isLogin = true;
        this.authService.isAdmin().subscribe({
          next: (isAdmin) => {
            this.isAdmin = true;
          },
          error: (error) => {
            this.isAdmin = false;
          }
        });
      },
      error: (error) => {
        this.isLogin = false;
      },
    });
  }

  logOut() {
    this.Swal.showYesNo('確定要登出嗎？').then((a) => {
      if (a.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            this.Swal.showEasySuccess("用戶已登出");
            setTimeout(() => {
              this.routter.navigate(['/user/login']).then(() => { window.location.reload(); });
            }, 2000);

          },
          error: (error) => {
            // console.error("登出 API 失敗:", error);
            // alert("登出失敗，請稍後再試！");
            this.Swal.showEasyError("登出失敗，請稍後再試！");

          }
        });


        setTimeout(() => {

        }, 2000);
      }
    });



  }
}
