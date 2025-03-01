/// <reference types="google.maps" />
import { AttractionCommentService } from './../../services/attraction-comment.service';
import { AttractionImageService } from './../../services/attraction-image.service';
import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnInit,
} from '@angular/core';
import { IAttraction } from 'src/app/interfaces/IAttraction';
import { AttractionService } from 'src/app/services/attraction.service';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { IAttractionCategory } from 'src/app/interfaces/IAttractionCategory';
import { AttractionCategoryService } from 'src/app/services/attraction-category.service';
import { IAttractionImage } from 'src/app/interfaces/IAttractionImage';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IAttractionComment } from 'src/app/interfaces/IAttractionComment';
import { GoogleMapAPIService } from 'src/app/services/google-map-api.service';
import { AttractionViewCookieService } from 'src/app/services/attraction-view-cookie.service';
import { IAttractionViewCount } from 'src/app/interfaces/IAttractionViewCount';
import { IAttractionTag } from 'src/app/interfaces/IAttractionTag';
import { AttractionTagService } from 'src/app/services/attraction-tag.service';
import { ICommenter } from 'src/app/interfaces/ICommenter';
import { OpenWeatherAPIService } from 'src/app/services/open-weather-api.service';
import { OpenAIService } from 'src/app/services/ai.service';
import { IItineraryItem } from 'src/app/interfaces/IItineraryItem';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';

// 宣告全域變數 google
// 在 Google Maps JavaScript API 中，google 這個物件是由 API 動態載入的，而不是直接在 TypeScript 環境中定義的。
// 因此，TypeScript 預設不知道 google 這個變數的型別，會報錯
declare var google: any;

// 在 TypeScript 全域環境 (global scope) 中，擴充 window 物件，使其包含 google 和 initMap 屬性。
// declare global:
// 這是 TypeScript 的全域擴充 (Global Augmentation) 機制，讓 TypeScript 知道我們正在修改內建的 Window 介面 (interface Window)。
declare global {
  // Window 是瀏覽器內建的全域物件
  interface Window {
    google: typeof google;
    initMap: () => void; // 讓 window.initMap 變數成為一個 callback function
  }
}

@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.component.html',
  styleUrls: ['./attraction.component.css'],
})
export class AttractionComponent implements AfterViewInit {
  // 在 TypeScript 內部存取 Angular 模板中的 DOM 元素或元件
  //
  // 在 HTML 模板中 找一個 #mapContainer 參考的元素。
  // mapContainer 屬性將被 ElementRef 物件賦值，允許 TypeScript 直接操作該 DOM 元素。
  //
  // { static: false }：控制何時獲取元素
  // static: false
  // 在 ngAfterViewInit() 之後才會獲取到。
  // 適用於 動態變更的元素（如 *ngIf 控制的元素）。
  // static: true：
  // 在 ngOnInit() 就能獲取到。
  // 適用於 靜態元素（沒有 *ngIf 控制的元素）。
  //
  // mapContainer!： ! 表示 TypeScript 非空斷言，確保編譯器不會報錯（但如果實際上 mapContainer 沒有獲取到，可能導致錯誤）。
  //
  // ElementRef: ElementRef 是 Angular 提供的一個 封裝 DOM 元素的類別，讓 TypeScript 可以 直接存取 HTML 元素。
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('ratingContainer') ratingContainer!: ElementRef;

  attraction: IAttraction = {};
  partialAttractions: IAttraction[] = [];
  attractionCategories: IAttractionCategory[] = [];
  partialImages: IAttractionImage[] = [];
  imageSrc: string[] = [];
  attractionComment: IAttractionComment[] = [];
  viewRecords: IAttractionViewCount[] = []; // 景點觀看次數的紀錄
  attractionTags: IAttractionTag[] = [];

  Page = {
    size: 0,
    index: 0,
    selectedPageIndex: 0,
    pages: [] as number[],
  };

  googleMap = {
    addressName: '',
    geocodeResult: null,
  };

  longitude: number = 0; // 經度
  latitude: number = 0; // 緯度
  weatherIconSrc: string = '';

  commentComponent = {
    isDescending: true,
    isCollapsed: true,
    sortButtonText: '從舊到新',
    collapseButtonText: '顯示',
    inputContent: '',
  };

  loginCommenter: ICommenter = {};
  selectedRating = 0;
  commentLimit = 5; // 一開始顯示 5 則評論

  temp_min = 0; // 最低溫度
  temp_max = 0; // 最高溫度
  humidity = 0; // 濕度

  keyword = ''; // 搜尋欄位

  pAttractionName = ''; // 值為指定的 attraction name，等等傳給 child component: ai-button
  planJSONStr = ''; // AI 產生的 plan，是 JSON 字串
  // planJSONObj = {}; // 由 planJSONStr 轉成 JSON 物件
  pItineraryData: IItineraryItem[] = [];

  isClickedAiBtn = false;

  constructor(
    private attractionService: AttractionService,
    private attractionImageService: AttractionImageService,
    private attractionCommentService: AttractionCommentService,
    private googleMapsService: GoogleMapAPIService,
    private attractionViewCookieService: AttractionViewCookieService,
    private attractionTagService: AttractionTagService,
    private openWeatherService: OpenWeatherAPIService,
    private sweetAlert2Service: SweetAlert2Service
  ) {}

  inputDemoData(){
    this.commentComponent.inputContent = "太魯閣國家公園壯麗非凡，峽谷險峻秀麗，溪水清澈蜿蜒，奇岩峭壁令人驚嘆。步道穿梭山林，瀑布飛瀉如畫，動植物生態豐富，是探索大自然奧秘的絕佳勝地，讓人流連忘返，讚嘆不已！";
    this.selectedRating=4;
    this.highlightStars(4);
  }

  clickAiBtn(isClick: boolean) {
    this.isClickedAiBtn = isClick;
    if (!this.isClickedAiBtn) {
      this.pItineraryData = [];
      console.log('after click, p:', this.pItineraryData);
      return; // 第二次點擊按鈕，就要刪除原本 AI 生成的資料
    }
  }

  // 顯示 AI 生成的旅遊計畫
  showPlan(newPlan: string) {
    this.pItineraryData = [];

    this.planJSONStr = newPlan;

    // **移除 Markdown 標籤**
    const cleanJsonString = this.planJSONStr.replace(/```json|```/g, '').trim();

    // **解析 JSON**
    try {
      this.pItineraryData = JSON.parse(cleanJsonString);
      // const planJSONObj = JSON.parse(cleanJsonString);
      // console.log('JSON Obj: ', planJSONObj);
    } catch (error) {
      console.error('JSON 解析失敗:', error);
    }
  }

  // 點擊"搜尋"按鈕後，根據 keyword 找景點
  searchAttraction() {
    this.partialAttractions = [];
    this.attractionService.getPartialAttractions(this.keyword, 9, 0).subscribe({
      next: (attraction) => {
        console.log(attraction);
        this.partialAttractions = attraction;
      },
      error: (err) => {},
    });
  }

  // 設定現在的最高溫、最低溫和濕度
  setCurrentTemperatureAndHumidity$() {
    return this.openWeatherService
      .getCurrentWeather(this.latitude, this.longitude)
      .pipe(
        tap((weather) => {
          console.log(weather);
          if (weather) {
            this.temp_min = Math.trunc(weather.main.temp_min - 273.15);
            this.temp_max = Math.trunc(weather.main.temp_max - 273.15);
            this.humidity = weather.main.humidity;
          }
        }),
        map(() => void 0)
      );
  }

  // 取得現在天氣的 icon
  setWeatherIcon$() {
    this.weatherIconSrc = '';
    return this.openWeatherService
      .getCurrentWeatherIcon(this.latitude, this.longitude)
      .pipe(
        tap((iconSrc) => {
          this.weatherIconSrc = iconSrc
            ? iconSrc
            : 'https://openweathermap.org/img/wn/10d@2x.png';
          console.log('weather icon src: ', this.weatherIconSrc);
        }),
        map(() => void 0)
      );
  }

  // 設定評論者(也就是登入者)的初始資訊
  setCommenter$() {
    return this.attractionCommentService.getCommenterInfo().pipe(
      tap((commenter) => {
        // 轉換 Base64 為 data:image/jpeg;base64 或 data:image/png;base64 格式
        commenter.fUserImage = commenter.fUserImage
          ? `data:image/${
              commenter.fUserImage.startsWith('/9j/') ? 'jpeg' : 'png'
            };base64,${commenter.fUserImage}`
          : 'assets/images/head002.jpg';

        this.loginCommenter = commenter;
      }),
      map(() => void 0)
    );
  }

  // 提交評論
  submitComment() {
    if (
      this.commentComponent.inputContent === '' ||
      this.selectedRating === 0
    ) {
      this.sweetAlert2Service.showEasyWarning("評論還未填寫");
      return;
    }
    const comment: IAttractionComment = {
      fCommentId: 0,
      fAttractionId: this.attraction.fAttractionId ?? null, // 確保是 number 或 null
      fAttractionName: this.attraction.fAttractionName ?? null, // 確保是 string 或 null
      fUserId: this.loginCommenter.fUserId ?? null, // 確保是 number 或 null
      fUserName: this.loginCommenter.fUserName ?? null,
      fUserNickName: this.loginCommenter.fUserNickName ?? null,
      fUserImage: this.loginCommenter.fUserImage ?? null,
      fRating: this.selectedRating, // 確保是 number 或 null
      fComment: this.commentComponent.inputContent ?? null,
      fCreatedDate: new Date().toISOString(), // ✅ 改為 ISO 8601 格式
    };

    this.attractionCommentService
      .postAttractionComment(comment)
      .pipe(
        switchMap(() => {
          console.log('Comment submitted successfully!');
          this.commentComponent.inputContent = ''; // 清空輸入框
          this.highlightStars(0);
          // 接著執行 showCommentsByCondition$
          return this.showCommentsByCondition$(
            this.attraction.fAttractionId!,
            5,
            this.commentComponent.isDescending,
            this.commentComponent.isCollapsed
          );
        })
      )
      .subscribe({
        next: () => console.log('Updated comment list'),
        error: (err) => console.error('Error:', err),
      });
  }

  // 點擊從舊到新/從新到舊留言
  toggleSort(id: number) {
    console.log('toggleSort');
    this.commentComponent.isDescending = !this.commentComponent.isDescending;
    this.commentComponent.sortButtonText = this.commentComponent.isDescending
      ? '從舊到新'
      : '從新到舊';
    this.showCommentsByCondition$(
      id,
      5,
      this.commentComponent.isDescending,
      this.commentComponent.isCollapsed
    ).subscribe(); // Observable 需要 subscribe() 才會執行
  }

  // 點擊顯示/收合按鈕
  toggleCollapse(id: number) {
    console.log('collapse');
    this.commentComponent.isCollapsed = !this.commentComponent.isCollapsed;
    this.commentComponent.collapseButtonText = this.commentComponent.isCollapsed
      ? '顯示'
      : '收合';
    this.showCommentsByCondition$(
      id,
      5,
      this.commentComponent.isDescending,
      this.commentComponent.isCollapsed
    ).subscribe(); // Observable 需要 subscribe() 才會執行
  }

  // 設定各景點的標籤，id 是景點 ID
  showAttractionTag$(): Observable<void> {
    this.attractionTags = []; // 清空

    const request = this.partialAttractions.map((attraction) =>
      this.attractionTagService.getAttractionTagsById(attraction.fAttractionId!)
    );

    return forkJoin(request).pipe(
      // tags 原本是 IAttractionTag[][]（二維陣列）。
      // .flat() 會將它攤平成 IAttractionTag[]（一維陣列），符合
      tap((tags) => (this.attractionTags = tags.flat())),
      map(() => void 0)
    );
  }

  // carousel
  setCarouselImages$(attractionId: number): Observable<void> {
    return new Observable((observer) => {
      const $carouselInner = $('#displayImageContainer');
      $carouselInner.empty(); //清空原有的 carousel-inner 內容

      this.attractionImageService
        .getAttractionImageById(attractionId)
        .subscribe((images) => {
          // no image
          if (images.length === 0) {
            // 建立 carousel-item 元素
            const $carouselItem = $(`
              <div class="carousel-item active" data-bs-interval="2000">
                <img src="assets/images/noImage.jpg" class="d-block w-100" alt="景點圖片" style="height: 300px">
              </div>
            `);
            $carouselInner.append($carouselItem); // 加入到 carousel-inner
          } else {
            // 遍歷圖片陣列並生成 carousel-item
            // $.each 是 jQuery 提供的迴圈方法，用來遍歷 images 陣列。
            // images 是一個陣列，其中每個元素 image 可能包含圖片的 URL。
            // index 是陣列中當前元素的索引。
            // image 是陣列中當前的圖片物件。
            $.each(images, (index, image) => {
              const isActive = index === 0 ? 'active' : ''; // 第一張圖片設為 active
              // 如果 fImage 是 Base64 格式的圖片資料，應確保它有正確的 MIME 類型前綴
              // <img src="data:image/jpeg;base64,{Base64 字串}">
              let imageSrc = `data:image/jpeg;base64,${image.fImage}`;
              // 建立 carousel-item 元素
              const $carouselItem = $(`
                <div class="carousel-item ${isActive}" data-bs-interval="2000">
                  <img src="${imageSrc}" class="d-block w-100" alt="景點圖片" style="height: 300px">
                </div>
              `);
              $carouselInner.append($carouselItem); // 加入到 carousel-inner
            });
          }
          observer.next(); // 完成
          observer.complete();
        });
    });
  }

  // 顯示景點觀看次數
  showAttractionViewCount$() {
    return this.attractionViewCookieService.getAllViewCount().pipe(
      tap((data) => {
        this.viewRecords = data;
        console.log(`viewRecords: ${JSON.stringify(this.viewRecords)}`);
        // 建立一個 Map 來快速查找 fAttractionId 對應的 fViewCount
        const viewCountMap = new Map(
          this.viewRecords.map((record) => [
            record.fAttractionId,
            record.fViewCount,
          ])
        );

        for (const attraction of this.partialAttractions) {
          attraction.fattractionViewCount =
            viewCountMap.get(attraction.fAttractionId) || 0;
        }
      }),
      map(() => void 0)
    );
  }

  // 點擊"詳細資訊"按鈕時，要增加景點的觀看次數
  addViewCount$(id: number): Observable<void> {
    return this.attractionViewCookieService.increaseViewCount(id).pipe(
      tap((data) => {
        console.log(data);
      }),
      map(() => void 0)
    );
  }

  // Geocoding API - 透過地址獲取經緯度
  geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address },
        (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const location = results[0].geometry.location;

            const lat = location.lat();
            const lng = location.lng();

            // 只在這裡更新物件屬性，避免 race condition
            this.longitude = location.lng();
            this.latitude = location.lat();
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            reject(`地址轉換失敗: ${status}`);
          }
        }
      );
    });
  }

  // 載入 Google Maps API
  loadGoogleMaps$(): Observable<void> {
    return new Observable((observer) => {
      // 如果 `window.google` 和 `window.google.maps` 已經存在，代表 Google Maps API 已載入，直接執行 this.loadMap() 來初始化地圖
      if (window.google && window.google.maps) {
        this.loadMap();
        observer.next(); // 發送成功訊號，告訴訂閱者可以繼續
        observer.complete(); // 標記這個 Observable 已結束，確保它不會無限運行
        return;
      }

      //設定 `initMap` 回呼函式，當 Google Maps 載入後執行 `loadMap`
      (window as any).initMap = () => {
        this.loadMap();
        observer.next();
        observer.complete();
      };

      // 呼叫後端取得 Google Maps API
      this.googleMapsService.getMapData().subscribe({
        next: (script) => {
          // 建立 `<script>` 並動態載入 Google Maps API
          const scriptElement = document.createElement('script');
          scriptElement.text = script; // 直接插入回應的 JavaScript 代碼
          document.body.appendChild(scriptElement);
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('Google Maps API 載入失敗', err);
          observer.error('Google Maps API 載入失敗');
        },
      });
    });
  }

  loadMap() {
    // 確保地圖容器 (mapContainer) 存在，否則顯示錯誤訊息
    // this.mapContainer 是 透過 @ViewChild('mapContainer') 獲取的地圖容器。
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('地圖元素未找到');
      return;
    }

    // 檢查是否有指定地址
    if (!this.googleMap.addressName) {
      console.error('未提供有效的地址');
      return;
    }

    // 呼叫 Geocoding API 取得該地址的座標
    this.geocodeAddress(this.googleMap.addressName)
      .then(({ lat, lng }) => {
        // 創建 Google 地圖物件，並將其綁定到 `this.mapContainer.nativeElement`
        // new google.maps.Map() 會建立一個 Google Maps 物件。
        // this.mapContainer.nativeElement 是地圖要顯示的 HTML 容器。
        const map = new google.maps.Map(this.mapContainer.nativeElement, {
          center: { lat, lng }, // 動態設定地圖中心
          zoom: 15, // zoom: 15 設定縮放層級，數字越大，放大越近。
        });

        // 在該位置放置標記 (Marker)
        new google.maps.Marker({
          position: { lat, lng }, // position 設定標記的位置。
          map: map, // map: map 指定該標記要放在哪個地圖上。
          title: this.googleMap.addressName, // title: '這是標記' 讓滑鼠懸停時會顯示這個標記的說明。
        });
      })
      .catch((error) => {
        console.error('地理編碼失敗:', error);
      });
  }

  // 根據 attractionId 顯示評論
  showCommentsByCondition$(
    id: number,
    count: number,
    isDescending: boolean,
    isCollapsed: boolean
  ): Observable<void> {
    console.log('showCommentsByCondition');
    return this.attractionCommentService
      .getAttractionCommentByCondition(id, count, isDescending, isCollapsed)
      .pipe(
        tap((data) => {
          this.attractionComment = data.map((comment) => ({
            ...comment,
            fUserImage: comment.fUserImage
              ? `data:image/${
                  comment.fUserImage.startsWith('/9j/') ? 'jpeg' : 'png'
                };base64,${comment.fUserImage}`
              : 'assets/images/head002.jpg',
          }));
          console.log(this.attractionComment);
        }),
        map(() => void 0)
      );
  }

  // 根據 attractionId 顯示景點資料
  showAttractionById$(id: number): Observable<void> {
    this.pAttractionName = '';
    return this.attractionService.getAttractionById(id).pipe(
      tap((data) => {
        this.attraction = data;
        if (data.fAttractionName) {
          this.pAttractionName = data.fAttractionName;
          console.log('pAttractionName: ', this.pAttractionName);
          this.googleMap.addressName = data.fAttractionName;
        } else this.googleMap.addressName = '';
      }),
      map(() => void 0)
    );
  }

  // 點擊"詳細資訊"按鈕時，要顯示某個景點的詳細資訊
  clickShowDetail(id: number) {
    this.showAttractionById$(id)
      .pipe(
        switchMap(() =>
          this.showCommentsByCondition$(
            id,
            5,
            this.commentComponent.isDescending,
            this.commentComponent.isCollapsed
          )
        ),
        switchMap(() => this.loadGoogleMaps$()),
        switchMap(() => this.addViewCount$(id)),
        switchMap(() => this.showAttractionViewCount$()),
        switchMap(() => this.setCarouselImages$(id)),
        switchMap(() => this.setWeatherIcon$()),
        switchMap(() => this.setCurrentTemperatureAndHumidity$())
      )
      .subscribe();
    this.setCarouselImages$(id);
  }

  // 按上一頁，顯示上一頁的景點
  clickPreviousPage() {
    if (this.Page.selectedPageIndex <= 0) return;
    this.Page.selectedPageIndex--;
    this.showPartialAttractions$(this.Page.selectedPageIndex)
      .pipe(
        switchMap(() => this.showPartialImages$()),
        switchMap(() => this.showAttractionViewCount$()),
        switchMap(() => this.showAttractionTag$())
      )
      .subscribe();
    this.scrollToTop();
  }

  // 按下一頁，顯示下一頁的景點
  clickNextPage() {
    if (this.Page.selectedPageIndex >= this.Page.pages.length - 1) return;
    this.Page.selectedPageIndex++;
    this.showPartialAttractions$(this.Page.selectedPageIndex)
      .pipe(
        switchMap(() => this.showPartialImages$()),
        switchMap(() => this.showAttractionViewCount$()),
        switchMap(() => this.showAttractionTag$())
      )
      .subscribe();
    this.scrollToTop();
  }

  // 點選頁碼，設定 selectedPageIndex
  setSelectedPageIndex(index: number) {
    this.Page.selectedPageIndex = index;
    this.showPartialAttractions$(this.Page.selectedPageIndex)
      .pipe(
        switchMap(() => this.showPartialImages$()),
        switchMap(() => this.showAttractionViewCount$()),
        switchMap(() => this.showAttractionTag$())
      )
      .subscribe();
    this.scrollToTop();
  }

  // 設定要給 HTML 做迴圈的陣列
  setPages(pageLength: number) {
    // length: 10：建立一個長度為 10 的陣列。
    // (_, i) => i：使用索引值生成 0 到 9 的數字。
    //
    // _：這是第一個參數，代表當前元素的值。由於在這裡我們不需要使用元素值，所以用 _ 作為佔位符（只是習慣用法，可以改成任何名稱）。
    // i：這是第二個參數，代表當前元素的索引值。
    //
    // (_, i) => i：
    // 這個函式的作用是針對每個元素返回其索引值 i。
    // _ 表示忽略元素的值（因為不需要），只使用索引值。
    this.Page.pages = Array.from({ length: pageLength }, (_, i) => i); // 生成 0~9 的陣列
  }

  // 在每次換頁事件中調用 scrollToTop()，確保在頁碼切換後自動滾動到頁面頂端。
  scrollToTop() {
    // window.scrollTo 方法：
    // top: 0 表示滾動到頁面的頂端。
    // behavior: 'smooth' 則會讓滾動行為更加平滑。
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 顯示本頁面 9 個景點各 1 張圖片
  showPartialImages$(): Observable<void> {
    this.imageSrc = [];
    // this.partialAttractions.map(...) 會產生一個 Observable<IAttractionImage>[] 陣列，每個元素都是一個 HTTP 請求，請求對應景點的圖片。
    const imageRequests = this.partialAttractions.map((attraction) =>
      this.attractionImageService
        .getOneAttractionImageById(attraction.fAttractionId!)
        .pipe(
          map((data) =>
            data === null ? '' : `data:image/jpeg;base64,${data.fImage}`
          ),
          catchError(() => of('')) // 若請求失敗，預設回傳空字串，避免 forkJoin 崩潰
        )
    );

    // forkJoin() 的特性
    // forkJoin() 會並行執行所有請求，並等待所有請求都成功後，才會發出最終的結果。
    // 回傳一個包含所有請求結果的陣列（Observable<IAttractionImage[]>）。
    // 如果有一個請求失敗，整個 forkJoin() 會發出錯誤（需要特別處理錯誤時，可使用 catchError()）。
    return forkJoin(imageRequests).pipe(
      tap((images) => {
        images.forEach((imageSrc, index) => {
          this.imageSrc[index] = imageSrc;
        });
      }),
      map(() => void 0) // 確保回傳 Observable<void>
    );
  }

  // 在 RxJS 和 Angular 的開發中，通常我們會在回傳 Observable 的方法名稱後加上 $，是一種約定俗成的做法。
  // 這樣可以讓開發者一眼就知道這個方法回傳的是 Observable，而不是一般的同步函式。
  showPartialAttractions$(index: number): Observable<void> {
    return this.attractionService.getPartialAttractions('', 9, index).pipe(
      // tap 是一種副作用（side effect），不會改變 Observable 的內容，它只是讓我們在 Observable 流程中執行額外的動作。
      // 這裡的 tap() 主要作用是：當 HTTP 請求回傳資料時，將資料存入 this.partialAttractions，以便前端顯示。
      tap((data) => {
        this.partialAttractions = data;
      }),
      // 將 Observable<IAttraction[]> 轉換為 Observable<void>。
      // 因為 getPartialAttractions() 回傳的是 Observable<IAttraction[]>，但我們不需要這個值，我們只在乎請求是否完成，所以用 map() 把它轉換成 void，讓它適合 switchMap() 使用。
      // void 0 是 undefined 的別名，因此 map(() => void 0) 其實就是：map(() => undefined)
      map(() => void 0)
    );
  }

  getAttractionQuantities(): Observable<number> {
    return this.attractionService.getAttractionQuantities();
  }

  // take(1) 會確保 subscribe() 只會執行一次，避免記憶體洩漏。
  initPage$(): Observable<void> {
    return this.getAttractionQuantities().pipe(
      take(1),
      tap((qty) => {
        this.setPages(Math.ceil(qty / 9));
      }),
      map(() => void 0)
    );
  }

  ngOnInit(): void {
    // 確保三個非同步函式依序執行，而不會因為 HTTP 請求的非同步特性導致順序錯亂。
    // 這段程式碼的執行順序
    // 1. initPartialAttractions$()
    // 透過 attractionService.getPartialAttractions() 取得部分景點資訊，並存入 this.partialAttractions。
    // 執行完成後，switchMap() 會繼續執行 initPage$()。
    //
    // 2. initPage$()
    // 透過 getAttractionQuantities() 取得景點總數，計算總頁數，並呼叫 setPages()。
    // 執行完成後，switchMap() 會繼續執行 showPartialImages$()。
    //
    // 3. showPartialImages$()
    // 迴圈 this.partialAttractions，並為每個景點請求一張圖片。
    // 確保所有圖片請求完成後，才會進入 subscribe()。
    this.showPartialAttractions$(0)
      // 在 RxJS 中，pipe() 用來組合不同的 RxJS operators，這裡我們使用 switchMap() 來鏈接非同步操作，確保它們按順序執行。
      .pipe(
        // switchMap() 會：
        // 等待前一個 Observable 完成，然後再執行新的 Observable。
        // 如果前一個 Observable 尚未完成，則取消它，改執行新的 Observable（但這裡不會有這種情況，因為我們的流程是線性的）。
        // 返回新的 Observable，讓它接著執行。
        switchMap(() => this.initPage$()), // 等待 initPartialAttractions 完成後再執行 initPage
        switchMap(() => this.showPartialImages$()), // 等待 initPage 完成後再執行 showPartialImages
        switchMap(() => this.showAttractionViewCount$()),
        switchMap(() => this.showAttractionTag$()),
        switchMap(() => this.setCommenter$())
      )
      .subscribe();
  }

  ngAfterViewInit() {
    // 星級評分元件初始化
    const stars: NodeListOf<HTMLElement> =
      this.ratingContainer.nativeElement.querySelectorAll('.star');

    stars.forEach((star) => {
      star.addEventListener('mouseover', () =>
        this.highlightStars(parseInt(star.getAttribute('data-value')!))
      );
      star.addEventListener('mouseout', () =>
        this.highlightStars(this.selectedRating)
      );
      star.addEventListener('click', () => {
        this.selectedRating = parseInt(star.getAttribute('data-value')!);
        console.log(this.selectedRating);
        this.highlightStars(this.selectedRating);
      });
    });
  }

  highlightStars(rating: number) {
    const stars: NodeListOf<HTMLElement> =
      this.ratingContainer.nativeElement.querySelectorAll('.star');

    stars.forEach((star) => {
      const value = parseInt(star.getAttribute('data-value')!);
      star.classList.toggle('selected', value <= rating);
    });
  }
}
