import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.css']
})
export class ImageBrowserComponent {
  currentIndex = 0;
  @Input() imagePreviews: string[] = [];
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
}
