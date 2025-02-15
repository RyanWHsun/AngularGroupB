import { TestBed } from '@angular/core/testing';

import { AttractionViewCookieService } from './attraction-view-cookie.service';

describe('AttractionViewCookieService', () => {
  let service: AttractionViewCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionViewCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
