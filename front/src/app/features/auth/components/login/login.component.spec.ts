import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockSessionService = {
      logIn: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and redirect', () => {
    const fakeSession = { 
      token: 'fake-token', 
      type: 'Bearer', 
      id: 1, 
      username: 'testuser', 
      firstName: 'Test', 
      lastName: 'User', 
      email: 'test@mail.com',
      admin: false // Added the missing 'admin' property
    };
    mockAuthService.login.mockReturnValue(of(fakeSession));

    component.form.setValue({
      email: 'test@mail.com',
      password: '123456'
    });

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@mail.com',
      password: '123456'
    });
    expect(mockSessionService.logIn).toHaveBeenCalledWith(fakeSession);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true when login fails', () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('401')));

    component.form.setValue({
      email: 'fail@mail.com',
      password: 'wrong'
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should keep submit disabled when form is invalid', () => {
    component.form.setValue({
      email: '',
      password: ''
    });

    expect(component.form.invalid).toBe(true);
  }); 
});
