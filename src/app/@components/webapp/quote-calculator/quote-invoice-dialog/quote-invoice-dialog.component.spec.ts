import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteInvoiceDialogComponent } from './quote-invoice-dialog.component';

describe('QuoteInvoiceDialogComponent', () => {
  let component: QuoteInvoiceDialogComponent;
  let fixture: ComponentFixture<QuoteInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteInvoiceDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
