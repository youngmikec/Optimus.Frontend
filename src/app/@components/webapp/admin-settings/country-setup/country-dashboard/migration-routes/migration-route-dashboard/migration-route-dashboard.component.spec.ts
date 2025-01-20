import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationRouteDashboardComponent } from './migration-route-dashboard.component';

describe('MigrationRouteDashboardComponent', () => {
  let component: MigrationRouteDashboardComponent;
  let fixture: ComponentFixture<MigrationRouteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationRouteDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationRouteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
