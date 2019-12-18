import { TestBed } from '@angular/core/testing';

import { UserCloudFuncService } from './user-cloud-func.service';

describe('UserCloudFuncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserCloudFuncService = TestBed.get(UserCloudFuncService);
    expect(service).toBeTruthy();
  });
});
