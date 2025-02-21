import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IPostComment } from 'src/app/interfaces/IPostComment';
import { SocialmediaService } from 'src/app/services/socialmedia.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  @ViewChild('commentContainer') commentContainer!: ElementRef;
  datas: any[] = [];
  imageData: { [postId: number]: string[] } = {};
  userData: { [userId: number]: { image: string, nickName: string } } = {};
  contentData: { [fPostId: number]: SafeHtml } = {};
  commentDatas: { [postId: number]: IPostComment[] } = {};
  activePostIds: number[] = [];
  commentTexts: { [postId: number]: string } = {};
  page: number = 1;
  pageSize: number = 3;
  loading: boolean = false;
  hasMore: boolean = true;
  loginUserId = 0;
  Likes: { [postId: number]: number } = {};
  LikeCounts: { [postId: number]: number } = {};
  types: { value: number, label: string }[] = [{ value: 0, label: '類別' }];
  filterTypesValue = 0;
  constructor(private socialmediaService: SocialmediaService, private sanitizer: DomSanitizer) { };
  ngOnInit(): void {
    this.loadLoginInfo();
    this.loadArticles();
    this.loadTypes();
  }
  loadLoginInfo() {
    this.socialmediaService.getLoginUserId().subscribe(data => this.loginUserId = data);
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
  loadLike(postId: number) {
    this.socialmediaService.getArticleLike(postId).subscribe(data => {
      if (data != null)
        this.Likes[postId] = data['fLikeId'];
    })
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
          this.loadLike(post['fPostId']);
          this.loadLikeCount(post['fPostId']);
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
    if (this.loginUserId == 0)
      return;
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

  deleteComment(commentId: number, postId: number) {
    this.socialmediaService.deleteComment(commentId).subscribe(response => { this.loadComments(postId) });
  }

  toggleLike(postId: number) {
    if (this.loginUserId == 0)
      return;
    if (postId in this.Likes) {
      this.socialmediaService.deleteArticleLike(this.Likes[postId]).subscribe(response => {
        delete this.Likes[postId];
        this.loadLike(postId);
        this.loadLikeCount(postId);
      })
    } else {
      this.socialmediaService.postArticleLike({
        FPostId: postId
      }).subscribe(response => {
        this.Likes[postId] = response['fLikeId']
        this.loadLikeCount(postId);
      })
    }
  }

  onScroll() {
    this.loadArticles();
  }
}
