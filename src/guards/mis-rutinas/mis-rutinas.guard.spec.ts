import { TestBed } from '@angular/core/testing';

import { MisRutinasGuard } from './mis-rutinas.guard';

describe('MisRutinasGuard', () => {
  let guard: MisRutinasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MisRutinasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
