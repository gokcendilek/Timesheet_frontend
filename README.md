#  Timesheet Frontend (Angular)

This is the frontend of the **Timesheet Management System**, developed using **Angular**. It allows users to register, log in, and manage their daily timesheet entries. Admins can search users, list all users, view individual user timesheets, and export data.

##  Features

### 👤 User Functionality
- Register with username, email, and password
- Login and receive JWT token
- Create, update, and delete daily timesheet entries
- View personal timesheet list

###  Admin Panel
- View and search all registered users (by username, email, or registration date)
- List all timesheets for all users
- View timesheets of a selected user
- Export user and timesheet data to CSV or Excel
- Role-based access control (admin vs user)

##  Validation Rules

- Passwords must contain at least:
  - 8 characters  
  - One uppercase letter  
  - One lowercase letter  
  - One special character

- Email and username must be unique (checked via backend API)

## 🛠️ Technologies Used

- Angular 17+  
- TypeScript  
- Bootstrap  
- ngx-toastr (notifications)  
- JWT Authentication  
- Angular Interceptors and Guards  



