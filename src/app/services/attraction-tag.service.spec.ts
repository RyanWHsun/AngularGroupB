import { TestBed } from '@angular/core/testing';

import { AttractionTagService } from './attraction-tag.service';

describe('AttractionTagService', () => {
  let service: AttractionTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
