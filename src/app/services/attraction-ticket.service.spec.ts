import { TestBed } from '@angular/core/testing';

import { AttractionTicketService } from './attraction-ticket.service';

describe('AttractionTicketService', () => {
  let service: AttractionTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
