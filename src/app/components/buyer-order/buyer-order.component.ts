import { OrderDetail, OrderDetailsResponse, OrderStatusHistory } from '../../interfaces/order';
import { Component } from '@angular/core';
import { buyerOrderAll } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';

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

  constructor(private orderService: OrderService) { }

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
        alert(error);
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
      1: 50,  // 待出貨
      2: 75,  // 待收貨
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
        const orderCreatedTime = new Date(firstStatus.fTimestamp);
        orderCreatedTime.setHours(orderCreatedTime.getHours() - 1);
        return orderCreatedTime.toISOString().replace('T', ' ').slice(0, 16);
      }
    }
    const status = this.OrderDetail.statusHistory.find(s => s.fOrderStatusId === statusId);
    return status ? new Date(status.fTimestamp).toISOString().replace('T', ' ').slice(0, 16) : '';
  }



}
