import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getTimesheets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/timesheets`);
  }

  getTimesheetsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/timesheets?userId=${userId}`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  getUsersByCriteria(username?: string, email?: string, registrationDate?: string): Observable<any> {
    let queryParams = '?';
    if (username) queryParams += `username=${username}`;
    if (email) queryParams += `email=${email}`;
    if (registrationDate) queryParams += `registrationDate=${registrationDate}`;
    return this.http.get(`${this.baseUrl}/users${queryParams}`);
  }
    




  exportTimesheets(userId: any) {
    if (userId){
      return this.http.get(`${this.baseUrl}/timesheets/export/csv?userId=${userId}`, { responseType: 'blob' });
    }
    return this.http.get(`${this.baseUrl}/timesheets/export/csv`, { responseType: 'blob' });
  }
  
}
