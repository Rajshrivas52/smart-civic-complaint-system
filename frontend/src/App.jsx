import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import CitizenLayout from './layouts/CitizenLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportComplaint from './pages/citizen/ReportComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetails from './pages/citizen/ComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllComplaints from './pages/admin/AllComplaints';
import Analytics from './pages/admin/Analytics';
import ComplaintMap from './pages/admin/ComplaintMap';
import Users from './pages/admin/Users';
import Departments from './pages/admin/Departments';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';
import HelpSupport from './pages/admin/HelpSupport';

// Department Pages
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import AssignedComplaints from './pages/department/AssignedComplaints';

// Placeholders for missing routes
const NotificationsPlaceholder = () => <div className="card" style={{ padding: '2rem' }}><h2>Citizen Notifications</h2><p style={{ color: 'var(--text-muted)' }}>No unread notifications.</p></div>;
const ProfilePlaceholder = () => <div className="card" style={{ padding: '2rem' }}><h2>Citizen Profile</h2><p style={{ color: 'var(--text-muted)' }}>Account settings and profile info.</p></div>;

const AdminMapPlaceholder = () => <div className="card" style={{ padding: '2rem' }}><h2>GIS Interactive Complaint Map</h2><p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Leaflet + OpenStreetMap integration module interface.</p></div>;
const AdminNotificationsPlaceholder = () => <div className="card" style={{ padding: '2rem' }}><h2>Admin Notifications Center</h2><p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>System notifications and department escalation logs.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Main/Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Department Routes */}
          <Route path="department/dashboard" element={<DepartmentDashboard />} />
          <Route path="department/complaints" element={<AssignedComplaints />} />
        </Route>

        {/* Citizen Routes wrapped in CitizenLayout */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="report" element={<ReportComplaint />} />
          <Route path="my-complaints" element={<MyComplaints />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
          <Route path="notifications" element={<NotificationsPlaceholder />} />
          <Route path="profile" element={<ProfilePlaceholder />} />
        </Route>

        {/* Admin Routes wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AllComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="map" element={<ComplaintMap />} />
          <Route path="complaint-map" element={<ComplaintMap />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help-support" element={<HelpSupport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
