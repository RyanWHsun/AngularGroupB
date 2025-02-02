import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: any[] = [];
  userId = 1;  // 測試用假登入 ID

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.http.get<any>('https://localhost:7112/api/Event').subscribe(
      (data) => {
        console.log("✅ API 回應:", data);

        // 確保 `data` 是正確的陣列格式
        const eventsArray = Array.isArray(data) ? data : data.$values;

        if (!Array.isArray(eventsArray)) {
          console.error("❌ API 回應不是陣列:", data);
          return;
        }

        this.events = eventsArray.map(event => ({
          fEventId: event.fEventId,
          fEventName: event.fEventName,
          fEventDescription: event.fEventDescription,
          fEventImageUrl: event.fEventImages?.length > 0
            ? `data:image/jpeg;base64,${event.fEventImages[0].fEventImage}`
            : 'assets/images/noImage.jpg',
            fLocation: event.locations && event.locations.length > 0
            ? event.locations.map((l: { fLocationName: string }) => l.fLocationName).join(', ') // ✅ 修正 TypeScript 類型
            : '未提供地點',
          fDuration: this.calculateDuration(event.fEventStartDate, event.fEventEndDate),
          fParticipant: Math.floor(Math.random() * 20) + 1,
          fRating: (Math.random() * 2 + 3).toFixed(1),
          fReviews: Math.floor(Math.random() * 500),
          fPrice: (Math.random() * 200 + 100).toFixed(0)
        }));

        console.log("🎯 轉換後的活動列表:", this.events);
      },
      (error) => {
        console.error("🚨 API 請求失敗:", error);
      }
    );
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); // 轉換為天數
  }

  registerForEvent(eventId: number) {
    const registrationData = {
      FUserId: this.userId,
      FEventId: eventId,  // ⬅️ 加上活動 ID
      FRegistrationStatus: "已報名"
    };

    this.http.post(`http://localhost:7112/api/EventRegistration`, registrationData)
      .subscribe(
        response => {
          alert("✅ 報名成功！");
          console.log(response);
        },
        error => {
          alert("❌ 報名失敗：" + (error.error.message || "發生未知錯誤"));
          console.error("報名錯誤:", error);
        }
      );
  }
}
