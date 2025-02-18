import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { loadCKEditorCloud, CKEditorModule, type CKEditorCloudResult, type CKEditorCloudConfig } from '@ckeditor/ckeditor5-angular';

import type { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { concatMap, of } from 'rxjs';
const LICENSE_KEY =
  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDAwOTU5OTksImp0aSI6IjAyNDhiMTFhLTU0ZDQtNDIzZi04NTFmLWEyYTA2ODIzY2FiZCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImEwOWU3ZDIwIn0.vxr1VsfKg7W4Q58SL66gRKE3eqcERkRaMXA4AZyywVzwS9vx0O6WLlIkuNrWFTBn1Q34TeRofuRdm-Z1mDRlqw';
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
  imagePreviews: string[] = [];
  currentIndex = 0;
  page: number = 1;
  pageSize: number = 9;
  loading: boolean = false;
  hasMore: boolean = true;
  constructor(private socialmediaService: SocialmediaService, private sanitizer: DomSanitizer) { };
  ngOnInit(): void {
    this.loadArticles();
    loadCKEditorCloud(cloudConfig).then(this._setupEditor.bind(this));
  }

  reset() {
    this.articleTitle = '';
    this.editorData = '';
    this.articleStatus = true;
    this.imagePreviews = [];
    this.currentIndex = 0;
    loadCKEditorCloud(cloudConfig).then(this._setupEditor.bind(this));
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
        });
        this.page++;
      } else {
        this.hasMore = false;
      }
      this.loading = false;
    }, error => {
      console.error("載入文章失敗", error);
      this.loading = false;
    });
  }
  save() {
    this.finalData = this.sanitizer.bypassSecurityTrustHtml(this.editorData);
    this.socialmediaService.postArticle({
      FTitle: this.articleTitle,
      FContent: this.editorData,
      FIsPublic: this.articleStatus
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
      this.loadArticles();
      console.log('文章圖片發佈成功', response);
    });
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
