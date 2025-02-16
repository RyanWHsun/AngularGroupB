import { OrderService } from 'src/app/services/order.service';
import { sellerOrderAll, OrderDetail, OrderStatusHistory } from './../../interfaces/order';
import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrls: ['./seller-order.component.css']
})
export class SellerOrderComponent {
  orders: sellerOrderAll[] = [];
  filteredOrders: sellerOrderAll[] = [];
  selectedStatus: number | null = null;
  searchText: string = ''; // 搜尋文字

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadSellerOrders();
  }

  loadSellerOrders(): void {
    this.orderService.getSellerOrders().subscribe({
      next: (data) => {
        //console.log(data);
        this.orders = data.sort((a, b) => new Date(b.fOrderDate).getTime() - new Date(a.fOrderDate).getTime()); // 依照時間排序
        this.filteredOrders = [...this.orders]; // 初始時顯示全部訂單
      }, error: (error) => {
        console.error('獲取訂單失敗', error);
        alert('獲取訂單失敗');
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
    console.log(this.searchText);
    // 先進行搜尋
    if (this.searchText.trim()) {
      const lowerText = this.searchText.toLowerCase();
      filtered = filtered.filter(order =>
        order.fOrderId.toString().includes(lowerText) ||
        order.buyerName.toLowerCase().includes(lowerText)
      );
    }

    // 確保搜尋時也考慮狀態篩選條件
    if (this.selectedStatus !== null) {
      filtered = filtered.filter(order => order.fOrderStatusId === this.selectedStatus);
    }

    this.filteredOrders = filtered;
  }


  resetSearch(): void {
    this.searchText = '';
    this.selectedStatus = null;
    this.loadSellerOrders();
  }

  getBadgeText(order: sellerOrderAll, statusId: number): string {
    if (order.fOrderStatusId === statusId) {
      return '進行中';
    } else if (order.fOrderStatusId > statusId) {
      const status = order.statusHistory.find(h => h.fOrderStatusId === statusId);
      return status ? new Date(status.fTimestamp).toLocaleDateString() : '待接續';
    }
    return '待接續';
  }
}



