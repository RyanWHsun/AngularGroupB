import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttractionComment } from '../interfaces/IAttractionComment';

@Injectable({
  providedIn: 'root'
})
export class AttractionCommentService {
  baseUrl='https://localhost:7112/api/TAttractionComments';

  constructor(private client:HttpClient) { }

  getAttractionCommentById(id:number){
    return this.client.get<IAttractionComment[]>(`${this.baseUrl}/${id}`);
  }
}
