import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 
  users: any[] = [];
  timesheets: any[] = [];
  selectedUserTimesheets: any[] = [];
  selectedUsername: string = '';
  selectedUserId: number =0;
  searchCriteria: string = 'username'; 
  searchQuery: string = '';
  showSearchForm: boolean = false;
  selectedCriteria: string = 'username'; 
  searchQueryControl: FormControl = new FormControl(); 
  
  constructor(private adminService: AdminService,private toastr: ToastrService) {}

  ngOnInit() {
    this.searchQueryControl.valueChanges.pipe(debounceTime(300)).subscribe(query => {
      if (query && query.trim()) {
        this.dynamicSearch(query); 
      } else {
        this.users = []; 
      }
    });
  }
  dynamicSearch(query: string) {
    if (this.selectedCriteria === 'email') {
      this.adminService.getUsersByCriteria('', query, '').subscribe(this.handleUserSearch);
    } else if (this.selectedCriteria === 'username') {
      this.adminService.getUsersByCriteria(query, '', '').subscribe(this.handleUserSearch);
    }
  }

  handleUserSearch = (data: any) => {
    this.users = data;
  }

    onSearch() {
      const query = this.searchQueryControl.value;
    
      if (!query) {
        this.loadUsers(); 
        return;
      }
    
      const criteria = this.selectedCriteria;
      
      if (criteria === 'username') {
        this.adminService.getUsersByCriteria(query, '', '').subscribe({
          next: (data: any) => {
            this.users = data;
            if (data.length === 0) {
              this.noUserFound();
            }
          },
          error: (err) => {
            console.error('Error fetching users', err);
          }
        });
      } else if (criteria === 'email') {
        this.adminService.getUsersByCriteria('', query, '').subscribe({
          next: (data: any) => {
            this.users = data;
            if (data.length === 0) {
              this.noUserFound();
            }
          },
          error: (err) => {
            console.error('Error fetching users', err);
          }
        });
      } else if (criteria === 'registrationDate') {
        this.adminService.getUsersByCriteria('', '', query).subscribe({
          next: (data: any) => {
            this.users = data;
            if (data.length === 0) {
              this.noUserFound();
            }
          },
          error: (err) => {
            console.error('Error fetching users', err);
          }
        });
      }
    }
    
    noUserFound() {
      this.toastr.warning('There is no such user');
      this.users = [];
    }
    
  
  toggleSearch() {
    this.clearAll();
    this.showSearchForm = !this.showSearchForm;
  }

  loadUsers() {
    this.clearAll();
    this.adminService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  loadTimesheets() {
    this.clearAll();
    this.adminService.getTimesheets().subscribe({
      next: (data: any) => {
        this.timesheets = data;
      },
      error: (err) => {
        console.error('Error loading timesheets', err);
      }
    });
  }

    viewTimesheets(userId: number) {
      this.adminService.getTimesheetsByUserId(userId).subscribe({
        next: (data: any) => {
          this.selectedUserTimesheets = data;
          const user = this.users.find(u => u.id === userId);
          this.selectedUsername = user ? user.username : 'Unknown';
          this.selectedUserId = user ? user.id : 0;
    
          if (this.selectedUserTimesheets.length === 0) {
            this.toastr.warning('The user has no timesheet data.');
          } else {
            this.toastr.info('The user\'s timesheet data is listed below.');
          }
        },
        error: (err) => {
          this.toastr.error('An error occurred while fetching the timesheets.');
        }
      });
    }
    
  exportTimesheets(userId: any) {
    this.adminService.exportTimesheets(userId).subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `timesheets.csv`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, error => {
      console.error('File export failed:', error);
    });
  }

  deleteUser(userId: number) {
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user', err);
      }
    });
  }
  private clearAll() {
    this.users = [];
    this.timesheets = [];
    this.selectedUserTimesheets = [];
    this.selectedUsername = '';
    this.selectedUserId = 0;
    this.searchQuery = '';
    this.showSearchForm = false;
   
  }

  updateUser(user: any) {
    console.log('Updating user', user);
  }


}
 