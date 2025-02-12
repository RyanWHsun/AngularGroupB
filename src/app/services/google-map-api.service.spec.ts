import { TestBed } from '@angular/core/testing';

import { GoogleMapAPIService } from './google-map-api.service';

describe('GoogleMapAPIService', () => {
  let service: GoogleMapAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
