import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Event {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  apiUrl = 'https://localhost:7112/api/Event';
  events: Event[] = [];
  newEvent: Event = { id: 0, name: '', location: '', startDate: '', endDate: '', description: '' };
  editingEvent: Event | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.http.get<Event[]>(this.apiUrl).subscribe(
      data => this.events = data,
      error => console.error('🚨 無法獲取活動列表:', error)
    );
  }

  addEvent() {
    this.http.post<Event>(this.apiUrl, this.newEvent).subscribe(
      data => {
        this.events.push(data);
        this.newEvent = { id: 0, name: '', location: '', startDate: '', endDate: '', description: '' };
      },
      error => console.error('🚨 新增活動失敗:', error)
    );
  }

  editEvent(event: Event) {
    this.editingEvent = { ...event };
  }

  updateEvent() {
    if (this.editingEvent && this.editingEvent.id !== undefined) {
      this.http.put(`${this.apiUrl}/${this.editingEvent.id}`, this.editingEvent).subscribe(
        () => {
          const index = this.events.findIndex(e => e.id !== undefined && e.id === this.editingEvent!.id);
          if (index !== -1) {
            this.events[index] = {
              id: this.editingEvent?.id!,
              name: this.editingEvent?.name || '',
              location: this.editingEvent?.location || '',
              startDate: this.editingEvent?.startDate || '',
              endDate: this.editingEvent?.endDate || '',
              description: this.editingEvent?.description || ''
            };
          }
          this.editingEvent = null;
        },
        error => console.error('🚨 更新活動失敗:', error)
      );
    }
  }

  deleteEvent(eventId: number) {
    this.http.delete(`${this.apiUrl}/${eventId}`).subscribe(
      () => this.events = this.events.filter(e => e.id !== eventId),
      error => console.error('🚨 刪除活動失敗:', error)
    );
  }
}
