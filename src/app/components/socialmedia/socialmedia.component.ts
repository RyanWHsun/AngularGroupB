import { Component, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocialmediaService } from 'src/app/services/socialmedia.service';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent {
  constructor(private socialmediaService: SocialmediaService, private authService: AuthService) { };
  get() {
    this.socialmediaService.getMyArticles().subscribe(data => {
      console.log('api', data);
    })
  }
}
