import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  UserCheck,
  Sparkles,
  Megaphone,
  AlertTriangle,
  Search,
  Filter,
  CheckCheck,
  X,
  ChevronRight,
  Eye,
  Trash2,
  ExternalLink,
  MapPin,
  Building2,
  ArrowUpDown,
  Mail,
  MailOpen,
  Info,
  Check,
  Wrench,
  FilePlus,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import './CitizenNotifications.css';

// Sample 24 Notifications realistic data
const initialNotificationsData = [
  {
    id: 'notif-1',
    title: 'Your complaint has been resolved',
    description: 'Complaint CIV-2026-00128 regarding a pothole near Main Road has been marked as resolved by the Road Maintenance Department.',
    timestamp: '10 minutes ago',
    date: '2026-09-16T21:19:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Resolved',
    badgeType: 'success',
    actionText: 'View Complaint',
    relatedId: 'CIV-2026-00128',
    read: false,
    department: 'Road Maintenance Department',
    location: 'Main Road, Sector 14',
    severity: 'High',
    iconType: 'check-circle'
  },
  {
    id: 'notif-2',
    title: 'Your complaint has been assigned',
    description: 'Complaint CIV-2026-00129 has been assigned to the Sanitation Department for further action.',
    timestamp: '1 hour ago',
    date: '2026-09-16T20:29:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Assigned',
    badgeType: 'primary',
    actionText: 'Track Complaint',
    relatedId: 'CIV-2026-00129',
    read: false,
    department: 'Sanitation Department',
    location: 'Market Complex, Block B',
    severity: 'Medium',
    iconType: 'user-check'
  },
  {
    id: 'notif-3',
    title: 'Work has started on your complaint',
    description: 'Field workers have started working on your reported water leakage issue.',
    timestamp: '2 hours ago',
    date: '2026-09-16T19:29:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'In Progress',
    badgeType: 'warning',
    actionText: 'View Details',
    relatedId: 'CIV-2026-00125',
    read: false,
    department: 'Water Supply & Sewerage Board',
    location: 'Green Avenue, Line 4',
    severity: 'High',
    iconType: 'clock'
  },
  {
    id: 'notif-4',
    title: 'Complaint submitted successfully',
    description: 'Your complaint CIV-2026-00130 has been received and is currently under review.',
    timestamp: 'Yesterday',
    date: '2026-09-15T15:00:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Submitted',
    badgeType: 'info',
    actionText: 'Track Complaint',
    relatedId: 'CIV-2026-00130',
    read: false,
    department: 'General Civic Redressal',
    location: 'Park Avenue, Sub-Zone 2',
    severity: 'Low',
    iconType: 'submitted'
  },
  {
    id: 'notif-5',
    title: 'AI analysis completed',
    description: 'Your uploaded image has been analyzed. Detected issue: Pothole. Suggested severity: High. You can review the details before submitting.',
    timestamp: 'Yesterday',
    date: '2026-09-15T12:30:00Z',
    type: 'ai_update',
    category: 'Complaint Updates',
    badge: 'AI Update',
    badgeType: 'purple',
    actionText: 'Review Complaint',
    relatedId: 'CIV-2026-00131',
    read: false,
    department: 'CivicAI Intelligent Inspection System',
    location: 'Central Ring Road',
    severity: 'High',
    iconType: 'sparkles'
  },
  {
    id: 'notif-6',
    title: 'New civic service announcement',
    description: 'Stay informed about local civic services and important community updates. Monsoon drainage clearance work starting this weekend.',
    timestamp: '2 days ago',
    date: '2026-09-14T09:00:00Z',
    type: 'announcement',
    category: 'Announcements',
    badge: 'Announcement',
    badgeType: 'default',
    actionText: 'Read More',
    relatedId: null,
    read: true,
    department: 'Municipal Corporation City Works',
    location: 'Citywide',
    severity: 'Info',
    iconType: 'megaphone'
  },
  {
    id: 'notif-7',
    title: 'Streetlight maintenance scheduled',
    description: 'Scheduled LED streetlight replacements are underway in Zone 4. Expect brief power fluctuations between 10 AM and 2 PM.',
    timestamp: '2 days ago',
    date: '2026-09-14T08:15:00Z',
    type: 'system_alert',
    category: 'System Alerts',
    badge: 'System Alert',
    badgeType: 'warning',
    actionText: 'View Schedule',
    relatedId: null,
    read: true,
    department: 'Electrical & Public Lighting Dept',
    location: 'Zone 4 Residential Sector',
    severity: 'Medium',
    iconType: 'alert'
  },
  {
    id: 'notif-8',
    title: 'Garbage collection route updated',
    description: 'Waste management schedules have been updated for Ward 12. Morning pickup now starts at 7:00 AM daily.',
    timestamp: '3 days ago',
    date: '2026-09-13T14:20:00Z',
    type: 'announcement',
    category: 'Announcements',
    badge: 'Announcement',
    badgeType: 'default',
    actionText: 'View Route',
    relatedId: null,
    read: true,
    department: 'Solid Waste Management Board',
    location: 'Ward 12 Residential Area',
    severity: 'Low',
    iconType: 'megaphone'
  },
  {
    id: 'notif-9',
    title: 'Feedback requested for CIV-2026-00115',
    description: 'Please rate your experience with the resolution of your streetlight repair complaint.',
    timestamp: '3 days ago',
    date: '2026-09-13T10:00:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Resolved',
    badgeType: 'success',
    actionText: 'Give Feedback',
    relatedId: 'CIV-2026-00115',
    read: true,
    department: 'Electrical & Public Lighting Dept',
    location: 'Sunrise Enclave',
    severity: 'Low',
    iconType: 'check-circle'
  },
  {
    id: 'notif-10',
    title: 'Verification required for water pipe repair',
    description: 'The department uploaded photo proof of completion for complaint CIV-2026-00110. Please confirm if satisfied.',
    timestamp: '4 days ago',
    date: '2026-09-12T16:45:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Verification',
    badgeType: 'info',
    actionText: 'Verify Resolution',
    relatedId: 'CIV-2026-00110',
    read: true,
    department: 'Water Supply & Sewerage Board',
    location: 'Block C, Metro Cross',
    severity: 'Medium',
    iconType: 'user-check'
  },
  {
    id: 'notif-11',
    title: 'AI detected duplicate complaint merged',
    description: 'Your report for broken traffic signal matches existing ticket CIV-2026-00108. We merged your ticket for faster tracking.',
    timestamp: '5 days ago',
    date: '2026-09-11T11:20:00Z',
    type: 'ai_update',
    category: 'Complaint Updates',
    badge: 'AI Update',
    badgeType: 'purple',
    actionText: 'View Ticket',
    relatedId: 'CIV-2026-00108',
    read: true,
    department: 'Traffic Control Bureau',
    location: 'Grand Junction Flyover',
    severity: 'High',
    iconType: 'sparkles'
  },
  {
    id: 'notif-12',
    title: 'System Maintenance Notice',
    description: 'CivicAI portal will undergo routine database maintenance on Sept 20 from 2:00 AM to 4:00 AM. Emergency hotline remains active.',
    timestamp: '6 days ago',
    date: '2026-09-10T18:00:00Z',
    type: 'system_alert',
    category: 'System Alerts',
    badge: 'System Alert',
    badgeType: 'warning',
    actionText: 'Read Details',
    relatedId: null,
    read: true,
    department: 'CivicAI IT Operations',
    location: 'Citywide Portal',
    severity: 'High',
    iconType: 'alert'
  },
  {
    id: 'notif-13',
    title: 'Inspection scheduled for CIV-2026-00104',
    description: 'Field engineer Rajesh Sharma has been assigned to inspect damaged pavement on 5th Cross Road.',
    timestamp: '1 week ago',
    date: '2026-09-09T14:10:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Assigned',
    badgeType: 'primary',
    actionText: 'View Inspector Details',
    relatedId: 'CIV-2026-00104',
    read: true,
    department: 'Road Maintenance Department',
    location: '5th Cross Road, Zone 2',
    severity: 'Medium',
    iconType: 'user-check'
  },
  {
    id: 'notif-14',
    title: 'Community Tree Planting Drive',
    description: 'Join the Ward 8 Green Initiative this Saturday at Central Park. Saplings and tools provided by Municipal Forestry.',
    timestamp: '1 week ago',
    date: '2026-09-08T09:30:00Z',
    type: 'announcement',
    category: 'Announcements',
    badge: 'Announcement',
    badgeType: 'default',
    actionText: 'RSVP Now',
    relatedId: null,
    read: true,
    department: 'Parks & Recreation Division',
    location: 'Central Park Green Belt',
    severity: 'Info',
    iconType: 'megaphone'
  },
  {
    id: 'notif-15',
    title: 'Drainage blockage cleared (CIV-2026-00098)',
    description: 'Heavy machinery team has cleared storm drain blockage near Metro Gate 3 ahead of rains.',
    timestamp: '1 week ago',
    date: '2026-09-07T17:15:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Resolved',
    badgeType: 'success',
    actionText: 'View Summary',
    relatedId: 'CIV-2026-00098',
    read: true,
    department: 'Stormwater & Drainage Dept',
    location: 'Metro Station Gate 3',
    severity: 'High',
    iconType: 'check-circle'
  },
  {
    id: 'notif-16',
    title: 'High priority alert: Water main repair',
    description: 'Emergency repair works on primary pipeline line 3. Water supply interrupted temporarily in East District.',
    timestamp: '2 weeks ago',
    date: '2026-09-02T08:00:00Z',
    type: 'system_alert',
    category: 'System Alerts',
    badge: 'System Alert',
    badgeType: 'danger',
    actionText: 'View Water Schedule',
    relatedId: null,
    read: true,
    department: 'Water Supply & Sewerage Board',
    location: 'East District Ward 4-9',
    severity: 'High',
    iconType: 'alert'
  },
  {
    id: 'notif-17',
    title: 'AI Priority Score Elevated (CIV-2026-00092)',
    description: 'CivicAI computer vision upgraded priority to High due to traffic safety hazard risk on Expressway exit.',
    timestamp: '2 weeks ago',
    date: '2026-09-01T13:40:00Z',
    type: 'ai_update',
    category: 'Complaint Updates',
    badge: 'AI Update',
    badgeType: 'purple',
    actionText: 'View Elevation Log',
    relatedId: 'CIV-2026-00092',
    read: true,
    department: 'CivicAI Intelligent Inspection System',
    location: 'City Expressway Exit 4',
    severity: 'High',
    iconType: 'sparkles'
  },
  {
    id: 'notif-18',
    title: 'Complaint CIV-2026-00085 closed by user',
    description: 'You marked complaint CIV-2026-00085 as closed. Thank you for using CivicAI.',
    timestamp: '2 weeks ago',
    date: '2026-08-31T11:00:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Closed',
    badgeType: 'default',
    actionText: 'View History',
    relatedId: 'CIV-2026-00085',
    read: true,
    department: 'Citizen Self-Service',
    location: 'Civic Center Mall',
    severity: 'Low',
    iconType: 'check-circle'
  },
  {
    id: 'notif-19',
    title: 'Property Tax Portal Upgrade',
    description: 'Online digital payment portal for civic property tax and utility bills updated with instant UPI zero fee checkout.',
    timestamp: '3 weeks ago',
    date: '2026-08-25T10:00:00Z',
    type: 'announcement',
    category: 'Announcements',
    badge: 'Announcement',
    badgeType: 'default',
    actionText: 'Explore Portal',
    relatedId: null,
    read: true,
    department: 'Municipal Revenue Department',
    location: 'Digital Portal',
    severity: 'Info',
    iconType: 'megaphone'
  },
  {
    id: 'notif-20',
    title: 'Sanitation drive completed in Ward 5',
    description: 'Special deep cleaning and fogging drive concluded across Ward 5 residential blocks.',
    timestamp: '3 weeks ago',
    date: '2026-08-22T16:00:00Z',
    type: 'announcement',
    category: 'Announcements',
    badge: 'Announcement',
    badgeType: 'default',
    actionText: 'View Report',
    relatedId: null,
    read: true,
    department: 'Sanitation Department',
    location: 'Ward 5 Residential Blocks',
    severity: 'Low',
    iconType: 'megaphone'
  },
  {
    id: 'notif-21',
    title: 'Complaint CIV-2026-00078 reassigned',
    description: 'Complaint regarding fallen tree branch transferred from Sanitation to Forestry Department.',
    timestamp: '1 month ago',
    date: '2026-08-16T12:00:00Z',
    type: 'complaint',
    category: 'Complaint Updates',
    badge: 'Assigned',
    badgeType: 'primary',
    actionText: 'Track Status',
    relatedId: 'CIV-2026-00078',
    read: true,
    department: 'Municipal Forestry Division',
    location: 'Lake View Road',
    severity: 'Medium',
    iconType: 'user-check'
  },
  {
    id: 'notif-22',
    title: 'AI Smart Routing verified ticket details',
    description: 'CivicAI NLP assigned ticket CIV-2026-00072 directly to Electrical Maintenance with 99.4% confidence.',
    timestamp: '1 month ago',
    date: '2026-08-14T09:10:00Z',
    type: 'ai_update',
    category: 'Complaint Updates',
    badge: 'AI Update',
    badgeType: 'purple',
    actionText: 'View Details',
    relatedId: 'CIV-2026-00072',
    read: true,
    department: 'CivicAI Intelligent Inspection System',
    location: 'Industrial Estate Gate 1',
    severity: 'Medium',
    iconType: 'sparkles'
  },
  {
    id: 'notif-23',
    title: 'Civic Townhall invitation',
    description: 'Join Mayor and Department Heads for quarterly smart city development Q&A session on September 28.',
    timestamp: '1 month ago',
    date: '2026-08-10T14:00:00Z',
    type: 'announcement',
    category: 'Announcements',
    badge: 'Announcement',
    badgeType: 'default',
    actionText: 'Register Event',
    relatedId: null,
    read: true,
    department: 'Office of Mayor & Smart City Cell',
    location: 'City Auditorium & Live Stream',
    severity: 'Info',
    iconType: 'megaphone'
  },
  {
    id: 'notif-24',
    title: 'Welcome to CivicAI Notification Center',
    description: 'Your citizen notification preferences are configured. You will receive real-time updates on all your submitted issues.',
    timestamp: '1 month ago',
    date: '2026-08-01T10:00:00Z',
    type: 'system_alert',
    category: 'System Alerts',
    badge: 'System Alert',
    badgeType: 'info',
    actionText: 'Manage Preferences',
    relatedId: null,
    read: true,
    department: 'CivicAI System Engine',
    location: 'User Account',
    severity: 'Low',
    iconType: 'alert'
  }
];

// Helper to render type icon
const NotificationIcon = ({ iconType, type }) => {
  switch (iconType) {
    case 'check-circle':
      return <CheckCircle2 className="icon-svg success" size={20} />;
    case 'user-check':
      return <UserCheck className="icon-svg primary" size={20} />;
    case 'clock':
      return <Clock className="icon-svg warning" size={20} />;
    case 'submitted':
      return <FilePlus className="icon-svg info" size={20} />;
    case 'sparkles':
      return <Sparkles className="icon-svg purple" size={20} />;
    case 'megaphone':
      return <Megaphone className="icon-svg default" size={20} />;
    case 'alert':
      return <AlertTriangle className="icon-svg danger" size={20} />;
    default:
      return <Bell className="icon-svg primary" size={20} />;
  }
};

const CitizenNotifications = () => {
  const navigate = useNavigate();

  // Primary State
  const [notifications, setNotifications] = useState(initialNotificationsData);
  
  // Controls & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState('All'); // 'All' | 'Unread' | 'Read'
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Complaint Updates' | 'System Alerts' | 'Announcements'
  const [sortBy, setSortBy] = useState('Newest'); // 'Newest' | 'Oldest'

  // Pagination / Load More State
  const [visibleCount, setVisibleCount] = useState(8);

  // Selected Notification for Detail Modal
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Dynamic Summary Counts
  const counts = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const complaintUpdates = notifications.filter(n => n.type === 'complaint' || n.type === 'ai_update').length;
    return { total, unread, complaintUpdates };
  }, [notifications]);

  // Filtered and Sorted Notifications
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        n.location.toLowerCase().includes(q) ||
        (n.relatedId && n.relatedId.toLowerCase().includes(q))
      );
    }

    // 2. Read status filter
    if (readFilter === 'Unread') {
      result = result.filter(n => !n.read);
    } else if (readFilter === 'Read') {
      result = result.filter(n => n.read);
    }

    // 3. Category type filter
    if (typeFilter !== 'All') {
      result = result.filter(n => n.category === typeFilter);
    }

    // 4. Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'Newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [notifications, searchQuery, readFilter, typeFilter, sortBy]);

  // Actions
  const handleMarkAsRead = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    showToast('Notification marked as read');
  };

  const handleToggleReadStatus = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const handleDeleteNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif(null);
    }
    showToast('Notification removed');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setReadFilter('All');
    setTypeFilter('All');
    setSortBy('Newest');
  };

  const handleViewComplaint = (relatedId) => {
    if (relatedId) {
      navigate(`/citizen/complaints/${relatedId}`);
    } else {
      navigate('/citizen/my-complaints');
    }
    setSelectedNotif(null);
  };

  const displayedNotifications = filteredNotifications.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNotifications.length;

  return (
    <div className="citizen-notifications-page animate-fade-in">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="notification-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <header className="page-header-container">
        <div className="header-text">
          <h1 className="header-title">
            Notifications
            {counts.unread > 0 && (
              <span className="unread-counter-badge">{counts.unread} unread</span>
            )}
          </h1>
          <p className="header-subtitle">Stay updated on your complaints and civic issues.</p>
        </div>

        <div className="header-quick-actions">
          <button
            className="btn btn-outline btn-mark-all"
            onClick={handleMarkAllAsRead}
            disabled={counts.unread === 0}
            title="Mark all notifications as read"
          >
            <CheckCheck size={18} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </header>

      {/* 2. Notification Summary Cards */}
      <div className="summary-cards-grid">
        <div
          className={`summary-card ${readFilter === 'All' && typeFilter === 'All' ? 'active-summary' : ''}`}
          onClick={() => { setReadFilter('All'); setTypeFilter('All'); }}
          role="button"
          tabIndex={0}
        >
          <div className="summary-card-icon icon-bg-primary">
            <Bell size={22} />
          </div>
          <div className="summary-card-info">
            <span className="summary-value">{counts.total}</span>
            <span className="summary-label">All Notifications</span>
          </div>
        </div>

        <div
          className={`summary-card ${readFilter === 'Unread' ? 'active-summary' : ''}`}
          onClick={() => { setReadFilter('Unread'); }}
          role="button"
          tabIndex={0}
        >
          <div className="summary-card-icon icon-bg-info">
            <MailOpen size={22} />
          </div>
          <div className="summary-card-info">
            <span className="summary-value">{counts.unread}</span>
            <span className="summary-label">Unread</span>
          </div>
        </div>

        <div
          className={`summary-card ${typeFilter === 'Complaint Updates' ? 'active-summary' : ''}`}
          onClick={() => { setTypeFilter('Complaint Updates'); setReadFilter('All'); }}
          role="button"
          tabIndex={0}
        >
          <div className="summary-card-icon icon-bg-success">
            <Wrench size={22} />
          </div>
          <div className="summary-card-info">
            <span className="summary-value">{counts.complaintUpdates}</span>
            <span className="summary-label">Complaint Updates</span>
          </div>
        </div>
      </div>

      {/* 3. Notification Controls Section */}
      <div className="controls-card">
        <div className="controls-row">
          {/* Search Input */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search notifications by title, ID, location, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="filters-flex">
            {/* Status Filter */}
            <div className="control-group">
              <label className="control-label">Status</label>
              <select
                className="control-select"
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Unread">Unread Only</option>
                <option value="Read">Read Only</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="control-group">
              <label className="control-label">Category</label>
              <select
                className="control-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Complaint Updates">Complaint Updates</option>
                <option value="System Alerts">System Alerts</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="control-group">
              <label className="control-label">Sort by</label>
              <select
                className="control-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {(searchQuery || readFilter !== 'All' || typeFilter !== 'All' || sortBy !== 'Newest') && (
              <button className="btn-reset-filters" onClick={handleClearFilters} title="Reset all filters">
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Notification List / Empty State */}
      {displayedNotifications.length === 0 ? (
        <div className="empty-state-card animate-fade-in">
          <div className="empty-state-illustration">
            <div className="bell-outer-ring">
              <div className="bell-inner-circle">
                <Bell size={42} className="empty-bell-icon" />
              </div>
            </div>
          </div>
          <h2 className="empty-state-title">You're all caught up!</h2>
          <p className="empty-state-description">
            {searchQuery || readFilter !== 'All' || typeFilter !== 'All'
              ? 'No notifications match your search query or selected filter criteria.'
              : "You don't have any new notifications right now. We'll notify you when there are updates on your complaints."}
          </p>
          <div className="empty-state-actions">
            {(searchQuery || readFilter !== 'All' || typeFilter !== 'All') ? (
              <button className="btn btn-outline" onClick={handleClearFilters}>
                <RotateCcw size={16} />
                Clear Filters
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate('/citizen/dashboard')}>
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="notifications-list-container">
          <div className="list-header-bar">
            <span className="list-showing-text">
              Showing <strong>{displayedNotifications.length}</strong> of <strong>{filteredNotifications.length}</strong> notifications
            </span>
            {counts.unread > 0 && (
              <button className="btn-text-action" onClick={handleMarkAllAsRead}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="notifications-list">
            {displayedNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item-card ${!notif.read ? 'unread-item' : 'read-item'}`}
                onClick={() => {
                  setSelectedNotif(notif);
                  if (!notif.read) {
                    handleMarkAsRead(notif.id);
                  }
                }}
              >
                {/* Unread Indicator Pill / Dot */}
                {!notif.read && <div className="unread-blue-dot" title="Unread notification" />}

                {/* Circular Icon Container */}
                <div className={`notification-icon-wrap icon-type-${notif.badgeType}`}>
                  <NotificationIcon iconType={notif.iconType} type={notif.type} />
                </div>

                {/* Notification Main Info */}
                <div className="notification-main-content">
                  <div className="notif-header-row">
                    <h3 className="notif-item-title">{notif.title}</h3>
                    <div className="notif-badges-row">
                      <span className={`badge badge-${notif.badgeType}`}>
                        {notif.badge}
                      </span>
                      <span className="notif-time-ago">{notif.timestamp}</span>
                    </div>
                  </div>

                  <p className="notif-item-description">{notif.description}</p>

                  <div className="notif-footer-row">
                    <div className="notif-meta-tags">
                      {notif.relatedId && (
                        <span className="meta-tag complaint-id-tag">
                          ID: <strong>{notif.relatedId}</strong>
                        </span>
                      )}
                      <span className="meta-tag dept-tag">
                        <Building2 size={12} /> {notif.department}
                      </span>
                      <span className="meta-tag loc-tag">
                        <MapPin size={12} /> {notif.location}
                      </span>
                    </div>

                    {/* Quick Action Button */}
                    <div className="notif-action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-sm btn-action-trigger"
                        onClick={() => {
                          setSelectedNotif(notif);
                          if (!notif.read) handleMarkAsRead(notif.id);
                        }}
                      >
                        <span>{notif.actionText}</span>
                        <ChevronRight size={14} />
                      </button>

                      {/* Options menu triggers */}
                      <button
                        className="btn-icon-subtle"
                        title={notif.read ? "Mark as unread" : "Mark as read"}
                        onClick={(e) => handleToggleReadStatus(notif.id, e)}
                      >
                        {notif.read ? <Mail size={15} /> : <MailOpen size={15} />}
                      </button>

                      <button
                        className="btn-icon-subtle btn-delete-subtle"
                        title="Delete notification"
                        onClick={(e) => handleDeleteNotification(notif.id, e)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="load-more-wrapper">
              <button
                className="btn btn-outline btn-load-more"
                onClick={() => setVisibleCount(prev => prev + 8)}
              >
                Load More Notifications ({filteredNotifications.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Notification Detail Modal */}
      {selectedNotif && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedNotif(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className={`modal-icon-box icon-type-${selectedNotif.badgeType}`}>
                  <NotificationIcon iconType={selectedNotif.iconType} type={selectedNotif.type} />
                </div>
                <div>
                  <span className={`badge badge-${selectedNotif.badgeType} modal-badge`}>
                    {selectedNotif.badge}
                  </span>
                  <h3 className="modal-title">{selectedNotif.title}</h3>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedNotif(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section message-box">
                <p className="modal-message-text">{selectedNotif.description}</p>
              </div>

              <div className="modal-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Date & Time</span>
                  <span className="detail-value">{new Date(selectedNotif.date).toLocaleString()}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedNotif.category}</span>
                </div>

                {selectedNotif.relatedId && (
                  <div className="detail-item">
                    <span className="detail-label">Complaint Reference</span>
                    <span className="detail-value highlight-id">{selectedNotif.relatedId}</span>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{selectedNotif.department}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Location / Area</span>
                  <span className="detail-value">{selectedNotif.location}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Priority Severity</span>
                  <span className="detail-value">{selectedNotif.severity}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-left">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleToggleReadStatus(selectedNotif.id)}
                >
                  {selectedNotif.read ? <Mail size={14} /> : <MailOpen size={14} />}
                  {selectedNotif.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </div>

              <div className="modal-footer-right">
                <button className="btn btn-outline" onClick={() => setSelectedNotif(null)}>
                  Close
                </button>
                {selectedNotif.relatedId ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewComplaint(selectedNotif.relatedId)}
                  >
                    View Complaint
                    <ExternalLink size={16} />
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/citizen/dashboard')}
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenNotifications;
