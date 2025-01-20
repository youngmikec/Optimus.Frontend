import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceReceiptDialogComponent } from './invoice-receipt-dialog.component';

describe('InvoiceReceiptDialogComponent', () => {
  let component: InvoiceReceiptDialogComponent;
  let fixture: ComponentFixture<InvoiceReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceReceiptDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
