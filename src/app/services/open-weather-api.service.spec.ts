import { TestBed } from '@angular/core/testing';

import { OpenWeatherAPIService } from './open-weather-api.service';

describe('OpenWeatherAPIService', () => {
  let service: OpenWeatherAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenWeatherAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
