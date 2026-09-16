import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const CitizenLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/citizen/notifications')) return 'Notification Center';
    if (path.includes('/citizen/report')) return 'Report Civic Issue';
    if (path.includes('/citizen/my-complaints') || path.includes('/citizen/complaints')) return 'My Complaints';
    if (path.includes('/citizen/complaint-map')) return 'Civic Complaint Map';
    if (path.includes('/citizen/profile')) return 'Citizen Profile';
    if (path.includes('/citizen/help-support')) return 'Help & Support';
    return 'Citizen Dashboard';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="citizen-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="citizen-main">
        <TopHeader title={getPageTitle()} toggleSidebar={toggleSidebar} unreadNotifications={5} />
        
        <div className="citizen-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CitizenLayout;
