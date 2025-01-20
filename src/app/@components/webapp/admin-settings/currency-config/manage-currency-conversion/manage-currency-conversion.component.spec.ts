import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCurrencyConversionComponent } from './manage-currency-conversion.component';

describe('ManageCurrencyConversionComponent', () => {
  let component: ManageCurrencyConversionComponent;
  let fixture: ComponentFixture<ManageCurrencyConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCurrencyConversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCurrencyConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
