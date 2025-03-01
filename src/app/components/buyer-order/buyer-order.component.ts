import { OrderDetail, OrderDetailsResponse, OrderStatusHistory } from '../../interfaces/order';
import { Component } from '@angular/core';
import { buyerOrderAll } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buyer-order',
  templateUrl: './buyer-order.component.html',
  styleUrls: ['./buyer-order.component.css']
})
export class BuyerOrderComponent {
  orders: buyerOrderAll[] = [];
  expandedOrderId: number | null = null;
  filteredOrders: buyerOrderAll[] = []; // 篩選後的訂單
  selectedStatus: number | null = null; // 當前選擇的狀態
  searchText: string = ''; // 搜尋文字
  OrderDetail: OrderDetailsResponse | null = null;
  isLoading: boolean = false;

  constructor(private orderService: OrderService, private swal: SweetAlert2Service, private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();

    setTimeout(() => {
      const scrollY = window.innerHeight * 0.2; //視窗高度百分比
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }, 200);
  }

  loadOrders(): void {
    this.orderService.getBuyerOrder().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => new Date(b.fOrderDate).getTime() - new Date(a.fOrderDate).getTime());// 確保訂單按照時間排序（新舊）
        this.filteredOrders = [...this.orders]; // 初始時顯示全部訂單
      },
      error: (error) => {
        console.log('取得訂單有錯誤', error);
        if (error.status === 404) {
          this.swal.showEasyError(error.error.message);
          this.router.navigate(['products']);
        }
      }
    })
  }

  filterOrders(status: number | null): void {
    this.selectedStatus = status;
    if (status === null) {
      this.filteredOrders = [...this.orders]; //顯示所有訂單
    } else {
      this.filteredOrders = this.orders.filter(order => order.fOrderStatusId === status);
    }
  }
  searchOrders() {
    let filtered = [...this.orders];

    // 先進行搜尋
    if (this.searchText.trim()) {
      const lowerText = this.searchText.toLowerCase();
      filtered = filtered.filter(order =>
        order.fOrderId.toString().includes(lowerText) ||
        order.fProductName?.some(name => name.toLowerCase().includes(lowerText))
      );
    }

    // 確保搜尋時也考慮狀態篩選條件
    if (this.selectedStatus !== null) {
      filtered = filtered.filter(order => order.fOrderStatusId === this.selectedStatus);
    }

    this.filteredOrders = filtered;
  }

  toggleOrderDetail(orderId: number) {
    if (this.expandedOrderId === orderId) {
      //如果已經是展開的狀態
      this.expandedOrderId = null;
      return;
    }
    this.isLoading = true;
    this.expandedOrderId = orderId;

    //呼叫API
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (data) => {
        //console.log(data);
        this.OrderDetail = data;
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      }, error: (error) => {
        console.log('訂單明細獲取失敗', error);
        this.isLoading = false;
      }
    })
  }

  // 計算訂單進度 (進度條顯示)
  calculateProgress(statusHistory: OrderStatusHistory[] | undefined): number {
    if (!statusHistory || statusHistory.length === 0) return 0;

    const progressMap: { [key: number]: number } = {
      0: 25,  // 訂單成立
      1: 37,  // 待出貨
      2: 73,  // 待收貨
      3: 100  // 訂單完成
    };

    // 取得最新的狀態
    const latestStatus = Math.max(...statusHistory.map(s => s.fOrderStatusId));
    return progressMap[latestStatus] ?? 0;
  }

  hasStatus(statusId: number): boolean {
    return this.OrderDetail?.statusHistory?.some(status => status.fOrderStatusId === statusId) ?? false;
  }

  getTimestamp(statusId: number, isOrderCreated: boolean = false): string {
    if (!this.OrderDetail?.statusHistory) return '';

    if (isOrderCreated) {
      // 訂單成立時間 = 第一個狀態 (fOrderStatusId = 1) 的時間 - 1 小時
      const firstStatus = this.OrderDetail.statusHistory.find(s => s.fOrderStatusId === 1);
      if (firstStatus) {
        // 直接使用後端的時間，並減去一小時的邏輯
        const timestamp = firstStatus.fTimestamp;
        const timestampMinusOneHour = new Date(new Date(timestamp).getTime() - 60 * 60 * 1000);

        // 取得各個時間部分
        const year = timestampMinusOneHour.getFullYear();
        const month = (timestampMinusOneHour.getMonth() + 1).toString().padStart(2, '0'); // 月份是 0-based
        const day = timestampMinusOneHour.getDate().toString().padStart(2, '0');
        const hours = timestampMinusOneHour.getHours().toString().padStart(2, '0');
        const minutes = timestampMinusOneHour.getMinutes().toString().padStart(2, '0');

        // 返回所需格式的字串
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
    }
    const status = this.OrderDetail.statusHistory.find(s => s.fOrderStatusId === statusId);
    return status ? status.fTimestamp.replace('T', ' ').slice(0, 16) : '';
  }

  getExtraInfo(orderId: number): void {
    const order = this.orders.find(i => i.fOrderId === orderId);
    if (!order) {
      this.swal.showEasyError('找不到訂單資訊，請洽客服');
      return;
    }
    const extraInfo = order.fExtraInfo ? order.fExtraInfo : '賣家未提供寄件資訊';
    Swal.fire({
      title: "寄件資訊",
      text: extraInfo,
      icon: "info",
      showCloseButton: false,
      showCancelButton: false,
      confirmButtonText: '關閉',
      confirmButtonColor: '#28a746',
      focusConfirm: false,
    });
  }

  addressUpdate(orderId: number, fShipAddress: string) {
    Swal.fire({
      title: '請填寫要更新的地址',
      input: 'text',
      inputPlaceholder: '請輸入地址及補充資訊',
      inputValue: fShipAddress,
      showCancelButton: true,
      confirmButtonText: '確定',
      confirmButtonColor: '#28a746',
      cancelButtonText: '取消',
      cancelButtonColor: '#b0b0b0',
      inputValidator: (value) => {
        if (value.length > 255) {
          return '文字長度不可超過255字';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newAddress = result.value || ''; //允許空值
        console.log(newAddress);
        this.orderService.buyerUpdateAddress(orderId, newAddress).subscribe({
          next: (response) => {
            //console.log(response);
            this.swal.showEasySuccess(response.message);
            this.loadOrders();
          }, error: (error) => {
            console.log(error);
            this.swal.showEasyError(error.error.message)
          }
        })
      }
    })
  }

  buyerCompleteOrder(orderId: number) {
    Swal.fire({
      title: '確定已收到商品且無誤?',
      text: '一旦確認完成後，款項將撥給賣家',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      confirmButtonColor: '#28a746',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.completeOrder(orderId).subscribe({
          next: (response) => {
            this.swal.showEasySuccess(response.message);
            this.loadOrders();
            this.toggleOrderDetail(orderId);
            this.filterOrders(null);
          },
          error: (error) => {
            this.swal.showEasyError(error.error.message);
            console.error('完成訂單失敗', error)
          }
        })
      }
    })
  }
}
