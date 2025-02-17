import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttractionTag } from '../interfaces/IAttractionTag';

@Injectable({
  providedIn: 'root'
})
export class AttractionTagService {
  baseUrl="https://localhost:7112/api/TAttractionJoinAttractionTags";

  constructor(private client:HttpClient) { }

  // id is attraction id
  getAttractionTagsById(id:number){
    return this.client.get<IAttractionTag[]>(`${this.baseUrl}/${id}`)
  }
}
