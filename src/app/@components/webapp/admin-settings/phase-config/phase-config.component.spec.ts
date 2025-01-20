import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseConfigComponent } from './phase-config.component';

describe('PhaseConfigComponent', () => {
  let component: PhaseConfigComponent;
  let fixture: ComponentFixture<PhaseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
