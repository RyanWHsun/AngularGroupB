import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.css"]
})
export class EventDetailComponent implements OnInit {
  eventId!: number;
  event: any;
  isAuthenticated = false; // ✅ 是否已登入
  isRegistered = false; // ✅ 是否已報名
  isFull = false; // ✅ 是否已滿
  apiUrl = "https://localhost:7112/api/EventRegistration";

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get("id"));
    this.isAuthenticated = !!localStorage.getItem("userId"); // ✅ 確認是否登入
    this.loadEventDetail();
  }

  /** ✅ 載入活動詳細資訊 */
  loadEventDetail() {
    this.http.get<any>(`https://localhost:7112/api/Event/${this.eventId}`).subscribe(
      (data) => {
        this.event = data;

        // ✅ 確保圖片是完整 URL 或 Base64
        if (this.event.imageBase64?.startsWith("data:image")) {
          this.event.fEventImageUrl = this.event.imageBase64;
        } else {
          this.event.fEventImageUrl = this.event.imageBase64 || "assets/images/noImage.jpg";
        }

        // ✅ 檢查是否已報名
        this.isRegistered = this.event.userHasRegistered || false;

        // ✅ 檢查是否額滿
        this.isFull = this.event.fMaxParticipants && this.event.fParticipant >= this.event.fMaxParticipants;
      },
      (error) => {
        console.error("載入活動失敗:", error);
      }
    );
  }

  /** ✅ 活動報名 */
  registerForEvent() {
    if (!this.isAuthenticated) {
      alert("請先登入才能報名活動！");
      this.router.navigate(["/login"]);
      return;
    }

    const registrationData = {
      fEventId: this.eventId,
      fUserId: localStorage.getItem("userId"),
      fRegistrationDate: new Date().toISOString(),
      fRegistrationStatus: "Pending"
    };

    this.http.post(this.apiUrl, registrationData, { withCredentials: true }).subscribe(
      () => {
        alert("🎉 報名成功！");
        this.isRegistered = true; // ✅ 更新狀態
        this.event.fParticipant += 1; // ✅ 增加報名人數
        this.isFull = this.event.fMaxParticipants && this.event.fParticipant >= this.event.fMaxParticipants;
      },
      (error) => {
        alert("⚠ 報名失敗：" + error.message);
      }
    );
  }

  /** ✅ 導向登入頁面 */
  redirectToLogin() {
    this.router.navigate(["/login"]);
  }
}





