import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentPlanComponent } from './create-payment-plan.component';

describe('CreatePaymentPlanComponent', () => {
  let component: CreatePaymentPlanComponent;
  let fixture: ComponentFixture<CreatePaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
