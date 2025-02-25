import { TestBed } from '@angular/core/testing';

import { LinePayService } from './line-pay.service';

describe('LinePayService', () => {
  let service: LinePayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinePayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
