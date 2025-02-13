import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getApiKey(): Observable<any> {
    return this.client.get<any>(`${this.baseUrl}/load-map`);
  }
}
