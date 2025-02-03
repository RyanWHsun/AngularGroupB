import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAttractionImage } from '../interfaces/IAttractionImage';

@Injectable({
  providedIn: 'root'
})
export class AttractionImageService {
  constructor(private client:HttpClient) { }

  getAttractionImages(){
    return this.client.get<IAttractionImage[]>("https://localhost:7112/api/TAttractionImages");
  }

  getAttractionImageById(id:number){
    return this.client.get<IAttractionImage[]>(`https://localhost:7112/api/TAttractionImages/${id}`);
  }

  postAttractionImages(fAttractionId: number, files: File[]) {
    const formData = new FormData();
    formData.append('fAttractionId', fAttractionId.toString());

    for (const file of files) {
      formData.append('fImages', file); // 多個圖片用 'FImages'
    }

    return this.client.post("https://localhost:7112/api/TAttractionImages", formData);
  }
}
