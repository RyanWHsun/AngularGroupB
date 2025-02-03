import { AttractionImageService } from './../../services/attraction-image.service';
//import { ColDef } from './../../../../node_modules/ag-grid-community/dist/types/core/entities/colDef.d';
import { Component, ViewChild } from '@angular/core';
import { IAttraction } from 'src/app/interfaces/IAttraction';
import { AttractionService } from 'src/app/services/attraction.service';
import * as $ from 'jquery';
import 'bootstrap';
import { IAttractionCategory } from 'src/app/interfaces/IAttractionCategory';
import { AttractionCategoryService } from 'src/app/services/attraction-category.service';
import { IAttractionImage } from 'src/app/interfaces/IAttractionImage';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.component.html',
  styleUrls: ['./attraction.component.css'],
})
export class AttractionComponent {
  attractionCategories: IAttractionCategory[] = [];

  @ViewChild(AgGridAngular)agGrid!:AgGridAngular;
  gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      headerName: '操作',
      field: 'actions',
      cellRenderer: this.actionCellRenderer.bind(this), // 呼叫自訂函式
      cellStyle: { textAlign: 'center' }, // 讓按鈕置中
      minWidth: 150, // 設定欄位寬度
    },
    { headerName: '景點ID', field: 'fAttractionId' },
    { headerName: '景點名稱', field: 'fAttractionName', filter: true },
    { headerName: '分類ID', field: 'fCategoryId' },
    { headerName: '分類名稱', field: 'fCategoryName', filter: true },
    { headerName: '描述', field: 'fDescription', filter: true },
    { headerName: '地區', field: 'fRegion', filter: true },
    { headerName: '地址', field: 'fAddress', filter: true },
    { headerName: '狀態', field: 'fStatus', filter: true },
    { headerName: '開放時間', field: 'fOpeningTime' },
    { headerName: '關閉時間', field: 'fClosingTime' },
    { headerName: '電話', field: 'fPhoneNumber' },
    { headerName: '網址', field: 'fWebsiteUrl' },
    { headerName: '建立日期', field: 'fCreatedDate' },
    { headerName: '更新日期', field: 'fUpdatedDate' },
    { headerName: '交通資訊', field: 'fTrafficInformation' },
    { headerName: '經度', field: 'fLongitude' },
    { headerName: '緯度', field: 'fLatitude' },
  ];

  rowData: IAttraction[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 30, 50];

  onGridReady(params:GridReadyEvent){
    this.gridApi = params.api;
  }

  selectedFiles: File[] = [];

  // **自訂按鈕的 CellRenderer**
  actionCellRenderer(params: any) {
    const div = document.createElement('div');

    // 建立編輯按鈕
    const editButton = document.createElement('button');
    editButton.innerText = '編輯';
    editButton.classList.add('btn', 'btn-outline-info', 'btn-sm');
    editButton.setAttribute('data-toggle', 'modal');
    editButton.setAttribute('data-target', '#mixModal');
    editButton.style.marginRight = '3px';
    editButton.addEventListener('click', () => {
      const id = params.data.fAttractionId; // 假設 params.data.fAttractionId 是景點的 ID
      this.showDetails(id); // 呼叫 `showDetails` 函式
      this.setCarouselImages(id);
      this.setDefaultPreviewImage();
    });

    // 建立刪除按鈕
    const deleteButton = document.createElement('button');
    deleteButton.innerText = '刪除';
    deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'ms-2');
    deleteButton.addEventListener('click', function () {
      //console.log(params.data);
    });

    // 將按鈕加入 div
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    return div;
  }
  constructor(
    private attractionService: AttractionService,
    private attractionCategoryService: AttractionCategoryService,
    private attractionImageService: AttractionImageService
  ) {}

  ngOnInit(): void {
    $('#btnSave').on('click', async (e) => {
      e.preventDefault(); // 防止表單預設提交行為
      await this.editItem();
      $('#mixModal').modal('hide'); // 關閉 modal
    });

    $('#FImages').on('change', (event) => {
      alert('image change');
      this.selectedFiles = [];
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        this.selectedFiles = Array.from(inputElement.files); // 轉成陣列
      }
      this.previewImage(event.target);
    });

    this.attractionCategoryService
      .getAttractionCategories()
      .subscribe((data) => {
        // console.log(data);
        // console.log(`${JSON.stringify(data)}`);
        this.attractionCategories = data;
        //console.log(this.attractionCategories);
      });

    const modalElement = document.getElementById('exampleModalCenter');

    if (modalElement) {
      $('#exampleModalCenter').on('hide.bs.modal', () => {
        //alert('Modal has been closed!');
      });
    }
    // this.attractionService.getAttractions() 回傳 1 個 Observable 的物件，要 subscribe() 後才可以使用
    this.attractionService.getAttractions().subscribe((data) => {
      //console.log(data);
      this.rowData = data;
    });

    document.getElementById('btnEdit')?.addEventListener('click', () => {
      const fieldIds = [
        'FCategoryId',
        'FDescription',
        'FRegion',
        'FAddress',
        'FStatus',
        'FOpeningTime',
        'FClosingTime',
        'FPhoneNumber',
        'FWebsiteUrl',
        'FTrafficInformation',
        'FImages',
      ];

      // 解除禁用的欄位
      fieldIds.forEach((id) => {
        const field = document.getElementById(id) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        if (field) {
          field.disabled = false; // 設置為可用
        }
      });

      // 顯示按鈕
      const buttonIds = ['btnCancel', 'btnSave'];
      buttonIds.forEach((id) => {
        const button = document.getElementById(id);
        if (button) {
          button.style.display = 'block'; // 顯示按鈕
        }
      });
    });

    // 動態綁定點擊事件
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.id === 'FAttractionName') {
        this.editH5Text(event);
      }
    });

    // 關閉 Modal 時觸發
    $('#mixModal').on('hide.bs.modal', () => {
      const fieldsToDisable = [
        'FCategoryId',
        'FDescription',
        'FRegion',
        'FAddress',
        'FStatus',
        'FOpeningTime',
        'FClosingTime',
        'FPhoneNumber',
        'FWebsiteUrl',
        'FTrafficInformation',
        'FImages',
      ];

      fieldsToDisable.forEach((fieldId) => {
        const field = document.getElementById(fieldId) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        if (field) {
          field.disabled = true;
        }
      });
      //

      // 隱藏按鈕
      const buttonsToHide = ['btnCancel', 'btnSave'];
      buttonsToHide.forEach((buttonId) => {
        const button = document.getElementById(buttonId) as HTMLElement;
        if (button) {
          button.style.display = 'none';
        }
      });

      // 清空容器和圖片輸入欄位
      const imageNameContainer = document.getElementById(
        'imageNameContainer'
      ) as HTMLElement;
      const imagesField = document.getElementById(
        'FImages'
      ) as HTMLInputElement;

      if (imageNameContainer) {
        imageNameContainer.innerHTML = ''; // 清空容器
      }

      if (imagesField) {
        imagesField.value = ''; // 清空圖片輸入欄位
      }

      // 清空和重設圖片預覽容器內容
      const previewImageContainer = $('#previewImageContainer');
      const $previewCarouselItem = $(
        `<div class="carousel-item active" data-bs-interval="2000"><img src="assets/images/noImage.jpg" class="d-block w-100" alt="景點圖片" style="height: 300px"></div>`
      );
      if (previewImageContainer) {
        previewImageContainer.empty(); // 清空預覽圖片容器
        //this.previewImageContainer.innerHTML = ''; // 清空預覽圖片容器
        if ($previewCarouselItem) {
          previewImageContainer.append($previewCarouselItem);
          //this.previewImageContainer.appendChild(this.$previewCarouselItem); // 重設為 noImage.jpeg 預設內容
        }
      }

      // 手動移除 backdrop
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open'); // 移除 Bootstrap 加上的 class
    });
  }

  editH5Text(event: Event): void {
    // 獲取當前文字內容
    const target = event.target as HTMLElement;

    const currentText = target.innerText;

    // 建立 <input> 元素
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'FAttractionNameInput';
    inputField.className = 'form-control w-100';
    inputField.value = currentText;

    // 替換 <h5> 為 <input>
    target.replaceWith(inputField);

    // 當失去焦點時恢復為 <h5>
    inputField.addEventListener('blur', () => {
      const newText =
        inputField.value.trim() === '' ? currentText : inputField.value;

      // 建立新的 <h5> 元素
      const h5Element = document.createElement('h5');
      h5Element.className = 'modal-title w-100';
      h5Element.id = 'FAttractionName';
      h5Element.innerText = newText;

      // 替換回 <h5>，並重新綁定點擊事件
      inputField.replaceWith(h5Element);

      // 更新隱藏欄位的值
      const hiddenInput = document.getElementById(
        'hiddenFAttractionName'
      ) as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = newText;
      }

      // 重新綁定點擊事件
      h5Element.addEventListener('click', (e) => this.editH5Text(e));
    });

    // 自動聚焦輸入框
    inputField.focus();
  }

  // 取得某個 atraction 的詳細資料
  showDetails(id: number) {
    this.attractionService.getAttractionById(id).subscribe((data) => {
      //console.log(data);
      $('#hiddenFAttractionId').val(
        data.fAttractionId ? data.fAttractionId : ''
      );
      $('#FAttractionName').text(
        data.fAttractionName ? data.fAttractionName : ''
      );
      let attractionName = $('#FAttractionName').text();
      $('#hiddenFAttractionName').val(attractionName);
      $('#FCategoryId').val(data.fCategoryId ? data.fCategoryId : '');
      $('#FDescription').val(data.fDescription ? data.fDescription : '');
      $('#FRegion').val(data.fRegion ? data.fRegion : '');
      $('#FAddress').val(data.fAddress ? data.fAddress : '');
      $('#FStatus').val(data.fStatus ? data.fStatus : '');
      $('#FOpeningTime').val(data.fOpeningTime ? data.fOpeningTime : '');
      $('#FClosingTime').val(data.fClosingTime ? data.fClosingTime : '');
      $('#FPhoneNumber').val(data.fPhoneNumber ? data.fPhoneNumber : '');
      $('#FWebsiteUrl').val(data.fWebsiteUrl ? data.fWebsiteUrl : '');
      $('#FTrafficInformation').val(
        data.fTrafficInformation ? data.fTrafficInformation : ''
      );
      $('#FCreatedDate').val(data.fCreatedDate ? data.fCreatedDate : '');
      $('#FUpdatedDate').val(data.fUpdatedDate ? data.fUpdatedDate : '');
    });
  }

  // carousel
  setCarouselImages(attractionId: number) {
    //清空原有的 carousel-inner 內容
    const $carouselInner = $('#displayImageContainer');
    $carouselInner.empty();

    this.attractionImageService
      .getAttractionImageById(attractionId)
      .subscribe((images) => {
        //console.log(images);
        // no image
        if (images.length === 0) {
          // 建立 carousel-item 元素
          const $carouselItem = $(
            `<div class="carousel-item active" data-bs-interval="2000"><img src="assets/images/noImage.jpg" class="d-block w-100" alt="景點圖片" style="height: 300px"></div>`
          );
          // 加入到 carousel-inner
          $carouselInner.append($carouselItem);
          return;
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
            const $carouselItem = $(
              `<div class="carousel-item ${isActive}" data-bs-interval="2000"><img src="${imageSrc}" class="d-block w-100" alt="景點圖片" style="height: 300px"></div>`
            );

            // 加入到 carousel-inner
            $carouselInner.append($carouselItem);
          });
        }
      });
  }

  setDefaultPreviewImage() {
    const previewImageContainer = $('#previewImageContainer');
    const $previewCarouselItem = $(
      `<div class="carousel-item active" data-bs-interval="2000"><img src="assets/images/noImage.jpg" class="d-block w-100" alt="景點圖片" style="height: 300px"></div>`
    );
    if (previewImageContainer.length === 0) {
      console.error('previewImageContainer not found!');
    } else {
      previewImageContainer.append($previewCarouselItem);
    }
  }

  previewImage(inputFile: any) {
    // 清空 imageNameContainer 的內容
    $('#imageNameContainer').find('div').remove();
    // 清空預覽圖片欄位的內容
    const previewImageContainer = $('#previewImageContainer');
    const $previewCarouselItem = $(
      `<div class="carousel-item active" data-bs-interval="2000"><img src="assets/images/noImage.jpg" class="d-block w-100" alt="景點圖片" style="height: 300px"></div>`
    );
    previewImageContainer.empty();

    if (!inputFile.files || inputFile.files.length == 0) {
      alert('no image');
      return;
    }

    let allowType = 'image.*';
    let fileList = inputFile.files;
    console.log(inputFile.files);
    // 遍歷圖片陣列並生成 carousel-item
    // $.each 是 jQuery 提供的迴圈方法，用來遍歷 images 陣列。
    // images 是一個陣列，其中每個元素 image 可能包含圖片的 URL。
    // index 是陣列中當前元素的索引。
    // image 是陣列中當前的圖片物件。
    $.each(fileList, (index, file) => {
      if (file.type.match(allowType)) {
        let reader = new FileReader();

        // 註冊一個回呼函式(不會立即執行!)，當reader讀取完成後會觸發該函式。
        // 使用箭頭函式確保 `this` 指向正確
        reader.onload = (e) => {
          // 第一張圖片設為 active
          const isActive = index === 0 ? 'active' : '';
          const mimeType = file.type; // 例如 "image/png"

          // 確保 e.target?.result 是 string
          if (typeof e.target?.result === 'string') {
            const base64Data = e.target.result.split(',')[1]; // 去掉 data:image/png;base64, 前綴
            //console.log(base64Data);
            const fullBase64 = `data:${mimeType};base64,${base64Data}`;
            // 建立 carousel-item 元素，並設置圖片 src 為讀取的結果
            const $previewCarouselItem2 = $(
              `<div class="carousel-item ${isActive}" data-bs-interval="2000"><img src="${fullBase64}" class="d-block w-100" alt="${file.name}" style="height: 300px"></div>`
            );
            // 加入到 carousel-inner
            previewImageContainer.append($previewCarouselItem2);
          }

          // 顯示剛剛添加的圖片檔名
          let div = $('<div>').text(file.name);
          $('#imageNameContainer').append(div);
        };

        // 使用 readAsDataURL 讀取檔案內容
        reader.readAsDataURL(file);
      } else {
        // Swal.fire({
        //     icon: "error",
        //     title: "錯誤",
        //     text: `不支援上傳的檔案格式：${file.name}`,
        // });
        alert('不支援上傳的檔案格式');
        $('#FImages').val('');
        $('#imageNameContainer').find('div').remove();

        // 加入到 carousel-inner
        previewImageContainer.append($previewCarouselItem);
      }
    });
  }

  async editItem() {
    // 建立一個 FormData 物件來處理表單資料和圖片上傳
    const formData = new FormData();

    // 將表單欄位值加入 formData
    let hiddenFAttractionId = $('#hiddenFAttractionId').val();
    let hiddenFAttractionName = $('#hiddenFAttractionName').val();
    let FCategoryId = $('#FCategoryId').val();
    let FCategoryName = $('#FCategoryId option:selected').text();
    let FDescription = $('#FDescription').val();
    let FRegion = $('#FRegion').val();
    let FAddress = $('#FAddress').val();
    let FStatus = $('#FStatus').val();
    let FOpeningTime = $('#FOpeningTime').val();
    let FClosingTime = $('#FClosingTime').val();
    let FPhoneNumber = $('#FPhoneNumber').val();
    let FWebsiteUrl = $('#FWebsiteUrl').val();
    let FCreatedDate = $('#FCreatedDate').val();
    let FUpdatedDate = new Date().toISOString();
    let FTrafficInformation = $('#FTrafficInformation').val();

    formData.append(
      'fAttractionId',
      hiddenFAttractionId ? hiddenFAttractionId.toString() : ''
    );
    formData.append(
      'fAttractionName',
      hiddenFAttractionName ? hiddenFAttractionName.toString() : ''
    );
    formData.append('fCategoryId', FCategoryId ? FCategoryId.toString() : '');
    formData.append(
      'fCategoryName',
      FCategoryName ? FCategoryName.toString() : ''
    );
    // formData.append(
    //   'fCategoryName',
    //   $('#FCategoryId option:selected').text() || ''
    // );
    formData.append(
      'fDescription',
      FDescription ? FDescription.toString() : ''
    );
    formData.append('fRegion', FRegion ? FRegion.toString() : '');
    formData.append('fAddress', FAddress ? FAddress.toString() : '');
    formData.append('fStatus', FStatus ? FStatus.toString() : '');
    formData.append(
      'fOpeningTime',
      FOpeningTime ? FOpeningTime.toString() : ''
    );
    formData.append(
      'fClosingTime',
      FClosingTime ? FClosingTime.toString() : ''
    );
    formData.append(
      'fPhoneNumber',
      FPhoneNumber ? FPhoneNumber.toString() : ''
    );
    formData.append('fWebsiteUrl', FWebsiteUrl ? FWebsiteUrl.toString() : '');
    formData.append(
      'fCreatedDate',
      FCreatedDate ? FCreatedDate.toString() : ''
    );
    formData.append('fUpdatedDate', FUpdatedDate ? FUpdatedDate : '');
    formData.append(
      'fTrafficInformation',
      FTrafficInformation ? FTrafficInformation.toString() : ''
    );

    // 處理圖片上傳
    let inputElement = $('#FImages')[0] as HTMLInputElement;
    let files = inputElement.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('fImages', files[i]);
      }
    }

    formData.forEach((value, key) => {
      // 通過檢查 value instanceof File，可以確定 value 是否是 File 類型。
      if (value instanceof File) {
        console.log(
          `${key}: File Name - ${value.name}, File Size - ${value.size} bytes, File Type - ${value.type}`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    // FOpeningTime 和 FClosingTime 的值為 HH:mm ， 後端 attractionDTO 只能接收 HH:mm:ss 這種格式的字串，所以要加 ':00'
    let editedAttraction: IAttraction = {
      fAttractionId: hiddenFAttractionId ? Number(hiddenFAttractionId) : null,
      fAttractionName: hiddenFAttractionName as string | null,
      fCategoryId: FCategoryId ? Number(FCategoryId) : null,
      fCategoryName: FCategoryName as string | null,
      fDescription: FDescription as string | null,
      fRegion: FRegion as string | null,
      fAddress: FAddress as string | null,
      fStatus: FStatus as string | null,
      fOpeningTime: FOpeningTime as string | null,
      fClosingTime: FClosingTime as string | null,
      fPhoneNumber: FPhoneNumber as string | null,
      fWebsiteUrl: FWebsiteUrl as string | null,
      fCreatedDate: FCreatedDate as string | null,
      fUpdatedDate: FUpdatedDate,
      fTrafficInformation: FTrafficInformation as string | null,
      fLongitude: null,
      fLatitude: null,
    };

    console.log(editedAttraction);
    // Non-Null Assertion Operator: ! 是 TypeScript 提供的一個語法，用來告訴編譯器某個值一定不為 null 或 undefined，即便 TypeScript 推斷它可能是 null 或 undefined。
    this.attractionService
      .putAttractionById(editedAttraction.fAttractionId!, editedAttraction)
      .subscribe({
        next: () => {
          console.log('update success');
        },
        error: () => {
          console.log('update error');
        },
      });

    if (this.selectedFiles.length > 0) {
      this.attractionImageService
        .postAttractionImages(
          editedAttraction.fAttractionId!,
          this.selectedFiles
        )
        .subscribe({
          next: () => {
            console.log('圖片上傳成功');
          },
          error: () => {
            console.log('圖片上傳失敗');
          },
        });
    }

    // this.rowData.
    // editedAttraction;
    // this.gridApi.setRowData(this.rowData);

  }
}
