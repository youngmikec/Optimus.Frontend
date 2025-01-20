import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentsScheduleModalComponent } from './view-payments-schedule-modal.component';

describe('PaymentPlanModalComponent', () => {
  let component: ViewPaymentsScheduleModalComponent;
  let fixture: ComponentFixture<ViewPaymentsScheduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPaymentsScheduleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaymentsScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
