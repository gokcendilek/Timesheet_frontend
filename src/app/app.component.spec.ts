import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],  
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'timesheet-app'`, () => {
    expect(component.title).toEqual('timesheet-app');
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('nav a');

    expect(links.length).toBe(5);  // Ensures that all the navigation links are present
    expect(links[0].textContent).toContain('Login');
    expect(links[1].textContent).toContain('Register');
    expect(links[2].textContent).toContain('Timesheet');
    expect(links[3].textContent).toContain('Admin Panel');
    expect(links[4].textContent).toContain('Exit');
  });

  it('should call authService.logout when Exit link is clicked', () => {
    
    const logoutLink: DebugElement = fixture.debugElement.query(By.css('a[routerLink="/login"]:last-child'));

   
    logoutLink.triggerEventHandler('click', null);

    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
