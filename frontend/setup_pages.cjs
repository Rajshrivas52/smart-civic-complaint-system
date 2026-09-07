const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

const dirs = [
  'components',
  'pages',
  'layouts',
  'services',
  'hooks',
  'utils',
  'charts',
  'assets',
  'pages/public',
  'pages/citizen',
  'pages/admin',
  'pages/department'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(srcPath, dir), { recursive: true });
});

const pageTemplate = (name) => `import React from 'react';

const ${name} = () => {
  return (
    <div className="page-container">
      <h1>${name}</h1>
      <p>This is a placeholder page for ${name}.</p>
    </div>
  );
};

export default ${name};
`;

const pages = {
  'public/Landing.jsx': 'Landing',
  'public/Login.jsx': 'Login',
  'public/Register.jsx': 'Register',
  'citizen/CitizenDashboard.jsx': 'CitizenDashboard',
  'citizen/ReportComplaint.jsx': 'ReportComplaint',
  'citizen/MyComplaints.jsx': 'MyComplaints',
  'citizen/ComplaintDetails.jsx': 'ComplaintDetails',
  'admin/AdminDashboard.jsx': 'AdminDashboard',
  'admin/AllComplaints.jsx': 'AllComplaints',
  'admin/Analytics.jsx': 'Analytics',
  'admin/Users.jsx': 'Users',
  'admin/Departments.jsx': 'Departments',
  'department/DepartmentDashboard.jsx': 'DepartmentDashboard',
  'department/AssignedComplaints.jsx': 'AssignedComplaints'
};

Object.entries(pages).forEach(([file, name]) => {
  fs.writeFileSync(path.join(srcPath, 'pages', file), pageTemplate(name));
});

const mainLayout = `import React from 'react';
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
`;

fs.writeFileSync(path.join(srcPath, 'layouts', 'MainLayout.jsx'), mainLayout);

console.log('Folders and placeholder files generated.');
