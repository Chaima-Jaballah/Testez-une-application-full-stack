import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  const mockUser: SessionInformation = {
    token: 'fake-token',
    type: 'Bearer',
    id: 1,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    admin: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isLogged = false and sessionInformation = undefined by default', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('$isLogged() should emit false by default', (done) => {
    service.$isLogged().subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should update state correctly on logIn()', (done) => {
    service.logIn(mockUser);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockUser);

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should reset state correctly on logOut()', (done) => {
    service.logIn(mockUser); // simulate login
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
});