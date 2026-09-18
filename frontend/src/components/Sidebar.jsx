import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, List, Bell, User, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 35 }}
          onClick={toggleSidebar}
        />
      )}

      <aside className={`citizen-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="citizen-sidebar-header">
          <div className="logo">
            <LayoutDashboard size={24} />
            Smart Civic
          </div>
        </div>
        
        <nav className="citizen-sidebar-nav">
          <NavLink to="/citizen/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          
          <NavLink to="/citizen/report" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            Report Complaint
          </NavLink>
          
          <NavLink to="/citizen/complaints" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <List size={20} />
            My Complaints
          </NavLink>
          
          <NavLink to="/citizen/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            Notifications
          </NavLink>
          
          <NavLink to="/citizen/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={20} />
            Profile
          </NavLink>
        </nav>
        
        <div className="sidebar-bottom">
          <NavLink to="#" className="sidebar-link">
            <Settings size={20} />
            Settings
          </NavLink>
          <NavLink 
            to="/login" 
            className="sidebar-link" 
            style={{ color: 'var(--danger)' }}
            onClick={() => {
              localStorage.removeItem('civic_token');
              localStorage.removeItem('civic_user');
            }}
          >
            <LogOut size={20} />
            Logout
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
