import { TestBed } from '@angular/core/testing';

import { AttractionTicketShoppingCartService } from './attraction-ticket-shopping-cart.service';

describe('AttractionTicketShoppingCartService', () => {
  let service: AttractionTicketShoppingCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionTicketShoppingCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
