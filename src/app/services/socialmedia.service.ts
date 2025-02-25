import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IChat } from '../interfaces/IChat';

@Injectable({
  providedIn: 'root'
})
export class SocialmediaService {
  constructor(private httpClient: HttpClient) { }


  getMyArticles(page: number, pageSize: number, TypesValue: number, afterDate: string, keyword: string): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPosts?page=${page}&pageSize=${pageSize}&categoryId=${TypesValue}&afterDate=${afterDate}&keyword=${keyword}`, { withCredentials: true })
  }
  postArticle(articleData: any): Observable<any> {
    return this.httpClient.post('https://localhost:7112/api/TPosts', articleData, { withCredentials: true })
  }
  putArticle(articleData: any): Observable<any> {
    return this.httpClient.put('https://localhost:7112/api/TPosts', articleData, { withCredentials: true })
  }
  deleteArticle(postId: number): Observable<any> {
    return this.httpClient.delete(`https://localhost:7112/api/TPosts/${postId}`, { withCredentials: true })
  }

  getMyImages(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostImages/${postId}`, { withCredentials: true })
  }
  postImages(imgData: any): Observable<any> {
    return this.httpClient.post('https://localhost:7112/api/TPostImages', imgData, { withCredentials: true })
  }
  deleteAllImages(postId: number): Observable<any> {
    return this.httpClient.delete(`https://localhost:7112/api/TPostImages/${postId}`, { withCredentials: true })
  }

  getPublicArticles(page: number, pageSize: number, popular: boolean, TypesValue: number, keyword: string): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPosts/GetPublicPosts?page=${page}&pageSize=${pageSize}&popular=${popular}&categoryId=${TypesValue}&keyword=${keyword}`)
  }
  getPublicImages(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostImages/getPublicImages/${postId}`, { withCredentials: true })
  }

  getUserInfo(userId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPosts/userInfo/${userId}`)
  }
  getLoginUserId(): Observable<any> {
    return this.httpClient.get('https://localhost:7112/api/TPosts/loginUserId', { withCredentials: true })
  }
  getArticleComments(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostComments/${postId}`)
  }
  postArticleComment(commentData: any): Observable<any> {
    return this.httpClient.post('https://localhost:7112/api/TPostComments', commentData, { withCredentials: true })
  }
  deleteComment(commentId: number): Observable<any> {
    return this.httpClient.delete(`https://localhost:7112/api/TPostComments/${commentId}`, { withCredentials: true })
  }
  getArticleLike(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostLikes/${postId}`, { withCredentials: true })
  }
  postArticleLike(likeData: any): Observable<any> {
    return this.httpClient.post('https://localhost:7112/api/TPostLikes', likeData, { withCredentials: true })
  }
  deleteArticleLike(likeId: number): Observable<any> {
    return this.httpClient.delete(`https://localhost:7112/api/TPostLikes/${likeId}`, { withCredentials: true })
  }
  getArticleLikeCount(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostLikes/GetTPostLikeCount/${postId}`)
  }
  getArticleCommentCount(postId: number): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostComments/GetTPostCommentCount/${postId}`)
  }
  getTypes(): Observable<any> {
    return this.httpClient.get(`https://localhost:7112/api/TPostCategories`)
  }

  getContactId(): Observable<any> {
    return this.httpClient.get('https://localhost:7112/api/TChats/Contact', { withCredentials: true })
  }
  getChatbyID(contactId: number): Observable<IChat[]> {
    return this.httpClient.get<IChat[]>(`https://localhost:7112/api/TChats/${contactId}`, { withCredentials: true })
  }
}
