import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionTicketComponent } from './attraction-ticket.component';

describe('AttractionTicketComponent', () => {
  let component: AttractionTicketComponent;
  let fixture: ComponentFixture<AttractionTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttractionTicketComponent]
    });
    fixture = TestBed.createComponent(AttractionTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
