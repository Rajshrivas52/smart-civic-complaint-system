import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, LogIn, UserPlus, Home } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">CivicConnect</div>
        <div className="nav-links">
          <Link to="/"><Home size={18}/> Home</Link>
          <Link to="/login"><LogIn size={18}/> Login</Link>
          <Link to="/register"><UserPlus size={18}/> Register</Link>
          <Link to="/citizen/dashboard"><LayoutDashboard size={18}/> Citizen</Link>
          <Link to="/admin/dashboard"><LayoutDashboard size={18}/> Admin</Link>
          <Link to="/department/dashboard"><LayoutDashboard size={18}/> Dept</Link>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
