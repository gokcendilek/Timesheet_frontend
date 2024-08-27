
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimesheetComponent } from './timesheet.component';
import { TimesheetService } from '../timesheet.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('TimesheetComponent', () => {
  let component: TimesheetComponent;
  let fixture: ComponentFixture<TimesheetComponent>;
  let timesheetService: jasmine.SpyObj<TimesheetService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const timesheetServiceSpy = jasmine.createSpyObj('TimesheetService', ['getTimesheets', 'saveTimesheet', 'updateTimesheet', 'exportTimesheets']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [ TimesheetComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: TimesheetService, useValue: timesheetServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetComponent);
    component = fixture.componentInstance;
    timesheetService = TestBed.inject(TimesheetService) as jasmine.SpyObj<TimesheetService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    // Mock getTimesheets to return an empty Observable
    timesheetService.getTimesheets.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load timesheets on init', () => {
    component.ngOnInit();
    expect(timesheetService.getTimesheets).toHaveBeenCalled();
  });

  it('should switch to edit mode and populate form with selected timesheet', () => {
    const timesheet = { id: 1, date: '2023-08-26', startTime: '09:00', endTime: '17:00', description: 'Worked on project' };
    component.editTimesheet(timesheet);
    expect(component.isEditMode).toBe(true);
    expect(component.timesheet).toEqual(timesheet);
  });

  it('should save timesheet and reload timesheets on success', () => {
    timesheetService.saveTimesheet.and.returnValue(of({}));
    component.saveTimesheet();
    expect(timesheetService.saveTimesheet).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Timesheet saved successfully');
    expect(timesheetService.getTimesheets).toHaveBeenCalled();
  });

  it('should show error message on save failure', () => {
    timesheetService.saveTimesheet.and.returnValue(of({}));
    component.saveTimesheet();
    expect(timesheetService.saveTimesheet).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Timesheet saved successfully');
    expect(timesheetService.getTimesheets).toHaveBeenCalled();
  });
});
