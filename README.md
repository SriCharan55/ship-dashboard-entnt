
# Ship Maintenance Dashboard

A comprehensive Ship Maintenance Management System built for ENTNT Technical Assignment. This React-based application provides a complete solution for managing ships, components, and maintenance jobs with role-based access control.

## 🚀 Live Demo

[View Live Application](https://your-deployment-url.vercel.app)

## 📋 Features

### Core Functionality
- **User Authentication**: Role-based access control (Admin, Inspector, Engineer)
- **Ships Management**: Create, read, update, and delete ships with detailed profiles
- **Components Management**: Manage ship components with installation and maintenance tracking
- **Maintenance Jobs**: Create and track maintenance jobs with priority and status management
- **Calendar View**: Visual calendar for scheduled maintenance jobs
- **Notifications**: Real-time in-app notification system
- **KPI Dashboard**: Key performance indicators with charts and metrics

### Technical Features
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Data Persistence**: All data stored in localStorage
- **Form Validation**: Comprehensive validation with user feedback
- **Professional UI**: Clean, modern interface using shadcn/ui components
- **State Management**: Context API for global state management
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🏗 Application Architecture

```
src/
├── components/
│   ├── Authentication/
│   │   └── LoginForm.tsx
│   ├── Dashboard/
│   │   ├── KPICards.tsx
│   │   └── Charts.tsx
│   ├── Ships/
│   │   ├── ShipList.tsx
│   │   ├── ShipDetail.tsx
│   │   └── ShipForm.tsx
│   ├── Components/
│   │   └── ComponentForm.tsx
│   ├── Jobs/
│   │   ├── JobList.tsx
│   │   ├── JobForm.tsx
│   │   └── JobCalendar.tsx
│   ├── Notifications/
│   │   └── NotificationCenter.tsx
│   └── Layout/
│       └── MainLayout.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── ShipsContext.tsx
│   ├── ComponentsContext.tsx
│   ├── JobsContext.tsx
│   └── NotificationContext.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── ShipsPage.tsx
│   ├── JobsPage.tsx
│   ├── CalendarPage.tsx
│   └── NotificationsPage.tsx
└── App.tsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ship-maintenance-dashboard.git
   cd ship-maintenance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 👥 Demo Credentials

The application includes three pre-configured user roles:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@entnt.in | admin123 | Full access to all features |
| Inspector | inspector@entnt.in | inspect123 | Read-only access |
| Engineer | engineer@entnt.in | engine123 | Can manage jobs and components |

## 🎯 Key Features Overview

### Dashboard
- **KPI Cards**: Total ships, overdue maintenance, jobs in progress, completed jobs
- **Charts**: Jobs by priority, status distribution, ship status overview
- **Responsive Design**: Optimized for all screen sizes

### Ships Management
- **Ship Profiles**: Detailed information including IMO number, flag, and status
- **Component Tracking**: View all components installed on each ship
- **Maintenance History**: Complete maintenance job history per ship
- **Search & Filter**: Quick search and filtering capabilities

### Maintenance Jobs
- **Job Creation**: Create jobs with priority, type, and scheduling
- **Status Tracking**: Track job progress from open to completion
- **Calendar View**: Visual calendar showing scheduled maintenance
- **Notifications**: Automatic notifications for job updates

### Role-Based Access
- **Admin**: Full system access including ship and component management
- **Inspector**: Read-only access to all data
- **Engineer**: Can create and manage maintenance jobs

## 📊 Data Structure

The application uses localStorage to persist data with the following structure:

```typescript
// Ships
interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
}

// Components
interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
}

// Jobs
interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Cleaning';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description?: string;
}
```

## 🔧 Technical Decisions

### Context API vs Redux
- **Choice**: Context API
- **Reason**: Sufficient for the application's complexity, avoiding unnecessary boilerplate

### shadcn/ui Components
- **Choice**: shadcn/ui over Material-UI
- **Reason**: Better TypeScript support, smaller bundle size, more customizable

### localStorage for Persistence
- **Choice**: localStorage
- **Reason**: Assignment requirement, no backend allowed

### Vite Build Tool
- **Choice**: Vite over Create React App
- **Reason**: Faster development server, better build performance

### TypeScript
- **Choice**: Full TypeScript implementation
- **Reason**: Better developer experience, type safety, fewer runtime errors

## 🐛 Known Issues & Limitations

1. **Data Persistence**: Data is stored in localStorage, so clearing browser data will reset the application
2. **Single User Session**: No multi-user support as there's no backend authentication
3. **No File Uploads**: Image/document uploads are not implemented
4. **Browser Compatibility**: Optimized for modern browsers (Chrome, Firefox, Safari, Edge)

## 🔮 Future Enhancements

- **Dark Mode**: Theme switching capability
- **Export Functionality**: PDF/Excel export for reports
- **Advanced Filtering**: More sophisticated search and filter options
- **Offline Support**: PWA capabilities for offline usage
- **Drag & Drop**: Calendar job scheduling with drag and drop

## 📝 Testing

The application has been tested on:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iOS Safari, Android Chrome)

## 🤝 Contributing

This is a technical assignment project. For any questions or clarifications, please contact the development team.

## 📄 License

This project is created for the ENTNT Technical Assignment and is not intended for commercial use.

---

**Built with ❤️ for ENTNT Technical Assignment**
