import { Component } from '@angular/core';
import { SocialmediaService } from 'src/app/services/socialmedia.service';

@Component({
  selector: 'app-myarticles',
  templateUrl: './myarticles.component.html',
  styleUrls: ['./myarticles.component.css']
})
export class MyarticlesComponent {
  datas = [];
  imageData: { [key: number]: string[] } = {};
  constructor(private socialmediaService: SocialmediaService) { };
  ngOnInit(): void {
    this.get();
  }
  loadImages(postId: number) {
    this.socialmediaService.getMyImages(postId).subscribe(data => {
      this.imageData[postId] = data.map((imageBase64: string) => 'data:image/jpeg;base64,' + imageBase64);
    })
  }
  get() {
    this.socialmediaService.getMyArticles().subscribe(data => {
      // console.log('api', data);
      this.datas = data;
      this.datas.forEach(post => {
        this.loadImages(post['fPostId']);
      });
    })
  }
}
