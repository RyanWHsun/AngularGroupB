import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  private userApiUrl = 'https://localhost:7112/api/TUsers/loginUser'; // ✅ 取得當前登入用戶的 API

  constructor(private eventService: EventService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.checkAdminAccess(); // ✅ 先檢查是否為管理員
  }

  /** ✅ 檢查是否為管理員 */
  checkAdminAccess() {
    this.http.get<any>(this.userApiUrl, { withCredentials: true }).subscribe(
      (user) => {
        console.log("📌 取得登入用戶資訊:", user);
        if (!user || user.fUserRankId !== 99) {
          alert("❌ 你沒有權限存取此頁面！");
          this.router.navigate(['/']); // ✅ 轉回首頁
        } else {
          this.loadEvents(); // ✅ 如果是管理員，才載入活動列表
        }
      },
      (error) => {
        console.error("🚨 取得用戶資訊失敗:", error);
        alert("❌ 你沒有權限存取此頁面！");
        this.router.navigate(['/']); // ✅ 轉回首頁
      }
    );
  }

  /** 📌 取得所有活動 */
  loadEvents() {
    this.eventService.getEvents().subscribe(
      (data) => { this.events = data; },
      (error) => { console.error('🚨 無法獲取活動:', error); }
    );
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
    if (!confirm('確定要刪除這個活動嗎？')) return;

    this.eventService.deleteEvent(eventId).subscribe(
      () => {
        alert('活動刪除成功！');
        this.loadEvents();
      },
      (error) => console.error('🚨 刪除活動失敗:', error)
    );
  }
}


















