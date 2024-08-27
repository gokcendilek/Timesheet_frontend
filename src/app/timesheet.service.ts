
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private baseUrl = 'http://localhost:8080/api/timesheets';

  constructor(private http: HttpClient) {}

  getTimesheets(searchTimeSheet: any) {
    if (searchTimeSheet){
      return this.http.get(`${this.baseUrl}?startDate=${searchTimeSheet.startDate}&endDate=${searchTimeSheet.endDate}`);
    }
    return this.http.get(this.baseUrl);
  }

  saveTimesheet(timesheet: any) {
    return this.http.post(this.baseUrl, timesheet);
  }

    exportTimesheets(searchTimeSheet: any) {
      if (searchTimeSheet.startDate && searchTimeSheet.endDate){
        return this.http.get(`${this.baseUrl}/export/csv?startDate=${searchTimeSheet.startDate}&endDate=${searchTimeSheet.endDate}`, { responseType: 'blob' });
      }
      return this.http.get(`${this.baseUrl}/export/csv`, { responseType: 'blob' });
    }

    updateTimesheet(id: number, timesheet: any) {
      console.log('Calling update API with ID:', id);
      return this.http.put(`${this.baseUrl}/${id}`, timesheet);
    }
    
    
}
