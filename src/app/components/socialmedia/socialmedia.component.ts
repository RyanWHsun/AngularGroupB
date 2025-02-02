import { Component, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocialmediaService } from 'src/app/services/socialmedia.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  datas = [];
  imageData: { [key: number]: string[] } = {};
  constructor(private socialmediaService: SocialmediaService) { };
  ngOnInit(): void {
    this.get();
  }
  loadImages(postId: number) {
    this.socialmediaService.getPublicImages(postId).subscribe(data => {
      this.imageData[postId] = data.map((imageBase64: string) => 'data:image/jpeg;base64,' + imageBase64);
    })
  }
  get() {
    this.socialmediaService.getPublicArticles().subscribe(data => {
      console.log('api', data);
      this.datas = data;
      this.datas.forEach(post => {
        this.loadImages(post['fPostId']);
      });
    })
  }
}
