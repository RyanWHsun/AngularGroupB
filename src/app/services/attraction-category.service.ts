import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttractionCategory } from '../interfaces/IAttractionCategory';

@Injectable({
  providedIn: 'root'
})
export class AttractionCategoryService {
  constructor(private client:HttpClient) { }
  getAttractionCategories(){
    return this.client.get<IAttractionCategory[]>("https://localhost:7112/api/TAttractionCategories");
  }

  getAttractionCategoryById(id:number){
    return this.client.get<IAttractionCategory>(`https://localhost:7112/api/TAttractionCategories/${id}`);
  }
}
