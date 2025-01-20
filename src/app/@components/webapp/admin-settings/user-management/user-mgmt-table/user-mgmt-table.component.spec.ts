import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgmtTableComponent } from './user-mgmt-table.component';

describe('UserMgmtTableComponent', () => {
  let component: UserMgmtTableComponent;
  let fixture: ComponentFixture<UserMgmtTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMgmtTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMgmtTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
