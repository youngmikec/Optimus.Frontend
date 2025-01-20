import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsInfoComponent } from './applicants-info.component';

describe('ApplicantsInfoComponent', () => {
  let component: ApplicantsInfoComponent;
  let fixture: ComponentFixture<ApplicantsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
