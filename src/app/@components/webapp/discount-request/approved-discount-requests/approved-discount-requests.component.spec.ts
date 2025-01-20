import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedDiscountRequestsComponent } from './approved-discount-requests.component';

describe('ApprovedDiscountRequestsComponent', () => {
  let component: ApprovedDiscountRequestsComponent;
  let fixture: ComponentFixture<ApprovedDiscountRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedDiscountRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedDiscountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
