import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteStepperComponent } from './quote-stepper.component';

describe('QuoteStepperComponent', () => {
  let component: QuoteStepperComponent;
  let fixture: ComponentFixture<QuoteStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
