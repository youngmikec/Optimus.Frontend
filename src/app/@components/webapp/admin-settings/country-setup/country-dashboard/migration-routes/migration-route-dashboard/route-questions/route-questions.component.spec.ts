import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteQuestionsComponent } from './route-questions.component';

describe('RouteQuestionsComponent', () => {
  let component: RouteQuestionsComponent;
  let fixture: ComponentFixture<RouteQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
