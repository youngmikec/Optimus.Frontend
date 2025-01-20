import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscountRequestComponent } from './view-discount-request.component';

describe('ViewDiscountRequestComponent', () => {
  let component: ViewDiscountRequestComponent;
  let fixture: ComponentFixture<ViewDiscountRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDiscountRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscountRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
