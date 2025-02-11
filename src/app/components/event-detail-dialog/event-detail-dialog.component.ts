import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-detail-dialog',
  templateUrl: './event-detail-dialog.component.html',  // ✅ 確保檔案名稱一致
  styleUrls: ['./event-detail-dialog.component.css']
})
export class EventDetailDialogComponent implements OnInit {  // ✅ 確保這裡的名稱一致
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
