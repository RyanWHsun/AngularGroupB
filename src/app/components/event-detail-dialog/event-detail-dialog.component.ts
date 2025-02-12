import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-detail-dialog',
  templateUrl: './event-detail-dialog.component.html',
  styleUrls: ['./event-detail-dialog.component.css'],
  providers: [DatePipe]  // ✅ 確保可以使用 DatePipe
})
export class EventDetailDialogComponent implements OnInit {
  event: any;
  apiUrl = 'https://localhost:7112/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe  // ✅ 注入 DatePipe
  ) { }

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

  // ✅ 註冊活動的方法
  registerEvent() {
    if (!this.event || !this.event.id) {
      console.error("🚨 活動資訊無效，無法報名");
      return;
    }

    const requestBody = {
      eventId: this.event.id,
      userId: 123  // 這裡應該改為動態獲取當前使用者 ID
    };

    this.http.post(`${this.apiUrl}/Event/Register`, requestBody).subscribe(
      (response) => {
        console.log("✅ 報名成功:", response);
        alert("報名成功！");
      },
      (error) => {
        console.error("🚨 報名失敗:", error);
        alert("報名失敗，請稍後再試！");
      }
    );
  }

  // ✅ 格式化日期
  getFormattedDate(date: string | Date | null): string {
    return date ? this.datePipe.transform(date, 'yyyy-MM-dd') || '未提供' : '未提供';
  }
}
