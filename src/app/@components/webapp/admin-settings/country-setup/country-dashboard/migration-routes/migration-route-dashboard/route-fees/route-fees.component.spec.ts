import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteFeesComponent } from './route-fees.component';

describe('RouteFeesComponent', () => {
  let component: RouteFeesComponent;
  let fixture: ComponentFixture<RouteFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
