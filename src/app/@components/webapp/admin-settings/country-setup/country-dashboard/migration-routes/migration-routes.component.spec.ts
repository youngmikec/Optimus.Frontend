import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationRoutesComponent } from './migration-routes.component';

describe('MigrationRoutesComponent', () => {
  let component: MigrationRoutesComponent;
  let fixture: ComponentFixture<MigrationRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
