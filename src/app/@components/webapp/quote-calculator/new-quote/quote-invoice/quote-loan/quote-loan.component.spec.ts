import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLoanComponent } from './quote-loan.component';

describe('QuoteLoanComponent', () => {
  let component: QuoteLoanComponent;
  let fixture: ComponentFixture<QuoteLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
