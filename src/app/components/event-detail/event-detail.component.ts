import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: any;
  apiUrl = 'https://localhost:7112/api';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId && !isNaN(Number(eventId))) {  // ✅ 確保 eventId 是數字
      this.loadEventDetails(eventId);
    } else {
      console.error("❌ 錯誤: eventId 無效", eventId);
    }
  }

  loadEventDetails(eventId: string) {
    this.http.get<any>(`${this.apiUrl}/Event/${eventId}`).subscribe(
      (data) => {
        this.event = data;

        // ✅ 確保活動地點有值
        this.event.fLocation = data.Location ?? '未提供';

        // ✅ 確保圖片有值
        this.event.fEventImageUrl = data.imageBase64
          ? data.imageBase64
          : 'assets/images/noImage.jpg';
      },
      (error) => {
        console.error("🚨 無法獲取活動詳情:", error);
      }
    );
  }
}

