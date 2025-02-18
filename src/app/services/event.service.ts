import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  fEventId: number;
  fEventName: string;
  fEventDescription: string;
  fEventStartDate: string;
  fEventEndDate: string;
  fEventImageUrl?: string; // ✅ 新增圖片 URL 屬性 (可選)
}


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://localhost:7112/api/EventManagement'; // ✅ API URL

  constructor(private http: HttpClient) {}

  /** 📌 取得所有活動 */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  /** ✅ 新增活動，支援 `FormData` (有圖片) 或 `Event` (無圖片) */
  createEvent(eventData: FormData | Event): Observable<any> {
    if (eventData instanceof FormData) {
      return this.http.post(`${this.apiUrl}`, eventData);
    } else {
      return this.http.post(`${this.apiUrl}`, eventData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
    }
  }

  /** ✅ 更新活動，支援 `FormData` (有圖片) 或 `Event` (無圖片) */
  updateEvent(eventId: number, eventData: FormData | Event): Observable<any> {
    if (eventData instanceof FormData) {
      return this.http.put(`${this.apiUrl}/${eventId}`, eventData);
    } else {
      return this.http.put(`${this.apiUrl}/${eventId}`, eventData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
    }
  }

  /** ❌ 刪除活動 */
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}`);
  }

  /** 📤 上傳活動圖片 */
  uploadEventImage(eventId: number, file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/UploadEventImage/${eventId}`, formData);
  }
}





