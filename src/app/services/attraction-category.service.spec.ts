import { TestBed } from '@angular/core/testing';

import { AttractionCategoryService } from './attraction-category.service';

describe('AttractionCategoryService', () => {
  let service: AttractionCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
