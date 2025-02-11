import { AttractionCommentService } from './../../services/attraction-comment.service';
import { AttractionImageService } from './../../services/attraction-image.service';
import { Component, ViewChild } from '@angular/core';
import { IAttraction } from 'src/app/interfaces/IAttraction';
import { AttractionService } from 'src/app/services/attraction.service';
import * as $ from 'jquery';
import { IAttractionCategory } from 'src/app/interfaces/IAttractionCategory';
import { AttractionCategoryService } from 'src/app/services/attraction-category.service';
import { IAttractionImage } from 'src/app/interfaces/IAttractionImage';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IAttractionComment } from 'src/app/interfaces/IAttractionComment';

@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.component.html',
  styleUrls: ['./attraction.component.css'],
})
export class AttractionComponent {
  attraction: IAttraction = {};
  partialAttractions: IAttraction[] = [];
  attractionCategories: IAttractionCategory[] = [];
  partialImages: IAttractionImage[] = [];
  imageSrc: string[] = [];
  attractionComment: IAttractionComment[] = [];

  Page = {
    size: 0,
    index: 0,
    selectedPageIndex: 0,
    pages: [] as number[],
  };

  // showImagesByAttractionId$():Observable<void> {}

  // 根據 attractionId 顯示評論
  showCommentsByAttractionId$(id: number): Observable<void> {
    return this.attractionCommentService.getAttractionCommentById(id).pipe(
      tap((data) => {
        this.attractionComment = Array.isArray(data) ? data : [data];
      }),
      map(() => void 0)
    );
  }

  // 根據 attractionId 顯示景點資料
  showAttractionById$(id: number): Observable<void> {
    return this.attractionService.getAttractionById(id).pipe(
      tap((data) => {
        this.attraction = data;
      }),
      map(() => void 0)
    );
  }

  // 點擊"詳細資訊"按鈕時，要顯示某個景點的詳細資訊
  clickShowDetail(id: number) {
    this.showAttractionById$(id)
      .pipe(switchMap(() => this.showCommentsByAttractionId$(id)))
      .subscribe();
  }

  // 按上一頁，顯示上一頁的景點
  clickPreviousPage() {
    if (this.Page.selectedPageIndex <= 0) return;
    this.Page.selectedPageIndex--;
    this.showPartialAttractions$(this.Page.selectedPageIndex)
      .pipe(switchMap(() => this.showPartialImages$()))
      .subscribe();
    this.scrollToTop();
  }

  // 按下一頁，顯示下一頁的景點
  clickNextPage() {
    if (this.Page.selectedPageIndex >= this.Page.pages.length - 1) return;
    this.Page.selectedPageIndex++;
    this.showPartialAttractions$(this.Page.selectedPageIndex)
      .pipe(switchMap(() => this.showPartialImages$()))
      .subscribe();
    this.scrollToTop();
  }

  // 點選頁碼，設定 selectedPageIndex
  setSelectedPageIndex(index: number) {
    this.Page.selectedPageIndex = index;
    this.showPartialAttractions$(this.Page.selectedPageIndex)
      .pipe(switchMap(() => this.showPartialImages$()))
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

  constructor(
    private attractionService: AttractionService,
    private attractionCategoryService: AttractionCategoryService,
    private attractionImageService: AttractionImageService,
    private attractionCommentService: AttractionCommentService
  ) {}

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
        switchMap(() => this.showPartialImages$()) // 等待 initPage 完成後再執行 showPartialImages
      )
      .subscribe();
  }
}
