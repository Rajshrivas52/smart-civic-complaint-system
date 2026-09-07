import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  MapPin, 
  Users, 
  Building2, 
  Bell, 
  Settings, 
  CircleHelp, 
  LogOut,
  ShieldAlert
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/complaints', icon: FileText, label: 'All Complaints' },
    { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/admin/complaint-map', icon: MapPin, label: 'Complaint Map' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 35 }}
          onClick={toggleSidebar}
        />
      )}

      <aside className={`citizen-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="citizen-sidebar-header">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <ShieldAlert size={22} color="var(--primary)" />
            </div>
            <span>Smart Civic</span>
          </div>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginTop: '0.3rem' }}>
            Admin Control Center
          </span>
        </div>
        
        <nav className="citizen-sidebar-nav" style={{ overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => { if (isOpen) toggleSidebar(); }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        
        <div className="sidebar-bottom">
          <NavLink 
            to="/admin/help-support" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => { if (isOpen) toggleSidebar(); }}
          >
            <CircleHelp size={18} />
            <span>Help & Support</span>
          </NavLink>
          <NavLink to="/login" className="sidebar-link" style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
