import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.loadEvents();
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

















