import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttraction } from '../interfaces/IAttraction';
import { IAttractionCategory } from '../interfaces/IAttractionCategory';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {
  baseUrl = 'https://localhost:7112/api/TAttractions';

  constructor(private client:HttpClient) { }

  getAllAttractions(){
    return this.client.get<IAttraction[]>(this.baseUrl);
  }

  getAttractionById(id:number){
    return this.client.get<IAttraction>(`${this.baseUrl}/${id}`);
  }

  // 取得部分景點資料(9筆)
  getPartialAttractions(word:string, size:number, index:number){
    return this.client.get<IAttraction[]>(`${this.baseUrl}/Search?keyword=${word}&pageSize=${size}&pageIndex=${index}`)
  }

  getAttractionQuantities(){
    return this.client.get<number>(`${this.baseUrl}/Count`);
  }

  putAttractionById(id:number, attraction:IAttraction){
    // return 是為了返回一個 Observable 物件，讓調用這個方法的地方可以對請求進行 subscribe，進而獲取服務器的響應結果或處理錯誤。
    return this.client.put<void>(`${this.baseUrl}/${id}`, attraction);
  }

  deleteAttractionById(id:number){
    return this.client.delete<void>(`${this.baseUrl}/${id}`);
  }
}
