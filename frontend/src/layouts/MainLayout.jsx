import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Home, LogOut, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    const role = (user.role || '').toLowerCase();
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'department') return '/department/dashboard';
    return '/citizen/dashboard';
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo cursor-pointer" onClick={() => navigate('/')}>
          <ShieldAlert size={24} color="var(--primary)" />
          <span>CivicConnect</span>
        </div>
        <div className="nav-links">
          <Link to="/"><Home size={18}/> Home</Link>
          
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                <LogIn size={16}/> Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                <UserPlus size={16}/> Register
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <Link to={getDashboardPath()} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                <LayoutDashboard size={16}/> My Dashboard
              </Link>
              <span className="badge badge-info" style={{ textTransform: 'capitalize', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                👤 {user.name || user.email} ({user.role || 'user'})
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                title="Log Out"
              >
                <LogOut size={15}/> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
