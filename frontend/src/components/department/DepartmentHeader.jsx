import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Wrench, 
  Bell, 
  Calendar, 
  User, 
  ChevronDown, 
  ShieldAlert, 
  CheckCircle2, 
  Search,
  Menu,
  HardHat
} from 'lucide-react';
import DepartmentSelector from './DepartmentSelector';
import './DepartmentHeader.css';

const DepartmentHeader = ({ 
  department, 
  onSelectDepartment, 
  unreadCount = 3,
  toggleSidebar 
}) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Format today's date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="dept-header-container">
      {/* Top Header Row */}
      <div className="dept-top-bar">
        <div className="dept-header-left">
          {toggleSidebar && (
            <button className="dept-menu-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
              <Menu size={22} />
            </button>
          )}

          <div className="dept-badge-title">
            <div className="dept-icon-avatar" style={{ backgroundColor: department.color || '#4f46e5' }}>
              <HardHat size={22} color="#ffffff" />
            </div>
            <div>
              <span className="dept-code-tag">{department.code || 'DEPT'}</span>
              <h2 className="dept-header-name">{department.name}</h2>
            </div>
          </div>
        </div>

        <div className="dept-header-right">
          {/* Department Selector Dropdown */}
          <div className="header-dept-selector-wrap">
            <DepartmentSelector 
              selectedDeptId={department.id} 
              onSelectDepartment={onSelectDepartment} 
            />
          </div>

          {/* Date Display */}
          <div className="header-date-badge hidden-mobile">
            <Calendar size={15} />
            <span>{currentDate}</span>
          </div>

          {/* Notification Icon */}
          <div className="header-popover-wrapper">
            <button 
              className="dept-icon-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Department Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="dept-notif-dot">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="dept-popover-dropdown">
                <div className="popover-header">
                  <h4>Department Alerts</h4>
                  <span className="badge badge-primary">{unreadCount} New</span>
                </div>
                <div className="popover-body">
                  <div className="popover-item unread">
                    <ShieldAlert size={16} className="text-danger" />
                    <div>
                      <p className="popover-text">Critical complaint CIV-2026-00129 assigned to your team.</p>
                      <span className="popover-time">10 mins ago</span>
                    </div>
                  </div>
                  <div className="popover-item unread">
                    <CheckCircle2 size={16} className="text-success" />
                    <div>
                      <p className="popover-text">Resurfacing work at Naya Bazar verified & closed.</p>
                      <span className="popover-time">1 hour ago</span>
                    </div>
                  </div>
                </div>
                <div className="popover-footer">
                  <button onClick={() => setShowNotifications(false)}>Mark all as read</button>
                </div>
              </div>
            )}
          </div>

          {/* Logged in Staff Profile Placeholder */}
          <div className="header-popover-wrapper">
            <div 
              className="dept-staff-profile" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="staff-avatar">
                {department.staffName ? department.staffName.split(' ').map(n=>n[0]).join('') : 'SS'}
              </div>
              <div className="staff-info hidden-mobile">
                <span className="staff-name">{department.staffName || 'Eng. Suresh Sharma'}</span>
                <span className="staff-role">{department.staffRole || 'Senior Road Officer'}</span>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </div>

            {showProfileMenu && (
              <div className="dept-popover-dropdown profile-dropdown">
                <div className="profile-dropdown-header">
                  <p className="font-bold">{department.staffName}</p>
                  <p className="text-muted-sm">{department.name}</p>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <User size={15} /> Staff Profile Settings
                </button>
                <button className="dropdown-menu-item text-danger" onClick={() => { setShowProfileMenu(false); logoutUser(); navigate('/login'); }}>
                  Log out of Department
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title & Subtitle Banner Row */}
      <div className="dept-hero-banner">
        <div>
          <h1 className="dept-page-title">{department.shortName || 'Road Maintenance'} Dashboard</h1>
          <p className="dept-page-subtitle">{department.description || 'Manage and resolve road-related complaints assigned to your department.'}</p>
        </div>
      </div>
    </header>
  );
};

export default DepartmentHeader;
