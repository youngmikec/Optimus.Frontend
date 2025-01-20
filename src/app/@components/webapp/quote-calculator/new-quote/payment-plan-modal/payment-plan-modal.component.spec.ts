import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanModalComponent } from './payment-plan-modal.component';

describe('PaymentPlanModalComponent', () => {
  let component: PaymentPlanModalComponent;
  let fixture: ComponentFixture<PaymentPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPlanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
