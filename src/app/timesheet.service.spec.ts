import { TestBed } from '@angular/core/testing';
import { TimesheetService } from './timesheet.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TimesheetService', () => {
  let service: TimesheetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimesheetService]
    });

    service = TestBed.inject(TimesheetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all timesheets when no search criteria is provided', () => {
    const dummyTimesheets = [
      { id: 1, date: '2023-08-20', description: 'Worked on project' },
      { id: 2, date: '2023-08-21', description: 'Worked on another project' }
    ];

    service.getTimesheets(null).subscribe(timesheets => {
      expect(timesheets).toEqual(dummyTimesheets);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/timesheets');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTimesheets);
  });

  it('should fetch timesheets by search criteria', () => {
    const dummyTimesheets = [
      { id: 1, date: '2023-08-20', description: 'Worked on project' }
    ];
    const searchCriteria = { startDate: '2023-08-20', endDate: '2023-08-21' };

    service.getTimesheets(searchCriteria).subscribe(timesheets => {
      expect(timesheets).toEqual(dummyTimesheets);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/timesheets?startDate=2023-08-20&endDate=2023-08-21`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTimesheets);
  });

  it('should save a timesheet', () => {
    const newTimesheet = { date: '2023-08-22', startTime: '09:00', endTime: '17:00', description: 'Worked on new project' };

    service.saveTimesheet(newTimesheet).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/timesheets');
    expect(req.request.method).toBe('POST');
    req.flush(newTimesheet);
  });

  it('should export timesheets as CSV without search criteria', () => {
    service.exportTimesheets({}).subscribe((response: Blob) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/timesheets/export/csv');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['timesheets.csv']));
  });

  it('should export timesheets as CSV with search criteria', () => {
    const searchCriteria = { startDate: '2023-08-20', endDate: '2023-08-21' };

    service.exportTimesheets(searchCriteria).subscribe((response: Blob) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/timesheets/export/csv?startDate=2023-08-20&endDate=2023-08-21');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['timesheets.csv']));
  });

  it('should update a timesheet', () => {
    const updatedTimesheet = { date: '2023-08-22', startTime: '09:00', endTime: '17:00', description: 'Updated project' };

    service.updateTimesheet(1, updatedTimesheet).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/timesheets/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTimesheet);
  });
});
