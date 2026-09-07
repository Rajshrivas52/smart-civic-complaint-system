import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  BellRing, 
  ClipboardList, 
  Building2, 
  User, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  X, 
  RotateCcw, 
  Check, 
  CheckCheck, 
  Trash2, 
  Mail, 
  MailOpen, 
  Eye, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ExternalLink,
  SlidersHorizontal,
  ShieldAlert,
  Info
} from 'lucide-react';

import './Notifications.css';

import { 
  initialNotifications, 
  getDateGroup 
} from '../../utils/mockNotificationData';

// Render type-specific icon
const renderTypeIcon = (type, size = 18) => {
  switch (type) {
    case 'complaint':
      return <ClipboardList size={size} />;
    case 'department':
      return <Building2 size={size} />;
    case 'user':
      return <User size={size} />;
    case 'system':
      return <BellRing size={size} />;
    default:
      return <Bell size={size} />;
  }
};

const Notifications = () => {
  const navigate = useNavigate();

  // Primary state: Mock notifications list
  const [notifications, setNotifications] = useState(initialNotifications);

  // Active Tab: 'All' | 'Unread' | 'Complaints' | 'Departments' | 'Users' | 'System'
  const [activeTab, setActiveTab] = useState('All');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [readFilter, setReadFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Selected notification IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Active 3-dots dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modals state
  const [viewingNotification, setViewingNotification] = useState(null);
  const [deletingNotification, setDeletingNotification] = useState(null); // Single item or 'bulk'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings mock state
  const [settingsForm, setSettingsForm] = useState({
    highPriorityAlerts: true,
    departmentEscalations: true,
    userAccountChanges: false,
    systemMaintenanceNotices: true,
    dailyDigestSummary: true
  });

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

  // Compute summary tab counts dynamically from `notifications`
  const tabCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      complaints: notifications.filter(n => n.type === 'complaint').length,
      departments: notifications.filter(n => n.type === 'department').length,
      users: notifications.filter(n => n.type === 'user').length,
      system: notifications.filter(n => n.type === 'system').length
    };
  }, [notifications]);

  // Handle Tab Click (synchronizes with type and read filters)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);

    if (tab === 'All') {
      setTypeFilter('All');
      setReadFilter('All');
    } else if (tab === 'Unread') {
      setTypeFilter('All');
      setReadFilter('Unread');
    } else if (tab === 'Complaints') {
      setTypeFilter('Complaint');
      setReadFilter('All');
    } else if (tab === 'Departments') {
      setTypeFilter('Department');
      setReadFilter('All');
    } else if (tab === 'Users') {
      setTypeFilter('User');
      setReadFilter('All');
    } else if (tab === 'System') {
      setTypeFilter('System');
      setReadFilter('All');
    }
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // 1. Tab filter check
      if (activeTab === 'Unread' && notif.read) return false;
      if (activeTab === 'Complaints' && notif.type !== 'complaint') return false;
      if (activeTab === 'Departments' && notif.type !== 'department') return false;
      if (activeTab === 'Users' && notif.type !== 'user') return false;
      if (activeTab === 'System' && notif.type !== 'system') return false;

      // 2. Search Query (Title, Message, Category, Sender, RelatedId, Area)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = notif.title.toLowerCase().includes(q);
        const matchMsg = notif.message.toLowerCase().includes(q);
        const matchCat = notif.category.toLowerCase().includes(q);
        const matchSender = notif.sender.toLowerCase().includes(q);
        const matchRel = notif.relatedId ? notif.relatedId.toLowerCase().includes(q) : false;
        const matchArea = notif.area ? notif.area.toLowerCase().includes(q) : false;

        if (!matchTitle && !matchMsg && !matchCat && !matchSender && !matchRel && !matchArea) {
          return false;
        }
      }

      // 3. Type Filter (if not overridden by tab)
      if (typeFilter !== 'All' && notif.type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // 4. Read Filter (if not overridden by tab)
      if (readFilter === 'Unread' && notif.read) return false;
      if (readFilter === 'Read' && !notif.read) return false;

      // 5. Priority Filter
      if (priorityFilter !== 'All' && notif.priority !== priorityFilter) {
        return false;
      }

      // 6. Date Filter
      if (dateFilter !== 'All') {
        const group = getDateGroup(notif.timestamp);
        const notifDate = new Date(notif.timestamp);
        const now = new Date('2026-09-06T23:59:59Z');
        const oneDay = 24 * 60 * 60 * 1000;

        if (dateFilter === 'Today' && group !== 'TODAY') return false;
        if (dateFilter === 'Yesterday' && group !== 'YESTERDAY') return false;
        if (dateFilter === 'Last 7 Days' && (now.getTime() - notifDate.getTime() > 7 * oneDay)) return false;
        if (dateFilter === 'Last 30 Days' && (now.getTime() - notifDate.getTime() > 30 * oneDay)) return false;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery, typeFilter, readFilter, priorityFilter, dateFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, readFilter, priorityFilter, dateFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage) || 1;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage, itemsPerPage]);

  // Group paginated notifications by date ('TODAY', 'YESTERDAY', 'EARLIER')
  const groupedNotifications = useMemo(() => {
    const groups = {
      TODAY: [],
      YESTERDAY: [],
      EARLIER: []
    };

    paginatedNotifications.forEach((notif) => {
      const g = getDateGroup(notif.timestamp);
      if (groups[g]) {
        groups[g].push(notif);
      } else {
        groups.EARLIER.push(notif);
      }
    });

    return groups;
  }, [paginatedNotifications]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    activeTab !== 'All' ||
    typeFilter !== 'All' ||
    readFilter !== 'All' ||
    priorityFilter !== 'All' ||
    dateFilter !== 'All'
  );

  const handleResetFilters = () => {
    setActiveTab('All');
    setSearchQuery('');
    setTypeFilter('All');
    setReadFilter('All');
    setPriorityFilter('All');
    setDateFilter('All');
    setSelectedIds(new Set());
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setSelectedIds(new Set());
  };

  // Toggle Read / Unread single item
  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    }));
  };

  // Selection Checkbox handling
  const handleToggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const isAllVisibleSelected = paginatedNotifications.length > 0 && 
    paginatedNotifications.every(n => selectedIds.has(n.id));

  const handleToggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      const next = new Set(selectedIds);
      paginatedNotifications.forEach(n => next.delete(n.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedNotifications.forEach(n => next.add(n.id));
      setSelectedIds(next);
    }
  };

  // Bulk Actions
  const handleBulkMarkAsRead = () => {
    setNotifications(prev => prev.map(n => {
      if (selectedIds.has(n.id)) {
        return { ...n, read: true };
      }
      return n;
    }));
    setSelectedIds(new Set());
  };

  const handleBulkMarkAsUnread = () => {
    setNotifications(prev => prev.map(n => {
      if (selectedIds.has(n.id)) {
        return { ...n, read: false };
      }
      return n;
    }));
    setSelectedIds(new Set());
  };

  const handleConfirmDelete = () => {
    if (!deletingNotification) return;

    if (deletingNotification === 'bulk') {
      setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
      setSelectedIds(new Set());
    } else {
      setNotifications(prev => prev.filter(n => n.id !== deletingNotification.id));
      if (selectedIds.has(deletingNotification.id)) {
        const next = new Set(selectedIds);
        next.delete(deletingNotification.id);
        setSelectedIds(next);
      }
    }

    setDeletingNotification(null);
  };

  // Related Entity Navigation helper
  const handleNavigateRelated = (notif) => {
    setViewingNotification(null);
    setActiveMenuId(null);

    if (notif.relatedEntity === 'complaint') {
      navigate('/admin/complaints');
    } else if (notif.relatedEntity === 'department') {
      navigate('/admin/departments');
    } else if (notif.relatedEntity === 'user') {
      navigate('/admin/users');
    } else if (notif.relatedEntity === 'map') {
      navigate('/admin/complaint-map');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="notifications-page-container">
      
      {/* 1. PAGE HEADER */}
      <header className="notif-header-card">
        <div className="notif-title-block">
          <div className="notif-title-row">
            <h1 className="notif-page-title">
              <Bell size={24} className="notif-title-icon" />
              <span>Notifications</span>
            </h1>
            {tabCounts.unread > 0 && (
              <span className="notif-unread-pill">
                {tabCounts.unread} unread
              </span>
            )}
          </div>
          <p className="notif-page-subtitle">
            Stay updated with complaints, department activity, users, and system alerts.
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="notif-action-btn notif-btn-readall"
            onClick={handleMarkAllAsRead}
            disabled={tabCounts.unread === 0}
            title="Mark all notifications as read"
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>

          <button 
            type="button" 
            className="notif-action-btn notif-btn-settings"
            onClick={() => setIsSettingsOpen(true)}
            title="Manage alert preferences"
          >
            <SlidersHorizontal size={16} />
            <span>Notification Settings</span>
          </button>
        </div>
      </header>

      {/* 2. SUMMARY / QUICK TABS */}
      <nav className="notif-tabs-strip" aria-label="Notification Category Tabs">
        <button
          type="button"
          className={`notif-tab ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => handleTabClick('All')}
        >
          <span>All</span>
          <span className="tab-counter">{tabCounts.all}</span>
        </button>

        <button
          type="button"
          className={`notif-tab ${activeTab === 'Unread' ? 'active' : ''}`}
          onClick={() => handleTabClick('Unread')}
        >
          <span>Unread</span>
          <span className={`tab-counter ${tabCounts.unread > 0 ? 'unread-count' : ''}`}>
            {tabCounts.unread}
          </span>
        </button>

        <button
          type="button"
          className={`notif-tab ${activeTab === 'Complaints' ? 'active' : ''}`}
          onClick={() => handleTabClick('Complaints')}
        >
          <ClipboardList size={14} />
          <span>Complaints</span>
          <span className="tab-counter">{tabCounts.complaints}</span>
        </button>

        <button
          type="button"
          className={`notif-tab ${activeTab === 'Departments' ? 'active' : ''}`}
          onClick={() => handleTabClick('Departments')}
        >
          <Building2 size={14} />
          <span>Departments</span>
          <span className="tab-counter">{tabCounts.departments}</span>
        </button>

        <button
          type="button"
          className={`notif-tab ${activeTab === 'Users' ? 'active' : ''}`}
          onClick={() => handleTabClick('Users')}
        >
          <User size={14} />
          <span>Users</span>
          <span className="tab-counter">{tabCounts.users}</span>
        </button>

        <button
          type="button"
          className={`notif-tab ${activeTab === 'System' ? 'active' : ''}`}
          onClick={() => handleTabClick('System')}
        >
          <BellRing size={14} />
          <span>System</span>
          <span className="tab-counter">{tabCounts.system}</span>
        </button>
      </nav>

      {/* 3. SEARCH & FILTERS CARD */}
      <section className="notif-filter-card" aria-label="Notification Filters">
        <div className="notif-search-wrapper">
          <Search size={16} className="notif-search-icon" />
          <input 
            type="text"
            className="notif-search-input"
            placeholder="Search notifications by title, message, category, sender or related ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search notifications"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="notif-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="notif-filters-grid">
          {/* Type */}
          <div className="notif-control-group">
            <label htmlFor="notif-filter-type" className="notif-control-label">Type</label>
            <select
              id="notif-filter-type"
              className={`notif-select ${typeFilter !== 'All' ? 'active-filter' : ''}`}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Complaint">Complaint</option>
              <option value="Department">Department</option>
              <option value="User">User</option>
              <option value="System">System</option>
            </select>
          </div>

          {/* Read Status */}
          <div className="notif-control-group">
            <label htmlFor="notif-filter-read" className="notif-control-label">Status</label>
            <select
              id="notif-filter-read"
              className={`notif-select ${readFilter !== 'All' ? 'active-filter' : ''}`}
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>

          {/* Priority */}
          <div className="notif-control-group">
            <label htmlFor="notif-filter-priority" className="notif-control-label">Priority</label>
            <select
              id="notif-filter-priority"
              className={`notif-select ${priorityFilter !== 'All' ? 'active-filter' : ''}`}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Date */}
          <div className="notif-control-group">
            <label htmlFor="notif-filter-date" className="notif-control-label">Date</label>
            <select
              id="notif-filter-date"
              className={`notif-select ${dateFilter !== 'All' ? 'active-filter' : ''}`}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button 
            type="button" 
            className="notif-reset-btn"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title="Reset filters and active search"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* 4. BULK ACTIONS TOOLBAR */}
      <section className="notif-toolbar-card" aria-label="Notification Bulk Actions">
        <div className="toolbar-left">
          <label className="select-all-label">
            <input 
              type="checkbox"
              className="notif-checkbox"
              checked={isAllVisibleSelected}
              onChange={handleToggleSelectAllVisible}
              aria-label="Select all visible notifications"
            />
            <span>Select All</span>
          </label>

          {selectedIds.size > 0 && (
            <span className="selected-count-badge">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        {selectedIds.size > 0 ? (
          <div className="toolbar-bulk-actions">
            <button 
              type="button" 
              className="bulk-btn bulk-btn-read"
              onClick={handleBulkMarkAsRead}
            >
              <MailOpen size={14} />
              <span>Mark as Read</span>
            </button>

            <button 
              type="button" 
              className="bulk-btn bulk-btn-unread"
              onClick={handleBulkMarkAsUnread}
            >
              <Mail size={14} />
              <span>Mark as Unread</span>
            </button>

            <button 
              type="button" 
              className="bulk-btn bulk-btn-delete"
              onClick={() => setDeletingNotification('bulk')}
            >
              <Trash2 size={14} />
              <span>Delete Selected</span>
            </button>

            <button 
              type="button" 
              className="bulk-btn bulk-btn-clear"
              onClick={() => setSelectedIds(new Set())}
            >
              <span>Clear</span>
            </button>
          </div>
        ) : (
          <div className="toolbar-info-text">
            Showing {filteredNotifications.length} notification{filteredNotifications.length === 1 ? '' : 's'}
          </div>
        )}
      </section>

      {/* 5. NOTIFICATION FEED (GROUPED BY DATE) */}
      <section className="notif-feed-section" aria-label="Notification Feed">
        {filteredNotifications.length === 0 ? (
          <div className="notif-empty-state">
            <div className="empty-bell-wrap">
              <Bell size={40} className="empty-bell-icon" />
            </div>
            <h3 className="empty-title">You're all caught up</h3>
            <p className="empty-subtitle">No notifications match your current filters or search query.</p>
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
          <div className="notif-groups-container">
            {['TODAY', 'YESTERDAY', 'EARLIER'].map((groupKey) => {
              const items = groupedNotifications[groupKey];
              if (!items || items.length === 0) return null;

              return (
                <div key={groupKey} className="notif-date-group">
                  <div className="group-divider">
                    <span className="group-title">{groupKey}</span>
                    <span className="group-line" />
                  </div>

                  <div className="notif-items-list">
                    {items.map((notif) => {
                      const isSelected = selectedIds.has(notif.id);
                      const isMenuOpen = activeMenuId === notif.id;

                      return (
                        <article 
                          key={notif.id} 
                          className={`notif-card ${!notif.read ? 'notif-unread' : 'notif-read'} ${isSelected ? 'notif-selected' : ''}`}
                        >
                          {/* Checkbox */}
                          <div className="notif-checkbox-cell">
                            <input 
                              type="checkbox"
                              className="notif-checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectOne(notif.id)}
                              aria-label={`Select ${notif.title}`}
                            />
                          </div>

                          {/* Category Type Icon */}
                          <div className={`notif-icon-box icon-${notif.type}`}>
                            {renderTypeIcon(notif.type, 18)}
                          </div>

                          {/* Main Content */}
                          <div className="notif-content-cell" onClick={() => setViewingNotification(notif)}>
                            <div className="notif-top-meta">
                              <span className="notif-category-tag">{notif.category}</span>
                              <span className={`notif-priority-tag pri-${notif.priority.toLowerCase()}`}>
                                {notif.priority}
                              </span>
                              {!notif.read && <span className="unread-dot" title="Unread notification" />}
                            </div>

                            <h4 className="notif-title">{notif.title}</h4>
                            <p className="notif-message">{notif.message}</p>

                            <div className="notif-bottom-meta">
                              <span className="meta-time">
                                <Clock size={12} />
                                {notif.timeAgo}
                              </span>
                              <span className="meta-sender">From: {notif.sender}</span>
                              {notif.relatedId && (
                                <span className="meta-related">
                                  ID: <strong>{notif.relatedId}</strong>
                                </span>
                              )}
                              {notif.area && (
                                <span className="meta-area">
                                  <MapPin size={11} />
                                  {notif.area}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="notif-actions-cell">
                            <button 
                              type="button" 
                              className="notif-quick-btn btn-view"
                              onClick={() => setViewingNotification(notif)}
                              title="View details"
                            >
                              <Eye size={14} />
                            </button>

                            <button 
                              type="button" 
                              className="notif-quick-btn btn-read-toggle"
                              onClick={() => handleToggleRead(notif.id)}
                              title={notif.read ? "Mark as unread" : "Mark as read"}
                            >
                              {notif.read ? <Mail size={14} /> : <MailOpen size={14} />}
                            </button>

                            {/* Dropdown Menu */}
                            <div className="notif-menu-wrapper" ref={isMenuOpen ? menuRef : null}>
                              <button 
                                type="button" 
                                className={`notif-quick-btn btn-more ${isMenuOpen ? 'active' : ''}`}
                                onClick={() => setActiveMenuId(isMenuOpen ? null : notif.id)}
                                aria-label="More notification options"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {isMenuOpen && (
                                <div className="notif-dropdown-menu">
                                  <button 
                                    type="button" 
                                    className="dropdown-item"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setViewingNotification(notif);
                                    }}
                                  >
                                    <Eye size={14} />
                                    <span>View Details</span>
                                  </button>

                                  <button 
                                    type="button" 
                                    className="dropdown-item"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleToggleRead(notif.id);
                                    }}
                                  >
                                    {notif.read ? <Mail size={14} /> : <MailOpen size={14} />}
                                    <span>{notif.read ? 'Mark as Unread' : 'Mark as Read'}</span>
                                  </button>

                                  {notif.relatedId && (
                                    <button 
                                      type="button" 
                                      className="dropdown-item"
                                      onClick={() => handleNavigateRelated(notif)}
                                    >
                                      <ExternalLink size={14} />
                                      <span>View Related Item</span>
                                    </button>
                                  )}

                                  <button 
                                    type="button" 
                                    className="dropdown-item dropdown-item-danger"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setDeletingNotification(notif);
                                    }}
                                  >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. PAGINATION BAR */}
        {filteredNotifications.length > 0 && (
          <div className="notif-pagination-bar">
            <div className="pagination-info">
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> – <strong>{Math.min(currentPage * itemsPerPage, filteredNotifications.length)}</strong> of <strong>{filteredNotifications.length}</strong> notifications
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
      {/* 7. MODALS                                                              */}
      {/* ====================================================================== */}

      {/* MODAL A: NOTIFICATION DETAILS MODAL */}
      {viewingNotification && (
        <div className="notif-modal-backdrop" onClick={() => setViewingNotification(null)}>
          <div 
            className="notif-modal-content view-notif-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-notif-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">{viewingNotification.id}</span>
                <h3 id="modal-notif-title" className="modal-title">{viewingNotification.title}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setViewingNotification(null)}
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Notification Badges Row */}
              <div className="detail-tags-row">
                <span className={`notif-priority-tag pri-${viewingNotification.priority.toLowerCase()}`}>
                  {viewingNotification.priority} Priority
                </span>
                <span className="notif-category-tag">
                  {viewingNotification.category}
                </span>
                <span className={`read-status-tag ${viewingNotification.read ? 'tag-read' : 'tag-unread'}`}>
                  {viewingNotification.read ? 'Read' : 'Unread'}
                </span>
              </div>

              {/* Message Banner */}
              <div className="detail-message-box">
                <h4 className="detail-msg-title">{viewingNotification.message}</h4>
                <p className="detail-desc">{viewingNotification.description}</p>
              </div>

              {/* Information Grid */}
              <div className="detail-info-grid">
                <div className="detail-field">
                  <span className="field-label">Received Timestamp</span>
                  <span className="field-val">
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    {new Date(viewingNotification.timestamp).toLocaleString()} ({viewingNotification.timeAgo})
                  </span>
                </div>

                <div className="detail-field">
                  <span className="field-label">Source / Sender</span>
                  <span className="field-val">
                    <Info size={13} style={{ color: 'var(--primary)' }} />
                    {viewingNotification.sender}
                  </span>
                </div>

                <div className="detail-field">
                  <span className="field-label">Related Entity</span>
                  <span className="field-val">
                    {renderTypeIcon(viewingNotification.type, 13)}
                    <span style={{ textTransform: 'capitalize' }}>{viewingNotification.relatedEntity}</span>
                  </span>
                </div>

                <div className="detail-field">
                  <span className="field-label">Related ID</span>
                  <span className="field-val">
                    <strong>{viewingNotification.relatedId || 'None'}</strong>
                  </span>
                </div>

                {viewingNotification.area && (
                  <div className="detail-field" style={{ gridColumn: 'span 2' }}>
                    <span className="field-label">Geographic Area</span>
                    <span className="field-val">
                      <MapPin size={13} style={{ color: 'var(--danger)' }} />
                      {viewingNotification.area}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => {
                  handleToggleRead(viewingNotification.id);
                  setViewingNotification(prev => ({ ...prev, read: !prev.read }));
                }}
              >
                {viewingNotification.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>

              {viewingNotification.relatedId && (
                <button 
                  type="button" 
                  className="modal-primary-btn"
                  onClick={() => handleNavigateRelated(viewingNotification)}
                >
                  <ExternalLink size={14} />
                  <span>View Related Item</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: DELETE CONFIRMATION DIALOG */}
      {deletingNotification && (
        <div className="notif-modal-backdrop" onClick={() => setDeletingNotification(null)}>
          <div 
            className="notif-modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="confirm-delete-title"
          >
            <div className="confirm-icon-wrap">
              <Trash2 size={26} style={{ color: 'var(--danger)' }} />
            </div>

            <h3 id="confirm-delete-title" className="confirm-title">
              {deletingNotification === 'bulk' ? `Delete ${selectedIds.size} Notifications?` : 'Delete Notification?'}
            </h3>

            <p className="confirm-desc">
              {deletingNotification === 'bulk'
                ? `Are you sure you want to delete ${selectedIds.size} selected notifications? This action cannot be undone.`
                : `Are you sure you want to delete "${deletingNotification.title}"? This alert will be removed from your activity log.`}
            </p>

            <div className="confirm-btn-row">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => setDeletingNotification(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="modal-primary-btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL C: NOTIFICATION SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="notif-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div 
            className="notif-modal-content settings-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="settings-title"
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="modal-badge-id">Preferences</span>
                <h3 id="settings-title" className="modal-title">Notification Settings</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close settings"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Configure alert delivery rules and municipal command-center notification triggers.
              </p>

              <div className="settings-toggles-list">
                <label className="settings-toggle-item">
                  <div className="toggle-label-block">
                    <span className="toggle-name">High-Priority Escalations</span>
                    <span className="toggle-desc">Instant notification when a severe civic hazard or safety issue is reported</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsForm.highPriorityAlerts}
                    onChange={(e) => setSettingsForm({ ...settingsForm, highPriorityAlerts: e.target.checked })}
                    className="notif-switch"
                  />
                </label>

                <label className="settings-toggle-item">
                  <div className="toggle-label-block">
                    <span className="toggle-name">Department Workload Thresholds</span>
                    <span className="toggle-desc">Alerts when a department's pending complaints exceed capacity thresholds</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsForm.departmentEscalations}
                    onChange={(e) => setSettingsForm({ ...settingsForm, departmentEscalations: e.target.checked })}
                    className="notif-switch"
                  />
                </label>

                <label className="settings-toggle-item">
                  <div className="toggle-label-block">
                    <span className="toggle-name">Citizen Account & Security Events</span>
                    <span className="toggle-desc">Notifications regarding account suspensions, role promotions, and registration bursts</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsForm.userAccountChanges}
                    onChange={(e) => setSettingsForm({ ...settingsForm, userAccountChanges: e.target.checked })}
                    className="notif-switch"
                  />
                </label>

                <label className="settings-toggle-item">
                  <div className="toggle-label-block">
                    <span className="toggle-name">System Maintenance & GIS Sync</span>
                    <span className="toggle-desc">Notices regarding map boundary sync, server backups, and maintenance windows</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsForm.systemMaintenanceNotices}
                    onChange={(e) => setSettingsForm({ ...settingsForm, systemMaintenanceNotices: e.target.checked })}
                    className="notif-switch"
                  />
                </label>

                <label className="settings-toggle-item">
                  <div className="toggle-label-block">
                    <span className="toggle-name">Daily Resolution Digest</span>
                    <span className="toggle-desc">Daily municipal performance and resolution velocity summary</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settingsForm.dailyDigestSummary}
                    onChange={(e) => setSettingsForm({ ...settingsForm, dailyDigestSummary: e.target.checked })}
                    className="notif-switch"
                  />
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="modal-secondary-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="modal-primary-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                <Check size={14} />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notifications;
