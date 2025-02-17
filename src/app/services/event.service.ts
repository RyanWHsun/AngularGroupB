import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  fEventId: number;
  fEventName: string;
  fEventDescription: string;
  fEventStartDate: string;
  fEventEndDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://localhost:7112/api/EventManagement';  // ✅ 這裡使用後台的 API

  constructor(private http: HttpClient) {}

  /** 📌 取得所有活動 */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  /** ✅ 新增活動 (傳送 JSON，而非 FormData) */
  createEvent(eventData: any): Observable<any> {
    const formData = new FormData();
    formData.append('Name', eventData.fEventName);
    formData.append('Description', eventData.fEventDescription);
    formData.append('StartDate', eventData.fEventStartDate);
    formData.append('EndDate', eventData.fEventEndDate);

    if (eventData.imageFile) {
      formData.append('Image', eventData.imageFile);
    }

    return this.http.post(`${this.apiUrl}`, formData);
  }

  /** ✅ 更新活動 (傳送 JSON) */
  updateEvent(eventId: number, eventData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}`, eventData);
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


