import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingInvoiceComponent } from './outstanding-invoice.component';

describe('OutstandingInvoiceComponent', () => {
  let component: OutstandingInvoiceComponent;
  let fixture: ComponentFixture<OutstandingInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutstandingInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
