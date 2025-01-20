import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendToApplicantModalComponent } from './send-to-applicant-modal.component';

describe('SendToApplicantModalComponent', () => {
  let component: SendToApplicantModalComponent;
  let fixture: ComponentFixture<SendToApplicantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendToApplicantModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToApplicantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
