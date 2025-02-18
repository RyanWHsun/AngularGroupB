import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IPostComment } from 'src/app/interfaces/IPostComment';
import { IUser } from 'src/app/interfaces/IUser';
import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  @ViewChild('commentContainer') commentContainer!: ElementRef;
  datas: any[] = [];
  imageData: { [key: number]: string[] } = {};
  userData: { [key: number]: { image: string, nickName: string } } = {};
  contentData: { [key: number]: SafeHtml } = {};
  commentDatas: { [postId: number]: IPostComment[] } = {};
  activePostIds: number[] = [];
  commentTexts: { [postId: string]: string } = {};
  page: number = 1;
  pageSize: number = 3;
  loading: boolean = false;
  hasMore: boolean = true;
  loginUserId = 0;
  constructor(private socialmediaService: SocialmediaService, private sanitizer: DomSanitizer) { };
  ngOnInit(): void {
    this.loadLoginInfo();
    this.loadArticles();
  }
  loadLoginInfo() {
    this.socialmediaService.getLoginUserId().subscribe(data => { this.loginUserId = data });

  }

  loadImages(postId: number) {
    this.socialmediaService.getPublicImages(postId).subscribe(data => {
      this.imageData[postId] = data.map((imageBase64: string) => 'data:image/jpeg;base64,' + imageBase64);
    })
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
      this.commentDatas[postId] = comments.map((comment: IPostComment) => {
        comment.fUserImage = 'data:image/jpeg;base64,' + comment.fUserImage;
        return comment
      });;
    });
  }
  loadArticles() {
    if (!this.hasMore || this.loading) return;

    this.loading = true;
    this.socialmediaService.getPublicArticles(this.page, this.pageSize).subscribe(response => {
      if (response.length > 0) {
        this.datas.push(...response);
        // console.log(this.datas);
        this.datas.forEach(post => {
          this.loadImages(post['fPostId']);
          this.loadUserInfo(post['fUserId']);
          this.contentData[post['fPostId']] = this.sanitizer.bypassSecurityTrustHtml(post['fContent']) as SafeHtml;
          this.commentTexts[post['fPostId']] = '';
        });
        // console.log(this.userData);
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
  toggleComments(postId: number) {
    const index = this.activePostIds.indexOf(postId);
    if (index === -1) {
      this.loadComments(postId);
      // console.log(this.commentDatas);
      this.activePostIds.push(postId);
    } else {
      this.activePostIds.splice(index, 1);
    }
  }
  submitComment(postId: number) {
    this.socialmediaService.postArticleComment({
      FPostId: postId,
      FContent: this.commentTexts[postId]
    }).subscribe(() => {
      this.commentTexts[postId] = '';
      if (this.activePostIds.includes(postId)) {
        this.loadComments(postId);
        setTimeout(() => { this.commentContainer.nativeElement.scrollTo({ top: 0, behavior: 'smooth' }) }, 100);
      } else {
        this.toggleComments(postId);
      }

    })
  }

  onScroll() {
    this.loadArticles();
  }
}
