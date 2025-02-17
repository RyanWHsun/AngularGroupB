import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { CartService } from './services/cart.service';
import { error } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularGroupB';
  cartItemCount: number = 0;
  isLogin: boolean = false;
  router: any;

  constructor(private cartService: CartService, private authService: AuthService, private routter: Router) { }

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
        console.error('購物車數量獲取失敗', error)
      }
    })
    this.authService.isLogin().subscribe({
      next: (a) => {
        this.isLogin = true;
      }, error: (error) => {
        this.isLogin = false;
      }
    })
  }

  logOut() {
    if (confirm('確定要登出嗎？')) {
      this.authService.logout().subscribe({
        next: () => {
          alert("用戶已登出");
          this.routter.navigate(['/user/login']).then(() => { window.location.reload(); });
        },
        error: (error) => {
          console.error("登出 API 失敗:", error);
          alert("登出失敗，請稍後再試！");
        }
      });
    };
  }




}

