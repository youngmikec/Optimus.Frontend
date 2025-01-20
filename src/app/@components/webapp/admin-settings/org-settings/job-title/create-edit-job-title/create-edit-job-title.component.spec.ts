import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditJobTitleComponent } from './create-edit-job-title.component';

describe('CreateEditJobTitleComponent', () => {
  let component: CreateEditJobTitleComponent;
  let fixture: ComponentFixture<CreateEditJobTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditJobTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
