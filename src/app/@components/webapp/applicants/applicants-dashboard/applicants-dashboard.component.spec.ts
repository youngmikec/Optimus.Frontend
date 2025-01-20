import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsDashboardComponent } from './applicants-dashboard.component';

describe('ApplicantsDashboardComponent', () => {
  let component: ApplicantsDashboardComponent;
  let fixture: ComponentFixture<ApplicantsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
