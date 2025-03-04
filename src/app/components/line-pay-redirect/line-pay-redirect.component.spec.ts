import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinePayRedirectComponent } from './line-pay-redirect.component';

describe('LinePayRedirectComponent', () => {
  let component: LinePayRedirectComponent;
  let fixture: ComponentFixture<LinePayRedirectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinePayRedirectComponent]
    });
    fixture = TestBed.createComponent(LinePayRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
