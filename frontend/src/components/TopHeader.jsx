import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

const TopHeader = ({ title = 'Dashboard', toggleSidebar, unreadNotifications = 5 }) => {
  const navigate = useNavigate();

  return (
    <header className="citizen-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="header-title">{title}</h2>
      </div>
      
      <div className="header-right">
        <div className="header-search">
          <Search size={18} />
          <input type="text" placeholder="Search complaints..." />
        </div>
        
        <button 
          className="header-icon-btn" 
          onClick={() => navigate('/citizen/notifications')}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadNotifications > 0 && <span className="notification-badge"></span>}
        </button>
        
        <div className="header-user" onClick={() => navigate('/citizen/profile')} title="My Profile">
          <div className="user-avatar">
            RS
          </div>
          <div className="user-info hidden md:flex" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <span className="user-name">Raj Shrivas</span>
            <span className="user-role">Citizen</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
