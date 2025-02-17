import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/event.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  apiUrl = 'http://localhost:7112/api/EventManagement';

  constructor(private eventService: EventService, private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  /** 📌 取得所有活動 */
  loadEvents() {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error('🚨 無法獲取活動:', error);
      }
    );
  }

  /** ✅ 開啟新增活動表單 */
  openCreateEventDialog() {
    // 🚀 這裡你可以導向新增頁面，或開啟一個彈出視窗
    alert('開啟新增活動表單');
  }

  /** ✅ 開啟編輯活動表單 */
  openEditEventDialog(event: Event) {
    // 🚀 這裡可以導向編輯頁面，或開啟彈出視窗
    alert(`編輯活動: ${event.fEventName}`);
  }

  /** ❌ 刪除活動 */
  deleteEvent(eventId: number) {
    if (!confirm('確定要刪除這個活動嗎？')) return;

    this.eventService.deleteEvent(eventId).subscribe(
      () => {
        alert('活動刪除成功！');
        this.loadEvents(); // ✅ 重新載入活動
      },
      (error) => {
        console.error('🚨 刪除活動失敗:', error);
      }
    );
  }
}







