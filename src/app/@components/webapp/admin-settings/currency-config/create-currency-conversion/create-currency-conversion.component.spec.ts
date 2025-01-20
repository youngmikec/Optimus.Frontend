import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurrencyConversionComponent } from './create-currency-conversion.component';

describe('CreateCurrencyConversionComponent', () => {
  let component: CreateCurrencyConversionComponent;
  let fixture: ComponentFixture<CreateCurrencyConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCurrencyConversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCurrencyConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
