# 🎯 Admin Portal - Complete & Professional

## Overview

A comprehensive admin portal with full CRUD operations for users and bookings management. All endpoints are properly integrated and working with the backend API.

## ✨ Features

### 📊 Dashboard
- Real-time statistics overview (Users, Bookings, Documents)
- Recent activity feed showing latest bookings and users
- Beautiful stat cards with color-coded icons
- Responsive grid layout

### 👥 User Management
- **View all users** in a responsive table with pagination support
- **Create new users** with modal form
- **Edit existing users** (update any field including password)
- **Toggle license status** (Activate/Deactivate with visual feedback)
- **Delete users** with confirmation prompt
- **Statistics**: Total, Active, and Inactive users
- **Full user details**: ID, Username, Email, Full Name, Phone, License Type

### 📅 Bookings Management
- **View all bookings** with complete information
- **Filter by status**: All, Pending, Confirmed, Rejected, Completed
- **Status-based actions**:
  - **Pending**: Confirm or Reject
  - **Confirmed**: Complete or Reject
  - **Rejected**: Re-confirm
  - **Completed**: View only (read-only)
- **Create new bookings** with full form
- **Edit existing bookings** (update any field)
- **Delete bookings** with confirmation
- **Admin response support** for all status changes
- **Pending notification badge** showing count
- **Statistics**: Total, Pending, Confirmed, Rejected, Completed
- **Full booking details**: ID, Name, Email, Phone, Date, Time, Status, Admin Response

### 🗓️ Calendar
- **Today's events** highlighted section
- **Upcoming events** for the next 7 days
- Color-coded event cards by status
- Event details with date, time, and location
- Fallback to bookings data if calendar API unavailable

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Steps

1. **Extract the ZIP file**
   ```bash
   unzip admin-portal.zip
   cd admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the portal**
   - Open your browser and navigate to: **http://localhost:3001**
   - Default PIN: **1234**

## 🔐 Login

**Default PIN Code:** `1234`

You can change the PIN in `src/pages/Login.jsx`:
```javascript
const ADMIN_PIN = '1234';  // Change this to your desired PIN
```

## 🔌 API Integration

### Base URL Configuration
The API base URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api/admin';
```

### Available Endpoints

#### Users
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/license` - Toggle license status

#### Bookings
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/bookings/pending` - Get pending bookings
- `POST /api/admin/bookings` - Create new booking
- `PUT /api/admin/bookings/:id` - Update booking
- `DELETE /api/admin/bookings/:id` - Delete booking
- `PATCH /api/admin/bookings/:id/confirm` - Confirm/Reject/Complete booking

#### Dashboard
- `GET /api/admin/dashboard/stats` - Get statistics
- `GET /api/admin/dashboard/recent` - Get recent activity

#### Calendar
- `GET /api/admin/calendar/upcoming` - Get upcoming events
- `GET /api/admin/calendar/today` - Get today's events

## 📁 Project Structure

```
admin-portal/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.jsx           # Main layout with sidebar navigation
│   ├── pages/
│   │   ├── Dashboard.jsx        # Dashboard with stats and activity
│   │   ├── Users.jsx            # User management (CRUD)
│   │   ├── Bookings.jsx         # Booking management (CRUD)
│   │   ├── Calendar.jsx         # Calendar view
│   │   └── Login.jsx            # Authentication page
│   ├── services/
│   │   └── api.js               # API service with all endpoints
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎨 UI/UX Features

### Design
- **Modern gradient sidebar** with smooth transitions
- **Active route highlighting** for easy navigation
- **Responsive tables** with horizontal scroll on mobile
- **Modal forms** for create/edit operations
- **Status badges** with color coding
- **Icon-based actions** for better UX
- **Loading states** for async operations
- **Error handling** with user-friendly messages
- **Confirmation dialogs** for destructive actions

### Color Coding
- **Blue**: Dashboard, Completed
- **Green**: Active, Confirmed
- **Yellow**: Pending
- **Red**: Inactive, Rejected
- **Purple**: Documents

### Animations
- Smooth hover effects
- Transition animations
- Loading spinners
- Fade-in effects

## 🔧 Configuration

### Change API Base URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-api-url.com/api/admin';
```

### Change Default PIN
Edit `src/pages/Login.jsx`:
```javascript
const ADMIN_PIN = 'your-new-pin';
```

### Change Port
Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001  // Change to your desired port
  }
})
```

## 📱 Responsive Design

The portal is fully responsive and works seamlessly on:
- **Desktop** (1920px and above)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

Features:
- Mobile-friendly sidebar (hamburger menu)
- Responsive tables with horizontal scroll
- Stack layout on small screens
- Touch-friendly buttons and controls

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 Usage Guide

### Users Management

1. **View Users**: Navigate to Users page to see all users
2. **Create User**: Click "Create User" button, fill the form, submit
3. **Edit User**: Click edit icon (pencil) in Actions column
4. **Toggle License**: Click power icon to activate/deactivate
5. **Delete User**: Click trash icon, confirm deletion

### Bookings Management

1. **View Bookings**: Navigate to Bookings page
2. **Filter**: Use status dropdown to filter bookings
3. **Create Booking**: Click "Create Booking" button
4. **Status Actions**:
   - **Pending**: Confirm (✓) or Reject (✗)
   - **Confirmed**: Complete (✓✓) or Reject (✗)
   - **Rejected**: Re-confirm (✓)
5. **Edit Booking**: Click edit icon (pencil)
6. **Delete Booking**: Click trash icon, confirm deletion
7. **Admin Response**: Add notes when changing status

## 🚨 Error Handling

The portal includes comprehensive error handling:
- API connection errors
- Validation errors
- Authentication errors
- Network timeouts
- User-friendly error messages
- Automatic retry suggestions

## 🔒 Security Features

- Session-based authentication
- Protected routes (auto-redirect to login)
- Confirmation dialogs for destructive actions
- Input validation
- XSS protection
- CSRF protection ready

## 🎯 Key Features

### Toggle Actions
All toggle-based actions (license activation, status changes) provide:
- Visual feedback (icon changes)
- Confirmation prompts
- Success/error notifications
- Immediate UI updates

### Modal Forms
All create/edit forms are in modals with:
- Form validation
- Required field indicators
- Error messages
- Cancel option
- Loading states

### Action Buttons
Smart action buttons that:
- Show only relevant actions based on status
- Provide tooltips for clarity
- Change color based on action type
- Include icons for quick recognition

## 📊 Data Flow

```
User Action → Component → API Service → Backend
                ↓              ↓
            UI Update ← Response
```

## 🐛 Troubleshooting

### API Connection Issues
1. Ensure backend is running on `http://localhost:8000`
2. Check CORS settings on backend
3. Verify endpoint paths match backend routes

### Login Issues
1. Verify PIN is correct (default: 1234)
2. Check browser console for errors
3. Clear browser cache and try again

### Data Not Loading
1. Check network tab in browser DevTools
2. Verify API responses
3. Check backend logs for errors

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Check network requests in DevTools
4. Review error messages carefully

## 🎉 Features Checklist

✅ Dashboard with real-time stats
✅ User CRUD operations
✅ Booking CRUD operations
✅ License toggle functionality
✅ Status management (Confirm/Reject/Complete)
✅ Status filtering
✅ Admin response support
✅ Calendar view
✅ Responsive design
✅ Error handling
✅ Loading states
✅ Confirmation dialogs
✅ Modal forms
✅ Protected routes
✅ Beautiful UI/UX
✅ Icon-based actions
✅ Color-coded badges
✅ Mobile-friendly sidebar

## 🚀 Ready to Use!

1. Extract ZIP
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3001
5. Login with PIN: 1234
6. Start managing!

**Professional, feature-rich, and production-ready!** 🎯
