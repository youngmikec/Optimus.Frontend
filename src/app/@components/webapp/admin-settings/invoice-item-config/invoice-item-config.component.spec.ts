import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemConfigComponent } from './invoice-item-config.component';

describe('InvoiceItemConfigComponent', () => {
  let component: InvoiceItemConfigComponent;
  let fixture: ComponentFixture<InvoiceItemConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceItemConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
