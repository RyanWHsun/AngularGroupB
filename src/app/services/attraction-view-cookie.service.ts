import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { IAttractionViewCount } from '../interfaces/IAttractionViewCount';

@Injectable({
  providedIn: 'root',
})
export class AttractionViewCookieService {
  baseUrl = 'https://localhost:7112/api/TAttractionViewCounts';
  constructor(
    private client: HttpClient,
    private cookieService: CookieService
  ) {}

  // id is attraction id
  increaseViewCount(id: number): Observable<any> {
    const viewedKey = `viewed_attraction_${id}`;

    // 檢查 Cookie 是否已經記錄此圖片
    if (!this.cookieService.check(viewedKey)) {
      const expireDate = new Date(); // 取得本地時間(UTC+8)

      // 存入 JSON 格式的資料
      const cookieValue = JSON.stringify({
        viewed: true,
        viewTime: expireDate.toLocaleString(), // 存入本地時間
      });

      expireDate.setMinutes(expireDate.getMinutes() + 5); // 設定 5 分鐘後過期
      //expireDate.setDate(expireDate.getDate() + 1); // 設定 1 天後過期

      this.cookieService.set(viewedKey, cookieValue, {
        expires: expireDate,
        path: '/',
      });
      // expires:1 → 設定 Cookie 1 天後過期
      // path: '/' → 設定 Cookie 的可用範圍，/ 表示 整個網站皆可存取
      // this.cookieService.set(viewedKey, 'true', { expires: 1, path: '/' });

      return this.client.post(`${this.baseUrl}/IncreaseViewCount`, { id });
    }
    // 如果已經記錄過，回傳一個空的 Observable
    console.log('已經看過此圖片');
    return of(null);
  }

  getAllViewCount():Observable<any>{
    return this.client.get<IAttractionViewCount[]>(`${this.baseUrl}/GetAllViewCount`);
  }
}
