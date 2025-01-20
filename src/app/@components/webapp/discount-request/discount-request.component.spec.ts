import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountRequestComponent } from './discount-request.component';

describe('DiscountRequestComponent', () => {
  let component: DiscountRequestComponent;
  let fixture: ComponentFixture<DiscountRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
