import { SweetAlert2Service } from './../../services/sweet-alert2.service';
import { Component, Input } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { IItineraryItem } from 'src/app/interfaces/IItineraryItem';
import { IPhoto } from 'src/app/interfaces/IPhoto';
import { GoogleMapAPIService } from 'src/app/services/google-map-api.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css'],
})
export class ItineraryComponent {
  @Input() cItineraryData: IItineraryItem[] = [];
  places: string[] = [];
  map: any;

  // add new
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  // add new

  constructor(
    private gMapService: GoogleMapAPIService,
    private sweetAlert2Service: SweetAlert2Service
  ) {}

  async ngOnChanges(): Promise<void> {
    this.places = [];
    //console.log('after click, c:', this.cItineraryData);
    if (!this.cItineraryData || this.cItineraryData.length <= 0) return;

    this.places = this.cItineraryData.map((data) => data.location);

    // 1. 建立所有 getPlacePhoto 的請求，所有 getPlacePhoto() 請求是並行執行，加快速度
    const getPhotoRequest: Observable<IPhoto>[] = this.cItineraryData.map(
      (item) => this.gMapService.getPlacePhoto(item.location)
    );

    // 2. 使用 forkJoin 來等待所有請求完成
    forkJoin(getPhotoRequest).subscribe({
      next: async (photoUrl) => {
        // 3. 當所有請求完成時，更新 cItineraryData 的 imgSrc
        this.cItineraryData.forEach((item, index) => {
          item.imgSrc = photoUrl[index].photoUrl;
        });

        // 4. 在所有請求完成後才執行 console.log
        //console.log('所有照片取得後的 cItineraryData:', this.cItineraryData);

        this.initMap(); // 初始化地圖
        await this.loadLocations(); // 取得地點並標記
      },
      error: (error) => {
        console.log('取得 itinerary 的照片失敗: ', error);
      },
    });
  }

  // 計算兩點路徑 & 顯示路線
  calculateAndDisplayRoute(
    start: string,
    end: string,
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    directionsService
      .route({
        origin: {
          query: start,
        },
        destination: {
          query: end,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => {
        this.sweetAlert2Service.showEasyWarning('尚未有路線可供行駛');
      });
  }

  // 傳遞兩點資料
  passTwoPointData(i: number) {
    console.log('passTwoPointData i= ', i);
    if (i === this.cItineraryData.length - 1) {
      console.log('超過界線');
      return;
    }
    this.calculateAndDisplayRoute(
      this.cItineraryData[i].location,
      this.cItineraryData[i + 1].location,
      this.directionsService,
      this.directionsRenderer
    );
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map')!, {
      zoom: 12,
      center: { lat: 25.033964, lng: 121.564472 }, // 預設台北中心點
    });

    this.directionsRenderer.setMap(this.map);
  }

  async loadLocations() {
    const markerLib = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;
    if (!markerLib || !markerLib.Marker) {
      console.error('無法載入 Google Maps Marker');
      return;
    }
    const { Marker } = markerLib;

    this.gMapService.getLocations(this.places).subscribe((locations: any) => {
      if (!locations || locations.length === 0) {
        console.error('無法獲取地點資訊');
        return;
      }

      const bounds = new google.maps.LatLngBounds();

      locations.forEach((location: any) => {
        const marker = new Marker({
          position: { lat: location.lat, lng: location.lng },
          map: this.map,
          title: location.name,
        });
        const markerPosition = marker.getPosition();
        if (markerPosition) {
          bounds.extend(markerPosition);
        }
      });

      this.map.fitBounds(bounds); // 自動調整地圖視野
    });
  }
}
