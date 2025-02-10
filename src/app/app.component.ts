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

