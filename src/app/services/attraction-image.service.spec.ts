import { TestBed } from '@angular/core/testing';

import { AttractionImageService } from './attraction-image.service';

describe('AttractionImageService', () => {
  let service: AttractionImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
