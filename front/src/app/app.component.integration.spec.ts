import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { AuthService } from './features/auth/services/auth.service';

describe('[INTEGRATION] AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  const sessionServiceStub = {
    $isLogged: jest.fn(),
    logOut: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        MatToolbarModule,
        NoopAnimationsModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceStub },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should display Sessions, Account and Logout when logged in', () => {
    sessionServiceStub.$isLogged.mockReturnValue(of(true));
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span[routerLink="sessions"]')).toBeTruthy();
    expect(compiled.querySelector('span[routerLink="me"]')).toBeTruthy();
    expect(compiled.textContent).toContain('Logout');
  });

  it('should display Login and Register when not logged in', () => {
    sessionServiceStub.$isLogged.mockReturnValue(of(false));
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span[routerLink="login"]')).toBeTruthy();
    expect(compiled.querySelector('span[routerLink="register"]')).toBeTruthy();
    expect(compiled.querySelector('span[routerLink="sessions"]')).toBeFalsy();
  });
});
