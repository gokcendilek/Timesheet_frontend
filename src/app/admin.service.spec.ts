import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { HttpClient } from '@angular/common/http';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users with getUsers', () => {
    const dummyUsers = [{ id: 1, username: 'john' }, { id: 2, username: 'jane' }];
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${baseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should fetch timesheets with getTimesheets', () => {
    const dummyTimesheets = [{ id: 1, description: 'Worked on project' }, { id: 2, description: 'Meeting' }];
    
    service.getTimesheets().subscribe(timesheets => {
      expect(timesheets.length).toBe(2);
      expect(timesheets).toEqual(dummyTimesheets);
    });

    const req = httpMock.expectOne(`${baseUrl}/timesheets`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTimesheets);
  });

  it('should fetch timesheets by userId with getTimesheetsByUserId', () => {
    const dummyTimesheets = [{ id: 1, description: 'Worked on project' }];
    const userId = 1;
    
    service.getTimesheetsByUserId(userId).subscribe(timesheets => {
      expect(timesheets.length).toBe(1);
      expect(timesheets).toEqual(dummyTimesheets);
    });

    const req = httpMock.expectOne(`${baseUrl}/timesheets?userId=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTimesheets);
  });

  it('should delete a user with deleteUser', () => {
    const userId = 1;
  
    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeNull();  // Adjusted expectation to be null
    });
  
    const req = httpMock.expectOne(`${baseUrl}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);  // Respond with null
  });
  

  it('should fetch users by criteria with getUsersByCriteria', () => {
    const dummyUsers = [{ id: 1, username: 'john' }];
    const username = 'john';
    
    service.getUsersByCriteria(username, '', '').subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${baseUrl}/users?username=${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should export timesheets with exportTimesheets', () => {
    const blob = new Blob(['dummy data'], { type: 'text/csv' });
    const userId = 1;

    service.exportTimesheets(userId).subscribe((exportedBlob) => {
      expect(exportedBlob).toEqual(blob);
    });

    const req = httpMock.expectOne(`${baseUrl}/timesheets/export/csv?userId=${userId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(blob);
  });

  it('should export all timesheets when no userId is provided', () => {
    const blob = new Blob(['dummy data'], { type: 'text/csv' });

    service.exportTimesheets(null).subscribe((exportedBlob) => {
      expect(exportedBlob).toEqual(blob);
    });

    const req = httpMock.expectOne(`${baseUrl}/timesheets/export/csv`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(blob);
  });
});
