import React from 'react';
import { Menu, Search, Bell, ChevronDown, Shield } from 'lucide-react';
import { getAuthUser } from '../services/api';

const AdminNavbar = ({ title = 'Admin Dashboard', toggleSidebar, unreadNotifications = 3 }) => {
  const user = getAuthUser();
  const displayName = user?.name || 'System Admin';
  const displayRole = user?.role === 'admin' ? 'Municipal Overseer' : (user?.role || 'Admin');
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
        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle Navigation Menu">
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 className="header-title">{title}</h2>
          <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
            <Shield size={10} style={{ marginRight: '0.2rem' }} /> Municipal Command
          </span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-search">
          <Search size={16} />
          <input type="text" placeholder="Search complaints, citizens, departments..." />
        </div>
        
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={20} />
          {unreadNotifications > 0 && <span className="notification-badge"></span>}
        </button>
        
        <div className="header-user">
          <div className="user-avatar" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}>
            {initials}
          </div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{displayRole}</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
