import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';
import { OrderService } from 'src/app/services/order.service';
import { sellerOrderAll, OrderDetail, OrderStatusHistory } from './../../interfaces/order';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as signalR from '@microsoft/signalr';

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
  private hubConnection!: signalR.HubConnection;

  constructor(private orderService: OrderService, private swal: SweetAlert2Service, private router: Router) { }

  ngOnInit(): void {
    this.loadSellerOrders();

    setTimeout(() => {
      const scrollY = window.innerHeight * 0.2; //視窗高度百分比
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }, 200);
    this.startSignalRConnection();
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
    // 先找出當前狀態
    const currentStatus = order.statusHistory.find(h => h.fOrderStatusId === statusId);

    if (!currentStatus) {
      return 'Pending';
    }

    // 如果訂單已完成（fOrderStatusId === 3），則只顯示完成時間
    if (order.fOrderStatusId === 3) {
      return new Date(currentStatus.fTimestamp).toLocaleDateString();
    }

    // 如果當前狀態正在進行
    if (order.fOrderStatusId === statusId) {
      return '進行中';
    }

    // 如果訂單已經超過此狀態，則顯示該狀態的變更時間
    if (order.fOrderStatusId > statusId) {
      return new Date(currentStatus.fTimestamp).toLocaleDateString();
    }

    return 'Pending';
  }

  generateQRcode(orderId: number) {
    this.orderService.getQRcode(orderId).subscribe({
      next: (blob: Blob) => {
        const qrCodeUrl = URL.createObjectURL(blob); //blob轉換成URL
        Swal.fire({
          title: `訂單#${orderId}出貨單`,
          text: "請列印出貨單",
          imageUrl: qrCodeUrl,
          imageWidth: 400,
          imageHeight: 400,
          imageAlt: `訂單${orderId}出貨單`,
          confirmButtonText: '列印',
          confirmButtonColor: '#28a746'
        });
        // 釋放記憶體
        setTimeout(() => URL.revokeObjectURL(qrCodeUrl), 5000);
      }, error: (error) => {
        console.error('產生QR錯誤', error)
        this.swal.showEasyError('產生錯誤，請稍後再試');
      }
    })
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

  private startSignalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7112/orderHub')
      .build();

    this.hubConnection.start().then(() => {
      console.log('連接成功!');
    }).catch(err => console.log('連接失敗', err));

    //監聽事件
    this.hubConnection.on('OrderUpdated', (orderId) => {
      console.log(`訂單 ${orderId} 已更新，重新載入訂單列表`);
      this.swal.showEasySuccess(`訂單 ${orderId} 司機已取件`);
      this.loadSellerOrders();
    })
  }
}


