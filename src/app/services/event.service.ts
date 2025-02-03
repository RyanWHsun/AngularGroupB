import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  fEventId: number;
  fEventName: string;
  fEventDescription: string;
  fEventStartDate: string;
  fEventEndDate: string;
  fEventCreatedDate: string;
  fEventUpdatedDate: string;
  fEventUrl: string;
  fEventIsActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:7112/api/Event';  // 你的後端 API 端點

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
}
