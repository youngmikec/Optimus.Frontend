import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteInvoiceComponent } from './quote-invoice.component';

describe('QuoteInvoiceComponent', () => {
  let component: QuoteInvoiceComponent;
  let fixture: ComponentFixture<QuoteInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
