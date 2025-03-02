import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { environment } from 'src/environments/environment';
import { OpenWeatherAPIService } from './open-weather-api.service';
import { IWeather } from '../interfaces/IWeather';

// 定義回傳的資料型別
interface InlineDataPart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  constructor(
    private http: HttpClient,
    private openWeatherService: OpenWeatherAPIService
  ) {}

  async recommend(attraction: string, weather: IWeather | null) {
    const genAI = new GoogleGenerativeAI(environment.googleAIKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `請幫我規劃${attraction}的單日旅遊行程，並輸出為 JSON 格式，範例如下：
      [
        {
          "startTime":"",
          "endTime":"",
          "location":"",
          "latitude":"",
          "longitude":"",
          "type":"",
          "schedule":""
        }
      ]

      規則：
      - startTime 和 endTime 只接受時間，24小時制
      - location不能有標點符號和樓層資訊
      - location只能有一個景點
      - location不能重複
      - type 根據 schedule 來分類，分類只有「自然景觀」、「歷史古蹟」、「博物館」、「主題樂園」、「海灘」、「購物區」、「美食區」、「動物園」、「植物園」、「宗教聖地」
      - 一個location的type不能重複
      - latitude和longitude不用給值
      - 不需要提供返回住宿地點的資訊
      - 根據當地天氣資訊來決定旅遊行程，以下是當地天氣資訊
      - 天氣: ${weather?.weather[0].main}
      - 氣溫: 攝氏 ${Math.trunc(weather?.main.temp! - 273.15)} 度
      - 氣壓: ${weather?.main.grnd_level} hPa
      - 濕度: ${weather?.main.humidity} %
      - 能見度: ${weather?.visibility} 公尺
      - 風速: ${weather?.wind.speed} 公尺/秒`;
    console.log('ai service prompt: ', prompt);
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  }
}
