import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { loadCKEditorCloud, CKEditorModule, type CKEditorCloudResult, type CKEditorCloudConfig } from '@ckeditor/ckeditor5-angular';

import type { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { concatMap, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPostComment } from 'src/app/interfaces/IPostComment';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';
import Swal from 'sweetalert2';
import { SignalrService } from 'src/app/services/signalr.service';
const LICENSE_KEY = environment.ckeditorLicenseKey;
const cloudConfig = {
  version: '44.1.0'
} satisfies CKEditorCloudConfig;

@Component({
  selector: 'app-myarticles',
  templateUrl: './myarticles.component.html',
  styleUrls: ['./myarticles.component.css']
})
export class MyarticlesComponent {
  Editor: typeof ClassicEditor | null = null;
  config: EditorConfig | null = null;
  articleTitle = '';
  editorData = '';
  datas: any[] = [];
  finalData: SafeHtml = '';
  imageData: { [key: number]: string[] } = {};
  articleStatus: boolean = true;
  lastPostId = -1;
  cloudConfig = {
    version: '44.1.0'
  } satisfies CKEditorCloudConfig;
  statuses = [
    { value: true, label: '公開' },
    { value: false, label: '私人' }
  ];
  currentData: any = {};
  types: { value: number, label: string }[] = [{ value: 0, label: '類別' }];
  articleTypesValue = 0;
  filterTypesValue = 0;
  imagePreviews: string[] = [];
  currentIndex = 0;
  page: number = 1;
  pageSize: number = 6;
  loading: boolean = false;
  hasMore: boolean = true;
  LikeCounts: { [postId: number]: number } = {};
  CommentCounts: { [postId: number]: number } = {};
  loginUserId = 0;
  userData: { [userId: number]: { image: string, nickName: string } } = {};
  commentDatas: { [postId: number]: IPostComment[] } = {};
  commentTexts = '';
  filter = {
    TypesValue: 0,
    afterDate: '',
    keyword: ''
  }
  previousFilter = { ...this.filter };
  constructor(private socialmediaService: SocialmediaService, private sanitizer: DomSanitizer, private sweetAlert: SweetAlert2Service, private signalrService: SignalrService) { };
  ngOnInit(): void {
    this.loadArticles();
    this.loadTypes();
    this.loadLoginInfo();
    loadCKEditorCloud(cloudConfig).then(this._setupEditor.bind(this));
    this.signalrService.startConnection();
    this.signalrService.onMessageReceived((comment: IPostComment) => {
      if (this.currentData.fPostId == comment.fPostId) {
        comment.fUserImage = 'data:image/jpeg;base64,' + comment.fUserImage;
        this.commentDatas[comment.fPostId].unshift(comment);
      }
    });
  }
  ngDoCheck(): void {

    if (
      this.previousFilter.afterDate !== this.filter.afterDate ||
      this.previousFilter.TypesValue !== this.filter.TypesValue ||
      this.previousFilter.keyword !== this.filter.keyword
    ) {
      console.log(this.filter);
      this.resetArticles();
      this.loadArticles();
      this.previousFilter = { ...this.filter };
    }
  }
  reset() {
    this.articleTitle = '';
    this.editorData = '';
    this.articleStatus = true;
    this.imagePreviews = [];
    this.currentIndex = 0;
    this.articleTypesValue = 0;
  }
  loadLoginInfo() {
    this.socialmediaService.getLoginUserId().subscribe(data => this.loginUserId = data);
  }
  loadUserInfo(userId: number) {
    if (!this.userData[userId]) {
      this.userData[userId] = { image: '', nickName: '' };
    }
    this.socialmediaService.getUserInfo(userId).subscribe(data => {
      this.userData[userId] = {
        image: `data:image/jpeg;base64,${data.fUserImage}`,
        nickName: data.fUserNickName
      }
    })
  }
  loadComments(postId: number) {
    this.socialmediaService.getArticleComments(postId).subscribe((comments: IPostComment[]) => {
      if (!comments)
        return;
      this.commentDatas[postId] = comments.map((comment: IPostComment) => {
        comment.fUserImage = 'data:image/jpeg;base64,' + comment.fUserImage;
        return comment;
      });;
    });
  }
  loadTypes() {
    this.socialmediaService.getTypes().subscribe(datas => this.types = [
      { value: 0, label: '類別' },
      ...datas.map((item: any) => ({
        value: item.fCategoryId,
        label: item.fName
      }))]
    )
  }
  loadLikeCount(postId: number) {
    this.socialmediaService.getArticleLikeCount(postId).subscribe(data => this.LikeCounts[postId] = data);
  }
  loadCommentCount(postId: number) {
    this.socialmediaService.getArticleCommentCount(postId).subscribe(data => this.CommentCounts[postId] = data);
  }
  loadImages(postId: number) {
    this.socialmediaService.getMyImages(postId).subscribe(data => {
      this.imageData[postId] = data.map((imageBase64: string) => 'data:image/jpeg;base64,' + imageBase64);
    })
  }

  loadArticles() {
    if (!this.hasMore || this.loading) return;

    this.loading = true;
    this.socialmediaService.getMyArticles(this.page, this.pageSize, this.filter.TypesValue, this.filter.afterDate, this.filter.keyword).subscribe(response => {
      if (response.length > 0) {
        this.datas.push(...response);
        this.datas.forEach(post => {
          this.loadImages(post['fPostId']);
          this.loadLikeCount(post['fPostId']);
          this.loadCommentCount(post['fPostId']);
        });
        this.page++;
        // console.log(this.datas);
      } else {
        this.hasMore = false;
      }
      this.loading = false;
    }, error => {
      console.error("載入文章失敗", error);
      this.loading = false;
    });
  }

  fetchCurrentData(data: any) {
    this.reset();
    this.loadComments(data.fPostId);
    this.loadUserInfo(data.fUserId);
    this.currentData = data;
    this.articleTitle = data.fTitle;
    this.editorData = data.fContent;
    this.finalData = this.sanitizer.bypassSecurityTrustHtml(this.editorData);
    this.articleStatus = data.fIsPublic;
    if (this.imageData[data.fPostId])
      this.imagePreviews = this.imageData[data.fPostId];
    this.currentIndex = 0;
    if (data.fCategoryId)
      this.articleTypesValue = data.fCategoryId;
    else
      this.articleTypesValue = 0;
  }
  edit() {
    this.socialmediaService.putArticle({
      FPostId: this.currentData.fPostId,
      FTitle: this.articleTitle,
      FContent: this.editorData,
      FIsPublic: this.articleStatus,
      ...(this.articleTypesValue != 0 && { FCategoryId: this.articleTypesValue })
    }).pipe(
      concatMap(response => {
        const postId = this.currentData.fPostId;
        return this.socialmediaService.deleteAllImages(postId);
      })
    ).pipe(
      concatMap(response => {
        if (this.imagePreviews.length == 0)
          return of(null);
        const postId = this.currentData.fPostId;
        const imageData = this.imagePreviews.map(img => ({
          FPostId: postId,
          FImage: img
        }));
        return this.socialmediaService.postImages(imageData);
      })
    ).subscribe(response => {
      this.sweetAlert.showEasySuccess("文章修改成功");
      this.resetArticles();
      this.loadArticles();
    });
  }

  delete() {
    Swal.fire({
      title: '你確定要刪除嗎？',
      text: '刪除後將無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，刪除！',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        const postId = this.currentData.fPostId;
        this.socialmediaService.deleteArticle(postId).subscribe(response => {
          this.sweetAlert.showEasySuccess("文章刪除成功");
          this.resetArticles();
          this.loadArticles();
        })
      }
    });
  }
  save() {
    // this.finalData = this.sanitizer.bypassSecurityTrustHtml(this.editorData);
    this.socialmediaService.postArticle({
      FTitle: this.articleTitle,
      FContent: this.editorData,
      FIsPublic: this.articleStatus,
      ...(this.articleTypesValue != 0 && { FCategoryId: this.articleTypesValue })
    }).pipe(
      concatMap(response => {
        // console.log('文章發佈成功', response);
        if (this.imagePreviews.length == 0)
          return of(null);
        const postId = response['fPostId'];
        const imageData = this.imagePreviews.map(img => ({
          FPostId: postId,
          FImage: img
        }));
        return this.socialmediaService.postImages(imageData);
      })
    ).subscribe(response => {
      this.resetArticles();
      this.loadArticles();
      // console.log('文章圖片發佈成功', response);
      this.sweetAlert.showEasySuccess("新增文章成功");
    });
  }
  resetArticles() {
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    this.datas = [];
  }
  onFileSelected(event: Event): void {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
          this.currentIndex = this.imagePreviews.length - 1;
        };
        reader.readAsDataURL(file);
      })
    }
  }
  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.prevImage();
  }
  prevImage(): void {
    if (this.imagePreviews.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.imagePreviews.length) % this.imagePreviews.length;
    }
  }

  nextImage(): void {
    if (this.imagePreviews.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.imagePreviews.length;
    }
  }

  submitComment(postId: number) {
    if (this.loginUserId == 0)
      return;
    this.socialmediaService.postArticleComment({
      FPostId: postId,
      FContent: this.commentTexts
    }).subscribe(() => {
      this.commentTexts = '';
      // this.loadComments(postId);
    })
  }

  deleteComment(commentId: number, postId: number) {
    Swal.fire({
      title: '你確定要刪除嗎？',
      text: '刪除後將無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，刪除！',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        this.socialmediaService.deleteComment(commentId).subscribe(response => {
          this.sweetAlert.showEasySuccess("留言刪除成功");
          this.loadComments(postId);
        });
      }
    });
  }
  onScroll() {
    this.loadArticles();
  }
  defaultDataForCreate() {
    this.articleTitle = '早午餐!!';
    this.editorData = '<h4><span style="color:hsl(0, 0%, 60%);">中午了</span></h4><h3><span style="color:hsl(0, 0%, 30%);">肚子餓</span></h3><h2>今天吃</h2><h1><span style="background-color:hsl(33, 100%, 84%);color:hsl(31, 100%, 52%);">早午餐</span></h1>';
    this.articleStatus = true;
    this.articleTypesValue = 2007;
  }
  defaultDataForEdit() {
    this.articleTitle = '超大便當!!';
    this.editorData = '<h4><span style="background-color:hsl(0, 0%, 0%);color:hsl(64, 100%, 84%);">中午了</span></h4><h3><span style="background-color:hsl(0, 0%, 0%);color:hsl(64, 100%, 84%);">肚子餓</span></h3><h2><span style="background-color:hsl(0, 0%, 0%);color:hsl(64, 100%, 84%);">今天吃</span></h2><h1><span style="background-color:hsl(0, 0%, 0%);color:hsl(64, 100%, 84%);">超大便當</span></h1>';
    this.articleStatus = true;
    this.articleTypesValue = 2007;
  }
  defaultFilter() {
    this.filter = {
      TypesValue: 2007,
      afterDate: '2025-01-01',
      keyword: '早'
    }
  }
  defaultComment() {
    this.commentTexts = '今天是個報告的好日子';
  }
  //
  private _setupEditor(cloud: CKEditorCloudResult<typeof cloudConfig>) {
    const {
      ClassicEditor,
      Alignment,
      Autosave,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontSize,
      Heading,
      HorizontalLine,
      Indent,
      IndentBlock,
      Italic,
      List,
      Paragraph,
      Strikethrough,
      TodoList,
      Underline
    } = cloud.CKEditor;

    this.Editor = ClassicEditor;
    this.config = {
      toolbar: {
        items: [
          'heading',
          '|',
          'fontColor',
          'fontBackgroundColor',
          'fontSize',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'horizontalLine',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'outdent',
          'indent'
        ],
        shouldNotGroupWhenFull: false
      },
      plugins: [
        Alignment,
        Autosave,
        Bold,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontSize,
        Heading,
        HorizontalLine,
        Indent,
        IndentBlock,
        Italic,
        List,
        Paragraph,
        Strikethrough,
        TodoList,
        Underline
      ],
      fontFamily: {
        supportAllValues: true
      },
      fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph'
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1'
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2'
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3'
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4'
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5'
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6'
          }
        ]
      },
      licenseKey: LICENSE_KEY,
      placeholder: '請輸入內容!'
    };
  }
}
