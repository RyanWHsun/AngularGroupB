import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPhoto } from '../interfaces/IPhoto';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapAPIService {
  baseUrl = 'https://localhost:7112/api/maps';

  constructor(private client: HttpClient) {}

  getGeocodeAddress(address: string): Observable<any> {
    return this.client.get<any>(`${this.baseUrl}/geocode`, {
      params: { address },
    });
  }

  getMapData(): Observable<any> {
    return this.client.get(`${this.baseUrl}/getMapData`, { responseType: 'text' });
  }

  // https://localhost:7112/api/maps/getPlacePhoto?query=%E6%B8%85%E5%A2%83%E8%BE%B2%E5%A0%B4
  getPlacePhoto(query:string):Observable<IPhoto>{
    return this.client.get<IPhoto>(`${this.baseUrl}/getPlacePhoto?query=${query}`);
  }

  // https://localhost:7112/api/maps/locations/geocode
  getLocations(places:string[]):Observable<any>{
    if (!places || places.length === 0) {
      return new Observable(observer => {
        observer.error("景點清單為空");
      });
    }
    return this.client.post(`${this.baseUrl}/locations/geocode`,places);
  }
}
