
import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../timesheet.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  timesheet = { date: '', startTime: '', endTime: '', description: '' };
  searchTimesheet = {startDate: '', endDate: ''};
  timesheets: any[] = [];
  isEditMode = false;
  selectedTimesheetId: number | null = null;
  constructor(private timesheetService: TimesheetService, private toastr: ToastrService ) {}

  ngOnInit() {
    this.loadTimesheets();
  }

  loadTimesheets() {
    this.timesheetService.getTimesheets(null).subscribe((data: any) => {
      this.timesheets = data;
    });
  }

  saveTimesheet() {
    this.timesheetService.saveTimesheet(this.timesheet).subscribe(() => {
      this.loadTimesheets();
      this.clearForm();
      this.toastr.success('Timesheet saved successfully');  
    }, error => {
      this.toastr.error('An error occurred while saving the timesheet');  
    });
  }

  exportTimesheets(format: string) {
    this.timesheetService.exportTimesheets(this.searchTimesheet).subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `timesheets.${format}`;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.toastr.success('Timesheets exported successfully');  
    }, error => {
      this.toastr.error('File export failed');  
    });
  }

  onSearchTimeSheets(){
    this.timesheetService.getTimesheets(this.searchTimesheet).subscribe((data: any) => {
      this.timesheets = data;
    });
  }
  editTimesheet(timesheet: any) {
    console.log('Editing timesheet:', timesheet);
    this.isEditMode = true;
    this.selectedTimesheetId = timesheet.id;
    this.timesheet = { ...timesheet };  
  }
  

  updateTimesheet() {
    if (this.selectedTimesheetId !== null) {
      this.timesheetService.updateTimesheet(this.selectedTimesheetId, this.timesheet).subscribe(() => {
        this.loadTimesheets();
        this.clearForm();
        this.isEditMode = false;
        this.toastr.success('Timesheet updated successfully');  
      }, error => {
        this.toastr.error('An error occurred while updating the timesheet'); 
      });
    }
  }

  cancelUpdate() {
    this.clearForm();
    this.isEditMode = false;
  }

  clearForm() {
    this.timesheet = { date: '', startTime: '', endTime: '', description: '' };
    this.selectedTimesheetId = null;
    this.isEditMode = false;
  }
  
  
  
}
