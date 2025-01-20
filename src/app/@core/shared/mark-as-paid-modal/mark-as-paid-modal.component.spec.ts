import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAsPaidModalComponent } from './mark-as-paid-modal.component';

describe('MarkAsPaidModalComponent', () => {
  let component: MarkAsPaidModalComponent;
  let fixture: ComponentFixture<MarkAsPaidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkAsPaidModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsPaidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
