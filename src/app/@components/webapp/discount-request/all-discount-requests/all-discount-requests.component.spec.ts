import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDiscountRequestsComponent } from './all-discount-requests.component';

describe('AllDiscountRequestsComponent', () => {
  let component: AllDiscountRequestsComponent;
  let fixture: ComponentFixture<AllDiscountRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDiscountRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDiscountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
