import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { loadCKEditorCloud, CKEditorModule, type CKEditorCloudResult, type CKEditorCloudConfig } from '@ckeditor/ckeditor5-angular';

import type { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { concatMap, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPostComment } from 'src/app/interfaces/IPostComment';
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
  constructor(private socialmediaService: SocialmediaService, private sanitizer: DomSanitizer) { };
  ngOnInit(): void {
    this.loadArticles();
    this.loadTypes();
    this.loadLoginInfo();
    loadCKEditorCloud(cloudConfig).then(this._setupEditor.bind(this));
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
    this.socialmediaService.getMyArticles(this.page, this.pageSize).subscribe(response => {
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
    })
      // .pipe(
      //   concatMap(response => {
      //     console.log('文章發佈成功', response);
      //     if (this.imagePreviews.length == 0)
      //       return of(null);
      //     const postId = response['fPostId'];
      //     const imageData = this.imagePreviews.map(img => ({
      //       FPostId: postId,
      //       FImage: img
      //     }));
      //     return this.socialmediaService.postImages(imageData);
      //   }))
      .subscribe(response => {
        this.resetArticles();
        this.loadArticles();
        // console.log('文章圖片發佈成功', response);
      });
  }
  delete() {
    const postId = this.currentData.fPostId;
    this.socialmediaService.deleteArticle(postId).subscribe(response => {
      this.resetArticles();
      this.loadArticles();
    })
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
        console.log('文章發佈成功', response);
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
      this.loadComments(postId);
    })
  }

  deleteComment(commentId: number, postId: number) {
    this.socialmediaService.deleteComment(commentId).subscribe(response => { this.loadComments(postId) });
  }
  onScroll() {
    this.loadArticles();
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
