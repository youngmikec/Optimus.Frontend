import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDiscountRequestsComponent } from './pending-discount-requests.component';

describe('PendingDiscountRequestsComponent', () => {
  let component: PendingDiscountRequestsComponent;
  let fixture: ComponentFixture<PendingDiscountRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDiscountRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDiscountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
