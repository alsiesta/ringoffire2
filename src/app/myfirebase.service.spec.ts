import { TestBed } from '@angular/core/testing';

import { MyfirebaseService } from './myfirebase.service';

describe('MyfirebaseService', () => {
  let service: MyfirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyfirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
