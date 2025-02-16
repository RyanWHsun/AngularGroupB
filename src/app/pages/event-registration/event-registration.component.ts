import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {
  eventId!: number;
  isAuthenticated = false;
  registrations: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    // this.isAuthenticated = this.authService.isLoggedIn();
    this.isAuthenticated = true;
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.http.get<any[]>(`https://localhost:7112/api/EventRegistration/${this.eventId}`)
      .subscribe(data => {
        this.registrations = data;
      });
  }

  register(): void {
    if (!this.isAuthenticated) {
      alert('請先登入再報名');
      return;
    }

    this.http.post(`https://localhost:7112/api/EventRegistration`, { FEventId: this.eventId })
      .subscribe(() => {
        alert('報名成功');
        this.loadRegistrations();
      }, error => {
        alert(error.error.message || '報名失敗');
      });
  }

  cancelRegistration(registrationId: number): void {
    this.http.delete(`https://localhost:7112/api/EventRegistration/${registrationId}`)
      .subscribe(() => {
        alert('取消報名成功');
        this.loadRegistrations();
      });
  }
}
