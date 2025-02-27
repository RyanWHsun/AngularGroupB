import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event: Event = {
    fEventId: 0,
    fEventName: '',
    fEventDescription: '',
    fEventStartDate: '',
    fEventEndDate: '',
    fEventImageUrl: ''
  };

  isEditMode = false;
  selectedImageFile?: File;
  imagePreview?: string;
  baseImageUrl = 'https://your-api.com/uploads/';

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.isEditMode = true;
      this.eventService.getEvents().subscribe(events => {
        const foundEvent = events.find(e => e.fEventId == +eventId);
        if (foundEvent) {
          this.event = foundEvent;

          if (this.event.fEventImageUrl && this.event.fEventImageUrl.trim() !== '') {
            this.imagePreview = this.getFullImageUrl(this.event.fEventImageUrl);
          }
        }
      });
    }
  }

  /** ✅ 確保圖片路徑完整 */
  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/default-placeholder.png';
    return imageUrl.startsWith('http') ? imageUrl : this.baseImageUrl + imageUrl;
  }

  /** ✅ 點擊標題或按鈕時隨機填入 活動名稱 & 活動描述 & 日期 */
  fillRandomData() {
    console.log("📌 fillRandomData() 被執行了！");

    const randomNames = [
      "探索神秘古城", "夏日音樂祭", "冒險森林探險",
      "環島單車挑戰", "沙灘瑜伽體驗", "夜間動物園奇遇"
    ];
    const randomDescriptions = [
      "這場活動將帶您探索最神秘的城市遺跡，感受歷史文化的魅力。",
      "熱血沸騰的音樂祭典，與全球音樂愛好者一起嗨翻夏天！",
      "挑戰自己，深入森林秘境，享受與大自然的親密接觸。",
      "單車環島是一場與自己對話的旅程，讓我們一起挑戰極限。",
      "在金色沙灘上進行晨間瑜伽，享受最純粹的身心放鬆。",
      "夜間動物園探險，發掘夜行性動物的神秘習性。"
    ];

    const randomIndex = Math.floor(Math.random() * randomNames.length);

    // ✅ 產生隨機開始 & 結束日期
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10)); // 未來 10 天內

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1); // 1～5 天後結束

    this.event = {
      ...this.event, // ✅ 保留原本的資料
      fEventName: randomNames[randomIndex],
      fEventDescription: randomDescriptions[randomIndex],
      fEventStartDate: this.formatDateTime(startDate),
      fEventEndDate: this.formatDateTime(endDate)
    };

    console.log("📌 只填入活動名稱 & 活動描述 & 日期：", this.event);
  }

  /** ✅ 確保日期格式正確 */
  formatDateTime(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  /** ✅ 監聽使用者選擇新圖片 */
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];

      if (this.selectedImageFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreview = e.target.result;
        reader.readAsDataURL(this.selectedImageFile);
      }
    }
  }

  /** ✅ 使用 SweetAlert2 顯示訊息 */
  showAlert(icon: 'success' | 'error' | 'warning', title: string, text: string) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: '確定',
      customClass: {
        popup: 'rounded-4 shadow-lg',
        title: 'fw-bold',
        confirmButton: 'btn btn-primary px-4 py-2 shadow-sm'
      }
    });
  }

  /** ✅ 提交活動 */
  submitEvent() {
    if (!this.event.fEventName || !this.event.fEventStartDate || !this.event.fEventEndDate) {
      this.showAlert('warning', '請填寫完整資訊', '活動名稱、開始與結束日期為必填！');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.event.fEventName);
    formData.append('Description', this.event.fEventDescription);
    formData.append('StartDate', this.event.fEventStartDate);
    formData.append('EndDate', this.event.fEventEndDate);

    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile);
    } else if (this.isEditMode && this.event.fEventImageUrl) {
      formData.append('ImageUrl', this.event.fEventImageUrl);
    }

    if (this.isEditMode) {
      this.eventService.updateEvent(this.event.fEventId, formData).subscribe(() => {
        this.showAlert('success', '活動更新成功', '活動內容已更新！');
        this.router.navigate(['/events']);
      }, error => {
        console.error('🚨 更新活動失敗:', error);
        this.showAlert('error', '更新失敗', '請檢查輸入內容或 API');
      });
    } else {
      this.eventService.createEvent(formData).subscribe(() => {
        this.showAlert('success', '活動新增成功', '新活動已成功建立！');
        this.router.navigate(['/events']);
      }, error => {
        console.error('🚨 新增活動失敗:', error);
        this.showAlert('error', '新增失敗', '請檢查輸入內容或 API');
      });
    }
  }
}



