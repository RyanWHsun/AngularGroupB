import { Component, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  datas: any[] = [];
  imageData: { [key: number]: string[] } = {};
  userData: { [key: number]: { image: string, nickName: string } } = {};
  activePostIds: number[] = [];
  page: number = 1;
  pageSize: number = 3;
  loading: boolean = false;
  hasMore: boolean = true;
  constructor(private socialmediaService: SocialmediaService, private userService: UserService) { };
  ngOnInit(): void {
    this.loadArticles();
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
    this.userService.getUser(userId).subscribe(data => {
      this.userData[userId] = {
        image: `data:image/jpeg;base64,${data.fUserImage}`,
        nickName: data.fUserNickName
      }
    })
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
