import { Component, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocialmediaService } from 'src/app/services/socialmedia.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  datas: any[] = [];
  imageData: { [key: number]: string[] } = {};
  activePostIds: number[] = [];
  page: number = 1;
  pageSize: number = 2;
  loading: boolean = false;
  hasMore: boolean = true;
  constructor(private socialmediaService: SocialmediaService) { };
  ngOnInit(): void {
    this.loadArticles();
  }
  loadImages(postId: number) {
    this.socialmediaService.getPublicImages(postId).subscribe(data => {
      this.imageData[postId] = data.map((imageBase64: string) => 'data:image/jpeg;base64,' + imageBase64);
    })
  }
  loadArticles() {
    if (!this.hasMore || this.loading) return;  // 如果沒有更多文章或正在載入則不執行

    this.loading = true;
    this.socialmediaService.getPublicArticles(this.page, this.pageSize).subscribe(response => {
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
  openComments(postId: number) {
    this.activePostIds.push(postId);
  }
  onScroll() {
    this.loadArticles();
  }
}
