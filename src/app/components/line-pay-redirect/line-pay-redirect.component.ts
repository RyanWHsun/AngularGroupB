import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-line-pay-redirect',
  templateUrl: './line-pay-redirect.component.html',
  styleUrls: ['./line-pay-redirect.component.css']
})
export class LinePayRedirectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // 5 秒後自動返回首頁
    setTimeout(() => {
      this.router.navigate(['/']); // 回到首頁
    }, 5000);
  }

  goBackHome() {
    this.router.navigate(['/']); // 讓使用者手動回首頁
  }
}
