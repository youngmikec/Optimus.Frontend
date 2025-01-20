import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTableViewComponent } from './create-table-view.component';

describe('CreateTableViewComponent', () => {
  let component: CreateTableViewComponent;
  let fixture: ComponentFixture<CreateTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
