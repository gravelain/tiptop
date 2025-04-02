import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from './services/token.service';
import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        {
          provide: TokenService,
          useValue: { getToken: () => 'test-token' }  // Mock token
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    tokenService = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    const httpRequestSpy = new HttpRequest('GET', '/test');
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(of(null));

    const token = tokenService.getToken();
    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(() => {
      expect(httpHandlerSpy.handle).toHaveBeenCalled();
      const interceptedRequest = httpHandlerSpy.handle.calls.mostRecent().args[0];
      expect(interceptedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });
  });
});
