import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRouteFeesComponent } from './create-route-fees.component';

describe('CreateRouteFeesComponent', () => {
  let component: CreateRouteFeesComponent;
  let fixture: ComponentFixture<CreateRouteFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRouteFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRouteFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
