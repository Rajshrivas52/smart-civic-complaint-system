import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { getAuthUser } from '../services/api';

const TopHeader = ({ title = 'Dashboard', toggleSidebar, unreadNotifications = 5 }) => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const displayName = user?.name || 'Raj Shrivas';
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Citizen';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
        
        <div className="header-user" onClick={() => navigate('/citizen/profile')} title="My Profile" style={{ cursor: 'pointer' }}>
          <div className="user-avatar">
            {initials}
          </div>
          <div className="user-info hidden md:flex" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <span className="user-name">{displayName}</span>
            <span className="user-role">{displayRole}</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
