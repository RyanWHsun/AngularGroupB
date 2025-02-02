import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SocialmediaService {
  constructor(private httpClient: HttpClient) { }


  getMyArticles(): Observable<any> {
    return this.httpClient.get('https://localhost:7112/api/TPosts', { withCredentials: true })
  }
  getMyImages(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostImages/${postId}`, { withCredentials: true })
  }

  getPublicArticles(): Observable<any> {
    return this.httpClient.get('https://localhost:7112/api/TPosts/GetPublicPosts', { withCredentials: true })
  }
  getPublicImages(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostImages/getPublicImages/${postId}`, { withCredentials: true })
  }
}
