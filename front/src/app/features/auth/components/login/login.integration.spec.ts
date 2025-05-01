import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('[INTEGRATION] LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let router: Router;
  let authServiceMock: any;
  let sessionServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn()
    };
    sessionServiceMock = {
      logIn: jest.fn()
    };
    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should log in and redirect on valid form submission', fakeAsync(() => {
    const mockSession = { token: '123', user: { email: 'test@example.com' } };
    authServiceMock.login.mockReturnValue(of(mockSession));

    
    component.form.setValue({
      email: 'test@example.com',
      password: 'securepass'
    });

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    tick(); 

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'securepass'
    });
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSession);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  }));
});