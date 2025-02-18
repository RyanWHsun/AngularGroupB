import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event: Event = { fEventId: 0, fEventName: '', fEventDescription: '', fEventStartDate: '', fEventEndDate: '', fEventImageUrl: '' };
  isEditMode = false;
  selectedImageFile?: File;
  imagePreview?: string;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    public router: Router // ✅ 確保 router 是 public，讓 HTML 可以存取
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.isEditMode = true;
      this.eventService.getEvents().subscribe(events => {
        const foundEvent = events.find(e => e.fEventId == +eventId);
        if (foundEvent) {
          this.event = foundEvent;
          this.imagePreview = this.event.fEventImageUrl; // ✅ 預覽舊圖片
        }
      });
    }
  }

  /** ✅ 圖片選擇 */
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];

      // ✅ 確保 selectedImageFile 有值才執行讀取
      if (this.selectedImageFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreview = e.target.result;
        reader.readAsDataURL(this.selectedImageFile);
      }
    }
  }


  /** ✅ 提交活動 */
  submitEvent() {
    if (!this.event.fEventName || !this.event.fEventStartDate || !this.event.fEventEndDate) {
      alert('請填寫完整的活動資訊！');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.event.fEventName);
    formData.append('Description', this.event.fEventDescription);
    formData.append('StartDate', this.event.fEventStartDate);
    formData.append('EndDate', this.event.fEventEndDate);

    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile);
    }

    if (this.isEditMode) {
      this.eventService.updateEvent(this.event.fEventId, formData).subscribe(() => {
        alert('活動更新成功！');
        this.router.navigate(['/events']);
      }, error => {
        console.error('🚨 更新活動失敗:', error);
        alert('更新活動失敗，請檢查輸入內容或 API');
      });
    } else {
      this.eventService.createEvent(formData).subscribe(() => {
        alert('活動新增成功！');
        this.router.navigate(['/events']);
      }, error => {
        console.error('🚨 新增活動失敗:', error);
        alert('活動新增失敗，請檢查輸入內容或 API');
      });
    }
  }
}

