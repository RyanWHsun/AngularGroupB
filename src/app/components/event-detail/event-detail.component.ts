import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',  // ✅ 確保 selector 符合 Angular 命名規則
  templateUrl: './event-detail.component.html',  // ✅ 確保檔案名稱一致
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {  // ✅ 重新命名類別，避免與 Dialog 混淆
  event: any;
  apiUrl = 'https://localhost:7112/api';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
    }
  }

  loadEventDetails(eventId: string) {
    this.http.get<any>(`${this.apiUrl}/Event/${eventId}`).subscribe(
      (data) => {
        this.event = data;
      },
      (error) => {
        console.error("🚨 無法獲取活動詳情:", error);
      }
    );
  }
}
