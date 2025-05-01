import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

describe('[INTEGRATION] FormComponent – create mode', () => {
  let fixture: ComponentFixture<FormComponent>;
  let component: FormComponent;
  let sessionApiServiceMock: any;
  let routerMock: any;
  let matSnackBarMock: any;

  beforeEach(async () => {
    sessionApiServiceMock = {
      create: jest.fn().mockReturnValue(of({ id: 2 })),
      update: jest.fn(),
      detail: jest.fn()
    };

    routerMock = {
      navigate: jest.fn(),
      url: '/sessions/create'
    };

    matSnackBarMock = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: Router, useValue: routerMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: { sessionInformation: { admin: true } } },
        { provide: TeacherService, useValue: { all: () => of([{ id: 1, firstName: 'John', lastName: 'Doe' }]) } },
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit a new session and navigate with snackbar', fakeAsync(() => {
    component.sessionForm?.setValue({
      name: 'New Session',
      date: '2024-01-01',
      teacher_id: 1,
      description: 'Integration test description'
    });

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    tick();

    expect(sessionApiServiceMock.create).toHaveBeenCalledWith(component.sessionForm?.value);
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  }));
});

describe('[INTEGRATION] FormComponent – update mode', () => {
  let fixture: ComponentFixture<FormComponent>;
  let component: FormComponent;
  let sessionApiServiceMock: any;
  let routerMock: any;
  let matSnackBarMock: any;

  const mockSession = {
    id: 1,
    name: 'Session Initiale',
    date: new Date(),
    teacher_id: 1,
    description: 'Ancienne description',
    users: []
  };

  beforeEach(async () => {
    sessionApiServiceMock = {
      create: jest.fn(),
      update: jest.fn().mockReturnValue(of(mockSession)),
      detail: jest.fn().mockReturnValue(of(mockSession))
    };

    routerMock = {
      navigate: jest.fn(),
      url: '/sessions/update/1'
    };

    matSnackBarMock = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: routerMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: { sessionInformation: { admin: true } } },
        { provide: TeacherService, useValue: { all: () => of([{ id: 1, firstName: 'John', lastName: 'Doe' }]) } },
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update an existing session and navigate with snackbar', fakeAsync(() => {
    component.sessionForm?.setValue({
      name: 'Updated Session',
      date: '2024-05-01',
      teacher_id: 1,
      description: 'Updated description'
    });

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    tick();

    expect(sessionApiServiceMock.update).toHaveBeenCalledWith('1', component.sessionForm?.value);
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  }));
});
