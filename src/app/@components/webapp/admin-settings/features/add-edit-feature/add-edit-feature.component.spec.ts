import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFeatureComponent } from './add-edit-feature.component';

describe('AddEditFeatureComponent', () => {
  let component: AddEditFeatureComponent;
  let fixture: ComponentFixture<AddEditFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
