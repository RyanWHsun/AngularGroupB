import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';
import { OrderService } from 'src/app/services/order.service';
import { sellerOrderAll, OrderDetail, OrderStatusHistory } from './../../interfaces/order';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  constructor(private orderService: OrderService, private swal: SweetAlert2Service, private router: Router) { }

  ngOnInit(): void {
    this.loadSellerOrders();

    setTimeout(() => {
      const scrollY = window.innerHeight * 0.2; //視窗高度百分比
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }, 200);
  }

  loadSellerOrders(): void {
    this.orderService.getSellerOrders().subscribe({
      next: (data) => {
        //console.log(data);
        this.orders = data.sort((a, b) => new Date(b.fOrderDate).getTime() - new Date(a.fOrderDate).getTime()); // 依照時間排序
        this.filteredOrders = [...this.orders]; // 初始時顯示全部訂單
      }, error: (error) => {
        console.error('獲取訂單失敗', error);
        if (error.status === 401) {
          this.swal.showEasyWarning('請先登入哦');
          this.router.navigate(['user/login']);
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
    //console.log(this.searchText);
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
    if (order.fOrderStatusId === 3) {
      // 訂單完成，回傳最新的 fTimestamp
      const latestStatus = order.statusHistory.find(h => h.fOrderStatusId === 3);
      return latestStatus ? new Date(latestStatus.fTimestamp).toLocaleDateString() : 'Pending';
    }

    if (order.fOrderStatusId === statusId) {
      return '進行中';
    } else if (order.fOrderStatusId > statusId) {
      const status = order.statusHistory.find(h => h.fOrderStatusId === statusId);
      return status ? new Date(status.fTimestamp).toLocaleDateString() : 'Pending';
    }
    return 'Pending';
  }


  shipOrder(orderId: number, fExtraInfo: string) {
    Swal.fire({
      title: '若已寄件完畢，請更新寄件資訊',
      input: 'text',
      inputPlaceholder: '請輸入物流單號或寄件資訊',
      inputValue: fExtraInfo,
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
        const extraInfo = result.value || ''; //允許空值
        console.log(extraInfo);
        this.orderService.shipOrder(orderId, extraInfo).subscribe({
          next: (response) => {
            //console.log(response);
            this.swal.showEasySuccess(response.message);
            this.loadSellerOrders();
          }, error: (error) => {
            console.log(error);
            this.swal.showEasyError(error.error.message)
          }
        })
      }
    })
  }

  confirmOrder(fExtraInfo: string) {
    //this.swal.showEasySuccess(`\n${fExtraInfo}`);
    Swal.fire({
      title: "訂單已完成!",
      text: fExtraInfo,
      confirmButtonColor: 'black',
    });
  }
}


