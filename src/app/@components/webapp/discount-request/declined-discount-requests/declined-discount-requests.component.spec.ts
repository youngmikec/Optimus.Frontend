import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedDiscountRequestsComponent } from './declined-discount-requests.component';

describe('DeclinedDiscountRequestsComponent', () => {
  let component: DeclinedDiscountRequestsComponent;
  let fixture: ComponentFixture<DeclinedDiscountRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclinedDiscountRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedDiscountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
