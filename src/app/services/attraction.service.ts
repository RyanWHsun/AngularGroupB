import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttraction } from '../interfaces/IAttraction';
import { IAttractionCategory } from '../interfaces/IAttractionCategory';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {
  constructor(private client:HttpClient) { }

  getAttractions(){
    return this.client.get<IAttraction[]>("https://localhost:7112/api/TAttractions")
  }

  getAttractionById(id:number){
    return this.client.get<IAttraction>(`https://localhost:7112/api/TAttractions/${id}`);
  }

  putAttractionById(id:number, attraction:IAttraction){
    // return 是為了返回一個 Observable 物件，讓調用這個方法的地方可以對請求進行 subscribe，進而獲取服務器的響應結果或處理錯誤。
    return this.client.put<void>(`https://localhost:7112/api/TAttractions/${id}`, attraction);
  }

  deleteAttractionById(id:number){
    return this.client.delete<void>(`https://localhost:7112/api/TAttractions/${id}`);
  }
}
