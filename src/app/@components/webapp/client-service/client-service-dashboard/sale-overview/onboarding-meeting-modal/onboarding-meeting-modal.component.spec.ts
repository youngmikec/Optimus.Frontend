import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingMeetingModalComponent } from './onboarding-meeting-modal.component';

describe('OnboardingMeetingModalComponent', () => {
  let component: OnboardingMeetingModalComponent;
  let fixture: ComponentFixture<OnboardingMeetingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingMeetingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingMeetingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
