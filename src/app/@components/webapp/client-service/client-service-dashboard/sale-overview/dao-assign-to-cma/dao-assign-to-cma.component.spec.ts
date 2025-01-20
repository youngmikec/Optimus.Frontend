import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaoAssignToCmaComponent } from './dao-assign-to-cma.component';

describe('DaoAssignToCmaComponent', () => {
  let component: DaoAssignToCmaComponent;
  let fixture: ComponentFixture<DaoAssignToCmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaoAssignToCmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaoAssignToCmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
