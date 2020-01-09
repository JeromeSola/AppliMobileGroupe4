import { TestBed } from '@angular/core/testing';

import { GoogleFitService } from './google-fit.service';

describe('GoogleFitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleFitService = TestBed.get(GoogleFitService);
    expect(service).toBeTruthy();
  });
});
