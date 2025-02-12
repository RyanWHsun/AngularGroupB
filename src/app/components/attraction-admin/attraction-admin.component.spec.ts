import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionAdminComponent } from './attraction-admin.component';

describe('AttractionAdminComponent', () => {
  let component: AttractionAdminComponent;
  let fixture: ComponentFixture<AttractionAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttractionAdminComponent]
    });
    fixture = TestBed.createComponent(AttractionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
