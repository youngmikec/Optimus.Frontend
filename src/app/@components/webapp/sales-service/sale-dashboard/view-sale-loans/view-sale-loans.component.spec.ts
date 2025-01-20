import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSaleLoansComponent } from './view-sale-loans.component';

describe('ViewSaleLoansComponent', () => {
  let component: ViewSaleLoansComponent;
  let fixture: ComponentFixture<ViewSaleLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSaleLoansComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSaleLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
