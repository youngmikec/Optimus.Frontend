import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShedulePaymentPlanDialogComponent } from './shedule-payment-plan-dialog.component';

describe('ShedulePaymentPlanDialogComponent', () => {
  let component: ShedulePaymentPlanDialogComponent;
  let fixture: ComponentFixture<ShedulePaymentPlanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShedulePaymentPlanDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShedulePaymentPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
