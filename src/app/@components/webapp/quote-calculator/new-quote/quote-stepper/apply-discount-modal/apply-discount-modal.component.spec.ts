import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyDiscountModalComponent } from './apply-discount-modal.component';

describe('ApplyDiscountModalComponent', () => {
  let component: ApplyDiscountModalComponent;
  let fixture: ComponentFixture<ApplyDiscountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyDiscountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyDiscountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
