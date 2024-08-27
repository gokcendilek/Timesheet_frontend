import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';  // Toastr for notifications

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', email: '', password: '' , role: ''};
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      role: ['', Validators.required]
    });
  }

  
  passwordValidator(control: any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pattern.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }

  register() {
    this.registerForm.markAllAsTouched();  
  
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          this.toastr.success('Registration successful! You can now login.');  
          this.router.navigate(['/login']);  
        },
        (error) => {
          if (error.status === 400) {
            this.toastr.error('User already exists. Please choose a different username or email.');
          } else {
            this.toastr.error('An unexpected error occurred. Please try again later.');
          }
        }
      );
    } else {
      this.toastr.error('Please ensure the form is filled out correctly.');
    }
  }
  
  
}
