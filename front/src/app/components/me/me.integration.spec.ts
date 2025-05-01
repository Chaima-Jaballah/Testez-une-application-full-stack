import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('[INTEGRATION] MeComponent – admin view', () => {
  let fixture: ComponentFixture<MeComponent>;
  let component: MeComponent;

  const mockUser = {
    id: 1,
    firstName: 'Admin',
    lastName: 'Admin',
    email: 'yoga@studio.com',
    admin: true,
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-05-01T00:00:00Z'
  };

  const sessionServiceMock = {
    sessionInformation: { id: 1, admin: true },
    logOut: jest.fn()
  };

  const userServiceMock = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display user info correctly for admin', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Name: Admin ADMIN');
    expect(el.textContent).toContain('Email: yoga@studio.com');
    expect(el.textContent).toContain('You are admin');
    expect(el.textContent).toContain('Create at:');
    expect(el.textContent).toContain('Last update:');
  });
});
