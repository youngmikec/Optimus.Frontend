import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditDivisionComponent } from './create-edit-division.component';

describe('CreateEditDivisionComponent', () => {
  let component: CreateEditDivisionComponent;
  let fixture: ComponentFixture<CreateEditDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
