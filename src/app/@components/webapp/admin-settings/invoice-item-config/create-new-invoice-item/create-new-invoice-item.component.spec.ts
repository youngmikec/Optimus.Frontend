import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewInvoiceItemComponent } from './create-new-invoice-item.component';

describe('CreateNewInvoiceItemComponent', () => {
  let component: CreateNewInvoiceItemComponent;
  let fixture: ComponentFixture<CreateNewInvoiceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewInvoiceItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewInvoiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
