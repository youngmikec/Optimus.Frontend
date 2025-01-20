import { TestBed } from '@angular/core/testing';

import { SalesLoanService } from './sales-loan.service';

describe('SalesLoanService', () => {
  let service: SalesLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
