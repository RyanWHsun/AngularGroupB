import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SocialmediaService {
  private apiUrl = 'https://localhost:7112/api/TPosts';
  constructor(private httpClient: HttpClient) { }


  getMyArticles(): Observable<any> {
    return this.httpClient.get(this.apiUrl, { withCredentials: true })
  }
}
