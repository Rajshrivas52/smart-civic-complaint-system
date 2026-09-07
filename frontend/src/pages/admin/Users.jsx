import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users as UsersIcon, 
  User, 
  UserCheck, 
  UserX, 
  Shield, 
  Building2, 
  Plus, 
  Search, 
  X, 
  RotateCcw, 
  Eye, 
  Edit3, 
  MoreVertical, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Check, 
  Activity,
  AlertTriangle
} from 'lucide-react';

import './Users.css';

import { 
  initialUsers, 
  USER_ROLES, 
  USER_STATUSES, 
  USER_DEPARTMENTS, 
  USER_AREAS, 
  REGISTRATION_PERIODS 
} from '../../utils/mockUserData';

// Avatar background color palette based on user name
const AVATAR_COLORS = [
  { bg: '#e0e7ff', text: '#4338ca' },
  { bg: '#dbeafe', text: '#1e40af' },
  { bg: '#dcfce7', text: '#15803d' },
  { bg: '#fef3c7', text: '#b45309' },
  { bg: '#fae8ff', text: '#86198f' },
  { bg: '#ffe4e6', text: '#be123c' },
  { bg: '#ccfbf1', text: '#0f766e' }
];

const getAvatarColor = (name = '') => {
  const charCode = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Reusable Role Badge
export const RoleBadge = ({ role }) => {
  if (role === 'Admin') {
    return (
      <span className="user-role-badge role-admin">
        <Shield size={12} />
        <span>Admin</span>
      </span>
    );
  }
  if (role === 'Department Staff') {
    return (
      <span className="user-role-badge role-staff">
        <Building2 size={12} />
        <span>Staff</span>
      </span>
    );
  }
  return (
    <span className="user-role-badge role-citizen">
      <User size={12} />
      <span>Citizen</span>
    </span>
  );
};

// Reusable Status Badge
export const StatusBadge = ({ status }) => {
  if (status === 'Active') {
    return (
      <span className="user-status-badge status-active">
        <span className="status-dot-active" />
        <span>Active</span>
      </span>
    );
  }
  if (status === 'Suspended') {
    return (
      <span className="user-status-badge status-suspended">
        <AlertTriangle size={11} />
        <span>Suspended</span>
      </span>
    );
  }
  return (
    <span className="user-status-badge status-inactive">
      <span className="status-dot-inactive" />
      <span>Inactive</span>
    </span>
  );
};

const Users = () => {
  const navigate = useNavigate();

  // Primary state: Mock users list
  const [users, setUsers] = useState(initialUsers);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [regPeriodFilter, setRegPeriodFilter] = useState('All');

  // Sorting state
  const [sortField, setSortField] = useState('registeredDate');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Active Dropdown state for "More Actions"
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modals state
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [confirmStatusUser, setConfirmStatusUser] = useState(null); // { user, targetStatus }

  // New User Form state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Citizen',
    department: '',
    area: 'Thatipur',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute KPI summary cards dynamically from `users`
  const kpis = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'Active').length;
    const citizens = users.filter(u => u.role === 'Citizen').length;
    const staff = users.filter(u => u.role === 'Department Staff').length;
    const admins = users.filter(u => u.role === 'Admin').length;
    const inactive = users.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length;

    return { total, active, citizens, staff, admins, inactive };
  }, [users]);

  // Filter users based on query and dropdown filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search Query (name, email, phone, id, area, department)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = user.name.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        const matchPhone = user.phone.toLowerCase().includes(q);
        const matchId = user.id.toLowerCase().includes(q);
        const matchArea = user.area.toLowerCase().includes(q);
        const matchDept = user.department ? user.department.toLowerCase().includes(q) : false;

        if (!matchName && !matchEmail && !matchPhone && !matchId && !matchArea && !matchDept) {
          return false;
        }
      }

      // 2. Role Filter
      if (roleFilter !== 'All' && user.role !== roleFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter !== 'All' && user.status !== statusFilter) {
        return false;
      }

      // 4. Department Filter
      if (departmentFilter !== 'All') {
        if (!user.department || user.department !== departmentFilter) {
          return false;
        }
      }

      // 5. Area Filter
      if (areaFilter !== 'All' && user.area !== areaFilter) {
        return false;
      }

      // 6. Registration Period Filter
      if (regPeriodFilter !== 'All') {
        const regDate = new Date(user.registeredDate);
        const now = new Date('2026-09-06T23:59:59Z');
        const oneDay = 24 * 60 * 60 * 1000;

        if (regPeriodFilter === 'Today') {
          if (user.registeredDate !== '2026-09-06' && Math.abs(now.getTime() - regDate.getTime()) > oneDay) {
            return false;
          }
        } else if (regPeriodFilter === 'Last 7 Days') {
          if (now.getTime() - regDate.getTime() > 7 * oneDay) {
            return false;
          }
        } else if (regPeriodFilter === 'Last 30 Days') {
          if (now.getTime() - regDate.getTime() > 30 * oneDay) {
            return false;
          }
        } else if (regPeriodFilter === 'Last 6 Months') {
          if (now.getTime() - regDate.getTime() > 180 * oneDay) {
            return false;
          }
        } else if (regPeriodFilter === 'This Year') {
          if (regDate.getFullYear() !== 2026) {
            return false;
          }
        }
      }

      return true;
    });
  }, [users, searchQuery, roleFilter, statusFilter, departmentFilter, areaFilter, regPeriodFilter]);

  // Sort filtered users
  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];

    list.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'registeredDate') {
        comparison = new Date(a.registeredDate).getTime() - new Date(b.registeredDate).getTime();
      } else if (sortField === 'complaintCount') {
        comparison = a.complaintCount - b.complaintCount;
      } else if (sortField === 'lastActive') {
        comparison = (a.lastActiveTimestamp || '').localeCompare(b.lastActiveTimestamp || '');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [filteredUsers, sortField, sortDirection]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, departmentFilter, areaFilter, regPeriodFilter, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage, itemsPerPage]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    roleFilter !== 'All' ||
    statusFilter !== 'All' ||
    departmentFilter !== 'All' ||
    areaFilter !== 'All' ||
    regPeriodFilter !== 'All'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('All');
    setStatusFilter('All');
    setDepartmentFilter('All');
    setAreaFilter('All');
    setRegPeriodFilter('All');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle user activation / deactivation confirmation
  const handleRequestStatusChange = (user) => {
    setActiveMenuId(null);
    const targetStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setConfirmStatusUser({ user, targetStatus });
  };

  const handleConfirmStatusChange = () => {
    if (!confirmStatusUser) return;
    const { user, targetStatus } = confirmStatusUser;

    setUsers(prev => prev.map(u => {
      if (u.id === user.id) {
        const newActivity = [
          {
            id: `act-${Date.now()}`,
            time: 'Just now',
            desc: `Account status changed to ${targetStatus} by Administrator`
          },
          ...(u.activity || [])
        ];
        return { ...u, status: targetStatus, activity: newActivity };
      }
      return u;
    }));

    setConfirmStatusUser(null);
  };

  // Edit User Handler
  const handleOpenEdit = (user) => {
    setActiveMenuId(null);
    setEditingUser({ ...user });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers(prev => prev.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editingUser.name.trim(),
          email: editingUser.email.trim(),
          phone: editingUser.phone.trim(),
          role: editingUser.role,
          department: editingUser.role === 'Department Staff' ? editingUser.department : null,
          area: editingUser.area,
          status: editingUser.status
        };
      }
      return u;
    }));

    setEditingUser(null);
  };

  // Add User Form Validation & Submission
  const validateNewUser = () => {
    const errors = {};
    if (!newUserForm.name.trim()) errors.name = 'Full name is required';
    if (!newUserForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newUserForm.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!newUserForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (newUserForm.role === 'Department Staff' && !newUserForm.department) {
      errors.department = 'Please select a department for staff';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!validateNewUser()) return;

    const nextIdNum = 1000 + users.length + 1;
    const newUser = {
      id: `USR-${nextIdNum}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      phone: newUserForm.phone.trim(),
      role: newUserForm.role,
      department: newUserForm.role === 'Department Staff' ? newUserForm.department : null,
      area: newUserForm.area,
      status: newUserForm.status,
      complaintCount: 0,
      resolvedComplaints: 0,
      registeredDate: '2026-09-06',
      lastActive: 'Just now',
      lastActiveTimestamp: new Date().toISOString(),
      avatar: null,
      activity: [
        {
          id: `act-${Date.now()}`,
          time: 'Just now',
          desc: 'Account created by Administrator'
        }
      ]
    };

    setUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'Citizen',
      department: '',
      area: 'Thatipur',
      status: 'Active'
    });
    setFormErrors({});
  };

  // View Complaints navigation handler
  const handleViewComplaints = (user) => {
    setActiveMenuId(null);
    setViewingUser(null);
    navigate('/admin/complaints');
  };

  return (
    <div className="users-page-container">
      
      {/* 1. PAGE HEADER */}
      <header className="users-header-card">
        <div className="users-title-block">
          <h1 className="users-page-title">
            <UsersIcon size={24} className="users-title-icon" />
            <span>User Management</span>
          </h1>
          <p className="users-page-subtitle">
            Manage citizens, department staff, and administrator accounts across municipal sectors.
          </p>
        </div>

        <button 
          type="button" 
          className="users-add-btn"
          onClick={() => setIsAddUserOpen(true)}
          aria-label="Add new user"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </header>

      {/* 2. KPI SUMMARY CARDS */}
      <section className="users-kpi-grid" aria-label="User Statistics Summary">
        {/* Total Users */}
        <div className="user-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Total Users</span>
            <span className="kpi-value">{kpis.total.toLocaleString()}</span>
          </div>
          <div className="kpi-icon-wrap kpi-total">
            <UsersIcon size={18} />
          </div>
        </div>

        {/* Active Users */}
        <div className="user-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Active Users</span>
            <span className="kpi-value" style={{ color: 'var(--success)' }}>
              {kpis.active.toLocaleString()}
            </span>
          </div>
          <div className="kpi-icon-wrap kpi-active">
            <UserCheck size={18} />
          </div>
        </div>

        {/* Citizens */}
        <div className="user-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Citizens</span>
            <span className="kpi-value">{kpis.citizens.toLocaleString()}</span>
          </div>
          <div className="kpi-icon-wrap kpi-citizen">
            <User size={18} />
          </div>
        </div>

        {/* Department Staff */}
        <div className="user-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Department Staff</span>
            <span className="kpi-value" style={{ color: '#2563eb' }}>
              {kpis.staff.toLocaleString()}
            </span>
          </div>
          <div className="kpi-icon-wrap kpi-staff">
            <Building2 size={18} />
          </div>
        </div>

        {/* Administrators */}
        <div className="user-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Administrators</span>
            <span className="kpi-value" style={{ color: 'var(--primary)' }}>
              {kpis.admins.toLocaleString()}
            </span>
          </div>
          <div className="kpi-icon-wrap kpi-admin">
            <Shield size={18} />
          </div>
        </div>

        {/* Inactive Users */}
        <div className="user-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Inactive Users</span>
            <span className="kpi-value" style={{ color: 'var(--text-muted)' }}>
              {kpis.inactive.toLocaleString()}
            </span>
          </div>
          <div className="kpi-icon-wrap kpi-inactive">
            <UserX size={18} />
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <section className="users-filter-card" aria-label="User Filter Controls">
        {/* Top Search Input */}
        <div className="users-search-row">
          <div className="users-search-wrapper">
            <Search size={16} className="users-search-icon" />
            <input 
              type="text"
              className="users-search-input"
              placeholder="Search users by name, email, phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search users"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="users-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="users-filters-grid">
          {/* Role Filter */}
          <div className="users-control-group">
            <label htmlFor="user-filter-role" className="users-control-label">Role</label>
            <select
              id="user-filter-role"
              className={`users-select ${roleFilter !== 'All' ? 'active-filter' : ''}`}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {USER_ROLES.map(r => (
                <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="users-control-group">
            <label htmlFor="user-filter-status" className="users-control-label">Status</label>
            <select
              id="user-filter-status"
              className={`users-select ${statusFilter !== 'All' ? 'active-filter' : ''}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {USER_STATUSES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="users-control-group">
            <label htmlFor="user-filter-dept" className="users-control-label">Department</label>
            <select
              id="user-filter-dept"
              className={`users-select ${departmentFilter !== 'All' ? 'active-filter' : ''}`}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {USER_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="users-control-group">
            <label htmlFor="user-filter-area" className="users-control-label">Area</label>
            <select
              id="user-filter-area"
              className={`users-select ${areaFilter !== 'All' ? 'active-filter' : ''}`}
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              {USER_AREAS.map(a => (
                <option key={a} value={a}>{a === 'All' ? 'All Areas' : a}</option>
              ))}
            </select>
          </div>

          {/* Registration Period */}
          <div className="users-control-group">
            <label htmlFor="user-filter-reg" className="users-control-label">Registered</label>
            <select
              id="user-filter-reg"
              className={`users-select ${regPeriodFilter !== 'All' ? 'active-filter' : ''}`}
              value={regPeriodFilter}
              onChange={(e) => setRegPeriodFilter(e.target.value)}
            >
              {REGISTRATION_PERIODS.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Dates' : p}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button 
            type="button" 
            className="users-reset-btn"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title="Reset search and filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* 4. USERS TABLE CARD */}
      <section className="users-table-card" aria-label="Registered Users Directory">
        
        {/* Table Toolbar / Count Header */}
        <div className="users-table-header-row">
          <div className="users-count-badge">
            <span>Showing</span>
            <strong>{filteredUsers.length}</strong>
            <span>of {users.length} registered accounts</span>
          </div>

          {/* Quick Sort Selector */}
          <div className="users-quick-sort">
            <label htmlFor="quick-sort-select" className="quick-sort-label">Sort by:</label>
            <select
              id="quick-sort-select"
              className="quick-sort-select"
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split('-');
                setSortField(f);
                setSortDirection(d);
              }}
            >
              <option value="registeredDate-desc">Newest First</option>
              <option value="registeredDate-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="complaintCount-desc">Most Complaints</option>
              <option value="complaintCount-asc">Least Complaints</option>
              <option value="lastActive-desc">Recently Active</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="users-table-responsive-wrapper">
          <table className="users-data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable-th">
                  <div className="th-content">
                    <span>User</span>
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-sort-muted" />
                    )}
                  </div>
                </th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Area</th>
                <th onClick={() => handleSort('complaintCount')} className="sortable-th">
                  <div className="th-content">
                    <span>Complaints</span>
                    {sortField === 'complaintCount' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-sort-muted" />
                    )}
                  </div>
                </th>
                <th>Status</th>
                <th onClick={() => handleSort('lastActive')} className="sortable-th">
                  <div className="th-content">
                    <span>Last Active</span>
                    {sortField === 'lastActive' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-sort-muted" />
                    )}
                  </div>
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="users-empty-cell">
                    <div className="users-empty-state">
                      <UserX size={42} className="empty-icon" />
                      <h3 className="empty-title">No users found</h3>
                      <p className="empty-subtitle">Try changing your search keywords or resetting filters.</p>
                      {hasActiveFilters && (
                        <button 
                          type="button" 
                          className="empty-clear-btn"
                          onClick={handleResetFilters}
                        >
                          <RotateCcw size={13} />
                          <span>Clear Filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const avatarColor = getAvatarColor(user.name);
                  const isMenuOpen = activeMenuId === user.id;

                  return (
                    <tr key={user.id} className="user-table-row">
                      {/* 1. User (Avatar + Name + ID) */}
                      <td>
                        <div className="user-profile-cell">
                          <div 
                            className="user-avatar-circle"
                            style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div className="user-name-block">
                            <span className="user-full-name">{user.name}</span>
                            <span className="user-id-code">{user.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Email */}
                      <td>
                        <span className="user-email-text" title={user.email}>
                          {user.email}
                        </span>
                      </td>

                      {/* 3. Role */}
                      <td>
                        <RoleBadge role={user.role} />
                      </td>

                      {/* 4. Department */}
                      <td>
                        <span className="user-department-text">
                          {user.department || '—'}
                        </span>
                      </td>

                      {/* 5. Area */}
                      <td>
                        <span className="user-area-pill">
                          <MapPin size={11} />
                          {user.area}
                        </span>
                      </td>

                      {/* 6. Complaints Count */}
                      <td>
                        <div className="user-complaint-count-cell">
                          <span className="complaint-total-num">{user.complaintCount}</span>
                          {user.complaintCount > 0 && (
                            <span className="complaint-resolved-tag" title={`${user.resolvedComplaints} resolved`}>
                              ({user.resolvedComplaints} solved)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 7. Status */}
                      <td>
                        <StatusBadge status={user.status} />
                      </td>

                      {/* 8. Last Active */}
                      <td>
                        <span className="user-last-active-text">
                          {user.lastActive}
                        </span>
                      </td>

                      {/* 9. Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="users-actions-wrapper">
                          <button 
                            type="button" 
                            className="action-icon-btn action-view"
                            onClick={() => setViewingUser(user)}
                            title="View user details"
                            aria-label={`View ${user.name}`}
                          >
                            <Eye size={15} />
                          </button>

                          <button 
                            type="button" 
                            className="action-icon-btn action-edit"
                            onClick={() => handleOpenEdit(user)}
                            title="Edit user details"
                            aria-label={`Edit ${user.name}`}
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Dropdown Toggle */}
                          <div className="more-menu-container" ref={isMenuOpen ? menuRef : null}>
                            <button
                              type="button"
                              className={`action-icon-btn action-more ${isMenuOpen ? 'active' : ''}`}
                              onClick={() => setActiveMenuId(isMenuOpen ? null : user.id)}
                              aria-label="More actions"
                              aria-expanded={isMenuOpen}
                            >
                              <MoreVertical size={15} />
                            </button>

                            {isMenuOpen && (
                              <div className="users-dropdown-menu">
                                <button 
                                  type="button" 
                                  className="dropdown-item"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setViewingUser(user);
                                  }}
                                >
                                  <Eye size={14} />
                                  <span>View Profile</span>
                                </button>

                                <button 
                                  type="button" 
                                  className="dropdown-item"
                                  onClick={() => handleOpenEdit(user)}
                                >
                                  <Edit3 size={14} />
                                  <span>Edit User</span>
                                </button>

                                <button 
                                  type="button" 
                                  className={`dropdown-item ${user.status === 'Active' ? 'dropdown-item-danger' : 'dropdown-item-success'}`}
                                  onClick={() => handleRequestStatusChange(user)}
                                >
                                  {user.status === 'Active' ? (
                                    <>
                                      <UserX size={14} />
                                      <span>Deactivate User</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck size={14} />
                                      <span>Activate User</span>
                                    </>
                                  )}
                                </button>

                                <button 
                                  type="button" 
                                  className="dropdown-item"
                                  onClick={() => handleViewComplaints(user)}
                                >
                                  <FileText size={14} />
                                  <span>View Complaints</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Viewports: Responsive User Cards */}
        <div className="users-mobile-cards-feed">
          {paginatedUsers.length === 0 ? (
            <div className="users-empty-state mobile-empty">
              <UserX size={36} className="empty-icon" />
              <h3 className="empty-title">No users found</h3>
              <p className="empty-subtitle">Try adjusting your filters.</p>
              {hasActiveFilters && (
                <button type="button" className="empty-clear-btn" onClick={handleResetFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            paginatedUsers.map((user) => {
              const avatarColor = getAvatarColor(user.name);

              return (
                <article key={user.id} className="user-mobile-card">
                  <div className="mobile-card-top">
                    <div className="user-profile-cell">
                      <div 
                        className="user-avatar-circle"
                        style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="user-name-block">
                        <span className="user-full-name">{user.name}</span>
                        <span className="user-id-code">{user.id}</span>
                      </div>
                    </div>
                    <StatusBadge status={user.status} />
                  </div>

                  <div className="mobile-card-meta-grid">
                    <div>
                      <span className="mobile-meta-label">Role</span>
                      <RoleBadge role={user.role} />
                    </div>
                    <div>
                      <span className="mobile-meta-label">Complaints</span>
                      <span className="mobile-meta-val">{user.complaintCount} total</span>
                    </div>
                    <div>
                      <span className="mobile-meta-label">Area</span>
                      <span className="mobile-meta-val">{user.area}</span>
                    </div>
                    <div>
                      <span className="mobile-meta-label">Department</span>
                      <span className="mobile-meta-val">{user.department || '—'}</span>
                    </div>
                  </div>

                  <div className="mobile-card-contact">
                    <span className="contact-line">
                      <Mail size={12} />
                      <span>{user.email}</span>
                    </span>
                    <span className="contact-line">
                      <Phone size={12} />
                      <span>{user.phone}</span>
                    </span>
                  </div>

                  <div className="mobile-card-footer">
                    <span className="mobile-active-tag">Active {user.lastActive}</span>
                    <div className="mobile-actions-group">
                      <button 
                        type="button" 
                        className="mobile-btn mobile-btn-view"
                        onClick={() => setViewingUser(user)}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <button 
                        type="button" 
                        className="mobile-btn mobile-btn-edit"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* 5. PAGINATION BAR */}
        {sortedUsers.length > 0 && (
          <div className="users-pagination-bar">
            <div className="pagination-info">
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> – <strong>{Math.min(currentPage * itemsPerPage, sortedUsers.length)}</strong> of <strong>{sortedUsers.length}</strong> users
            </div>

            <div className="pagination-controls">
              <button 
                type="button"
                className="page-nav-btn"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              <div className="page-numbers-row">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`page-num-btn ${pageNum === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button 
                type="button"
                className="page-nav-btn"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

      </section>

      {/* ====================================================================== */}
      {/* 6. MODALS                                                              */}
      {/* ====================================================================== */}

      {/* MODAL A: VIEW USER PROFILE MODAL / DRAWER */}
      {viewingUser && (
        <div className="users-modal-backdrop" onClick={() => setViewingUser(null)}>
          <div 
            className="users-modal-content view-user-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="view-user-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">{viewingUser.id}</span>
                <h3 id="view-user-title" className="modal-title">{viewingUser.name}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setViewingUser(null)}
                aria-label="Close user profile"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Profile summary header banner */}
              <div className="view-profile-hero">
                <div 
                  className="view-hero-avatar"
                  style={{ 
                    backgroundColor: getAvatarColor(viewingUser.name).bg, 
                    color: getAvatarColor(viewingUser.name).text 
                  }}
                >
                  {getInitials(viewingUser.name)}
                </div>
                <div className="view-hero-details">
                  <div className="view-badges-line">
                    <RoleBadge role={viewingUser.role} />
                    <StatusBadge status={viewingUser.status} />
                  </div>
                  <span className="view-email-sub">{viewingUser.email}</span>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="view-stats-row">
                <div className="view-stat-box">
                  <span className="stat-label">Total Complaints</span>
                  <span className="stat-num">{viewingUser.complaintCount}</span>
                </div>
                <div className="view-stat-box">
                  <span className="stat-label">Resolved</span>
                  <span className="stat-num" style={{ color: 'var(--success)' }}>
                    {viewingUser.resolvedComplaints}
                  </span>
                </div>
                <div className="view-stat-box">
                  <span className="stat-label">Pending</span>
                  <span className="stat-num" style={{ color: 'var(--warning-text)' }}>
                    {Math.max(0, viewingUser.complaintCount - viewingUser.resolvedComplaints)}
                  </span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="view-info-grid">
                <div className="info-field-box">
                  <span className="field-label">Phone</span>
                  <span className="field-val">
                    <Phone size={13} style={{ color: 'var(--primary)' }} />
                    {viewingUser.phone}
                  </span>
                </div>
                <div className="info-field-box">
                  <span className="field-label">Municipal Area</span>
                  <span className="field-val">
                    <MapPin size={13} style={{ color: 'var(--danger)' }} />
                    {viewingUser.area}
                  </span>
                </div>
                <div className="info-field-box">
                  <span className="field-label">Department</span>
                  <span className="field-val">
                    <Building2 size={13} style={{ color: '#2563eb' }} />
                    {viewingUser.department || 'None (Citizen/General)'}
                  </span>
                </div>
                <div className="info-field-box">
                  <span className="field-label">Registered Date</span>
                  <span className="field-val">
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    {viewingUser.registeredDate}
                  </span>
                </div>
                <div className="info-field-box" style={{ gridColumn: 'span 2' }}>
                  <span className="field-label">Last Activity Timestamp</span>
                  <span className="field-val">
                    <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                    {viewingUser.lastActive} ({new Date(viewingUser.lastActiveTimestamp).toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="view-activity-block">
                <h4 className="activity-title">
                  <Activity size={14} />
                  <span>Recent Activity</span>
                </h4>
                <div className="activity-timeline">
                  {viewingUser.activity && viewingUser.activity.length > 0 ? (
                    viewingUser.activity.map((act) => (
                      <div key={act.id} className="timeline-item">
                        <span className="timeline-bullet" />
                        <div className="timeline-body">
                          <span className="timeline-time">{act.time}</span>
                          <p className="timeline-desc">{act.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent activity records.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => setViewingUser(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="modal-primary-btn"
                onClick={() => handleViewComplaints(viewingUser)}
              >
                <FileText size={14} />
                <span>View Complaints</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: EDIT USER MODAL */}
      {editingUser && (
        <div className="users-modal-backdrop" onClick={() => setEditingUser(null)}>
          <div 
            className="users-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="edit-user-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">{editingUser.id}</span>
                <h3 id="edit-user-title" className="modal-title">Edit User Account</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setEditingUser(null)}
                aria-label="Close edit form"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body form-grid">
                {/* Full Name */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="edit-name" className="form-label">Full Name</label>
                  <input 
                    id="edit-name"
                    type="text"
                    className="form-input"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="edit-email" className="form-label">Email Address</label>
                  <input 
                    id="edit-email"
                    type="email"
                    className="form-input"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="edit-phone" className="form-label">Phone Number</label>
                  <input 
                    id="edit-phone"
                    type="text"
                    className="form-input"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Role */}
                <div className="form-group">
                  <label htmlFor="edit-role" className="form-label">Account Role</label>
                  <select 
                    id="edit-role"
                    className="form-select"
                    value={editingUser.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setEditingUser({
                        ...editingUser,
                        role: newRole,
                        department: newRole === 'Department Staff' ? (editingUser.department || 'Road Maintenance') : null
                      });
                    }}
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Department Staff">Department Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Department (if staff) */}
                <div className="form-group">
                  <label htmlFor="edit-dept" className="form-label">
                    Department {editingUser.role !== 'Department Staff' && '(N/A)'}
                  </label>
                  <select 
                    id="edit-dept"
                    className="form-select"
                    value={editingUser.department || ''}
                    disabled={editingUser.role !== 'Department Staff'}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {USER_DEPARTMENTS.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div className="form-group">
                  <label htmlFor="edit-area" className="form-label">Municipal Area</label>
                  <select 
                    id="edit-area"
                    className="form-select"
                    value={editingUser.area}
                    onChange={(e) => setEditingUser({ ...editingUser, area: e.target.value })}
                  >
                    {USER_AREAS.filter(a => a !== 'All').map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="edit-status" className="form-label">Account Status</label>
                  <select 
                    id="edit-status"
                    className="form-select"
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-secondary-btn"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-primary-btn"
                >
                  <Check size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL C: ADD USER MODAL */}
      {isAddUserOpen && (
        <div className="users-modal-backdrop" onClick={() => setIsAddUserOpen(false)}>
          <div 
            className="users-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="add-user-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">New Registration</span>
                <h3 id="add-user-title" className="modal-title">Add New User</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsAddUserOpen(false)}
                aria-label="Close registration form"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body form-grid">
                {/* Full Name */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="add-name" className="form-label">Full Name *</label>
                  <input 
                    id="add-name"
                    type="text"
                    className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Alok Verma"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="add-email" className="form-label">Email Address *</label>
                  <input 
                    id="add-email"
                    type="email"
                    className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                    placeholder="alok@example.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="add-phone" className="form-label">Phone Number *</label>
                  <input 
                    id="add-phone"
                    type="text"
                    className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                    placeholder="+91 98765 00000"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>

                {/* Role */}
                <div className="form-group">
                  <label htmlFor="add-role" className="form-label">Account Role *</label>
                  <select 
                    id="add-role"
                    className="form-select"
                    value={newUserForm.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setNewUserForm({
                        ...newUserForm,
                        role: newRole,
                        department: newRole === 'Department Staff' ? 'Road Maintenance' : ''
                      });
                    }}
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Department Staff">Department Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Department */}
                <div className="form-group">
                  <label htmlFor="add-dept" className="form-label">
                    Department {newUserForm.role === 'Department Staff' ? '*' : '(Disabled)'}
                  </label>
                  <select 
                    id="add-dept"
                    className={`form-select ${formErrors.department ? 'input-error' : ''}`}
                    value={newUserForm.department}
                    disabled={newUserForm.role !== 'Department Staff'}
                    onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {USER_DEPARTMENTS.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {formErrors.department && <span className="error-text">{formErrors.department}</span>}
                </div>

                {/* Area */}
                <div className="form-group">
                  <label htmlFor="add-area" className="form-label">Municipal Area *</label>
                  <select 
                    id="add-area"
                    className="form-select"
                    value={newUserForm.area}
                    onChange={(e) => setNewUserForm({ ...newUserForm, area: e.target.value })}
                  >
                    {USER_AREAS.filter(a => a !== 'All').map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="add-status" className="form-label">Initial Status</label>
                  <select 
                    id="add-status"
                    className="form-select"
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-secondary-btn"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-primary-btn"
                >
                  <Plus size={14} />
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL D: ACTIVATE / DEACTIVATE CONFIRMATION DIALOG */}
      {confirmStatusUser && (
        <div className="users-modal-backdrop" onClick={() => setConfirmStatusUser(null)}>
          <div 
            className="users-modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="confirm-dialog-title"
          >
            <div className="confirm-icon-wrap">
              {confirmStatusUser.targetStatus === 'Active' ? (
                <UserCheck size={28} style={{ color: 'var(--success)' }} />
              ) : (
                <AlertCircle size={28} style={{ color: 'var(--danger)' }} />
              )}
            </div>

            <h3 id="confirm-dialog-title" className="confirm-title">
              {confirmStatusUser.targetStatus === 'Active' ? 'Activate User Account?' : 'Deactivate User Account?'}
            </h3>

            <p className="confirm-desc">
              Are you sure you want to change the status of <strong>{confirmStatusUser.user.name}</strong> ({confirmStatusUser.user.id}) to <strong>{confirmStatusUser.targetStatus}</strong>?
              {confirmStatusUser.targetStatus === 'Inactive' 
                ? ' The user will not be able to log in or submit civic complaints until reactivated.' 
                : ' The user will regain full access to report civic complaints and access portal tools.'}
            </p>

            <div className="confirm-btn-row">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => setConfirmStatusUser(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={`modal-primary-btn ${confirmStatusUser.targetStatus === 'Inactive' ? 'btn-danger' : ''}`}
                onClick={handleConfirmStatusChange}
              >
                Confirm {confirmStatusUser.targetStatus}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
