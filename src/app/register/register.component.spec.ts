import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a valid user', async () => {
    const formData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'ValidPass1!',
      role: 'USER'
    };

    component.registerForm.setValue(formData);
    expect(component.registerForm.valid).toBeTrue();

    authService.register.and.returnValue(of('Registration successful!'));

    component.register();
    fixture.detectChanges(); 
    await fixture.whenStable(); 

    expect(authService.register).toHaveBeenCalledWith(formData);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastr.success).toHaveBeenCalledWith('Registration successful! You can now login.');
  });

  it('should show error when user already exists', async () => {
    const formData = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'ValidPass1!',
      role: 'USER'
    };

    component.registerForm.setValue(formData);
    expect(component.registerForm.valid).toBeTrue();

    authService.register.and.returnValue(throwError({ status: 400 }));

    component.register();
    fixture.detectChanges(); 
    await fixture.whenStable(); 

    expect(authService.register).toHaveBeenCalledWith(formData);
    expect(toastr.error).toHaveBeenCalledWith('User already exists. Please choose a different username or email.');
  });

  it('should show a generic error message when an unexpected error occurs', async () => {
    const formData = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'ValidPass1!',
      role: 'USER'
    };

    component.registerForm.setValue(formData);
    expect(component.registerForm.valid).toBeTrue();

    authService.register.and.returnValue(throwError({ status: 500 }));

    component.register();
    fixture.detectChanges(); 
    await fixture.whenStable(); 

    expect(authService.register).toHaveBeenCalledWith(formData);
    expect(toastr.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again later.');
  });
});
