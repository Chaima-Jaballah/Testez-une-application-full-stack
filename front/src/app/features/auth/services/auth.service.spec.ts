import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRegisterRequest: RegisterRequest = {
    email: 'newuser@example.com',
    firstName: 'New',
    lastName: 'User',
    password: 'secure123'
  };

  const mockLoginRequest: LoginRequest = {
    email: 'testuser@example.com',
    password: 'testpass'
  };

  const mockSession: SessionInformation = {
    token: 'fake-token',
    type: 'Bearer',
    id: 1,
    username: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    admin: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register API and return void', () => {
    service.register(mockRegisterRequest).subscribe((res) => {
      expect(res).toBeUndefined(); // Observable<void>
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null);
  });

  it('should call login API and return SessionInformation', () => {
    service.login(mockLoginRequest).subscribe((session: SessionInformation) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSession);
  });
});
