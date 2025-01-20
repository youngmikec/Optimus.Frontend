/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetingModalComponent } from './create-meeting-modal.component';

describe('CreateMeetingModalComponent', () => {
  let component: CreateMeetingModalComponent;
  let fixture: ComponentFixture<CreateMeetingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMeetingModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMeetingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
