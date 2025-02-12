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
    minPrice: 0, // ✅ 最低價格篩選
    maxPrice: 999999 // ✅ 最高價格篩選
  };

  constructor(private http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSavedEvents();
    this.loadEvents();
  }

  /** 🚀 從 API 載入活動 */
  loadEvents() {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe(
      (data) => {
        console.log("📌 API 回傳資料:", data);
        this.events = Array.isArray(data) ? data : data?.$values || [];

        this.events.forEach(event => {
          event.fLocation = event.location ?? '未知地點';
          event.fParticipant = event.fParticipants ?? 0; // ✅ 設定參加人數
          event.fDuration = event.fDuration ?? 1; // ✅ 設定行程天數
          event.fPrice = event.registrationFee ?? 0; // ✅ 設定報名費
          event.fEventImageUrl = event.imageBase64 ?? 'assets/images/noImage.jpg'; // ✅ 設定圖片
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
    this.uniqueDurations = [...new Set(this.events.map(e => e.fDuration || 1))]; // ✅ 確保天數有值
  }

  /** 🔍 依據篩選條件搜尋活動 */
  searchEvents() {
    this.filteredEvents = this.events.filter(e =>
      (!this.filters.location || e.fLocation.toLowerCase().includes(this.filters.location.toLowerCase())) &&
      (!this.filters.departDate || new Date(e.fEventStartDate) >= new Date(this.filters.departDate)) &&
      (!this.filters.returnDate || new Date(e.fEventEndDate) <= new Date(this.filters.returnDate)) &&
      (!this.filters.days || e.fDuration == +this.filters.days) &&
      (e.fPrice >= this.filters.minPrice && e.fPrice <= this.filters.maxPrice) // ✅ 價格篩選
    );

    this.currentIndex = 0;
    this.updateDisplayedEvents();
  }

  /** 📌 更新顯示的活動 (處理分頁) */
  updateDisplayedEvents() {
    this.displayedEvents = this.filteredEvents.slice(this.currentIndex, this.currentIndex + this.eventsPerPage);
  }

  /** ◀️ 上一頁 */
  prevEvent() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.eventsPerPage;
      this.updateDisplayedEvents();
    }
  }

  /** ▶️ 下一頁 */
  nextEvent() {
    if (this.currentIndex + this.eventsPerPage < this.filteredEvents.length) {
      this.currentIndex += this.eventsPerPage;
      this.updateDisplayedEvents();
    }
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
}



