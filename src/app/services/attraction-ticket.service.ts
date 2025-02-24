import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAttractionTicket } from '../interfaces/IAttractionTicket';
import { IAttractionTicketShoppingCart } from '../interfaces/IAttractionTicketShoppingCart';

@Injectable({
  providedIn: 'root',
})
export class AttractionTicketService {
  baseUrl = 'https://localhost:7112/api/TAttractionTickets';
  constructor(private client: HttpClient) {}

  getAllAttractionTickets() {
    return this.client.get<IAttractionTicket[]>(this.baseUrl);
  }

  // id is the attraction id
  getAttractionTicketsById(id: number) {
    return this.client.get<IAttractionTicket[]>(`${this.baseUrl}/${id}`);
  }

  // 如果 isDistinct 是 true，代表取所有資料的時候，如果 fAttractionId 相同，只會拿第一筆
  // 根據分頁號碼(第1、2...頁)取資料，每次取9筆資料
  getPartialAttractionTickets(index: number, isDistinct: boolean) {
    return this.client.get<IAttractionTicket[]>(
      `${this.baseUrl}/Search?isDistinct=${isDistinct}&pageSize=9&pageIndex=${index}`
    );
  }

  // 將取得的票券資料根據 fCreatedDate 排序
  getTicketOrderByDate(index: number, isDistinct: boolean, orderBy:string){
    return this.client.get<IAttractionTicket[]>(
      `${this.baseUrl}/Search?isDistinct=${isDistinct}&pageSize=9&pageIndex=${index}&orderBy=${orderBy}`
    );
  }

  getAttractionTicketTypes(attractionId: number) {
    return this.client.get<string[]>(`${this.baseUrl}/${attractionId}/types`);
  }

  getTicketQuantities(){
    return this.client.get<number>(`${this.baseUrl}/Count`);
  }
}
