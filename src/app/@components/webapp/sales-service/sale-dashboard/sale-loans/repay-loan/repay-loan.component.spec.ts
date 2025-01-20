import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepayLoanComponent } from './repay-loan.component';

describe('RepayLoanComponent', () => {
  let component: RepayLoanComponent;
  let fixture: ComponentFixture<RepayLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepayLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepayLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
