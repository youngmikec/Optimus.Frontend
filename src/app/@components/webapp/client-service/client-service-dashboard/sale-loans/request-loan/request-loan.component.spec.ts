import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLoanComponent } from './request-loan.component';

describe('RequestLoanComponent', () => {
  let component: RequestLoanComponent;
  let fixture: ComponentFixture<RequestLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
