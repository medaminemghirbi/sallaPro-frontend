import { TestBed } from '@angular/core/testing';

import { CertifcatesService } from './certifcates.service';

describe('CertifcatesService', () => {
  let service: CertifcatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertifcatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
