import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesFullscreenComponent } from './activities-fullscreen.component';

describe('ActivitiesFullscreenComponent', () => {
  let component: ActivitiesFullscreenComponent;
  let fixture: ComponentFixture<ActivitiesFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesFullscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
