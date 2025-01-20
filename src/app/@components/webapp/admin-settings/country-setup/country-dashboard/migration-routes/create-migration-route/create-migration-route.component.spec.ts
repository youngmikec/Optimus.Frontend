import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMigrationRouteComponent } from './create-migration-route.component';

describe('CreateMigrationRouteComponent', () => {
  let component: CreateMigrationRouteComponent;
  let fixture: ComponentFixture<CreateMigrationRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMigrationRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMigrationRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
