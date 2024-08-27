import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AdminService } from '../admin.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsers', 'getTimesheets', 'getTimesheetsByUserId', 'getUsersByCriteria', 'deleteUser', 'exportTimesheets']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['warning', 'info', 'error']);

    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, ToastrModule.forRoot()], // Add ToastrModule
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should load users if query is empty', () => {
      spyOn(component, 'loadUsers');
      component.searchQueryControl.setValue('');
      component.onSearch();
      expect(component.loadUsers).toHaveBeenCalled();
    });

    it('should call getUsersByCriteria for username and show warning if no users found', () => {
      component.selectedCriteria = 'username';
      component.searchQueryControl.setValue('testuser');
      adminService.getUsersByCriteria.and.returnValue(of([]));

      component.onSearch();

      expect(adminService.getUsersByCriteria).toHaveBeenCalledWith('testuser', '', '');
      expect(toastrService.warning).toHaveBeenCalledWith('There is no such user');
      expect(component.users.length).toBe(0);
    });

    it('should call getUsersByCriteria for email and show warning if no users found', () => {
      component.selectedCriteria = 'email';
      component.searchQueryControl.setValue('test@test.com');
      adminService.getUsersByCriteria.and.returnValue(of([]));

      component.onSearch();

      expect(adminService.getUsersByCriteria).toHaveBeenCalledWith('', 'test@test.com', '');
      expect(toastrService.warning).toHaveBeenCalledWith('There is no such user');
      expect(component.users.length).toBe(0);
    });

    it('should call getUsersByCriteria for registrationDate and show warning if no users found', () => {
      component.selectedCriteria = 'registrationDate';
      component.searchQueryControl.setValue('2024-08-01');
      adminService.getUsersByCriteria.and.returnValue(of([]));

      component.onSearch();

      expect(adminService.getUsersByCriteria).toHaveBeenCalledWith('', '', '2024-08-01');
      expect(toastrService.warning).toHaveBeenCalledWith('There is no such user');
      expect(component.users.length).toBe(0);
    });
  });

  describe('viewTimesheets', () => {
    it('should call getTimesheetsByUserId and show warning if no timesheets found', () => {
      const mockTimesheets: any[] = [];

      const mockUser = { id: 1, username: 'testuser' };
      component.users = [mockUser];
      
      adminService.getTimesheetsByUserId.and.returnValue(of(mockTimesheets));

      component.viewTimesheets(1);

      expect(adminService.getTimesheetsByUserId).toHaveBeenCalledWith(1);
      expect(toastrService.warning).toHaveBeenCalledWith('The user has no timesheet data.');
    });

    it('should call getTimesheetsByUserId and show info if timesheets found', () => {
      const mockTimesheets = [{ date: '2024-08-01', startTime: '09:00', endTime: '17:00', description: 'Work' }];
      const mockUser = { id: 1, username: 'testuser' };
      component.users = [mockUser];

      adminService.getTimesheetsByUserId.and.returnValue(of(mockTimesheets));

      component.viewTimesheets(1);

      expect(adminService.getTimesheetsByUserId).toHaveBeenCalledWith(1);
      expect(toastrService.info).toHaveBeenCalledWith("The user's timesheet data is listed below.");
      expect(component.selectedUserTimesheets.length).toBe(1);
    });
  });

  describe('loadUsers', () => {
    it('should call getUsers and load users', () => {
      const mockUsers = [{ id: 1, username: 'testuser' }];
      adminService.getUsers.and.returnValue(of(mockUsers));

      component.loadUsers();

      expect(adminService.getUsers).toHaveBeenCalled();
      expect(component.users.length).toBe(1);
    });
  });

  describe('deleteUser', () => {
    it('should call deleteUser and reload users', () => {
      spyOn(component, 'loadUsers');
      adminService.deleteUser.and.returnValue(of(void 0));


      component.deleteUser(1);

      expect(adminService.deleteUser).toHaveBeenCalledWith(1);
      expect(component.loadUsers).toHaveBeenCalled();
    });
  });

  describe('loadTimesheets', () => {
    it('should call getTimesheets and load timesheets', () => {
      const mockTimesheets = [{ date: '2024-08-01', startTime: '09:00', endTime: '17:00', description: 'Work' }];
      adminService.getTimesheets.and.returnValue(of(mockTimesheets));

      component.loadTimesheets();

      expect(adminService.getTimesheets).toHaveBeenCalled();
      expect(component.timesheets.length).toBe(1);
    });
  });
});
