import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  displayedEvents: any[] = [];
  savedEvents: any[] = [];
  uniqueLocations: string[] = [];
  uniqueDurations: number[] = [1, 2, 3, 5, 7]; // ✅ 預設行程天數
  currentIndex = 0;
  eventsPerPage = 3;
  apiUrl = 'https://localhost:7112/api/Event';
  isLoading = false;

  filters = {
    location: '',
    departDate: '',
    returnDate: '',
    days: '',
    minPrice: 0,
    maxPrice: ''
  };

  constructor(private http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSavedEvents();
    this.loadEvents();

    // 🚀 自動輪播
    // setInterval(() => {
    //   this.nextEvent();
    // }, 8000);
  }

  /** 🚀 從 API 載入活動 */
  loadEvents() {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe(
      (data) => {
        console.log("📌 API 回傳資料:", data);
        this.events = Array.isArray(data) ? data : data?.$values || [];

        this.events.forEach(event => {
          event.fLocation = event.fLocation ?? '未知地點';
          event.fParticipant = event.fParticipant ?? 0; // ✅ 改用 API 回傳的 FParticipant
          event.fDuration = event.fDuration ?? 1; // ✅ 改用 API 回傳的 FDuration
          event.fPrice = event.fPrice ?? 0; // ✅ 改用 API 回傳的 FPrice
          event.fEventImageUrl = event.imageBase64 ?? 'assets/images/noImage.jpg';
        });

        this.extractUniqueFilters();
        this.searchEvents();
        this.isLoading = false;
      },
      (error) => {
        console.error("🚨 無法獲取活動:", error);
        this.isLoading = false;
      }
    );
  }


  /** 🏷️ 取得所有篩選選項 */
  extractUniqueFilters() {
    this.uniqueLocations = [...new Set(this.events.map(e => e.fLocation))];
    this.uniqueDurations = [...new Set(this.events.map(e => e.fDuration || 1))];
  }

  /** 🔍 依據篩選條件搜尋活動 */
  searchEvents() {
    this.filteredEvents = this.events.filter(e =>
      (!this.filters.location || e.fLocation.toLowerCase().includes(this.filters.location.toLowerCase())) &&
      (!this.filters.departDate || new Date(e.fEventStartDate) >= new Date(this.filters.departDate)) &&
      (!this.filters.returnDate || new Date(e.fEventEndDate) <= new Date(this.filters.returnDate)) &&
      (!this.filters.days || e.fDuration == +this.filters.days)
    );

    this.currentIndex = 0;
    this.updateDisplayedEvents();
  }

  /** 📌 更新顯示的活動 (處理分頁) */
  updateDisplayedEvents() {
    this.displayedEvents = this.filteredEvents.slice(this.currentIndex, this.currentIndex + this.eventsPerPage);
  }

  /** ▶️ 下一頁 */
  nextEvent() {
    if (this.currentIndex + this.eventsPerPage < this.filteredEvents.length) {
      this.currentIndex += this.eventsPerPage;
    } else {
      this.currentIndex = 0;
    }
    this.updateDisplayedEvents();
  }

  /** ◀️ 上一頁 */
  prevEvent() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.eventsPerPage;
    } else {
      this.currentIndex = this.filteredEvents.length - this.eventsPerPage;
    }
    this.updateDisplayedEvents();
  }

  /** ⭐ 收藏/取消收藏活動 */
  toggleSaveEvent(event: any) {
    this.savedEvents = this.savedEvents.some(e => e.fEventId === event.fEventId)
      ? this.savedEvents.filter(e => e.fEventId !== event.fEventId)
      : [...this.savedEvents, event];

    localStorage.setItem('savedEvents', JSON.stringify(this.savedEvents));
    this.cdRef.detectChanges();
  }

  /** 🔍 檢查活動是否已收藏 */
  isEventSaved(eventId: number) {
    return this.savedEvents.some(e => e.fEventId === eventId);
  }

  /** ⭐ 載入已收藏的活動 */
  loadSavedEvents() {
    const saved = localStorage.getItem('savedEvents');
    if (saved) {
      this.savedEvents = JSON.parse(saved);
    }
  }

  /** ⏪ 回到首頁 */
  navigateToHome() {
    this.router.navigate(['/']);
  }

   /** 📌 點擊圖片，觸發 input file */
   triggerFileInput(eventId: number) {
    const fileInput = document.querySelector(`#fileInput${eventId}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /** 📤 處理圖片選擇並上傳 */
  onFileSelected(event: any, eventId: number) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadImage(eventId, file);
    }
  }

  /** 📤 上傳圖片到 API */
  uploadImage(eventId: number, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    this.http.post<{ imageUrl: string }>(`${this.apiUrl}/UploadEventImage/${eventId}`, formData)
      .subscribe(
        (res) => {
          alert("圖片上傳成功！");

          // ✅ 直接更新本地圖片
          const eventIndex = this.events.findIndex(e => e.fEventId === eventId);
          if (eventIndex !== -1) {
            this.events[eventIndex].fEventImageUrl = res.imageUrl; // ✅ 更新圖片 URL
          }

          this.cdRef.detectChanges(); // ✅ 手動觸發變更偵測
        },
        (error) => {
          console.error('🚨 圖片上傳失敗:', error);
          alert('圖片上傳失敗，請稍後再試');
        }
      );
  }

}



