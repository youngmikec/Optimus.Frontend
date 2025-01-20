import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhaseConfigComponent } from './edit-phase-config.component';

describe('EditPhaseConfigComponent', () => {
  let component: EditPhaseConfigComponent;
  let fixture: ComponentFixture<EditPhaseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhaseConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhaseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
