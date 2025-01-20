import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplicationsComponent } from './create-applications.component';

describe('CreateApplicationsComponent', () => {
  let component: CreateApplicationsComponent;
  let fixture: ComponentFixture<CreateApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateApplicationsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
