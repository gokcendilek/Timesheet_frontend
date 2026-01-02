# Timesheet Frontend (Angular)

This is the frontend of the **Timesheet Management System**, developed using **Angular 18**. It allows users to register, log in, and manage their daily timesheet entries. Admins can search users, list all users, view individual user timesheets, and export data.

## 🚀 Features

### User Functionality
- ✅ User registration with username, email, and password
- ✅ Secure login with JWT token authentication
- ✅ Create, update, and view daily timesheet entries
- ✅ Search timesheets by date range
- ✅ Export personal timesheets to CSV

### Admin Panel
- ✅ View and search all registered users (by username, email, or registration date)
- ✅ List all timesheets for all users
- ✅ View timesheets of a selected user
- ✅ Export user and timesheet data to CSV
- ✅ Role-based access control (admin vs user)
- ✅ User management capabilities

## 🛠️ Technologies Used

- **Angular** 18.1.0
- **TypeScript** 5.5.2
- **Bootstrap** 5.3.3 (UI framework)
- **ngx-toastr** 19.0.0 (notifications)
- **RxJS** 7.8.0 (reactive programming)
- **JWT Authentication** (token-based auth)
- **Angular Interceptors and Guards** (route protection)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.19.1 or higher recommended)
- **npm** (v6.11.0 or higher)
- **Angular CLI** (v18.1.0 or higher)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gokcendilek/Timesheet_frontend.git
   cd Timesheet_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update the base URL in the service files if your backend is running on a different port:
   - `src/app/auth.service.ts`
   - `src/app/timesheet.service.ts`
   - `src/app/admin.service.ts`
   
   Default backend URL: `http://localhost:8080`

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:4200`

## 🏗️ Build

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/timesheet-app` directory.

## 🧪 Testing

Run unit tests:

```bash
npm test
```

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin panel component
│   ├── login/              # Login component
│   ├── register/           # Registration component
│   ├── timesheet/          # Timesheet management component
│   ├── unauthorized/       # Unauthorized access component
│   ├── admin.service.ts    # Admin API service
│   ├── auth.service.ts     # Authentication service
│   ├── auth.guard.ts       # Route guard for authentication
│   ├── jwt.interceptor.ts  # JWT token interceptor
│   └── timesheet.service.ts # Timesheet API service
├── styles.css              # Global styles
└── index.html              # Main HTML file
```

## 🔐 Security

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (USER/ADMIN)
- Protected routes using Angular Guards
- HTTP Interceptor for automatic token injection

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Security Updates
- ✅ Fixed `qs` package vulnerability (CVE-2025-15284) via npm overrides
- All dependencies are regularly updated for security patches

## 📝 API Endpoints

The application communicates with a backend API. Ensure your backend is running and accessible.

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Timesheet
- `GET /api/timesheets` - Get all timesheets (with optional date filters)
- `POST /api/timesheets` - Create new timesheet entry
- `PUT /api/timesheets/{id}` - Update timesheet entry
- `GET /api/timesheets/export/csv` - Export timesheets to CSV

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users?username={username}` - Search users by username
- `GET /api/admin/users?email={email}` - Search users by email
- `GET /api/admin/users?registrationDate={date}` - Search users by registration date
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/timesheets` - Get all timesheets
- `GET /api/admin/timesheets?userId={id}` - Get timesheets by user ID
- `GET /api/admin/timesheets/export/csv` - Export all timesheets to CSV

## 🎨 UI Features

- Responsive design with Bootstrap
- Toast notifications for user feedback
- Form validation with error messages
- Loading states and error handling
- Clean and modern interface

## 🔄 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests

## 📄 License

This project is private and proprietary.

## 👤 Author

**gokcendilek**

## 🤝 Contributing

This is a private project. Contributions are not currently accepted.

## 📞 Support

For issues or questions, please contact the repository owner.

---

**Note:** Make sure your backend API is running and accessible before starting the frontend application.
