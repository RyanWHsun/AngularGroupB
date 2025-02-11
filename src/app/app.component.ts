import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularGroupB';
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngAfterViewInit() {
    $('.nav-item.dropdown').each(function () {
      const $dropdown = $(this);
      const $menu = $dropdown.find('.dropdown-menu');

      $dropdown.on('mouseenter', function () {
        $menu.addClass('show');
      });

      $dropdown.on('mouseleave', function () {
        $menu.removeClass('show');
      });
    });
  }
}
