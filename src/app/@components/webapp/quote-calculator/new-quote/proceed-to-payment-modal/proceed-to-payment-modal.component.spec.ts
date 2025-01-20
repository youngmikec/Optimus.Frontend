import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedToPaymentModalComponent } from './proceed-to-payment-modal.component';

describe('ProceedToPaymentModalComponent', () => {
  let component: ProceedToPaymentModalComponent;
  let fixture: ComponentFixture<ProceedToPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceedToPaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedToPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
