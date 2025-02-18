import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttractionComment } from '../interfaces/IAttractionComment';
import { userMaterial } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AttractionCommentService {
  baseUrl = 'https://localhost:7112/api/TAttractionComments';

  constructor(private client: HttpClient) {}

  // id is attraction id
  getAttractionCommentById(id: number) {
    return this.client.get<IAttractionComment[]>(`${this.baseUrl}/${id}`);
  }

  getAttractionCommentByCondition(
    id: number,
    count: number = 5,
    isDescending: boolean = true,
    isCollapsed: boolean = true
  ) {
    // 在 JavaScript 和 TypeScript 中，如果物件的屬性名稱與變數名稱相同，可以省略重複的 key: value 指定方式，這叫做 屬性縮寫 (Property shorthand)。
    const params = {
      id,
      count,
      isDescending,
      isCollapsed,
    };
    // https://localhost:7112/api/TAttractionComments/comments?id=1&count=2&isDescending=false&isCollapsed=true
    return this.client.get<IAttractionComment[]>(`${this.baseUrl}/comments`, {
      params,
    });
  }

  // editting
  getCommenterInfo(){
    return this.client.get<userMaterial>(`${this.baseUrl}/commenter`,{
      withCredentials: true,
    })
  }

  // https://localhost:7112/api/TAttractionComments
  postAttractionComment(comment: IAttractionComment) {
    return this.client.post<IAttractionComment>(`${this.baseUrl}`, comment, {
      headers: { 'Content-Type': 'application/json' }, // ✅ 確保是 JSON 格式
      withCredentials: true,
    });
  }
}
