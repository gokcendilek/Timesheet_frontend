import { Component } from '@angular/core';
import { AuthService } from './auth.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false
})
export class AppComponent {
  title = 'timesheet-app';
  constructor(public authService: AuthService) {}
}
