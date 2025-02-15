import { CartService } from './../../services/cart.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CheckoutRequest, itemsForOrder, Seller, ShoppingCartItem, userInfo } from 'src/app/interfaces/shoppingCart';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
declare var $: any; // 宣告 jQuery

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
  userInfo: userInfo = {
    fUserId: 0,
    fUserName: '',
    fUserPhone: '',
    fUserAddress: '',
    totalBalance: 0
  };

  selectedCartItemIds: number[] = []; //選取的項目id
  selectAllTickets = false;
  selectAllEvents = false;
  totalPrice = 0;
  selectedCount = 0;
  fPaymentMethod: string = ''; // 預設付款方式

  constructor(private cartService: CartService, private authService: AuthService, private router: Router, private orderService: OrderService) { }
  @ViewChild('popoverButton', { static: false }) popoverButton!: ElementRef;


  ngOnInit(): void {
    this.loadCart();
    //console.log("初始化付款方式:", this.fPaymentMethod);
  };

  ngAfterViewInit() {
    this.loadUserWallet();
  }

  loadUserWallet() {
    this.cartService.getUserInfo().subscribe({
      next: (response) => {
        //console.log('用戶資訊', response);
        this.userInfo = { ...response };  // 確保userInfo是完整的物件

        setTimeout(() => {  // 確保 DOM 元素已渲染
          if (this.popoverButton?.nativeElement) {
            const formattedBalance = this.userInfo?.totalBalance
              ? new Intl.NumberFormat('zh-TW').format(this.userInfo.totalBalance)
              : '0';

            $(this.popoverButton.nativeElement).popover({
              trigger: 'hover',
              placement: 'top',
              content: `錢包餘額：${formattedBalance}`,
              html: true
            });
          }
        }, 0);
      },
      error: (error) => {
        console.error("獲取用戶資訊失敗", error);
        this.userInfo = {
          fUserId: 0,
          fUserName: '',
          fUserPhone: '',
          fUserAddress: '',
          totalBalance: 0,
        };
      }
    });
  }


  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.carItems = items;
        //console.log(this.carItems);
        this.sortItems();
      }, error: (error) => {
        if (error.status === 404) {
          console.log(error);
          console.warn('購物車為空，顯示提示訊息');
          alert('購物車沒東西，快去加入吧!');
          this.router.navigate(['#']);
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
        //console.log('景點票券:', this.tickets);
      } else if (item.fItemType === 'eventFee') {
        this.eventFee.push(item);
        //console.log('行程費用:', this.eventFee);
      } else if (item.fItemType === 'product') {
        //依據fSellerName分組
        let sellerId = item.fSellerId ?? 0;
        let seller = this.sellers.find(s => s.sellerId == sellerId);
        // 如果賣家不存在，則新增
        if (!seller) {
          seller = {
            sellerId: sellerId,
            name: item.fSellerName ?? '未知賣家', // 仍保留賣家名稱
            selected: false,
            products: []
          };
          this.sellers.push(seller);
        }
        // 將商品加入對應的賣家分組
        seller.products.push(item);
        //console.log('商品', this.sellers);
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

    //console.log("翻轉後 selectAllTickets:", this.selectAllTickets);
    this.tickets.forEach(item => {
      item.selected = this.selectAllTickets
    });
    this.calculateTotal();
  }

  //切換票券選取狀態
  toggleAllEvents() {
    this.selectAllEvents = !this.selectAllEvents;
    this.eventFee.forEach(fee => {
      fee.selected = this.selectAllEvents
    });
    this.calculateTotal();
  }

  //處理選取的項目
  processCartItems() {
    this.selectedCartItemIds = [];
    this.totalPrice = 0;
    this.selectedCount = 0;

    // 迭代所有類型的購物車項目
    this.sellers.forEach(seller => {
      seller.selected = seller.products.every(product => product.selected);
      seller.products.forEach(product => {
        if (product.selected) {
          this.totalPrice += product.fPrice * product.fQuantity;
          this.selectedCount++;
          this.selectedCartItemIds.push(product.fCartItemId);
        }
      });
    });

    this.tickets.forEach(ticket => {
      if (ticket.selected) {
        this.totalPrice += ticket.fPrice * ticket.fQuantity;
        this.selectedCount++;
        this.selectedCartItemIds.push(ticket.fCartItemId)
      }
    });

    this.eventFee.forEach(event => {
      if (event.selected) {
        this.totalPrice += event.fPrice * event.fQuantity;
        this.selectedCount++;
        this.selectedCartItemIds.push(event.fCartItemId);
      }
    });

    this.selectAllTickets = this.tickets.every(ticket => ticket.selected);
    this.selectAllEvents = this.eventFee.every(event => event.selected);

    //console.log(this.selectedCartItemIds);
    return this.selectedCartItemIds;
  }
  // 計算總金額與已選商品數量
  calculateTotal() {
    this.processCartItems()
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

  updatePaymentMethod(method: string) {
    this.fPaymentMethod = method;
    //console.log("目前付款方式:", this.fPaymentMethod);
  }

  removeItem(fCartItemId: number) {
    this.cartService.removeCartItem(fCartItemId).subscribe({
      next: (response) => {
        //console.log(response);
        this.cartService.loadCartCount();
        this.loadCart();
      },
      error: (error) => {
        alert(error.message)
        console.log(error);
      }
    });
  }

  removeSelectedItems() {
    const removeItemsIds = this.processCartItems();
    if (this.selectedCartItemIds.length === 0) {
      alert("請先選擇要刪除的項目!")
      return;
    }
    this.cartService.removeCartItems(removeItemsIds).subscribe({
      next: (response) => {
        //console.log(response);
        this.cartService.loadCartCount();
        this.loadCart();
      }, error: (error) => {
        alert(error.message)
        console.log(error);
      }
    })
    this.totalPrice = 0;
  }

  hasSelectedProduct(): boolean {
    return this.sellers.some(seller => seller.products.some(product => product.selected));
  }

  checkOut() {
    const selectedItems: itemsForOrder[] = [];

    // 取得所有勾選的商品、票券、活動
    this.sellers.forEach(seller => {
      seller.products.forEach(product => {
        if (product.selected) {
          selectedItems.push({
            fCartItemId: product.fCartItemId,
            fItemType: product.fItemType,
            fItemId: product.fItemId,
            fQuantity: product.fQuantity,
            fSellerId: product.fSellerId
          });
        }
      });
    });

    this.tickets.forEach(ticket => {
      if (ticket.selected) {
        selectedItems.push({
          fCartItemId: ticket.fCartItemId,
          fItemType: ticket.fItemType,
          fItemId: ticket.fItemId,
          fQuantity: ticket.fQuantity,
          fSellerId: ticket.fSellerId
        });
      }
    });

    this.eventFee.forEach(event => {
      if (event.selected) {
        selectedItems.push({
          fCartItemId: event.fCartItemId,
          fItemType: event.fItemType,
          fItemId: event.fItemId,
          fQuantity: event.fQuantity,
          fSellerId: event.fSellerId
        });
      }
    });

    const userInfo: userInfo = {
      fUserId: this.userInfo?.fUserId ?? 0,  // 預設為 0 避免 null
      fUserName: this.userInfo?.fUserName ?? '',
      fUserPhone: this.userInfo?.fUserPhone ?? '',
      fUserAddress: this.userInfo?.fUserAddress ?? '',
      totalBalance: this.userInfo?.totalBalance ?? 0,
    };


    // 檢查是否有選擇商品
    if (selectedItems.length === 0) {
      alert("請選擇至少一個商品進行結帳！");
      return;
    }
    // 檢查是否有選擇付款方式
    if (!this.fPaymentMethod) {
      alert("請選擇付款方式！");
      return;
    }
    //console.log('會員資訊:', userInfo);
    //console.log('選取的商品:', selectedItems);
    //console.log("目前付款方式:", this.fPaymentMethod);

    // 組合checkoutRequest
    const checkoutRequest: CheckoutRequest = {
      userInfo: this.userInfo,
      selectedItems: selectedItems,
      fPaymentMethod: this.fPaymentMethod
    };
    console.log('準備發送訂單資料:', checkoutRequest);

    //呼叫後端API
    this.orderService.checkOut(checkoutRequest).subscribe({
      next: (response) => {
        alert(response.message);
        window.location.reload(); //刷新頁面
        this.loadUserWallet();
      },
      error: (error) => {
        const errorMessage = error.error?.message || "訂單建立失敗，請稍後再試";
        alert(errorMessage)
        console.log('訂單建立失敗', error);
        window.location.reload(); //刷新頁面
      }
    });
  }
}
