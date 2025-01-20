import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanScheduleComponent } from './payment-plan-schedule.component';

describe('PaymentPlanScheduleComponent', () => {
  let component: PaymentPlanScheduleComponent;
  let fixture: ComponentFixture<PaymentPlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPlanScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
