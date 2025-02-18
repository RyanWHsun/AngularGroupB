import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCenterComponent } from './seller-center.component';

describe('SellerCenterComponent', () => {
  let component: SellerCenterComponent;
  let fixture: ComponentFixture<SellerCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerCenterComponent]
    });
    fixture = TestBed.createComponent(SellerCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
