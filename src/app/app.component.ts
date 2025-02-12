import { Component } from '@angular/core';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularGroupB';
  cartItemCount: number = 0;
  constructor(private cartService: CartService) { }

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
  }
}

