import { CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { Seller, ShoppingCartItem } from 'src/app/interfaces/shoppingCart';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  carItems: ShoppingCartItem[] = [];//所有購物車項目
  tickets: ShoppingCartItem[] = []; //門票項目
  eventFee: ShoppingCartItem[] = []; //活動費用
  sellers: Seller[] = []; //賣家分組

  selectAllTickets = false;
  selectAllEvents = false;
  totalPrice = 0;
  selectedCount = 0;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        //console.log(this.carItems);
        this.carItems = items;
        this.sortItems();
      }, error: (error) => {
        if (error.status === 404) {
          console.log(error);
          console.warn('購物車為空，顯示提示訊息');
          alert('購物車沒東西，快去加入吧!');
        } else if (error.status === 401) {
          console.log(error);
          console.warn('沒登入，顯示提示訊息');
          alert('請先登入哦!');
          this.router.navigate(['user/login']);
        }
        else {
          console.error('載入購物車錯誤:', error);
          alert('發生錯誤請洽客服');
        }
      }
    })
  }

  sortItems(): void {
    //清空
    this.tickets = [];
    this.eventFee = [];
    this.sellers = [];

    //分類
    this.carItems.forEach(item => {
      if (item.fItemType === 'attractionTicket') {
        this.tickets.push(item);
      } else if (item.fItemType === 'eventFee') {
        this.eventFee.push(item);
      } else { item.fItemType === 'product' } {
        //依據fSellerName分組
        let sellerName = item.fSellerName ?? '未知賣家';
        let seller = this.sellers.find(s => s.name === sellerName);
        if (!seller) {
          seller = { name: sellerName, selected: false, products: [] };
          this.sellers.push(seller);
        }
        seller.products.push(item);
      }
    })
  }

  // 切換賣家的全選狀態
  toggleSellerSelection(seller: Seller) {
    seller.products.forEach((product) => {
      product.selected = seller.selected;
    });
    this.calculateTotal();
  }

  // 切換所有景點票券的選取狀態
  toggleAllTickets() {
    this.selectAllTickets = !this.selectAllTickets;
    this.tickets.forEach(ticket => {
      ticket.selected = this.selectAllEvents
    });
    this.calculateTotal();
  }

  toggleAllEvents() {
    this.selectAllEvents = !this.selectAllEvents;
    this.eventFee.forEach(fee => {
      fee.selected = this.selectAllEvents
    });
    this.calculateTotal();
  }

  // 計算總金額與已選商品數量
  calculateTotal() {
    this.totalPrice = 0;
    this.selectedCount = 0;
    this.sellers.forEach((seller) => {
      seller.selected = seller.products.every((product) => product.selected);
      seller.products.forEach((product) => {
        if (product.selected) {
          this.totalPrice += product.fPrice * product.fQuantity;
          this.selectedCount++;
        }
      });
    });

    this.tickets.forEach((ticket) => {
      if (ticket.selected) {
        this.totalPrice += ticket.fPrice * ticket.fQuantity;
        this.selectedCount++;
      }
    });

    this.eventFee.forEach((event) => {
      if (event.selected) {
        this.totalPrice += event.fPrice * event.fQuantity;
        this.selectedCount++;
      }
    });

    // 更新全選 checkbox 狀態
    this.selectAllTickets = this.tickets.every(ticket => ticket.selected);
    this.selectAllEvents = this.eventFee.every(event => event.selected);
  }

  increaseQuantity(item: any) {
    if (item.fItemType === 'product') {
      if (item.fQuantity < item.fProductStock) { // 🔹 確保數量不超過庫存
        item.fQuantity++;
        this.calculateTotal();
      } else {
        alert("數量已達庫存上限");
      }
    } else {
      item.fQuantity++;
      this.calculateTotal();
    }
  }

  decreaseQuantity(item: any) {
    if (item.fQuantity > 1) {
      item.fQuantity--;
      this.calculateTotal();
    }
  }

  removeItem(category: any, item: any) {
    // if (category.products) {
    //   category.products = category.products.filter(p => p.id !== item.id);
    // } else if (category.items) {
    //   category.items = category.items.filter(i => i.id !== item.id);
    // } else if (category.fees) {
    //   category.fees = category.fees.filter(f => f.id !== item.id);
    // }
    this.calculateTotal();
  }
}
