import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="citizen-layout">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="citizen-main">
        <AdminNavbar title="Admin Dashboard" toggleSidebar={toggleSidebar} unreadNotifications={3} />
        
        <div className="citizen-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
