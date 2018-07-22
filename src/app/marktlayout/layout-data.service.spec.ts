import { TestBed, inject } from '@angular/core/testing';

import { LayoutDataService } from './layout-data.service';

describe('LayoutDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutDataService]
    });
  });

  it('should be created', inject([LayoutDataService], (service: LayoutDataService) => {
    expect(service).toBeTruthy();
  }));
});
