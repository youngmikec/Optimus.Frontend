import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBreadcrumbComponent } from './navbar-breadcrumb.component';

describe('NavbarBreadcrumbComponent', () => {
  let component: NavbarBreadcrumbComponent;
  let fixture: ComponentFixture<NavbarBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
