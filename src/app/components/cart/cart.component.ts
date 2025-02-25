import { CartService } from './../../services/cart.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CheckoutRequest, itemsForOrder, Seller, ShoppingCartItem, userInfo } from 'src/app/interfaces/shoppingCart';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { LinePayService } from 'src/app/services/line-pay.service';
declare var $: any; // 宣告 jQuery
import Swal from 'sweetalert2';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';

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
  isLoading = false;
  selectedCartItemIds: number[] = []; //選取的項目id
  selectAllTickets = false;
  selectAllEvents = false;
  totalPrice = 0;
  selectedCount = 0;
  fPaymentMethod: string = ''; // 預設付款方式
  storeName: string = '';
  storeID: string = '';
  storeInfo: string = '';
  windowClosed: boolean = false;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router, private orderService: OrderService, private swal: SweetAlert2Service, private linePayService: LinePayService) { }
  @ViewChild('popoverButton', { static: false }) popoverButton!: ElementRef;


  ngOnInit(): void {
    this.loadCart();
    //console.log("初始化付款方式:", this.fPaymentMethod);
    this.isLoading = true;
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
        }, 300);
        this.isLoading = false;
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
        this.isLoading = false;
      }, error: (error) => {
        if (error.status === 404) {
          console.log(error);
          console.warn('購物車為空，顯示提示訊息');
          this.swal.showEasyWarning('購物車沒東西，快去加入吧!');
          this.router.navigate(['#']);
        } else if (error.status === 401) {
          console.log(error);
          console.warn('沒登入，顯示提示訊息');
          this.swal.showEasyWarning('請先登入哦!');
          this.router.navigate(['user/login']);
        }
        else {
          console.error('載入購物車錯誤:', error);
          this.swal.showEasyError('發生錯誤請洽客服');
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
        this.swal.showEasyError('數量已達庫存上限');
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
  }

  openStoreMap() {
    this.cartService.openStoreMap().subscribe({
      next: (response) => {
        if (response.mapUrl) {
          window.open(response.mapUrl, '_blank');
          this.getSelectedStore();
        } else {
          console.error('無法獲取門市選擇 URL');
        }
      },
      error: (error) => {
        console.error('API錯誤', error)
      }
    });
  }


  // 取得選擇的門市資訊
  getSelectedStore() {
    this.cartService.getSelectedStore().subscribe({
      next: (data) => {
        this.storeName = data.storeName;
        this.storeID = data.storeID;
        this.storeInfo = `${this.storeID}+${this.storeName}`
        this.userInfo.fUserAddress = this.storeInfo;
      }, error: (error) => {
        console.error('無法獲取選擇的門市資訊:', error)
      }
    })
  }

  removeItem(fCartItemId: number) {
    this.cartService.removeCartItem(fCartItemId).subscribe({
      next: (response) => {
        //console.log(response);
        this.cartService.loadCartCount();
        this.loadCart();
      },
      error: (error) => {
        this.swal.showEasyError(error.message);
        console.log(error);
      }
    });
  }

  removeSelectedItems() {
    const removeItemsIds = this.processCartItems();
    if (this.selectedCartItemIds.length === 0) {
      this.swal.showEasyWarning('請先選擇要刪除的項目!');
      return;
    }
    this.cartService.removeCartItems(removeItemsIds).subscribe({
      next: (response) => {
        //console.log(response);
        this.cartService.loadCartCount();
        this.loadCart();
      }, error: (error) => {
        this.swal.showEasyError(error.message);
        console.log(error);
      }
    })
    this.totalPrice = 0;
  }

  hasSelectedProduct(): boolean {
    return this.sellers.some(seller => seller.products.some(product => product.selected));
  }

  checkOut() {
    const selectedItems: itemsForOrder[] = this.sellers
      .flatMap(seller => seller.products)
      .concat(this.tickets)
      .concat(this.eventFee)
      .filter(item => item.selected)
      .map(item => ({
        fCartItemId: item.fCartItemId,
        fItemType: item.fItemType,
        fItemId: item.fItemId,
        fQuantity: item.fQuantity,
        fSellerId: item.fSellerId,
        fProductName: item.fProductName || "未命名商品" // ✅ 確保商品名稱不為空
      }));

    const userInfo: userInfo = {
      fUserId: this.userInfo?.fUserId ?? 0,
      fUserName: this.userInfo?.fUserName ?? '',
      fUserPhone: this.userInfo?.fUserPhone ?? '',
      fUserAddress: this.userInfo?.fUserAddress ?? '',
      totalBalance: this.userInfo?.totalBalance ?? 0,
    };

    if (selectedItems.length === 0) {
      this.swal.showEasyWarning('請選擇至少一個商品進行結帳');
      return;
    }

    if (!this.fPaymentMethod) {
      this.swal.showEasyWarning('請選擇付款方式');
      return;
    }

    if (this.fPaymentMethod === 'Wallet' && this.totalPrice > (this.userInfo?.totalBalance || 0)) {
      this.swal.showEasyError(`您的錢包餘額為 NT$${this.userInfo?.totalBalance}\n餘額不足!請修改支付方式`);
      return;
    }

    const checkoutRequest = {
      userInfo: userInfo,
      selectedItems: selectedItems, // ✅ 確保這裡有商品
      fPaymentMethod: this.fPaymentMethod
    };

    console.log("📦 發送的結帳請求：", JSON.stringify(checkoutRequest, null, 2)); // ✅ 確保請求內容正確

    this.orderService.checkOut(checkoutRequest).subscribe({
      next: (response) => {
        console.log("✅ 訂單建立成功:", response);
        Swal.fire({
          title: response.message,
          position: 'center',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
          this.loadUserWallet();
        });
      },
      error: (error) => {
        console.error("❌ 訂單建立失敗:", error);
        const errorMessage = error.error?.message || "訂單建立失敗，請稍後再試";
        this.swal.showEasyError(errorMessage);
        window.location.reload();
      }
    });
  }

  processLinePay(selectedItems: itemsForOrder[]) {
    if (!this.userInfo?.fUserId) {
      this.swal.showEasyError('使用者資訊載入錯誤，請重新登入');
      return;
    }

    const orderId = 'ORDER_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000);
    console.log("📌 送出的 orderId：", orderId);  // ✅ 檢查是否為有效 ID

    const confirmUrl = 'https://yourfrontend.com/payment-success?orderId=' + orderId;
    const cancelUrl = 'https://yourfrontend.com/payment-failed';

    const totalAmount = selectedItems.reduce((sum, item) => {
      const price = this.carItems.find(ci => ci.fCartItemId === item.fCartItemId)?.fPrice ?? 0;
      return sum + (price * item.fQuantity);
    }, 0);

    const paymentRequest = {
      totalAmount: totalAmount,
      orderId: orderId,
      packages: [
        {
          id: "PKG001",
          amount: totalAmount,
          name: "購物車結帳",
          products: selectedItems.map(item => ({
            id: item.fItemId.toString(),
            name: item.fProductName?.trim() || "未命名商品",
            imageUrl: "https://example.com/default-product.jpg",
            quantity: item.fQuantity,
            price: (typeof item.fPrice === "number" ? item.fPrice : 0)
          }))
        }
      ],
      confirmUrl: confirmUrl,
      cancelUrl: cancelUrl
    };

    console.log("📦 發送的付款請求：", JSON.stringify(paymentRequest, null, 2));

    this.linePayService.requestPayment(paymentRequest).subscribe({
      next: (response) => {
        console.log("🟢 LINE Pay API 回應：", JSON.stringify(response, null, 2));
        if (response.returnCode === "0000") {
          window.location.href = response.info.paymentUrl.web;
        } else {
          this.swal.showEasyError('付款失敗，請檢查資訊');
        }
      },
      error: (error) => {
        console.error("🔴 付款請求錯誤：", error);
        this.swal.showEasyError('付款請求失敗，請稍後再試');
      }
    });
  }
}
