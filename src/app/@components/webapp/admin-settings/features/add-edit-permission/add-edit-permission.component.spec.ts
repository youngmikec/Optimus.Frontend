import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPermissionComponent } from './add-edit-permission.component';

describe('AddEditPermissionComponent', () => {
  let component: AddEditPermissionComponent;
  let fixture: ComponentFixture<AddEditPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
