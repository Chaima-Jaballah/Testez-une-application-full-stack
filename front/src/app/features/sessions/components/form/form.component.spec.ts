import { TestBed, ComponentFixture, fakeAsync, tick, flush, flushMicrotasks as ngFlushMicrotasks } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { expect } from "@jest/globals";

import { FormComponent } from "./form.component";
import { SessionApiService } from "../../services/session-api.service";
import { SessionService } from "../../../../services/session.service";
import { TeacherService } from "../../../../services/teacher.service";
import { Session } from "../../interfaces/session.interface";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";


const mockSession: Session = {
  id: 1,
  name: "Test Session",
  date: new Date(),
  teacher_id: 42,
  description: "Jest rocks !",
  users: []
};

function createActivatedRouteStub(params: Record<string, string> = {}) {
  return {
    snapshot: {
      paramMap: {
        get: (key: string) => params[key]
      }
    }
  } as unknown as ActivatedRoute;
}

function createSessionServiceStub(isAdmin = true) {
  return {
    sessionInformation: { admin: isAdmin }
  } as unknown as SessionService;
}

function createTeacherServiceStub() {
  return {
    all: jest.fn().mockReturnValue(of([]))
  } as unknown as TeacherService;
}


function createMatSnackBarStub() {
  return {
    open: jest.fn()
  } as any;
}

describe("FormComponent – create mode", () => {
  let fixture: ComponentFixture<FormComponent>;
  let component: FormComponent;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let router: Router;

  beforeEach(async () => {
    sessionApiService = {
      create: jest.fn().mockReturnValue(of({ ...mockSession, id: 2 })),
      update: jest.fn(),
      detail: jest.fn()
    } as unknown as jest.Mocked<SessionApiService>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [FormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: createActivatedRouteStub() },
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: SessionService, useValue: createSessionServiceStub() },
        { provide: TeacherService, useValue: createTeacherServiceStub() },
        { provide: MatSnackBar, useValue: createMatSnackBarStub() }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
    expect(component.onUpdate).toBe(false);
  });

  it("should build a blank form", () => {
    const formValues = component.sessionForm?.value;
    expect(formValues).toEqual({
      name: "",
      date: "",
      teacher_id: "",
      description: ""
    });
  });

  it("should call create() and navigate on submit", fakeAsync(() => {
    component.sessionForm?.setValue({
      name: mockSession.name,
      date: mockSession.date.toISOString().split("T")[0],
      teacher_id: mockSession.teacher_id,
      description: mockSession.description
    });

    const navigateSpy = jest.spyOn(router, "navigate").mockResolvedValue(true as any);

    component.submit();
    flush(); 

    expect(sessionApiService.create).toHaveBeenCalledWith(component.sessionForm?.value);
    expect(navigateSpy).toHaveBeenCalledWith(["sessions"]);
  }));
});

describe("FormComponent – update mode", () => {
  let fixture: ComponentFixture<FormComponent>;
  let component: FormComponent;
  let sessionApiService: jest.Mocked<SessionApiService>;

  beforeEach(async () => {
    sessionApiService = {
      create: jest.fn(),
      update: jest.fn().mockReturnValue(of(mockSession)),
      detail: jest.fn().mockReturnValue(of(mockSession))
    } as unknown as jest.Mocked<SessionApiService>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [FormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: createActivatedRouteStub({ id: "1" }) },
        { provide: Router, useValue: { url: "/sessions/update/1", navigate: jest.fn().mockResolvedValue(true) } },
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: SessionService, useValue: createSessionServiceStub() },
        { provide: TeacherService, useValue: createTeacherServiceStub() },
        { provide: MatSnackBar, useValue: createMatSnackBarStub() }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should switch to update mode and init form", () => {
    expect(component.onUpdate).toBe(true);
    expect(sessionApiService.detail).toHaveBeenCalledWith("1");
    expect(component.sessionForm?.value.name).toBe(mockSession.name);
  });

  it("should call update() on submit", fakeAsync(() => {
    component.submit();
    flush();
    expect(sessionApiService.update).toHaveBeenCalledWith("1", component.sessionForm?.value);
  }));
});
