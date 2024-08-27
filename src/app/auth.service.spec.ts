import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();  
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login the user', () => {
    const dummyCredentials = { username: 'testuser', password: 'password' };
    const dummyToken = { token: 'jwt-token' };

    service.login(dummyCredentials).subscribe(response => {
      expect(response).toEqual(dummyToken);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyToken);
  });

  it('should register the user', () => {
    const dummyUser = { username: 'newuser', email: 'newuser@example.com', password: 'password', role: 'USER' };
    const dummyResponse = 'User registered successfully';

    service.register(dummyUser).subscribe(response => {
      expect(response).toBe(dummyResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/register');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse, { headers: { 'Content-Type': 'text/plain' } });
  });

  it('should return the role from the token', () => {
    const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiJ0ZXN0dXNlciIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTUxNjIzOTAyMn0.' +
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    localStorage.setItem('token', dummyToken);

    const role = service.getRole();
    expect(role).toBe('ADMIN');
  });

  it('should return null if no token is present', () => {
    localStorage.removeItem('token');
    const role = service.getRole();
    expect(role).toBeNull();
  });

  it('should return true if user is logged in', () => {
    localStorage.setItem('token', 'dummy-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should log out the user and navigate to login page', () => {
   
    localStorage.setItem('token', 'dummy-token'); 
  
    service.logout();
  
    expect(localStorage.getItem('token')).toBeNull();
  
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
  
});
