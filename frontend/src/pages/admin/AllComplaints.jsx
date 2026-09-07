import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Download, 
  Search, 
  X, 
  RotateCcw, 
  Eye, 
  MoreVertical, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Check, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  RefreshCw
} from 'lucide-react';

import './AllComplaints.css';

import { 
  mockComplaints, 
  adminComplaintsStats,
  COMPLAINT_STATUSES,
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_DEPARTMENTS,
  COMPLAINT_AREAS,
  COMPLAINT_DATE_FILTERS
} from '../../utils/mockData';

// Department list for modal assignment (excluding 'All' and 'Unassigned')
const ASSIGNABLE_DEPARTMENTS = [
  'Public Works',
  'Sanitation',
  'Water Supply',
  'Electricity',
  'Traffic Management',
  'Parks & Environment'
];

const STATUS_OPTIONS = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

// Reusable Priority Badge Component
export const PriorityBadge = ({ priority }) => {
  const normalized = (priority || 'medium').toLowerCase();
  let pillClass = 'priority-medium';
  if (normalized === 'high') pillClass = 'priority-high';
  if (normalized === 'low') pillClass = 'priority-low';

  return (
    <span className={`priority-pill ${pillClass}`}>
      <span className="priority-dot" />
      {priority}
    </span>
  );
};

// Reusable Status Badge Component
export const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();
  let pillClass = 'status-pending';
  let Icon = Clock;

  if (normalized === 'assigned') {
    pillClass = 'status-assigned';
    Icon = UserCheck;
  } else if (normalized === 'in progress') {
    pillClass = 'status-in-progress';
    Icon = Activity;
  } else if (normalized === 'resolved') {
    pillClass = 'status-resolved';
    Icon = CheckCircle2;
  } else if (normalized === 'rejected') {
    pillClass = 'status-rejected';
    Icon = XCircle;
  }

  return (
    <span className={`status-pill ${pillClass}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const AllComplaints = () => {
  const navigate = useNavigate();

  // Local state for complaints (enables in-memory updates for assigns & status changes)
  const [complaints, setComplaints] = useState(mockComplaints);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modals state
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    complaint: null,
    department: 'Public Works'
  });

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    complaint: null,
    status: 'In Progress',
    remark: ''
  });

  // Action dropdown open menu tracker (by complaint ID)
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Helper to show toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest('.actions-cell-group')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Keyboard shortcut: Esc closes modals and menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setAssignModal(prev => ({ ...prev, isOpen: false }));
        setStatusModal(prev => ({ ...prev, isOpen: false }));
        setActiveMenuId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Complaints refreshed successfully');
    }, 450);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setDepartmentFilter('All');
    setAreaFilter('All');
    setDateFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Filters cleared');
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    statusFilter !== 'All' ||
    categoryFilter !== 'All' ||
    priorityFilter !== 'All' ||
    departmentFilter !== 'All' ||
    areaFilter !== 'All' ||
    dateFilter !== 'All'
  );

  // Filtered & Sorted complaints memo
  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCitizen = (item.citizenName || '').toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesArea = (item.area || '').toLowerCase().includes(query) || (item.address || '').toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesCitizen && !matchesDesc && !matchesArea) {
          return false;
        }
      }

      // 2. Status
      if (statusFilter !== 'All' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // 3. Category
      if (categoryFilter !== 'All' && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // 4. Priority
      if (priorityFilter !== 'All' && item.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      // 5. Department
      if (departmentFilter !== 'All') {
        if (departmentFilter === 'Unassigned') {
          if (item.department && item.department !== 'Unassigned') return false;
        } else if (item.department !== departmentFilter) {
          return false;
        }
      }

      // 6. Area
      if (areaFilter !== 'All' && item.area !== areaFilter) {
        return false;
      }

      // 7. Date Filter
      if (dateFilter !== 'All') {
        const itemDate = new Date(item.submittedDate).getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const cutoff = new Date().setHours(0, 0, 0, 0);

        if (dateFilter === 'Today') {
          if (itemDate < cutoff) return false;
        } else if (dateFilter === 'Last 7 Days') {
          if (itemDate < cutoff - 6 * oneDay) return false;
        } else if (dateFilter === 'Last 30 Days') {
          if (itemDate < cutoff - 29 * oneDay) return false;
        } else if (dateFilter === 'This Year') {
          const itemYear = new Date(item.submittedDate).getFullYear();
          const currentYear = new Date().getFullYear();
          if (itemYear !== currentYear) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.submittedDate) - new Date(a.submittedDate);
      }
      if (sortBy === 'oldest') {
        return new Date(a.submittedDate) - new Date(b.submittedDate);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [complaints, searchQuery, statusFilter, categoryFilter, priorityFilter, departmentFilter, areaFilter, dateFilter, sortBy]);

  // Helper filter update functions that also reset pagination
  const updateSearchQuery = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };
  const updateStatusFilter = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };
  const updateCategoryFilter = (val) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };
  const updatePriorityFilter = (val) => {
    setPriorityFilter(val);
    setCurrentPage(1);
  };
  const updateDepartmentFilter = (val) => {
    setDepartmentFilter(val);
    setCurrentPage(1);
  };
  const updateAreaFilter = (val) => {
    setAreaFilter(val);
    setCurrentPage(1);
  };
  const updateDateFilter = (val) => {
    setDateFilter(val);
    setCurrentPage(1);
  };
  const updateSortBy = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredComplaints.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredComplaints, currentPage, itemsPerPage]);

  // Navigate to complaint details
  const handleViewDetails = (complaintId) => {
    navigate(`/admin/complaints/${complaintId}`);
  };

  // Open Assign Modal
  const openAssignModal = (complaint) => {
    setActiveMenuId(null);
    setAssignModal({
      isOpen: true,
      complaint,
      department: complaint.department && complaint.department !== 'Unassigned' 
        ? complaint.department 
        : 'Public Works'
    });
  };

  // Submit Assign Department
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignModal.complaint) return;

    const updatedDept = assignModal.department;
    const targetId = assignModal.complaint.id;

    setComplaints(prev => prev.map(item => {
      if (item.id === targetId) {
        return {
          ...item,
          department: updatedDept,
          status: item.status === 'Pending' ? 'Assigned' : item.status
        };
      }
      return item;
    }));

    setAssignModal({ isOpen: false, complaint: null, department: 'Public Works' });
    showToast(`Complaint ${targetId} successfully assigned to ${updatedDept}`);
  };

  // Open Update Status Modal
  const openStatusModal = (complaint) => {
    setActiveMenuId(null);
    setStatusModal({
      isOpen: true,
      complaint,
      status: complaint.status,
      remark: ''
    });
  };

  // Submit Update Status
  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!statusModal.complaint) return;

    const updatedStatus = statusModal.status;
    const targetId = statusModal.complaint.id;

    setComplaints(prev => prev.map(item => {
      if (item.id === targetId) {
        return {
          ...item,
          status: updatedStatus
        };
      }
      return item;
    }));

    setStatusModal({ isOpen: false, complaint: null, status: 'In Progress', remark: '' });
    showToast(`Complaint ${targetId} status updated to ${updatedStatus}`);
  };

  // Export CSV of currently filtered complaints
  const handleExportCSV = () => {
    if (filteredComplaints.length === 0) {
      showToast('No complaints to export', 'error');
      return;
    }

    const headers = ['Complaint ID', 'Title', 'Citizen', 'Category', 'Priority', 'Department', 'Status', 'Area', 'Submitted Date'];
    const rows = filteredComplaints.map(c => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.citizenName || 'Unknown'}"`,
      `"${c.category}"`,
      `"${c.priority}"`,
      `"${c.department || 'Unassigned'}"`,
      `"${c.status}"`,
      `"${c.area || ''}"`,
      `"${c.submittedText || c.submittedDate}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_civic_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredComplaints.length} complaints to CSV`);
  };

  return (
    <div className="all-complaints-page">
      
      {/* 1. HEADER */}
      <header className="complaints-header-card">
        <div className="complaints-title-area">
          <h1 className="complaints-main-title">
            All Complaints
            <span className="complaints-badge-counter">{complaints.length} Records</span>
          </h1>
          <p className="complaints-subtitle">
            Review, manage and track civic complaints across the city.
          </p>
        </div>

        <div className="complaints-header-actions">
          <button 
            type="button" 
            className={`refresh-icon-btn ${isLoading ? 'spinning' : ''}`} 
            onClick={handleRefresh}
            title="Refresh Complaints"
            aria-label="Refresh Complaints"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            type="button" 
            className="export-btn"
            onClick={handleExportCSV}
            title="Download CSV report of current complaints"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* 2. SUMMARY CARDS */}
      <section className="complaints-kpi-grid" aria-label="Summary KPIs">
        {/* Total Complaints */}
        <div className="kpi-card kpi-total">
          <div className="kpi-header">
            <span className="kpi-label">Total Complaints</span>
            <div className="kpi-icon-wrap">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="kpi-number">{adminComplaintsStats.total}</div>
          <div className="kpi-footer">
            <span>Overall civic issue volume</span>
          </div>
        </div>

        {/* Pending */}
        <div className="kpi-card kpi-pending">
          <div className="kpi-header">
            <span className="kpi-label">Pending</span>
            <div className="kpi-icon-wrap">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-number">{adminComplaintsStats.pending}</div>
          <div className="kpi-footer">
            <span>Requires review or triage</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="kpi-card kpi-progress">
          <div className="kpi-header">
            <span className="kpi-label">In Progress</span>
            <div className="kpi-icon-wrap">
              <Activity size={18} />
            </div>
          </div>
          <div className="kpi-number">{adminComplaintsStats.inProgress}</div>
          <div className="kpi-footer">
            <span>Under field crew resolution</span>
          </div>
        </div>

        {/* High Priority */}
        <div className="kpi-card kpi-priority">
          <div className="kpi-header">
            <span className="kpi-label">High Priority</span>
            <div className="kpi-icon-wrap">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-number">{adminComplaintsStats.highPriority}</div>
          <div className="kpi-footer">
            <span>Urgent municipal attention</span>
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <section className="filter-toolbar-card" aria-label="Search and Filter Controls">
        {/* Top search & sorting row */}
        <div className="filter-top-row">
          <div className="search-input-wrapper">
            <Search size={17} className="search-icon-adornment" />
            <input 
              type="text"
              className="complaints-search-input"
              placeholder="Search complaints by ID, title, citizen, description or area..."
              value={searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              aria-label="Search complaints"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => updateSearchQuery('')}
                aria-label="Clear search input"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="sort-container">
            <label htmlFor="complaints-sort" className="sort-label">
              <ArrowUpDown size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Sort:
            </label>
            <select 
              id="complaints-sort"
              className="sort-select"
              value={sortBy}
              onChange={(e) => updateSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Filters Grid Row */}
        <div className="filters-grid-row">
          {/* Status Filter */}
          <div className="filter-control-group">
            <label htmlFor="filter-status" className="filter-control-label">Status</label>
            <select 
              id="filter-status"
              className={`filter-select ${statusFilter !== 'All' ? 'active-filter' : ''}`}
              value={statusFilter}
              onChange={(e) => updateStatusFilter(e.target.value)}
            >
              {COMPLAINT_STATUSES.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-control-group">
            <label htmlFor="filter-category" className="filter-control-label">Category</label>
            <select 
              id="filter-category"
              className={`filter-select ${categoryFilter !== 'All' ? 'active-filter' : ''}`}
              value={categoryFilter}
              onChange={(e) => updateCategoryFilter(e.target.value)}
            >
              {COMPLAINT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-control-group">
            <label htmlFor="filter-priority" className="filter-control-label">Priority</label>
            <select 
              id="filter-priority"
              className={`filter-select ${priorityFilter !== 'All' ? 'active-filter' : ''}`}
              value={priorityFilter}
              onChange={(e) => updatePriorityFilter(e.target.value)}
            >
              {COMPLAINT_PRIORITIES.map(pr => (
                <option key={pr} value={pr}>{pr === 'All' ? 'All Priorities' : pr}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="filter-control-group">
            <label htmlFor="filter-dept" className="filter-control-label">Department</label>
            <select 
              id="filter-dept"
              className={`filter-select ${departmentFilter !== 'All' ? 'active-filter' : ''}`}
              value={departmentFilter}
              onChange={(e) => updateDepartmentFilter(e.target.value)}
            >
              {COMPLAINT_DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="filter-control-group">
            <label htmlFor="filter-area" className="filter-control-label">Area</label>
            <select 
              id="filter-area"
              className={`filter-select ${areaFilter !== 'All' ? 'active-filter' : ''}`}
              value={areaFilter}
              onChange={(e) => updateAreaFilter(e.target.value)}
            >
              {COMPLAINT_AREAS.map(area => (
                <option key={area} value={area}>{area === 'All' ? 'All Areas' : area}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="filter-control-group">
            <label htmlFor="filter-date" className="filter-control-label">Date</label>
            <select 
              id="filter-date"
              className={`filter-select ${dateFilter !== 'All' ? 'active-filter' : ''}`}
              value={dateFilter}
              onChange={(e) => updateDateFilter(e.target.value)}
            >
              {COMPLAINT_DATE_FILTERS.map(df => (
                <option key={df} value={df}>{df === 'All' ? 'All Dates' : df}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <button 
            type="button"
            className="clear-filters-btn"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            title="Reset all search queries and filters"
          >
            <RotateCcw size={13} />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* Filter Results Summary */}
        <div className="filter-status-summary">
          <div>
            Showing <span className="filter-count-badge">{filteredComplaints.length}</span> matching complaint{filteredComplaints.length === 1 ? '' : 's'}
            {hasActiveFilters && <span style={{ color: 'var(--primary)', marginLeft: '0.4rem', fontWeight: 500 }}>(Filtered)</span>}
          </div>
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                Active criteria applied
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 4. COMPLAINTS TABLE / CARD WORKSPACE */}
      <section className="complaints-table-card" aria-label="Complaints List">
        {isLoading ? (
          /* Loading State */
          <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="skeleton-row" style={{ borderRadius: '6px' }} />
            <div className="skeleton-row" style={{ borderRadius: '6px' }} />
            <div className="skeleton-row" style={{ borderRadius: '6px' }} />
            <div className="skeleton-row" style={{ borderRadius: '6px' }} />
            <div className="skeleton-row" style={{ borderRadius: '6px' }} />
          </div>
        ) : filteredComplaints.length === 0 ? (
          /* Empty State */
          <div className="complaints-empty-state">
            <div className="empty-state-icon-box">
              <Search size={32} />
            </div>
            <h3 className="empty-state-title">No complaints found</h3>
            <p className="empty-state-text">
              Try changing your search or filter criteria.
            </p>
            <button 
              type="button" 
              className="clear-filters-btn" 
              style={{ height: 'auto', padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary)', color: '#ffffff', border: 'none' }}
              onClick={handleClearFilters}
            >
              <RotateCcw size={14} />
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View (>= 860px) */}
            <div className="table-responsive-wrapper">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Complaint</th>
                    <th>Citizen</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Submitted</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedComplaints.map((complaint) => {
                    const isHighPriority = complaint.priority.toLowerCase() === 'high';
                    const isUnassigned = !complaint.department || complaint.department === 'Unassigned';

                    return (
                      <tr 
                        key={complaint.id} 
                        className={isHighPriority ? 'row-high-priority' : ''}
                      >
                        {/* 1. Complaint ID */}
                        <td className="col-id">
                          {complaint.id}
                        </td>

                        {/* 2. Complaint Title & Thumbnail */}
                        <td>
                          <div className="complaint-cell-content">
                            {complaint.image && (
                              <img 
                                src={complaint.image} 
                                alt={complaint.title} 
                                className="complaint-thumbnail" 
                                loading="lazy"
                              />
                            )}
                            <div className="complaint-title-group">
                              <span className="complaint-title-text" title={complaint.title}>
                                {complaint.title}
                              </span>
                              <span className="complaint-id-sub">
                                Ref #{complaint.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Citizen */}
                        <td>
                          <div className="citizen-cell">
                            <div className="citizen-avatar-initial">
                              {(complaint.citizenName || 'C').charAt(0)}
                            </div>
                            <span className="citizen-name-text">
                              {complaint.citizenName || 'Citizen User'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Category */}
                        <td>
                          <span className="category-tag">
                            {complaint.category}
                          </span>
                        </td>

                        {/* 5. Priority */}
                        <td>
                          <PriorityBadge priority={complaint.priority} />
                        </td>

                        {/* 6. Department */}
                        <td>
                          {isUnassigned ? (
                            <span className="dept-unassigned" title="Requires department assignment">
                              <AlertTriangle size={12} />
                              Unassigned
                            </span>
                          ) : (
                            <span className="dept-pill">
                              <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                              {complaint.department}
                            </span>
                          )}
                        </td>

                        {/* 7. Status */}
                        <td>
                          <StatusBadge status={complaint.status} />
                        </td>

                        {/* 8. Location */}
                        <td>
                          <span className="location-pill" title={complaint.address || complaint.area}>
                            <MapPin size={13} className="location-pin-icon" />
                            {complaint.area || 'City Area'}
                          </span>
                        </td>

                        {/* 9. Submitted Date */}
                        <td>
                          <span className="submitted-time-text">
                            {complaint.submittedText || 'Recently'}
                          </span>
                        </td>

                        {/* 10. Actions */}
                        <td>
                          <div className="actions-cell-group" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="view-btn"
                              onClick={() => handleViewDetails(complaint.id)}
                              title="View full complaint details"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              className="more-action-btn"
                              aria-label={`Actions for ${complaint.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === complaint.id ? null : complaint.id);
                              }}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === complaint.id && (
                              <div className="actions-dropdown-menu">
                                <button
                                  type="button"
                                  className="dropdown-item-btn"
                                  onClick={() => handleViewDetails(complaint.id)}
                                >
                                  <Eye size={14} />
                                  <span>View Details</span>
                                </button>
                                <button
                                  type="button"
                                  className="dropdown-item-btn"
                                  onClick={() => openAssignModal(complaint)}
                                >
                                  <Building2 size={14} />
                                  <span>Assign Department</span>
                                </button>
                                <button
                                  type="button"
                                  className="dropdown-item-btn"
                                  onClick={() => openStatusModal(complaint)}
                                >
                                  <Activity size={14} />
                                  <span>Change Status</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 860px) */}
            <div className="complaints-mobile-cards-list">
              {paginatedComplaints.map((complaint) => {
                const isHigh = complaint.priority.toLowerCase() === 'high';
                const isUnassigned = !complaint.department || complaint.department === 'Unassigned';

                return (
                  <article 
                    key={complaint.id} 
                    className={`mobile-complaint-card ${isHigh ? 'mobile-high-priority' : ''}`}
                  >
                    <div className="mobile-card-header">
                      <span className="col-id">{complaint.id}</span>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <PriorityBadge priority={complaint.priority} />
                        <StatusBadge status={complaint.status} />
                      </div>
                    </div>

                    <h4 className="mobile-card-title">{complaint.title}</h4>

                    <div className="mobile-card-meta-row">
                      <div className="mobile-meta-item">
                        <span className="mobile-meta-label">Citizen</span>
                        <span style={{ fontWeight: 500 }}>{complaint.citizenName || 'Citizen'}</span>
                      </div>
                      <div className="mobile-meta-item">
                        <span className="mobile-meta-label">Category</span>
                        <span>{complaint.category}</span>
                      </div>
                      <div className="mobile-meta-item">
                        <span className="mobile-meta-label">Department</span>
                        {isUnassigned ? (
                          <span className="dept-unassigned" style={{ alignSelf: 'flex-start' }}>
                            Unassigned
                          </span>
                        ) : (
                          <span>{complaint.department}</span>
                        )}
                      </div>
                      <div className="mobile-meta-item">
                        <span className="mobile-meta-label">Location</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <MapPin size={11} color="#ef4444" />
                          {complaint.area}
                        </span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <button 
                        type="button" 
                        className="mobile-action-btn primary"
                        onClick={() => handleViewDetails(complaint.id)}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button 
                        type="button" 
                        className="mobile-action-btn"
                        onClick={() => openAssignModal(complaint)}
                      >
                        <Building2 size={14} />
                        <span>Assign</span>
                      </button>
                      <button 
                        type="button" 
                        className="mobile-action-btn"
                        onClick={() => openStatusModal(complaint)}
                      >
                        <Activity size={14} />
                        <span>Status</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* 5. PAGINATION */}
            <footer className="complaints-pagination-bar">
              <div className="pagination-info-text">
                Showing{' '}
                <strong>
                  {Math.min((currentPage - 1) * itemsPerPage + 1, filteredComplaints.length)}
                  –
                  {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
                </strong>{' '}
                of <strong>{filteredComplaints.length}</strong> complaints
              </div>

              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </>
        )}
      </section>

      {/* ====================================================================
          MODAL 1: ASSIGN DEPARTMENT
          ==================================================================== */}
      {assignModal.isOpen && assignModal.complaint && (
        <div className="modal-overlay" onClick={() => setAssignModal({ ...assignModal, isOpen: false })}>
          <div 
            className="modal-dialog-box" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="assign-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="assign-modal-title" className="modal-title">
                <Building2 size={18} style={{ color: 'var(--primary)' }} />
                Assign Department
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setAssignModal({ ...assignModal, isOpen: false })}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <div className="modal-info-summary">
                  <span className="modal-complaint-id-tag">{assignModal.complaint.id}</span>
                  <span className="modal-complaint-title">{assignModal.complaint.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Current Department: <strong>{assignModal.complaint.department || 'Unassigned'}</strong>
                  </span>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="assign-dept-select" className="modal-form-label">
                    Select Target Department *
                  </label>
                  <select
                    id="assign-dept-select"
                    className="modal-form-select"
                    value={assignModal.department}
                    onChange={(e) => setAssignModal({ ...assignModal, department: e.target.value })}
                    required
                  >
                    {ASSIGNABLE_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setAssignModal({ ...assignModal, isOpen: false })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-primary"
                >
                  <Check size={16} />
                  <span>Assign Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: UPDATE COMPLAINT STATUS
          ==================================================================== */}
      {statusModal.isOpen && statusModal.complaint && (
        <div className="modal-overlay" onClick={() => setStatusModal({ ...statusModal, isOpen: false })}>
          <div 
            className="modal-dialog-box" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="status-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="status-modal-title" className="modal-title">
                <Activity size={18} style={{ color: 'var(--primary)' }} />
                Update Complaint Status
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit}>
              <div className="modal-body">
                <div className="modal-info-summary">
                  <span className="modal-complaint-id-tag">{statusModal.complaint.id}</span>
                  <span className="modal-complaint-title">{statusModal.complaint.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Status:</span>
                    <StatusBadge status={statusModal.complaint.status} />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="update-status-select" className="modal-form-label">
                    New Status *
                  </label>
                  <select
                    id="update-status-select"
                    className="modal-form-select"
                    value={statusModal.status}
                    onChange={(e) => setStatusModal({ ...statusModal, status: e.target.value })}
                    required
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="admin-remark-textarea" className="modal-form-label">
                    Admin Remark (Optional)
                  </label>
                  <textarea
                    id="admin-remark-textarea"
                    className="modal-form-textarea"
                    rows={3}
                    placeholder="Enter reason for status change or internal notes..."
                    value={statusModal.remark}
                    onChange={(e) => setStatusModal({ ...statusModal, remark: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-primary"
                >
                  <Check size={16} />
                  <span>Update Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST NOTIFICATION
          ==================================================================== */}
      {toast.show && (
        <div className="complaints-toast-alert" role="status" aria-live="polite">
          <div className="toast-icon-box">
            <CheckCircle2 size={18} />
          </div>
          <span>{toast.message}</span>
          <button 
            type="button" 
            className="toast-close-btn" 
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
};

export default AllComplaints;
