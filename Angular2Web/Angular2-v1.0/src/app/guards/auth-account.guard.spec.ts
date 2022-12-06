import { TestBed, async, inject } from '@angular/core/testing';

import { AuthAccountGuard } from './auth-account.guard';

describe('AuthAccountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAccountGuard]
    });
  });

  it('should ...', inject([AuthAccountGuard], (guard: AuthAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
