
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  login() {
    this.authService.login(this.credentials).subscribe((response: any) => {
      localStorage.setItem('token', response.token);
      this.toastr.success('Login successful!', 'Success');
      this.router.navigate(['/timesheet']);
    }, error => {
      this.toastr.error('Invalid credentials', 'Error');
    });
  }
}

