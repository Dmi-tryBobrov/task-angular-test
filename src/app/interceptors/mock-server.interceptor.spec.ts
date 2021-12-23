import { TestBed } from '@angular/core/testing';

import { MockServerInterceptor } from './mock-server.interceptor';

describe('MockServerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockServerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MockServerInterceptor = TestBed.inject(MockServerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
