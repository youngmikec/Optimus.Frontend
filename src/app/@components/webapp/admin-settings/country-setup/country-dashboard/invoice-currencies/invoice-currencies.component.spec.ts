import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCurrenciesComponent } from './invoice-currencies.component';

describe('InvoiceCurrenciesComponent', () => {
  let component: InvoiceCurrenciesComponent;
  let fixture: ComponentFixture<InvoiceCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCurrenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
