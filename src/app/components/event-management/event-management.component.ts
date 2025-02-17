import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  selectedImageFile: File | null = null;

  newEvent: any = {
    fEventName: '',
    fEventDescription: '',
    fEventStartDate: '',
    fEventEndDate: ''
  };

  constructor(private eventService: EventService) {}

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
  openEditEventDialog(event: Event) {
    // 這裡可以開啟彈窗或導向編輯頁面
    console.log('編輯活動:', event);
    alert(`編輯活動: ${event.fEventName}`);
  }


  /** ✅ 當使用者選擇圖片時觸發 */
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
    }
  }

  /** ✅ 新增活動 */
  createNewEvent() {
    if (!this.newEvent.fEventName || !this.newEvent.fEventStartDate || !this.newEvent.fEventEndDate) {
      alert('請填寫完整的活動資訊！');
      return;
    }

    this.eventService.createEvent(this.newEvent).subscribe(
      (response) => {
        console.log('活動新增成功:', response);
        alert('活動已成功新增！');

        // 如果有圖片，則上傳
        if (this.selectedImageFile) {
          this.eventService.uploadEventImage(response.eventId, this.selectedImageFile).subscribe(
            (imageResponse) => {
              console.log('圖片上傳成功:', imageResponse);
            },
            (error) => {
              console.error('圖片上傳失敗:', error);
            }
          );
        }

        this.loadEvents(); // 重新載入活動
      },
      (error) => {
        console.error('🚨 新增活動失敗:', error);
        alert('新增活動失敗，請檢查 API 是否正常');
      }
    );
  }

  /** ✅ 修改活動 */
  updateEvent(eventId: number) {
    const updatedEvent = this.events.find(e => e.fEventId === eventId);
    if (!updatedEvent) {
      alert('找不到該活動');
      return;
    }

    this.eventService.updateEvent(eventId, updatedEvent).subscribe(
      () => {
        alert('活動更新成功！');
        this.loadEvents();
      },
      (error) => {
        console.error('🚨 更新活動失敗:', error);
      }
    );
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









