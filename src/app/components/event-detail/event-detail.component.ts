import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  eventId!: number;
  event: any;
  apiUrl = 'https://localhost:7112/api/EventRegistration';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ 載入活動詳細資訊
    this.loadEventDetail();
  }

  /** ✅ 載入活動詳細資訊 */
  loadEventDetail() {
    this.http.get(`https://localhost:7112/api/Event/${this.eventId}`).subscribe(data => {
      this.event = data;
    });
  }

  /** ✅ 活動報名 */
  registerForEvent() {
    const registrationData = {
      fEventId: this.eventId,
      fRegistrationDate: new Date().toISOString(),
      fRegistrationStatus: "Pending"
    };

    this.http.post(this.apiUrl, registrationData, { withCredentials: true }).subscribe(
      () => alert("報名成功！"),
      error => {
        if (error.status === 401) {
          alert("請先登入才能報名活動！");
          this.router.navigate(['/login']); // 導向登入頁面
        } else {
          alert("報名失敗：" + error.message);
        }
      }
    );
  }
}




