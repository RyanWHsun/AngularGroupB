import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWeather } from '../interfaces/IWeather';

@Injectable({
  providedIn: 'root',
})
export class OpenWeatherAPIService {
  baseUrl = 'https://localhost:7112/api/OpenWeatherAPI';

  constructor(private client: HttpClient) {}

  // 取得現在天氣
  // https://localhost:7112/api/OpenWeatherAPI/CurrentWeather?lat=25.070843504702268&lon=121.49929878012719
  getCurrentWeather(lat: number, lon: number):Observable<IWeather>{
    return this.client.get<IWeather>(`${this.baseUrl}/CurrentWeather?lat=${lat}&lon=${lon}`);
  }

  // 取得現在天氣的圖示
  //https://localhost:7112/api/OpenWeatherAPI/WeatherIcon?lat=25.070843504702268&lon=121.49929878012719
  getCurrentWeatherIcon(lat: number, lon: number) {
    // TypeScript 預設 HttpClient 會解析 JSON，因此 responseType 須顯式指定為 'text'
    return this.client.get(
      `${this.baseUrl}/WeatherIcon?lat=${lat}&lon=${lon}`,
      { responseType: 'text' }
    );
  }
}
