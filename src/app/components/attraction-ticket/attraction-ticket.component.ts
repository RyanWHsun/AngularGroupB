import { AttractionTicketShoppingCartService } from './../../services/attraction-ticket-shopping-cart.service';
import { AttractionImageService } from './../../services/attraction-image.service';
import { IAttraction } from './../../interfaces/IAttraction';
import { AttractionService } from 'src/app/services/attraction.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IAttractionTicket } from 'src/app/interfaces/IAttractionTicket';
import { AttractionTicketService } from 'src/app/services/attraction-ticket.service';
import { catchError, forkJoin, map, Observable, of, take } from 'rxjs';
import { tick } from '@angular/core/testing';
import { IBuyTicketModal } from 'src/app/interfaces/IBuyTicketModal';
import { IAttractionTicketShoppingCart } from 'src/app/interfaces/IAttractionTicketShoppingCart';

@Component({
  selector: 'app-attraction-ticket',
  templateUrl: './attraction-ticket.component.html',
  styleUrls: ['./attraction-ticket.component.css'],
})
export class AttractionTicketComponent {
  @ViewChild('ticketTypeSelect')
  ticketTypeSelect!: ElementRef<HTMLSelectElement>;

  attractionTickets: IAttractionTicket[] = [];
  viewMode: 'grid' | 'list' = 'grid'; // 這是一種 union type，viewMode 的值只能是 'grid' 或 'list'
  pages: number[] = [];
  selectedPageIndex: number = 0;
  menuIsActive: boolean = true;
  viewModeIsActive: boolean = true;
  pageIsActive: boolean = true;

  ticket: IAttractionTicket = {};
  partialAttractionTickets: IAttractionTicket[] = [];
  attractionDescription: string[] = [];

  buyTicketModal: IBuyTicketModal = {
    attractionName: '',
    attractionDescription: '',
    attractionTicketType: [],
    attractionTicketPrice: [],
    attractionTicketQuantity: 0,
    imageSrc: '',
  };

  selectedType: string = ''; // 被選中的票種
  selectedPrice: number = 0; // 被選中的票種的價格
  //selectedQuantity: number = 0;

  // 放入購物車的景點門票資訊
  shoppingCartTicket: IAttractionTicketShoppingCart = {
    fUserId: 0,
    fTicketId: 0,
    fAttractionId: 0,
    fAttractionName: '',
    fImageSrc: '',
    fTicketType: '',
    fPrice: 0,
    fQuantity: 0,
    fDiscountInformation: '',
    fCreatedDate: '',
  };

  isDisabled: boolean = true; // 「加入購物車」按鈕一開始不能按。true 才是不能按的意思

  // constructor
  constructor(
    private attractionTicketService: AttractionTicketService,
    private attractionService: AttractionService,
    private attractionImageService: AttractionImageService,
    private attractionTicketShoppingCartService: AttractionTicketShoppingCartService
  ) {}

  setAddToCartBtn() {
    let total =
      this.buyTicketModal.attractionTicketQuantity! * this.selectedPrice!;
    if (total > 0) this.isDisabled = false;
    else this.isDisabled = true;
  }

  addTicketQuantity() {
    this.buyTicketModal.attractionTicketQuantity!++;
    this.changeTicketQty();
  }

  subTicketQuantity() {
    this.buyTicketModal.attractionTicketQuantity!--;
    this.changeTicketQty();
  }

  changeTicketQty() {
    if (typeof this.buyTicketModal.attractionTicketQuantity !== 'number') {
      this.buyTicketModal.attractionTicketQuantity = 0;
    } else if (this.buyTicketModal.attractionTicketQuantity! >= 15) {
      this.buyTicketModal.attractionTicketQuantity = 15;
    } else if (this.buyTicketModal.attractionTicketQuantity! <= 0) {
      this.buyTicketModal.attractionTicketQuantity = 0;
    } else {
      this.buyTicketModal.attractionTicketQuantity =
        this.buyTicketModal.attractionTicketQuantity;
    }
    this.setAddToCartBtn();
  }

  setImage(tickets: IAttractionTicket[]) {
    const imageRequests = tickets.map((ticket) =>
      this.attractionImageService
        .getOneAttractionImageById(ticket.fAttractionId!)
        .pipe(
          map((data) =>
            data === null ? null : `data:image/jpeg;base64,${data.fImage}`
          )
        )
    );

    forkJoin(imageRequests).subscribe((images) => {
      images.forEach((imageSrc, index) => {
        if (imageSrc) {
          this.partialAttractionTickets[index].fimageSrc = imageSrc;
        }
      });
    });
  }

  // 顯示購買票券的 modal 畫面
  showTicketModal(ticket: IAttractionTicket, attractionDescription: string) {
    this.selectedPrice = 0;
    this.buyTicketModal.attractionName = ticket.fAttractionName
      ? ticket.fAttractionName
      : '';
    this.buyTicketModal.attractionDescription = attractionDescription;
    try {
      this.attractionTicketService
        .getAttractionTicketsById(ticket.fAttractionId!)
        .subscribe((data) => {
          this.buyTicketModal.attractionTicketType = data.map(
            (item) => item.fTicketType!
          );
          this.buyTicketModal.attractionTicketPrice = data.map(
            (item) => item.fPrice!
          );
        });
    } catch (error) {
      console.error('showTicketModal ERROR! ', error);
    }
    this.buyTicketModal.attractionTicketQuantity = 0;
    this.buyTicketModal.imageSrc = ticket.fimageSrc;
    this.setShoppingCartTicket(ticket);
  }

  // 設定 shoppingCartTicket 的值
  // setShoppingCartTicket() overloading 的寫法
  setShoppingCartTicket(ticket: IAttractionTicket): void;
  setShoppingCartTicket(buyTicketModal: IBuyTicketModal): void;
  // param: IAttractionTicket | IBuyTicketModal
  // 傳入的 param 可能是 IAttractionTicket 或 IBuyTicketModal
  setShoppingCartTicket(param: IAttractionTicket | IBuyTicketModal): void {
    if (this.isTicket(param)) {
      //this.shoppingCartTicket.fUserId = 0;
      this.shoppingCartTicket.fTicketId = param.fAttractionTicketId;
      this.shoppingCartTicket.fAttractionId = param.fAttractionId;
      this.shoppingCartTicket.fAttractionName = param.fAttractionName;
      this.shoppingCartTicket.fImageSrc = param.fimageSrc;
      this.shoppingCartTicket.fDiscountInformation = '';

      // UTC+8
      // new Date().toISOString() 的時間是以 UTC 時間顯示的，而我的當地時間比 UTC 快 8 小時，所以是 UTC+8 時區。
      let localTime = new Date();
      localTime.setHours(localTime.getHours() + 8);
      this.shoppingCartTicket.fCreatedDate = localTime.toISOString();
    } else if (this.isModal(param)) {
      this.shoppingCartTicket.fTicketType = this.selectedType;
      this.shoppingCartTicket.fPrice = this.selectedPrice;
      this.shoppingCartTicket.fQuantity = param.attractionTicketQuantity;
    } else {
      console.error('Invalid parameter type');
    }
  }

  // Type Guard
  // TypeScript 本身無法直接從物件的結構判斷其型別，這就是型別守衛的用途。
  // 型別守衛是一個函式，用來檢查某個物件是否符合某個型別，並讓 TypeScript 知道檢查成功後，該物件就被視為該型別。
  //
  // param is IAttractionTicket
  // 函式的回傳型別，告訴 TypeScript：
  // 如果這個函式回傳 true，則 param 會被視為 IAttractionTicket 型別。
  // 在型別守衛中，param is IAttractionTicket 是一種特定的語法。
  //
  // 'fAttractionTicketId' in param && 'fAttractionId' in param
  // 使用 JavaScript 的 in 運算子來檢查 param 是否擁有這些屬性。
  // 如果 param 同時具有屬性 fAttractionTicketId 和 fAttractionId，則認為 param 是 IAttractionTicket 型別。
  isTicket(param: any): param is IAttractionTicket {
    return 'fAttractionTicketId' in param && 'fAttractionId' in param;
  }

  isModal(param: any): param is IBuyTicketModal {
    return 'attractionTicketType' in param && 'attractionTicketPrice' in param;
  }

  setTicketPrice(event: Event) {
    const selectedElement = event.target as HTMLSelectElement; // 將 target 斷言為 HTMLSelectElement
    this.selectedType = selectedElement.value;
    if (!this.selectedType) {
      return;
    }
    let selectedIndex = this.buyTicketModal.attractionTicketType?.findIndex(
      (type) => type === this.selectedType
    );
    if (selectedIndex !== -1) {
      this.selectedPrice =
        this.buyTicketModal.attractionTicketPrice![selectedIndex!];
    }
  }

  // 把訂購的門票加入購物車
  addTicketToShoppingCart(buyTicketModal: IBuyTicketModal) {
    this.setShoppingCartTicket(buyTicketModal);
    this.attractionTicketShoppingCartService
      .postAttractionTicketToShoppingCart(this.shoppingCartTicket)
      .subscribe({
        next: () => {
          console.log('Order ticket success!');
        },
        error: () => {
          console.log('Order ticket failed!');
        },
      });
  }

  showAllTickets() {
    this.attractionTicketService.getAllAttractionTickets().subscribe((data) => {
      //this.setPages(Math.ceil(data.length / 9));
    });
  }

  showPopularTickets(index: number) {}

  showPartialAttractionTickets(index: number) {
    return this.attractionTicketService
      .getPartialAttractionTickets(index, true)
      .pipe(
        map((data) => {
          this.partialAttractionTickets = data;
          this.setImage(data);
          return data; // 回傳票券資料
        })
      );
  }

  getTicketQuantities(): Observable<number> {
    return this.attractionTicketService.getTicketQuantities();
  }

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
    this.pages = Array.from({ length: pageLength }, (_, i) => i); // 生成 0~9 的陣列
  }

  toggleAll() {
    this.menuIsActive = true;
    this.getTicketQuantities()
      .pipe(take(1))
      .subscribe((qty) => {
        this.setPages(Math.ceil(qty / 9));
        console.log(this.pages)
        this.showPartialAttractionTickets(0);
      });
  }

  togglePopular() {
    this.menuIsActive = false;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
    this.viewModeIsActive = !this.viewModeIsActive;
  }

  // 點選頁碼，設定 selectedPageIndex
  setSelectedPageIndex(index: number) {
    this.selectedPageIndex = index;
    this.showPartialAttractionTickets(index);
    this.scrollToTop();
  }

  clickPreviousPage() {
    if (this.selectedPageIndex <= 0) return;
    this.selectedPageIndex--;
    this.showPartialAttractionTickets(this.selectedPageIndex);
    this.scrollToTop();
  }

  clickNextPage() {
    if (this.selectedPageIndex >= this.pages.length - 1) return;
    this.selectedPageIndex++;
    this.showPartialAttractionTickets(this.selectedPageIndex);
    this.scrollToTop();
  }

  getAttractionDescription(id: number): Observable<string> {
    // 為什麼需要 pipe？
    // 因為 RxJS 提供了大量的運算子，每個運算子負責不同的功能（如錯誤處理、數據轉換、過濾等）。
    // pipe 將這些運算子串接在一起，形成一個處理數據的管道。
    return this.attractionService.getAttractionById(id).pipe(
      map((data) => (data && data.fDescription ? data.fDescription : '')),
      // catchError 的作用：
      // 捕捉 Observable 執行過程中的錯誤。
      // 在錯誤發生時，替代返回一個新的 Observable，以免中斷資料流。
      //
      // of('') 的作用：
      // of 是 RxJS 提供的一個運算子，用於建立一個簡單的 Observable。
      // 在這裡用來回傳一個包含空字串的 Observable，作為錯誤情況下的替代值。
      catchError(() => of(''))
    );
  }

  // 把 attraction description 的資料填入 attractionDescription 陣列
  setAttractionDescriptionArray(index: number) {
    this.showPartialAttractionTickets(index).subscribe((tickets) => {
      const request = tickets
        .filter(
          (ticket) =>
            ticket !== null && typeof ticket.fAttractionId === 'number'
        )
        .map((ticket) => {
          return this.getAttractionDescription(ticket.fAttractionId!).pipe(
            catchError(() => of(''))
          );
        });

      // forkJoin 是 RxJS 提供的一個操作符，用於並行執行多個 Observable，並在所有 Observable 完成後返回它們的結果。返回值是一個包含每個 Observable 最終值的陣列。
      //
      // request 是一個 Observable 陣列。其中每個元素都是一個 Observable<string>。
      // const request = [
      //     this.getAttractionDescription(1),
      //     this.getAttractionDescription(2),
      //     this.getAttractionDescription(3),
      // ];
      //
      // forkJoin(request)：
      // 開始執行所有 Observable，即所有請求將同時並行發送。
      // 當所有 Observable 都完成時，會將每個 Observable 的結果收集為一個陣列，並將此陣列作為輸出。
      // 如果任意一個 Observable 發生錯誤，整個 forkJoin 會進入 error，除非有使用 catchError 來處理錯誤。
      //
      // subscribe() 訂閱 Observable
      // subscribe((descriptions) => {...})：
      // 當所有請求完成後，forkJoin 的結果（即所有 Observable 的結果）會以陣列形式傳遞給 subscribe 的回呼函式。
      // descriptions 是一個陣列，包含每個請求的最終值。
      forkJoin(request).subscribe((descriptions) => {
        this.attractionDescription = descriptions;
      });
    });
  }

  ngOnInit() {
    this.toggleAll();

    // 把 attraction description 的資料填入 attractionDescription 陣列
    this.setAttractionDescriptionArray(0);
  }

  ngAfterViewInit() {
    $('#exampleModalCenter').on('hidden.bs.modal', (e) => {
      this.ticketTypeSelect.nativeElement.value = '';
      this.selectedPrice = 0;
      this.isDisabled = true;
    });
  }

  // 在每次換頁事件中調用 scrollToTop()，確保在頁碼切換後自動滾動到頁面頂端。
  scrollToTop() {
    // window.scrollTo 方法：
    // top: 0 表示滾動到頁面的頂端。
    // behavior: 'smooth' 則會讓滾動行為更加平滑。
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
