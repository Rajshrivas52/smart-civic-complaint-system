import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Context & Route Protection
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
import CitizenNotifications from './pages/citizen/CitizenNotifications';
import CitizenProfile from './pages/citizen/CitizenProfile';

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
import RoadMaintenanceDashboard from './pages/department/RoadMaintenanceDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main/Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Department Routes wrapped with ProtectedRoute */}
            <Route 
              path="department/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['department']}>
                  <RoadMaintenanceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="department/road-maintenance/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['department']}>
                  <RoadMaintenanceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="department/complaints" 
              element={
                <ProtectedRoute allowedRoles={['department']}>
                  <AssignedComplaints />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Citizen Routes wrapped in CitizenLayout & ProtectedRoute */}
          <Route 
            path="/citizen" 
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="report" element={<ReportComplaint />} />
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            <Route path="notifications" element={<CitizenNotifications />} />
            <Route path="complaint-map" element={<ComplaintMap />} />
            <Route path="profile" element={<CitizenProfile />} />
            <Route path="profile/:tab" element={<CitizenProfile />} />
            <Route path="help-support" element={<HelpSupport />} />
          </Route>

          {/* Admin Routes wrapped in AdminLayout & ProtectedRoute */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
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
    </AuthProvider>
  );
}

export default App;
