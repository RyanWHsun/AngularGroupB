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
  postArticle(articleData: any): Observable<any> {
    return this.httpClient.post('https://localhost:7112/api/TPosts', articleData, { withCredentials: true })
  }
  getMyImages(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostImages/${postId}`, { withCredentials: true })
  }
  postImages(imgData: any): Observable<any> {
    return this.httpClient.post('https://localhost:7112/api/TPostImages', imgData, { withCredentials: true })
  }

  getPublicArticles(page: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPosts/GetPublicPosts?page=${page}&pageSize=${pageSize}`)
  }
  getPublicImages(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostImages/getPublicImages/${postId}`, { withCredentials: true })
  }

  getUserInfo(userId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPosts/userInfo/${userId}`)
  }
  getArticleComments(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostComments/${postId}`)
  }
}
