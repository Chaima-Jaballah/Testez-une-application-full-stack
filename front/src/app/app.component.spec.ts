import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

 
  const sessionServiceStub = {
    $isLogged: jest.fn().mockReturnValue(of(true)),
    logOut: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]), 
        HttpClientModule,
        MatToolbarModule,
        NoopAnimationsModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceStub },
        { provide: AuthService, useValue: {} }
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('$isLogged() should proxy SessionService.$isLogged', (done) => {
    component.$isLogged().subscribe(value => {
      expect(value).toBe(true);
      expect(sessionServiceStub.$isLogged).toHaveBeenCalled();
      done();
    });
  });

  it('logout() should clear session and navigate to root', () => {
    const router = TestBed.inject(Router);
    const spy = jest.spyOn(router, 'navigate');

    component.logout();

    expect(sessionServiceStub.logOut).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(['']);
  });
  
});
