import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

const TopHeader = ({ title = 'Dashboard', toggleSidebar, unreadNotifications = 0 }) => {
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
        
        <button className="header-icon-btn">
          <Bell size={20} />
          {unreadNotifications > 0 && <span className="notification-badge"></span>}
        </button>
        
        <div className="header-user">
          <div className="user-avatar">
            RK
          </div>
          <div className="user-info hidden md:flex" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <span className="user-name">Raj Kumar</span>
            <span className="user-role">Citizen</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
