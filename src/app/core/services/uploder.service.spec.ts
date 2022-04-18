import { TestBed } from '@angular/core/testing';

import { UploderService } from './uploder.service';

describe('UploderService', () => {
  let service: UploderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
