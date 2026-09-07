import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const CitizenLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="citizen-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="citizen-main">
        <TopHeader title="Citizen Dashboard" toggleSidebar={toggleSidebar} unreadNotifications={2} />
        
        <div className="citizen-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CitizenLayout;
