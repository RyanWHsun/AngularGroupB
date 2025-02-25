import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CartService } from "src/app/services/cart.service"; // ✅ 引入購物車服務

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.css"]
})
export class EventDetailComponent implements OnInit {
  eventId!: number;
  event: any;
  isAuthenticated = false;
  apiUrl = "https://localhost:7112/api/Event";
  registerApiUrl = "https://localhost:7112/api/EventRegistrationToCart/addEvent";
  authCheckUrl = "https://localhost:7112/api/auth/checkAuth"; // ✅ 檢查登入 API

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cartService: CartService // ✅ 加入購物車服務
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get("id"));

    // ✅ 確保 eventId 有效
    if (isNaN(this.eventId) || this.eventId <= 0) {
      alert("無效的活動 ID！");
      this.router.navigate(["/"]); // ✅ 跳轉回首頁
      return;
    }

    // ✅ 檢查登入狀態
    this.checkAuthentication();

    // ✅ 載入活動詳細資訊
    this.loadEventDetail();
  }

  /** ✅ 檢查是否已登入 */
  checkAuthentication() {
    this.http.get<any>(this.authCheckUrl, { withCredentials: true }).subscribe(
      () => {
        this.isAuthenticated = true;
        this.cdr.detectChanges(); // ✅ 確保 UI 變更
      },
      () => {
        this.isAuthenticated = false;
      }
    );
  }

  /** ✅ 載入活動詳細資訊 */
  loadEventDetail() {
    this.http.get<any>(`${this.apiUrl}/${this.eventId}`).subscribe(
      (data) => {
        console.log("📌 API 回傳資料:", data);
        this.event = {
          fEventId: data.fEventId,
          fEventName: data.fEventName,
          fLocation: data.fLocation,
          fEventStartDate: data.fEventStartDate,
          fEventEndDate: data.fEventEndDate,
          fPrice: data.fPrice !== undefined && data.fPrice !== null ? data.fPrice : 0, // ✅ 確保綁定正確的費用
          fEventDescription: data.fEventDescription,
          fEventImageUrl: data.imageBase64 || "assets/images/noImage.jpg"
        };
      },
      (error) => {
        console.error("載入活動失敗:", error);
      }
    );
  }

  /** ✅ 點擊「我要報名」，將活動加入購物車 */
  registerForEvent() {
    if (!this.isAuthenticated) {
      alert("請先登入才能報名活動！");
      this.router.navigate(["/user"]);
      return;
    }

    this.http.post(this.registerApiUrl, this.eventId, { withCredentials: true })
      .subscribe(
        () => {
          alert("🎉 活動已成功加入購物車！");
          this.cartService.loadCartCount(); // ✅ 更新購物車數量
        },
        (error) => {
          alert("⚠ 加入購物車失敗：" + (error.error?.message || "請稍後再試"));
        }
      );
  }

  /** ✅ 導向登入頁面 */
  redirectToLogin() {
    this.router.navigate(["/user"]); // ✅ 這樣就會跳到 `/user`
  }
}









