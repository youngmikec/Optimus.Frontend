import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleLoansComponent } from './sale-loans.component';

describe('SaleLoansComponent', () => {
  let component: SaleLoansComponent;
  let fixture: ComponentFixture<SaleLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleLoansComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
