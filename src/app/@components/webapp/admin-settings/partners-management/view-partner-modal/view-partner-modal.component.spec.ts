import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPartnerModalComponent } from './view-partner-modal.component';

describe('ViewPartnerModalComponent', () => {
  let component: ViewPartnerModalComponent;
  let fixture: ComponentFixture<ViewPartnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPartnerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
