import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  X, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Eye, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Download, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  AlertCircle, 
  FileText, 
  Construction, 
  Trash2, 
  Lightbulb, 
  Droplets, 
  Waves, 
  Car, 
  ShieldCheck, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

import './Departments.css';

import { 
  initialDepartments, 
  getWorkloadClass, 
  getPerformanceClass 
} from '../../utils/mockDepartmentData';

// Dynamic department icon resolver
const renderDepartmentIcon = (iconName, size = 20) => {
  switch (iconName) {
    case 'Construction':
      return <Construction size={size} />;
    case 'Trash2':
      return <Trash2 size={size} />;
    case 'Lightbulb':
      return <Lightbulb size={size} />;
    case 'Droplets':
      return <Droplets size={size} />;
    case 'Waves':
      return <Waves size={size} />;
    case 'TrafficCone':
      return <Car size={size} />;
    default:
      return <Building2 size={size} />;
  }
};

const Departments = () => {
  const navigate = useNavigate();

  // Primary state: Mock departments list
  const [departments, setDepartments] = useState(initialDepartments);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [workloadFilter, setWorkloadFilter] = useState('All');
  const [performanceFilter, setPerformanceFilter] = useState('All');

  // Table Sorting state
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modals state
  const [viewingDept, setViewingDept] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [confirmStatusDept, setConfirmStatusDept] = useState(null); // { dept, targetStatus }

  // New Department Form state
  const [newDeptForm, setNewDeptForm] = useState({
    name: '',
    code: '',
    description: '',
    head: '',
    phone: '',
    email: '',
    officeLocation: '',
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

  // Compute KPI summary cards dynamically from `departments`
  const kpis = useMemo(() => {
    const total = departments.length;
    const active = departments.filter(d => d.status === 'Active').length;
    const totalStaff = departments.reduce((acc, d) => acc + (d.staffCount || 0), 0);
    const assignedComplaints = departments.reduce((acc, d) => acc + (d.totalComplaints || 0), 0);
    const pendingComplaints = departments.reduce((acc, d) => acc + (d.pendingComplaints || 0), 0);
    const avgResolutionRate = total > 0 
      ? Math.round(departments.reduce((acc, d) => acc + (d.resolutionRate || 0), 0) / total) 
      : 0;

    return { total, active, totalStaff, assignedComplaints, pendingComplaints, avgResolutionRate };
  }, [departments]);

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      // 1. Search Query (name, code, head, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = dept.name.toLowerCase().includes(q);
        const matchCode = dept.code.toLowerCase().includes(q);
        const matchHead = dept.head.toLowerCase().includes(q);
        const matchDesc = dept.description.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchHead && !matchDesc) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'All' && dept.status !== statusFilter) {
        return false;
      }

      // 3. Workload Filter
      if (workloadFilter !== 'All') {
        const { level } = getWorkloadClass(dept.totalComplaints);
        if (workloadFilter === 'Low' && level !== 'Low') return false;
        if (workloadFilter === 'Medium' && level !== 'Medium') return false;
        if (workloadFilter === 'High' && level !== 'High') return false;
      }

      // 4. Performance Filter
      if (performanceFilter !== 'All') {
        const { label } = getPerformanceClass(dept.resolutionRate);
        if (performanceFilter !== label) return false;
      }

      return true;
    });
  }, [departments, searchQuery, statusFilter, workloadFilter, performanceFilter]);

  // Sorted departments for the performance table
  const sortedDepartments = useMemo(() => {
    const list = [...filteredDepartments];

    list.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'staffCount') {
        comparison = a.staffCount - b.staffCount;
      } else if (sortField === 'totalComplaints') {
        comparison = a.totalComplaints - b.totalComplaints;
      } else if (sortField === 'pendingComplaints') {
        comparison = a.pendingComplaints - b.pendingComplaints;
      } else if (sortField === 'resolutionRate') {
        comparison = a.resolutionRate - b.resolutionRate;
      } else if (sortField === 'averageResolutionTime') {
        comparison = parseFloat(a.averageResolutionTime) - parseFloat(b.averageResolutionTime);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [filteredDepartments, sortField, sortDirection]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    statusFilter !== 'All' ||
    workloadFilter !== 'All' ||
    performanceFilter !== 'All'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setWorkloadFilter('All');
    setPerformanceFilter('All');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle department status confirmation
  const handleRequestStatusChange = (dept) => {
    setActiveMenuId(null);
    const targetStatus = dept.status === 'Active' ? 'Inactive' : 'Active';
    setConfirmStatusDept({ dept, targetStatus });
  };

  const handleConfirmStatusChange = () => {
    if (!confirmStatusDept) return;
    const { dept, targetStatus } = confirmStatusDept;

    setDepartments(prev => prev.map(d => {
      if (d.id === dept.id) {
        return { ...d, status: targetStatus };
      }
      return d;
    }));

    setConfirmStatusDept(null);
  };

  // Edit Department Handler
  const handleOpenEdit = (dept) => {
    setActiveMenuId(null);
    setEditingDept({ ...dept });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDept) return;

    setDepartments(prev => prev.map(d => {
      if (d.id === editingDept.id) {
        return {
          ...d,
          name: editingDept.name.trim(),
          code: editingDept.code.trim().toUpperCase(),
          description: editingDept.description.trim(),
          head: editingDept.head.trim(),
          phone: editingDept.phone.trim(),
          email: editingDept.email.trim(),
          officeLocation: editingDept.officeLocation.trim(),
          status: editingDept.status
        };
      }
      return d;
    }));

    setEditingDept(null);
  };

  // Add Department Form Validation & Submission
  const validateNewDept = () => {
    const errors = {};
    if (!newDeptForm.name.trim()) errors.name = 'Department name is required';
    if (!newDeptForm.code.trim()) errors.code = 'Department code is required';
    if (!newDeptForm.head.trim()) errors.head = 'Department head is required';
    if (!newDeptForm.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(newDeptForm.email)) {
      errors.email = 'Enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!validateNewDept()) return;

    const nextIdNum = departments.length + 1;
    const newDept = {
      id: `DEPT-${String(nextIdNum).padStart(3, '0')}`,
      name: newDeptForm.name.trim(),
      code: newDeptForm.code.trim().toUpperCase(),
      description: newDeptForm.description.trim() || 'Civic department service provider.',
      head: newDeptForm.head.trim(),
      phone: newDeptForm.phone.trim() || '+91 98000 00000',
      email: newDeptForm.email.trim(),
      officeLocation: newDeptForm.officeLocation.trim() || 'Municipal Administrative Complex, Gwalior',
      status: newDeptForm.status,
      staffCount: 5,
      totalComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      resolvedComplaints: 0,
      resolutionRate: 100,
      averageResolutionTime: '1.0 day',
      createdDate: '2026-09-06',
      iconName: 'Building2',
      recentComplaints: [],
      staff: [
        { id: `STF-${nextIdNum}01`, name: newDeptForm.head.trim(), designation: 'Department Head', phone: newDeptForm.phone.trim() || '+91 98000 00000' }
      ]
    };

    setDepartments([...departments, newDept]);
    setIsAddDeptOpen(false);
    setNewDeptForm({
      name: '',
      code: '',
      description: '',
      head: '',
      phone: '',
      email: '',
      officeLocation: '',
      status: 'Active'
    });
    setFormErrors({});
  };

  // Export Report action
  const handleExportReport = () => {
    const csvRows = [
      ['ID', 'Department', 'Code', 'Head', 'Status', 'Staff', 'Complaints', 'Pending', 'Resolved', 'Resolution Rate', 'Avg Time'],
      ...departments.map(d => [
        d.id,
        `"${d.name}"`,
        d.code,
        `"${d.head}"`,
        d.status,
        d.staffCount,
        d.totalComplaints,
        d.pendingComplaints,
        d.resolvedComplaints,
        `${d.resolutionRate}%`,
        d.averageResolutionTime
      ])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart_civic_departments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View Complaints navigation handler
  const handleViewComplaints = (dept) => {
    setActiveMenuId(null);
    setViewingDept(null);
    navigate('/admin/complaints');
  };

  return (
    <div className="departments-page-container">
      
      {/* 1. PAGE HEADER */}
      <header className="dept-header-card">
        <div className="dept-title-block">
          <h1 className="dept-page-title">
            <Building2 size={24} className="dept-title-icon" />
            <span>Department Management</span>
          </h1>
          <p className="dept-page-subtitle">
            Manage civic departments, staff, workloads, and service performance across municipal sectors.
          </p>
        </div>

        <div className="dept-header-actions">
          <button 
            type="button" 
            className="dept-export-btn"
            onClick={handleExportReport}
            title="Export departmental service performance report"
          >
            <Download size={15} />
            <span>Export Report</span>
          </button>

          <button 
            type="button" 
            className="dept-add-btn"
            onClick={() => setIsAddDeptOpen(true)}
            aria-label="Add new civic department"
          >
            <Plus size={16} />
            <span>Add Department</span>
          </button>
        </div>
      </header>

      {/* 2. SUMMARY KPI CARDS */}
      <section className="dept-kpi-grid" aria-label="Department Performance Metrics">
        {/* Total Departments */}
        <div className="dept-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Total Departments</span>
            <span className="kpi-value">{kpis.total}</span>
          </div>
          <div className="kpi-icon-wrap kpi-blue">
            <Building2 size={18} />
          </div>
        </div>

        {/* Active Departments */}
        <div className="dept-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Active Departments</span>
            <span className="kpi-value" style={{ color: 'var(--success)' }}>{kpis.active}</span>
          </div>
          <div className="kpi-icon-wrap kpi-green">
            <ShieldCheck size={18} />
          </div>
        </div>

        {/* Total Staff */}
        <div className="dept-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Total Staff</span>
            <span className="kpi-value">{kpis.totalStaff}</span>
          </div>
          <div className="kpi-icon-wrap kpi-purple">
            <Users size={18} />
          </div>
        </div>

        {/* Assigned Complaints */}
        <div className="dept-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Assigned Complaints</span>
            <span className="kpi-value">{kpis.assignedComplaints}</span>
          </div>
          <div className="kpi-icon-wrap kpi-indigo">
            <ClipboardList size={18} />
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="dept-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Pending Complaints</span>
            <span className="kpi-value" style={{ color: 'var(--warning-text)' }}>{kpis.pendingComplaints}</span>
          </div>
          <div className="kpi-icon-wrap kpi-amber">
            <Clock size={18} />
          </div>
        </div>

        {/* Average Resolution Rate */}
        <div className="dept-kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Avg. Resolution Rate</span>
            <span className="kpi-value" style={{ color: 'var(--primary)' }}>{kpis.avgResolutionRate}%</span>
          </div>
          <div className="kpi-icon-wrap kpi-teal">
            <TrendingUp size={18} />
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <section className="dept-filter-card" aria-label="Department Filter Controls">
        <div className="dept-search-wrapper">
          <Search size={16} className="dept-search-icon" />
          <input 
            type="text"
            className="dept-search-input"
            placeholder="Search departments by name, code, head or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search departments"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="dept-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="dept-filters-row">
          {/* Status Filter */}
          <div className="dept-control-group">
            <label htmlFor="dept-status-filter" className="dept-control-label">Status</label>
            <select
              id="dept-status-filter"
              className={`dept-select ${statusFilter !== 'All' ? 'active-filter' : ''}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Workload Filter */}
          <div className="dept-control-group">
            <label htmlFor="dept-workload-filter" className="dept-control-label">Workload</label>
            <select
              id="dept-workload-filter"
              className={`dept-select ${workloadFilter !== 'All' ? 'active-filter' : ''}`}
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
            >
              <option value="All">All Workloads</option>
              <option value="Low">Low (0–20 complaints)</option>
              <option value="Medium">Medium (21–40 complaints)</option>
              <option value="High">High (41+ complaints)</option>
            </select>
          </div>

          {/* Performance Filter */}
          <div className="dept-control-group">
            <label htmlFor="dept-perf-filter" className="dept-control-label">Performance</label>
            <select
              id="dept-perf-filter"
              className={`dept-select ${performanceFilter !== 'All' ? 'active-filter' : ''}`}
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
            >
              <option value="All">All Performance</option>
              <option value="Excellent">Excellent (90%+)</option>
              <option value="Good">Good (75%–89%)</option>
              <option value="Needs Attention">Needs Attention (&lt;75%)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button 
            type="button" 
            className="dept-reset-btn"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title="Reset search and filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* 4. DEPARTMENT CARDS GRID */}
      <section className="dept-cards-section" aria-label="Municipal Department Cards">
        {filteredDepartments.length === 0 ? (
          <div className="dept-empty-card">
            <Building2 size={44} className="empty-icon" />
            <h3 className="empty-title">No departments found</h3>
            <p className="empty-subtitle">Try adjusting your search criteria or resetting filters.</p>
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
        ) : (
          <div className="dept-cards-grid">
            {filteredDepartments.map((dept) => {
              const workload = getWorkloadClass(dept.totalComplaints);
              const perf = getPerformanceClass(dept.resolutionRate);
              const isMenuOpen = activeMenuId === dept.id;

              return (
                <article key={dept.id} className="dept-card">
                  
                  {/* Card Header */}
                  <div className="dept-card-header">
                    <div className="dept-card-brand">
                      <div className="dept-icon-box">
                        {renderDepartmentIcon(dept.iconName, 22)}
                      </div>
                      <div>
                        <h3 className="dept-card-name">{dept.name}</h3>
                        <span className="dept-card-code">{dept.code}</span>
                      </div>
                    </div>

                    <div className="dept-header-badges">
                      <span className={`status-badge ${dept.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        <span className="status-dot" />
                        {dept.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="dept-card-desc">{dept.description}</p>

                  {/* Head & Staff Line */}
                  <div className="dept-card-meta-line">
                    <div className="meta-subgroup">
                      <span className="meta-label">Department Head</span>
                      <span className="meta-val">{dept.head}</span>
                    </div>
                    <div className="meta-subgroup" style={{ textAlign: 'right' }}>
                      <span className="meta-label">Staff</span>
                      <span className="meta-val">
                        <Users size={12} style={{ display: 'inline', marginRight: 3 }} />
                        {dept.staffCount}
                      </span>
                    </div>
                  </div>

                  {/* Complaint Metric Strip */}
                  <div className="dept-complaint-metrics">
                    <div className="metric-cell">
                      <span className="metric-label">Complaints</span>
                      <span className="metric-number">{dept.totalComplaints}</span>
                    </div>
                    <div className="metric-cell">
                      <span className="metric-label">Pending</span>
                      <span className="metric-number" style={{ color: 'var(--warning-text)' }}>{dept.pendingComplaints}</span>
                    </div>
                    <div className="metric-cell">
                      <span className="metric-label">Resolved</span>
                      <span className="metric-number" style={{ color: 'var(--success)' }}>{dept.resolvedComplaints}</span>
                    </div>
                  </div>

                  {/* Workload Resolution Progress Bar */}
                  <div className="dept-resolution-bar-container">
                    <div className="resolution-bar-header">
                      <span className="res-title">Resolution Rate</span>
                      <div className="res-badges-wrap">
                        <span className={`workload-tag ${workload.badgeClass}`}>
                          {workload.label}
                        </span>
                        <span className="res-percentage">{dept.resolutionRate}%</span>
                      </div>
                    </div>
                    <div className="progress-track" role="progressbar" aria-valuenow={dept.resolutionRate} aria-valuemin="0" aria-valuemax="100">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(dept.resolutionRate, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="dept-card-footer">
                    <div className="footer-left-actions">
                      <button 
                        type="button" 
                        className="card-action-btn btn-view-details"
                        onClick={() => setViewingDept(dept)}
                      >
                        <Eye size={13} />
                        <span>View Details</span>
                      </button>
                      <button 
                        type="button" 
                        className="card-action-btn btn-edit-dept"
                        onClick={() => handleOpenEdit(dept)}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* More Menu Dropdown */}
                    <div className="dept-more-container" ref={isMenuOpen ? menuRef : null}>
                      <button 
                        type="button" 
                        className={`card-more-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setActiveMenuId(isMenuOpen ? null : dept.id)}
                        aria-label="More department options"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isMenuOpen && (
                        <div className="dept-dropdown-menu">
                          <button 
                            type="button" 
                            className="dropdown-item"
                            onClick={() => {
                              setActiveMenuId(null);
                              setViewingDept(dept);
                            }}
                          >
                            <Eye size={14} />
                            <span>View Details</span>
                          </button>
                          <button 
                            type="button" 
                            className="dropdown-item"
                            onClick={() => handleOpenEdit(dept)}
                          >
                            <Edit3 size={14} />
                            <span>Edit Department</span>
                          </button>
                          <button 
                            type="button" 
                            className={`dropdown-item ${dept.status === 'Active' ? 'dropdown-item-danger' : 'dropdown-item-success'}`}
                            onClick={() => handleRequestStatusChange(dept)}
                          >
                            {dept.status === 'Active' ? (
                              <>
                                <ShieldAlert size={14} />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={14} />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                          <button 
                            type="button" 
                            className="dropdown-item"
                            onClick={() => handleViewComplaints(dept)}
                          >
                            <FileText size={14} />
                            <span>View Complaints</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. DEPARTMENT PERFORMANCE TABLE */}
      <section className="dept-table-section" aria-label="Department Performance Metrics Table">
        <div className="dept-table-header">
          <div className="table-title-group">
            <h2 className="table-main-title">Department Service Performance</h2>
            <span className="table-subtitle">Comparative resolution velocity, staff allocation, and workload statistics</span>
          </div>
          <span className="table-count-badge">{sortedDepartments.length} Departments Listed</span>
        </div>

        <div className="dept-table-wrapper">
          <table className="dept-data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable-th">
                  <div className="th-content">
                    <span>Department</span>
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-muted" />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('staffCount')} className="sortable-th">
                  <div className="th-content">
                    <span>Staff</span>
                    {sortField === 'staffCount' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-muted" />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('totalComplaints')} className="sortable-th">
                  <div className="th-content">
                    <span>Total</span>
                    {sortField === 'totalComplaints' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-muted" />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('pendingComplaints')} className="sortable-th">
                  <div className="th-content">
                    <span>Pending</span>
                    {sortField === 'pendingComplaints' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-muted" />
                    )}
                  </div>
                </th>
                <th>In Progress</th>
                <th>Resolved</th>
                <th onClick={() => handleSort('resolutionRate')} className="sortable-th">
                  <div className="th-content">
                    <span>Resolution Rate</span>
                    {sortField === 'resolutionRate' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-muted" />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('averageResolutionTime')} className="sortable-th">
                  <div className="th-content">
                    <span>Avg. Time</span>
                    {sortField === 'averageResolutionTime' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} className="th-muted" />
                    )}
                  </div>
                </th>
                <th>Performance</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDepartments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-table-cell">
                    No departments match the specified filters.
                  </td>
                </tr>
              ) : (
                sortedDepartments.map((dept) => {
                  const perf = getPerformanceClass(dept.resolutionRate);

                  return (
                    <tr key={dept.id} className="table-dept-row">
                      {/* Department name & code */}
                      <td>
                        <div className="table-dept-brand">
                          <div className="table-icon-mini">
                            {renderDepartmentIcon(dept.iconName, 15)}
                          </div>
                          <div>
                            <span className="table-dept-name">{dept.name}</span>
                            <span className="table-dept-code">{dept.code}</span>
                          </div>
                        </div>
                      </td>

                      {/* Staff */}
                      <td>
                        <span className="table-staff-num">{dept.staffCount}</span>
                      </td>

                      {/* Total Complaints */}
                      <td>
                        <strong className="table-total-num">{dept.totalComplaints}</strong>
                      </td>

                      {/* Pending */}
                      <td>
                        <span className="table-pending-num">{dept.pendingComplaints}</span>
                      </td>

                      {/* In Progress */}
                      <td>
                        <span className="table-progress-num">{dept.inProgressComplaints}</span>
                      </td>

                      {/* Resolved */}
                      <td>
                        <span className="table-resolved-num">{dept.resolvedComplaints}</span>
                      </td>

                      {/* Resolution Rate */}
                      <td>
                        <div className="table-res-cell">
                          <div className="table-res-track">
                            <div 
                              className="table-res-fill"
                              style={{ width: `${Math.min(dept.resolutionRate, 100)}%` }}
                            />
                          </div>
                          <span className="table-res-text">{dept.resolutionRate}%</span>
                        </div>
                      </td>

                      {/* Avg. Resolution Time */}
                      <td>
                        <span className="table-time-text">{dept.averageResolutionTime}</span>
                      </td>

                      {/* Performance */}
                      <td>
                        <span className={`perf-badge ${perf.badgeClass}`}>
                          {perf.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-cell">
                          <button 
                            type="button" 
                            className="table-icon-btn action-view"
                            onClick={() => setViewingDept(dept)}
                            title="View department details"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="table-icon-btn action-edit"
                            onClick={() => handleOpenEdit(dept)}
                            title="Edit department"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. MODALS                                                              */}
      {/* ====================================================================== */}

      {/* MODAL A: VIEW DEPARTMENT DETAILS MODAL */}
      {viewingDept && (
        <div className="dept-modal-backdrop" onClick={() => setViewingDept(null)}>
          <div 
            className="dept-modal-content view-dept-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="view-dept-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">{viewingDept.code} • {viewingDept.id}</span>
                <h3 id="view-dept-title" className="modal-title">{viewingDept.name}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setViewingDept(null)}
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Hero Banner */}
              <div className="view-dept-hero">
                <div className="view-hero-icon">
                  {renderDepartmentIcon(viewingDept.iconName, 32)}
                </div>
                <div className="view-hero-text">
                  <div className="view-hero-tags">
                    <span className={`status-badge ${viewingDept.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      <span className="status-dot" />
                      {viewingDept.status}
                    </span>
                    <span className={`workload-tag ${getWorkloadClass(viewingDept.totalComplaints).badgeClass}`}>
                      {getWorkloadClass(viewingDept.totalComplaints).label}
                    </span>
                  </div>
                  <p className="view-desc">{viewingDept.description}</p>
                </div>
              </div>

              {/* Performance Metrics Row */}
              <div className="view-metrics-grid">
                <div className="metric-box">
                  <span className="box-label">Total Complaints</span>
                  <span className="box-val">{viewingDept.totalComplaints}</span>
                </div>
                <div className="metric-box">
                  <span className="box-label">Pending</span>
                  <span className="box-val" style={{ color: 'var(--warning-text)' }}>{viewingDept.pendingComplaints}</span>
                </div>
                <div className="metric-box">
                  <span className="box-label">In Progress</span>
                  <span className="box-val" style={{ color: '#4338ca' }}>{viewingDept.inProgressComplaints}</span>
                </div>
                <div className="metric-box">
                  <span className="box-label">Resolved</span>
                  <span className="box-val" style={{ color: 'var(--success)' }}>{viewingDept.resolvedComplaints}</span>
                </div>
                <div className="metric-box">
                  <span className="box-label">Resolution Rate</span>
                  <span className="box-val" style={{ color: 'var(--primary)' }}>{viewingDept.resolutionRate}%</span>
                </div>
                <div className="metric-box">
                  <span className="box-label">Avg. Resolution Time</span>
                  <span className="box-val">{viewingDept.averageResolutionTime}</span>
                </div>
              </div>

              {/* Contact & Location Info */}
              <div className="view-contact-grid">
                <div className="contact-item">
                  <span className="contact-label">Department Head</span>
                  <span className="contact-val">{viewingDept.head}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone Hotline</span>
                  <span className="contact-val">
                    <Phone size={13} style={{ color: 'var(--primary)' }} />
                    {viewingDept.phone}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Official Email</span>
                  <span className="contact-val">
                    <Mail size={13} style={{ color: 'var(--primary)' }} />
                    {viewingDept.email}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Office Location</span>
                  <span className="contact-val">
                    <MapPin size={13} style={{ color: 'var(--danger)' }} />
                    {viewingDept.officeLocation}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Registered Since</span>
                  <span className="contact-val">
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    {viewingDept.createdDate}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Total Assigned Staff</span>
                  <span className="contact-val">
                    <Users size={13} style={{ color: '#2563eb' }} />
                    {viewingDept.staffCount} Officers
                  </span>
                </div>
              </div>

              {/* Staff Section */}
              <div className="view-sub-section">
                <div className="sub-section-header">
                  <h4 className="sub-section-title">
                    <Users size={15} />
                    <span>Department Staff ({viewingDept.staff ? viewingDept.staff.length : 0})</span>
                  </h4>
                  <button 
                    type="button" 
                    className="sub-section-link"
                    onClick={() => navigate('/admin/users')}
                  >
                    View All Staff <ChevronRight size={13} />
                  </button>
                </div>

                <div className="staff-cards-row">
                  {viewingDept.staff && viewingDept.staff.length > 0 ? (
                    viewingDept.staff.map(member => (
                      <div key={member.id} className="mini-staff-card">
                        <div className="staff-avatar">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="staff-details">
                          <span className="staff-name">{member.name}</span>
                          <span className="staff-role">{member.designation}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No staff registered.</span>
                  )}
                </div>
              </div>

              {/* Recent Assigned Complaints */}
              <div className="view-sub-section">
                <div className="sub-section-header">
                  <h4 className="sub-section-title">
                    <ClipboardList size={15} />
                    <span>Recent Complaints</span>
                  </h4>
                  <button 
                    type="button" 
                    className="sub-section-link"
                    onClick={() => handleViewComplaints(viewingDept)}
                  >
                    View All in Complaints <ChevronRight size={13} />
                  </button>
                </div>

                <div className="complaint-mini-feed">
                  {viewingDept.recentComplaints && viewingDept.recentComplaints.length > 0 ? (
                    viewingDept.recentComplaints.map(comp => (
                      <div key={comp.id} className="complaint-mini-row">
                        <div className="comp-meta">
                          <span className="comp-id">{comp.id}</span>
                          <span className="comp-title">{comp.title}</span>
                          <span className="comp-area">{comp.area}</span>
                        </div>
                        <div className="comp-badges">
                          <span className={`comp-priority pri-${(comp.priority || 'medium').toLowerCase()}`}>
                            {comp.priority}
                          </span>
                          <span className={`comp-status st-${(comp.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                            {comp.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No active complaints assigned.</span>
                  )}
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => setViewingDept(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="modal-primary-btn"
                onClick={() => handleViewComplaints(viewingDept)}
              >
                <FileText size={14} />
                <span>View Complaints</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: EDIT DEPARTMENT MODAL */}
      {editingDept && (
        <div className="dept-modal-backdrop" onClick={() => setEditingDept(null)}>
          <div 
            className="dept-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="edit-dept-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">{editingDept.id}</span>
                <h3 id="edit-dept-title" className="modal-title">Edit Department</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setEditingDept(null)}
                aria-label="Close edit form"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body form-grid">
                {/* Name */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="edit-dept-name" className="form-label">Department Name</label>
                  <input 
                    id="edit-dept-name"
                    type="text"
                    className="form-input"
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                    required
                  />
                </div>

                {/* Code */}
                <div className="form-group">
                  <label htmlFor="edit-dept-code" className="form-label">Department Code</label>
                  <input 
                    id="edit-dept-code"
                    type="text"
                    className="form-input"
                    value={editingDept.code}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                    required
                  />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="edit-dept-status" className="form-label">Status</label>
                  <select 
                    id="edit-dept-status"
                    className="form-select"
                    value={editingDept.status}
                    onChange={(e) => setEditingDept({ ...editingDept, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="edit-dept-desc" className="form-label">Description</label>
                  <textarea 
                    id="edit-dept-desc"
                    className="form-textarea"
                    rows="2"
                    value={editingDept.description}
                    onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  />
                </div>

                {/* Head */}
                <div className="form-group">
                  <label htmlFor="edit-dept-head" className="form-label">Department Head</label>
                  <input 
                    id="edit-dept-head"
                    type="text"
                    className="form-input"
                    value={editingDept.head}
                    onChange={(e) => setEditingDept({ ...editingDept, head: e.target.value })}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="edit-dept-phone" className="form-label">Phone Hotline</label>
                  <input 
                    id="edit-dept-phone"
                    type="text"
                    className="form-input"
                    value={editingDept.phone}
                    onChange={(e) => setEditingDept({ ...editingDept, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="edit-dept-email" className="form-label">Official Email</label>
                  <input 
                    id="edit-dept-email"
                    type="email"
                    className="form-input"
                    value={editingDept.email}
                    onChange={(e) => setEditingDept({ ...editingDept, email: e.target.value })}
                    required
                  />
                </div>

                {/* Office Location */}
                <div className="form-group">
                  <label htmlFor="edit-dept-loc" className="form-label">Office Location</label>
                  <input 
                    id="edit-dept-loc"
                    type="text"
                    className="form-input"
                    value={editingDept.officeLocation}
                    onChange={(e) => setEditingDept({ ...editingDept, officeLocation: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-secondary-btn"
                  onClick={() => setEditingDept(null)}
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

      {/* MODAL C: ADD DEPARTMENT MODAL */}
      {isAddDeptOpen && (
        <div className="dept-modal-backdrop" onClick={() => setIsAddDeptOpen(false)}>
          <div 
            className="dept-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="add-dept-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">New Unit</span>
                <h3 id="add-dept-title" className="modal-title">Add New Department</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsAddDeptOpen(false)}
                aria-label="Close registration form"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDept}>
              <div className="modal-body form-grid">
                {/* Department Name */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="add-dept-name" className="form-label">Department Name *</label>
                  <input 
                    id="add-dept-name"
                    type="text"
                    className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Public Health & Pest Control"
                    value={newDeptForm.name}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                {/* Department Code */}
                <div className="form-group">
                  <label htmlFor="add-dept-code" className="form-label">Department Code *</label>
                  <input 
                    id="add-dept-code"
                    type="text"
                    className={`form-input ${formErrors.code ? 'input-error' : ''}`}
                    placeholder="e.g. HLTH"
                    value={newDeptForm.code}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
                  />
                  {formErrors.code && <span className="error-text">{formErrors.code}</span>}
                </div>

                {/* Initial Status */}
                <div className="form-group">
                  <label htmlFor="add-dept-status" className="form-label">Initial Status</label>
                  <select 
                    id="add-dept-status"
                    className="form-select"
                    value={newDeptForm.status}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="add-dept-desc" className="form-label">Description</label>
                  <textarea 
                    id="add-dept-desc"
                    className="form-textarea"
                    rows="2"
                    placeholder="Brief description of municipal scope and responsibilities..."
                    value={newDeptForm.description}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, description: e.target.value })}
                  />
                </div>

                {/* Department Head */}
                <div className="form-group">
                  <label htmlFor="add-dept-head" className="form-label">Department Head *</label>
                  <input 
                    id="add-dept-head"
                    type="text"
                    className={`form-input ${formErrors.head ? 'input-error' : ''}`}
                    placeholder="e.g. Dr. Sunil Rathore"
                    value={newDeptForm.head}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, head: e.target.value })}
                  />
                  {formErrors.head && <span className="error-text">{formErrors.head}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="add-dept-phone" className="form-label">Phone Hotline</label>
                  <input 
                    id="add-dept-phone"
                    type="text"
                    className="form-input"
                    placeholder="+91 98765 00000"
                    value={newDeptForm.phone}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, phone: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="add-dept-email" className="form-label">Official Email *</label>
                  <input 
                    id="add-dept-email"
                    type="email"
                    className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                    placeholder="health@smartcivic.gov.in"
                    value={newDeptForm.email}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, email: e.target.value })}
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>

                {/* Office Location */}
                <div className="form-group">
                  <label htmlFor="add-dept-loc" className="form-label">Office Location</label>
                  <input 
                    id="add-dept-loc"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Health Wing, City Centre"
                    value={newDeptForm.officeLocation}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, officeLocation: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-secondary-btn"
                  onClick={() => setIsAddDeptOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-primary-btn"
                >
                  <Plus size={14} />
                  <span>Create Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL D: ACTIVATE / DEACTIVATE CONFIRMATION DIALOG */}
      {confirmStatusDept && (
        <div className="dept-modal-backdrop" onClick={() => setConfirmStatusDept(null)}>
          <div 
            className="dept-modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="confirm-dept-title"
          >
            <div className="confirm-icon-wrap">
              {confirmStatusDept.targetStatus === 'Active' ? (
                <ShieldCheck size={28} style={{ color: 'var(--success)' }} />
              ) : (
                <ShieldAlert size={28} style={{ color: 'var(--danger)' }} />
              )}
            </div>

            <h3 id="confirm-dept-title" className="confirm-title">
              {confirmStatusDept.targetStatus === 'Active' ? 'Activate Department?' : 'Deactivate Department?'}
            </h3>

            <p className="confirm-desc">
              Are you sure you want to change status of <strong>{confirmStatusDept.dept.name} ({confirmStatusDept.dept.code})</strong> to <strong>{confirmStatusDept.targetStatus}</strong>?
              {confirmStatusDept.targetStatus === 'Inactive'
                ? ' New citizen complaints cannot be routed to inactive departments until reactivated.'
                : ' The department will immediately resume accepting municipal complaints and dispatching field workers.'}
            </p>

            <div className="confirm-btn-row">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => setConfirmStatusDept(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={`modal-primary-btn ${confirmStatusDept.targetStatus === 'Inactive' ? 'btn-danger' : ''}`}
                onClick={handleConfirmStatusChange}
              >
                Confirm {confirmStatusDept.targetStatus}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Departments;
