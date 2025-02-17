import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
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
  apiUrl = "https://localhost:7112/api/TShoppingCarts/addProductToCart"; // ✅ 加入購物車 API

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get("id"));

    // ✅ 確保登入狀態正確
    this.checkAuthentication();
    window.addEventListener("storage", () => this.checkAuthentication());

    // ✅ 載入活動詳細資訊
    this.loadEventDetail();
  }

  /** ✅ 確認使用者是否登入 */
  checkAuthentication() {
    this.isAuthenticated = !!localStorage.getItem("userId");
    this.cdr.detectChanges(); // ✅ 確保 UI 變更
  }

  /** ✅ 載入活動詳細資訊 */
  loadEventDetail() {
    this.http.get<any>(`https://localhost:7112/api/Event/${this.eventId}`).subscribe(
      (data) => {
        this.event = data;

        // ✅ 確保圖片顯示
        if (this.event.imageBase64?.startsWith("data:image")) {
          this.event.fEventImageUrl = this.event.imageBase64;
        } else {
          this.event.fEventImageUrl = this.event.imageBase64 || "assets/images/noImage.jpg";
        }
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
      this.router.navigate(["/login"]);
      return;
    }

    const cartData = {
      fItemType: "eventFee", // ✅ 活動類型
      fItemId: this.eventId,  // ✅ 活動 ID
      fQuantity: 1,          // ✅ 預設數量 1
      fPrice: this.event.fEventPrice || 0 // ✅ 如果免費，則設為 0
    };

    this.http.post(this.apiUrl, cartData, { withCredentials: true }).subscribe(
      () => {
        alert("🎉 活動已加入購物車！");
        this.router.navigate(["/cart"]); // ✅ 直接導向購物車頁面
      },
      (error) => {
        alert("⚠ 加入購物車失敗：" + error.message);
      }
    );
  }

  /** ✅ 導向登入頁面 */
  redirectToLogin() {
    this.router.navigate(["/login"]);
  }
}








