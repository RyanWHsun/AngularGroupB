import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventService, Event } from '../../services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = []; // 所有活動
  paginatedEvents: Event[] = []; // 當前分頁顯示的活動
  currentPage: number = 1; // 當前頁數
  itemsPerPage: number = 5; // 每頁顯示筆數
  private userApiUrl = 'https://localhost:7112/api/TUsers/loginUser'; // ✅ 取得當前登入用戶的 API

  constructor(private eventService: EventService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.checkAdminAccess(); // ✅ 先檢查是否為管理員
  }

  /** ✅ 檢查是否為管理員 */
  checkAdminAccess() {
    this.http.get<any>(this.userApiUrl, { withCredentials: true }).subscribe(
      (user) => {
        console.log("📌 取得登入用戶資訊:", user);
        if (!user || user.fUserRankId !== 99) {
          Swal.fire({
            icon: 'error',
            title: '❌ 權限不足',
            text: '你沒有權限存取此頁面！',
            confirmButtonText: '確定'
          }).then(() => {
            this.router.navigate(['/']); // ✅ 轉回首頁
          });
        } else {
          this.loadEvents(); // ✅ 如果是管理員，才載入活動列表
        }
      },
      (error) => {
        console.error("🚨 取得用戶資訊失敗:", error);
        Swal.fire({
          icon: 'error',
          title: '❌ 權限不足',
          text: '你沒有權限存取此頁面！',
          confirmButtonText: '確定'
        }).then(() => {
          this.router.navigate(['/']); // ✅ 轉回首頁
        });
      }
    );
  }

  /** 📌 取得所有活動 */
  loadEvents() {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.updatePagination();
      },
      (error) => { console.error('🚨 無法獲取活動:', error); }
    );
  }

  /** ✅ 更新分頁 */
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /** ✅ 上一頁 */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /** ✅ 下一頁 */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /** ✅ 計算總頁數 */
  get totalPages(): number {
    return Math.ceil(this.events.length / this.itemsPerPage);
  }

  /** ✅ 跳轉至「新增活動」頁面 */
  goToCreateEvent() {
    this.router.navigate(['/event-form']);
  }

  /** ✅ 跳轉至「編輯活動」頁面 */
  goToEditEvent(eventId: number) {
    this.router.navigate([`/event-form/${eventId}`]);
  }

  /** ✅ 刪除活動 */
  deleteEvent(eventId: number) {
    Swal.fire({
      title: '確定要刪除這個活動嗎？',
      text: '刪除後將無法恢復！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: '刪除成功',
              text: '活動已成功刪除！',
              confirmButtonText: '確定'
            });
            this.loadEvents();
          },
          (error) => {
            console.error('🚨 刪除活動失敗:', error);
            Swal.fire({
              icon: 'error',
              title: '刪除失敗',
              text: '無法刪除此活動，請稍後再試。',
              confirmButtonText: '確定'
            });
          }
        );
      }
    });
  }
}




















