import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttractionTicketShoppingCart } from '../interfaces/IAttractionTicketShoppingCart';

@Injectable({
  providedIn: 'root',
})
export class AttractionTicketShoppingCartService {
  baseUrl = 'https://localhost:7112/api/TAttractionTicketShoppingCart';
  constructor(private client: HttpClient) {}

  // withCredentials: true 允許跨域請求攜帶 Cookies 或 HTTP 認證資訊。
  // 如果後端使用 JWT Token + HttpOnly Cookie，這個選項是 必要的，否則請求不會附帶 jwt_token（存於 HttpOnly Cookie 中）。
  //
  // 應用場景：
  // 1. 前端和後端不同網域（CORS，跨域請求）。
  // 2. 後端驗證使用者身份（例如 Session 或 JWT 存在 HttpOnly Cookie）。
  postAttractionTicketToShoppingCart(ticket: IAttractionTicketShoppingCart) {
    console.log("ticket ", ticket);
    return this.client.post<void>(`${this.baseUrl}`, ticket, {
      withCredentials: true,
    });
  }
}
