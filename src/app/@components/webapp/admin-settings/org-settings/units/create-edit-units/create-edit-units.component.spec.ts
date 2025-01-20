import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditUnitsComponent } from './create-edit-units.component';

describe('CreateEditUnitsComponent', () => {
  let component: CreateEditUnitsComponent;
  let fixture: ComponentFixture<CreateEditUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
