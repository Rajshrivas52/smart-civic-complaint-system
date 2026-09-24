import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, ClipboardList, MapPin, Bell, User, HelpCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    if (isOpen && toggleSidebar) toggleSidebar();
  };

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
            Report Issue
          </NavLink>
          
          <NavLink to="/citizen/my-complaints" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ClipboardList size={20} />
            My Complaints
          </NavLink>
          
          <NavLink to="/citizen/complaint-map" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <MapPin size={20} />
            Complaint Map
          </NavLink>
          
          <NavLink to="/citizen/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            Notifications
          </NavLink>
          
          <NavLink to="/citizen/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={20} />
            Profile
          </NavLink>
          
          <NavLink to="/citizen/help-support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <HelpCircle size={20} />
            Help & Support
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
            onClick={handleLogout}
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
