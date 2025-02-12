import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: any[] = []; // 活動列表
  displayedEvents: any[] = []; // 顯示的活動
  newEvent: any = { name: '', location: '', startDate: '', endDate: '', description: '', imageBase64: '' };
  apiUrl = 'http://localhost:7112/api/Event'; // API 位址
  selectedImage: File | null = null;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  /** 🚀 從 API 取得活動 */
  loadEvents() {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe(
      (data) => {
        console.log("📌 API 回傳的原始資料:", data);
        if (!Array.isArray(data)) {
          console.error("🚨 API 回傳格式錯誤！", data);
          return;
        }

        this.events = [...data];

        this.events.forEach(event => {
          event.fEventImageUrl = event.imageBase64 ?? 'assets/images/noImage.jpg';
          event.fLocation = event.location ?? '未知地點';
          event.fDuration = event.duration ?? 1;
          event.fParticipant = event.participant ?? 0;
          event.fPrice = event.registrationFee ?? 0;
        });

        this.displayedEvents = [...this.events];
        console.log("✅ 更新後的 displayedEvents:", this.displayedEvents);
        this.isLoading = false;
      },
      (error) => {
        console.error("🚨 無法獲取活動:", error);
        this.isLoading = false;
      }
    );
  }

  /** 📸 當使用者選擇圖片時觸發 */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.newEvent.imageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /** ➕ 新增活動 */
  addEvent() {
    if (!this.newEvent.name || !this.newEvent.startDate || !this.newEvent.endDate) {
      alert("請填寫完整的活動資訊！");
      return;
    }

    const formData = new FormData();
    formData.append("name", this.newEvent.name);
    formData.append("location", this.newEvent.location);
    formData.append("startDate", this.newEvent.startDate);
    formData.append("endDate", this.newEvent.endDate);
    formData.append("description", this.newEvent.description);
    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    this.http.post(this.apiUrl, formData).subscribe(() => {
      this.loadEvents();
      this.newEvent = { name: '', location: '', startDate: '', endDate: '', description: '', imageBase64: '' };
      this.selectedImage = null;
    }, error => {
      console.error("🚨 無法新增活動:", error);
    });
  }

  /** ✏️ 編輯活動 */
  editEvent(event: any) {
    this.newEvent = { ...event };
  }

  /** ❌ 刪除活動 */
  deleteEvent(eventId: number) {
    this.http.delete(`${this.apiUrl}/${eventId}`).subscribe(() => {
      this.loadEvents();
    });
  }
}






