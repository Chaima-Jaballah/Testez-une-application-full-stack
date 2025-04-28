import { HttpClientModule } from '@angular/common/http';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;

  /**  Stubs **/
  const sessionServiceStub = {
    $isLogged: jest.fn().mockReturnValue(of(true)),
    logOut : jest.fn()
  };

  // Router stub – seule la méthode navigate est nécessaire
  const routerStub = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,          // garde les helpers Angular
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: Router,        useValue: routerStub },
        { provide: SessionService,useValue: sessionServiceStub },
        { provide: AuthService,   useValue: {} }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router    = TestBed.inject(Router);
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
    component.logout();

    expect(sessionServiceStub.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
