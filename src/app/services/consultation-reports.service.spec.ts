import { TestBed } from '@angular/core/testing';

import { ConsultationReportsService } from './consultation-reports.service';

describe('ConsultationReportsService', () => {
  let service: ConsultationReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultationReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
