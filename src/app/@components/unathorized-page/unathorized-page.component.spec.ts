import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnathorizedPageComponent } from './unathorized-page.component';

describe('UnathorizedPageComponent', () => {
  let component: UnathorizedPageComponent;
  let fixture: ComponentFixture<UnathorizedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnathorizedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnathorizedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
