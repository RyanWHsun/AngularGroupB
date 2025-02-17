import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminEditComponent } from './user-admin-edit.component';

describe('UserAdminEditComponent', () => {
  let component: UserAdminEditComponent;
  let fixture: ComponentFixture<UserAdminEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAdminEditComponent]
    });
    fixture = TestBed.createComponent(UserAdminEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
