import { Component, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocialmediaService } from 'src/app/services/socialmedia.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  imageBase64List = [];
  constructor(private socialmediaService: SocialmediaService) { };
  ngOnInit(): void {
    this.loadImages(2014);
  }
  loadImages(postId: number) {
    this.socialmediaService.getImages(postId).subscribe(data => {
      this.imageBase64List = data.map((imageBase64: string) => 'data:image/jpeg;base64,' + imageBase64)
    })
  }
  get() {
    this.socialmediaService.getMyArticles().subscribe(data => {
      console.log('api', data);
    })
  }
}
