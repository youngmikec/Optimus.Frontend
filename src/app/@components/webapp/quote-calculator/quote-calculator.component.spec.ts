import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteCalculatorComponent } from './quote-calculator.component';

describe('QuoteCalculatorComponent', () => {
  let component: QuoteCalculatorComponent;
  let fixture: ComponentFixture<QuoteCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
