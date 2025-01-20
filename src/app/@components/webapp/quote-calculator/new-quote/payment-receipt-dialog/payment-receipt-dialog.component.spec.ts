import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReceiptDialogComponent } from './payment-receipt-dialog.component';

describe('PaymentReceiptDialogComponent', () => {
  let component: PaymentReceiptDialogComponent;
  let fixture: ComponentFixture<PaymentReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentReceiptDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
