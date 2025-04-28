import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let mockAuthService: { register: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, MatCardModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate to login on success', () => {
    mockAuthService.register.mockReturnValue(of(undefined));

    component.form.setValue({
      email: 'test@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secure123'
    });

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secure123'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true when register fails', () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Error')));

    component.form.setValue({
      email: 'fail@mail.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: '123'
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should mark form as invalid if fields are empty', () => {
    component.form.setValue({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });

    expect(component.form.invalid).toBe(true);
  });
});