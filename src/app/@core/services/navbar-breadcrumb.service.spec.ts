import { TestBed } from '@angular/core/testing';

import { NavbarBreadcrumbService } from './navbar-breadcrumb.service';

describe('NavbarBreadcrumbService', () => {
  let service: NavbarBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
