import { TestBed } from '@angular/core/testing';

import { DialogDataService } from './dialog-data.service';

describe('DialogDataService', () => {
  let service: DialogDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
