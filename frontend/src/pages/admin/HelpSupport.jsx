import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  CircleHelp, 
  Search, 
  FileText, 
  Users, 
  Building2, 
  BarChart2, 
  MapPin, 
  Bell, 
  Settings as SettingsIcon, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Send, 
  CheckCircle, 
  Clock, 
  X, 
  RotateCcw, 
  Mail, 
  Phone, 
  Shield, 
  ExternalLink, 
  MessageSquare, 
  LifeBuoy, 
  AlertCircle, 
  ArrowRight,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

import './HelpSupport.css';

// --------------------------------------------------------------------------
// MOCK DATA SETS
// --------------------------------------------------------------------------

const initialSupportRequests = [
  {
    ticketId: 'SUP-1001',
    subject: 'Google Maps not loading in GIS interactive module',
    category: 'Maps',
    priority: 'High',
    status: 'Open',
    createdAt: 'Today, 10:24 AM',
    lastUpdated: '15 mins ago',
    description: 'The GIS Complaint Map page displays a blank tile container when zooming into Sector 4 hotspot cluster. Satellite view fails to render street markers.',
    supportResponse: 'Our technical infrastructure team is investigating the Google Maps JavaScript API quota and CDN tile provider.'
  },
  {
    ticketId: 'SUP-1002',
    subject: 'Unable to assign complaint to Sanitation staff',
    category: 'Complaint Management',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: 'Yesterday, 04:15 PM',
    lastUpdated: '2 hours ago',
    description: 'When assigning complaint CMP1048 to the Solid Waste division, the dropdown menu occasionally freezes on mobile tablet viewports.',
    supportResponse: 'Assigned to the frontend engineering squad. A hotfix patch for dropdown touch handlers is currently in staging.'
  },
  {
    ticketId: 'SUP-1003',
    subject: 'User account verification glitch on citizen portal',
    category: 'User Management',
    priority: 'Low',
    status: 'Resolved',
    createdAt: 'Sep 3, 2026',
    lastUpdated: 'Sep 4, 2026',
    description: 'Citizen USR-1024 reported not receiving the activation confirmation code after registering through the public landing page.',
    supportResponse: 'Email verification queue cleared and user account manually verified. Confirmed citizen successfully logged in.'
  },
  {
    ticketId: 'SUP-1004',
    subject: 'Automated escalation delay for high priority civic issues',
    category: 'Notifications',
    priority: 'High',
    status: 'Open',
    createdAt: 'Sep 5, 2026',
    lastUpdated: 'Yesterday',
    description: 'Complaints marked with High Priority are taking up to 45 minutes to trigger the admin notification banner instead of real-time broadcast.',
    supportResponse: 'Notification polling background worker inspected; worker thread concurrency being scaled.'
  },
  {
    ticketId: 'SUP-1005',
    subject: 'Department resolution rate calculation query in Analytics',
    category: 'Analytics',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: 'Sep 4, 2026',
    lastUpdated: 'Yesterday, 06:30 PM',
    description: 'Water & Sanitation resolution rate shows 88% while closed complaints count indicates 92% based on month-to-date figures.',
    supportResponse: 'Reviewing KPI formulas in Analytics service. The metric accounts for unresolved complaints from previous quarterly roll-over.'
  },
  {
    ticketId: 'SUP-1006',
    subject: 'Municipal zone boundary update request for North Sector',
    category: 'Maps',
    priority: 'Low',
    status: 'Closed',
    createdAt: 'Sep 1, 2026',
    lastUpdated: 'Sep 2, 2026',
    description: 'Requesting updated GeoJSON ward coordinates to reflect recently rezoned civic subdivisions in North Sector Ward 12.',
    supportResponse: 'New GeoJSON boundary polygons imported into administrative GIS layer.'
  }
];

const helpCategories = [
  { id: 'Complaint Management', title: 'Complaint Management', count: 8, icon: FileText },
  { id: 'User Management', title: 'User Management', count: 6, icon: Users },
  { id: 'Department Management', title: 'Department Management', count: 5, icon: Building2 },
  { id: 'Analytics & Reports', title: 'Analytics & Reports', count: 4, icon: BarChart2 },
  { id: 'Maps & Locations', title: 'Maps & Locations', count: 3, icon: MapPin },
  { id: 'Notifications', title: 'Notifications', count: 4, icon: Bell },
  { id: 'Account & Settings', title: 'Account & Settings', count: 5, icon: SettingsIcon },
  { id: 'Technical Issues', title: 'Technical Issues', count: 4, icon: Shield }
];

const quickHelpCards = [
  {
    icon: FileText,
    title: 'Complaint Management',
    desc: 'Learn how to review, assign, filter, and resolve citizen complaints.',
    category: 'Complaint Management',
    link: '/admin/complaints'
  },
  {
    icon: Users,
    title: 'Users & Accounts',
    desc: 'Manage citizen and department staff accounts, status, and permissions.',
    category: 'User Management',
    link: '/admin/users'
  },
  {
    icon: Building2,
    title: 'Departments',
    desc: 'Manage municipal divisions, staff assignments, and workload distribution.',
    category: 'Department Management',
    link: '/admin/departments'
  },
  {
    icon: BarChart2,
    title: 'Analytics',
    desc: 'Understand complaint trends, SLA resolution metrics, and department throughput.',
    category: 'Analytics & Reports',
    link: '/admin/analytics'
  },
  {
    icon: MapPin,
    title: 'Complaint Map',
    desc: 'Monitor civic issue geographic clusters and hotspot density in real-time.',
    category: 'Maps & Locations',
    link: '/admin/complaint-map'
  },
  {
    icon: Bell,
    title: 'Notifications',
    desc: 'Configure alert triggers, escalation notices, and daily administrative digests.',
    category: 'Notifications',
    link: '/admin/notifications'
  }
];

const faqData = [
  {
    id: 1,
    question: 'How do I assign a complaint to a department?',
    answer: 'Open All Complaints, select the target complaint from the list, click "Assign Department", choose the appropriate municipal department (such as Public Works or Water Supply) from the dropdown, and confirm the assignment.',
    category: 'Complaint Management',
    relatedRoute: '/admin/complaints',
    relatedText: 'Go to All Complaints'
  },
  {
    id: 2,
    question: 'How do I change a complaint status?',
    answer: 'In the All Complaints table or Complaint Details drawer, click the Status dropdown menu for the record. You can update its state to "Pending", "In Progress", "Resolved", or "Rejected". Changes are immediately reflected across dashboards.',
    category: 'Complaint Management',
    relatedRoute: '/admin/complaints',
    relatedText: 'Manage Complaints'
  },
  {
    id: 3,
    question: 'How do I identify high-priority complaints?',
    answer: 'High-priority complaints are indicated with a prominent red badge. In All Complaints or Analytics, use the Priority filter and select "High" to view all critical civic escalations requiring immediate municipal intervention.',
    category: 'Complaint Management',
    relatedRoute: '/admin/complaints',
    relatedText: 'Filter High Priority'
  },
  {
    id: 4,
    question: 'How does the Complaint Map work?',
    answer: 'The Complaint Map plots complaints using Leaflet and Google Maps GIS coordinates. It clusters complaints by ward and area, allowing administrators to pinpoint civic trouble hotspots, pipeline leaks, and road damage concentrations.',
    category: 'Maps & Locations',
    relatedRoute: '/admin/complaint-map',
    relatedText: 'Open Complaint Map'
  },
  {
    id: 5,
    question: 'How do I manage users?',
    answer: 'Navigate to the Users section. You can view all registered citizens, department staff, and admin accounts. Use the search bar and role filters to find specific accounts, view complaint histories, or edit contact details.',
    category: 'User Management',
    relatedRoute: '/admin/users',
    relatedText: 'View Users Page'
  },
  {
    id: 6,
    question: 'How do I deactivate a user account?',
    answer: 'In the Users management table, click the action menu next to a user and select "Deactivate". A confirmation modal will appear explaining that the user will not be able to log in or file complaints until reactivated.',
    category: 'User Management',
    relatedRoute: '/admin/users',
    relatedText: 'Go to Users'
  },
  {
    id: 7,
    question: 'How do I view department performance?',
    answer: 'In the Departments section or Analytics tab, you can examine real-time KPIs including total assigned complaints, average resolution speed, and performance grades (A+, B, etc.) for each municipal division.',
    category: 'Department Management',
    relatedRoute: '/admin/departments',
    relatedText: 'Check Departments'
  },
  {
    id: 8,
    question: 'How do I use Analytics filters?',
    answer: 'The Analytics page includes comprehensive date range filters (Last 7 days, Last 30 days, Last 6 months) as well as department and priority breakdowns. Selecting any filter recalculates trends and charts dynamically.',
    category: 'Analytics & Reports',
    relatedRoute: '/admin/analytics',
    relatedText: 'Open Analytics'
  },
  {
    id: 9,
    question: 'How do I mark notifications as read?',
    answer: 'Go to the Notifications Center and click "Mark All as Read" in the top right corner. You can also click the checkmark icon on individual notification cards to dismiss unread indicators.',
    category: 'Notifications',
    relatedRoute: '/admin/notifications',
    relatedText: 'Open Notifications'
  },
  {
    id: 10,
    question: 'How do I add a new department?',
    answer: 'From the Departments page, click the "+ Add Department" button in the upper right. Enter the department name, assigned categories (e.g. Electrical, Drainage), supervisor contact, and initial capacity.',
    category: 'Department Management',
    relatedRoute: '/admin/departments',
    relatedText: 'Departments Overview'
  },
  {
    id: 11,
    question: 'How do I update Admin settings and system preferences?',
    answer: 'Open the Settings page from the Admin Sidebar. You can adjust municipality identity, default complaint status, dashboard auto-refresh intervals, notification toggles, and two-factor authentication.',
    category: 'Account & Settings',
    relatedRoute: '/admin/settings',
    relatedText: 'Open Admin Settings'
  },
  {
    id: 12,
    question: 'What should I do if Google Maps is not loading?',
    answer: 'Check that your Google Maps API key is configured in frontend environment settings (.env). If you are testing offline, the GIS module gracefully falls back to OpenStreetMap / Leaflet tile layers without error.',
    category: 'Technical Issues',
    relatedRoute: '/admin/complaint-map',
    relatedText: 'View GIS Map'
  },
  {
    id: 13,
    question: 'How do I review resolved complaints?',
    answer: 'In All Complaints, set the Status filter to "Resolved". You can click any resolved record to review the before-and-after photo attachments, resolution notes, and citizen feedback ratings.',
    category: 'Complaint Management',
    relatedRoute: '/admin/complaints',
    relatedText: 'Review Complaints'
  },
  {
    id: 14,
    question: 'How do I view a citizen\'s complaint history?',
    answer: 'From the Users page, click on any citizen\'s name or use "View Profile" to open their comprehensive dossier showing all historically submitted complaints, current open tickets, and verification badge.',
    category: 'User Management',
    relatedRoute: '/admin/users',
    relatedText: 'View Citizen Profiles'
  },
  {
    id: 15,
    question: 'How do I contact technical support for urgent platform issues?',
    answer: 'Scroll to the "Need More Help?" section on this page or click "Submit Support Request". You can also email support@smartcivic.example or call our toll-free municipal administrative hotline at +91 1800 000 000.',
    category: 'Technical Issues',
    relatedRoute: null,
    relatedText: null
  }
];

const HelpSupport = () => {
  // References
  const faqSectionRef = useRef(null);
  const contactCardRef = useRef(null);

  // Search & Topic Category Filter state
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // FAQ Accordion expanded state (single expanded at a time)
  const [expandedFaqId, setExpandedFaqId] = useState(1);

  // Support Requests State
  const [supportRequests, setSupportRequests] = useState(initialSupportRequests);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('All');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState('All');

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // New Support Request Form state & validation
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: 'Technical Issue',
    priority: 'Medium',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // --------------------------------------------------------------------------
  // Dynamic FAQ Filtering
  // --------------------------------------------------------------------------
  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      // Category match
      if (selectedCategory !== 'All' && faq.category !== selectedCategory) {
        return false;
      }
      // Search query match in question or answer
      if (faqSearchQuery.trim()) {
        const q = faqSearchQuery.toLowerCase();
        const matchQ = faq.question.toLowerCase().includes(q);
        const matchA = faq.answer.toLowerCase().includes(q);
        const matchCat = faq.category.toLowerCase().includes(q);
        if (!matchQ && !matchA && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [faqSearchQuery, selectedCategory]);

  const toggleFaqAccordion = (id) => {
    setExpandedFaqId((prevId) => (prevId === id ? null : id));
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (faqSectionRef.current) {
      faqSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLearnMoreQuickCard = (category) => {
    setSelectedCategory(category);
    if (faqSectionRef.current) {
      faqSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --------------------------------------------------------------------------
  // Dynamic Support Requests Filtering
  // --------------------------------------------------------------------------
  const filteredRequests = useMemo(() => {
    return supportRequests.filter((req) => {
      // Search
      if (ticketSearch.trim()) {
        const q = ticketSearch.toLowerCase();
        const matchId = req.ticketId.toLowerCase().includes(q);
        const matchSub = req.subject.toLowerCase().includes(q);
        const matchCat = req.category.toLowerCase().includes(q);
        const matchDesc = req.description.toLowerCase().includes(q);
        if (!matchId && !matchSub && !matchCat && !matchDesc) return false;
      }
      // Status
      if (ticketStatusFilter !== 'All' && req.status !== ticketStatusFilter) {
        return false;
      }
      // Priority
      if (ticketPriorityFilter !== 'All' && req.priority !== ticketPriorityFilter) {
        return false;
      }
      // Category
      if (ticketCategoryFilter !== 'All' && req.category !== ticketCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [supportRequests, ticketSearch, ticketStatusFilter, ticketPriorityFilter, ticketCategoryFilter]);

  const handleResetFilters = () => {
    setTicketSearch('');
    setTicketStatusFilter('All');
    setTicketPriorityFilter('All');
    setTicketCategoryFilter('All');
  };

  // Dynamic Statistics
  const stats = useMemo(() => {
    const openCount = supportRequests.filter((r) => r.status === 'Open').length;
    const progressCount = supportRequests.filter((r) => r.status === 'In Progress').length;
    const resolvedCount = supportRequests.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;
    return {
      open: openCount,
      progress: progressCount,
      resolved: resolvedCount,
      avgResponse: '3.8 hours'
    };
  }, [supportRequests]);

  // --------------------------------------------------------------------------
  // Support Request Submission
  // --------------------------------------------------------------------------
  const validateForm = () => {
    const errors = {};
    if (!newTicketForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!newTicketForm.category) {
      errors.category = 'Please select a category';
    }
    if (!newTicketForm.description.trim()) {
      errors.description = 'Description is required';
    } else if (newTicketForm.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const nextIdNum = 1000 + supportRequests.length + 1;
    const newTicket = {
      ticketId: `SUP-${nextIdNum}`,
      subject: newTicketForm.subject.trim(),
      category: newTicketForm.category,
      priority: newTicketForm.priority,
      status: 'Open',
      createdAt: 'Just now',
      lastUpdated: 'Just now',
      description: newTicketForm.description.trim(),
      supportResponse: 'Your ticket has been received and queued for review by municipal technical support.'
    };

    setSupportRequests([newTicket, ...supportRequests]);
    setIsSubmitModalOpen(false);
    setNewTicketForm({
      subject: '',
      category: 'Technical Issue',
      priority: 'Medium',
      description: ''
    });
    setFormErrors({});
    showToast('Support request submitted successfully.');
  };

  // Helper for priority badge classes
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'badge-priority-high';
      case 'medium':
        return 'badge-priority-medium';
      case 'low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-low';
    }
  };

  // Helper for status badge classes
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'badge-status-open';
      case 'in progress':
        return 'badge-status-progress';
      case 'resolved':
        return 'badge-status-resolved';
      case 'closed':
        return 'badge-status-closed';
      default:
        return 'badge-status-open';
    }
  };

  return (
    <div className="helpsupport-container">
      {/* 1. PAGE HEADER */}
      <header className="help-header-card">
        <div className="help-title-block">
          <div className="help-title-row">
            <div className="help-title-icon-wrapper">
              <CircleHelp size={24} />
            </div>
            <h1 className="help-page-title">Help & Support</h1>
          </div>
          <p className="help-page-subtitle">
            Find answers, troubleshoot issues, and get assistance with Smart Civic.
          </p>
        </div>

        <div className="help-status-badge" title="Platform systems and helpdesk active">
          <span className="help-status-dot"></span>
          <span>Support Available</span>
        </div>
      </header>

      {/* 2. SEARCH HERO SECTION */}
      <section className="help-search-section" aria-label="Search Help Content">
        <h2 className="help-search-heading">How can we assist you today?</h2>
        <p className="help-search-subtext">
          Search for tutorials, system guidelines, troubleshooting steps, and administrative answers.
        </p>
        <div className="help-search-input-wrap">
          <Search size={18} className="help-search-icon" />
          <input
            type="text"
            className="help-search-input"
            placeholder="Search for help (e.g., 'assign complaint', 'google maps', 'analytics')..."
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            aria-label="Search for help"
          />
          {faqSearchQuery && (
            <button
              type="button"
              className="help-search-clear"
              onClick={() => setFaqSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* 3. QUICK HELP CARDS */}
      <section className="quick-help-section" aria-label="Quick Help Categories">
        <div className="section-title-wrap">
          <h2 className="help-section-title">
            <LifeBuoy size={20} style={{ color: 'var(--primary)' }} />
            Quick Help Workflows
          </h2>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Key municipal operational modules
          </span>
        </div>

        <div className="quick-help-grid">
          {quickHelpCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="quick-help-card">
                <div className="quick-help-content">
                  <div className="quick-help-icon-box">
                    <Icon size={20} />
                  </div>
                  <h3 className="quick-help-title">{card.title}</h3>
                  <p className="quick-help-desc">{card.desc}</p>
                </div>
                <button
                  type="button"
                  className="quick-help-action"
                  onClick={() => handleLearnMoreQuickCard(card.category)}
                  aria-label={`Learn more about ${card.title}`}
                >
                  <span>Learn More</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. BROWSE HELP TOPICS */}
      <section className="help-categories-section" aria-label="Browse Help Topics">
        <div className="section-title-wrap">
          <h2 className="help-section-title">
            <FolderOpen size={20} style={{ color: 'var(--primary)' }} />
            Browse Help Topics
          </h2>
          {selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="faq-reset-filter-btn"
            >
              Show all topics
            </button>
          )}
        </div>

        <div className="help-categories-grid">
          {helpCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`help-category-card ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="help-category-left">
                  <div className="help-category-icon">
                    <Icon size={16} />
                  </div>
                  <div className="help-category-info">
                    <span className="help-category-name">{cat.title}</span>
                    <span className="help-category-count">{cat.count} articles</span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: isActive ? 'var(--primary)' : 'var(--text-light)' }} />
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="faq-section" ref={faqSectionRef} aria-label="Frequently Asked Questions">
        <div className="faq-header-row">
          <div>
            <h2 className="help-section-title">
              <HelpCircle size={20} style={{ color: 'var(--primary)' }} />
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              Common administration procedures, workflow solutions, and platform features.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedCategory !== 'All' && (
              <span className="faq-category-filter-badge">
                <span>Filtered: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="faq-reset-filter-btn"
                  aria-label="Remove category filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {filteredFaqs.length} FAQs
            </span>
          </div>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length > 0 ? (
          <div className="faq-accordion-list">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`faq-accordion-item ${isExpanded ? 'expanded' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-accordion-header"
                    onClick={() => toggleFaqAccordion(faq.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="faq-question-wrap">
                      <span className="faq-q-badge">Q</span>
                      <span className="faq-question-text">{faq.question}</span>
                    </div>

                    <div className="faq-header-right">
                      <span className="faq-tag">{faq.category}</span>
                      <ChevronDown size={18} className="faq-chevron" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="faq-accordion-body"
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                    >
                      <p className="faq-answer-text">{faq.answer}</p>
                      {faq.relatedRoute && (
                        <Link to={faq.relatedRoute} className="faq-related-link">
                          <span>{faq.relatedText}</span>
                          <ExternalLink size={13} />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="faq-empty-state">
            <div className="faq-empty-icon">
              <Search size={24} />
            </div>
            <h3 className="faq-empty-title">No help articles found</h3>
            <p className="faq-empty-desc">
              Try using different keywords, clearing your search query, or checking another help topic.
            </p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setFaqSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Search</span>
            </button>
          </div>
        )}
      </section>

      {/* 6. CONTACT SUPPORT BANNER */}
      <section className="help-contact-banner" aria-label="Need More Help">
        <div className="help-contact-left">
          <h2 className="help-contact-title">
            <MessageSquare size={22} />
            Need More Help?
          </h2>
          <p className="help-contact-text">
            Can't find what you're looking for? Submit a support request and our technical assistance squad will review your case promptly.
          </p>
          <div className="help-contact-channels">
            <div className="help-channel-item">
              <Mail size={14} />
              <span>support@smartcivic.example</span>
            </div>
            <div className="help-channel-item">
              <Phone size={14} />
              <span>+91 1800 000 000</span>
            </div>
            <div className="help-channel-item">
              <Clock size={14} />
              <span>Mon - Fri (9:00 AM - 6:00 PM)</span>
            </div>
          </div>
        </div>

        <div className="help-contact-buttons">
          <button
            type="button"
            className="btn-contact-ghost"
            onClick={() => {
              setShowContactInfo(!showContactInfo);
              if (!showContactInfo && contactCardRef.current) {
                setTimeout(() => {
                  contactCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }
            }}
          >
            <Phone size={16} />
            <span>{showContactInfo ? 'Hide Contact Info' : 'Contact Support'}</span>
          </button>

          <button
            type="button"
            className="btn-contact-white"
            onClick={() => setIsSubmitModalOpen(true)}
          >
            <Plus size={16} />
            <span>Submit Support Request</span>
          </button>
        </div>
      </section>

      {/* 7. TECHNICAL SUPPORT INFO CARD (TOGGLEABLE) */}
      {showContactInfo && (
        <section className="tech-support-card" ref={contactCardRef} aria-label="Technical Support Information">
          <div className="section-title-wrap">
            <h3 className="help-section-title" style={{ fontSize: '1.1rem' }}>
              <Shield size={18} style={{ color: 'var(--primary)' }} />
              Municipal Technical Support Desk
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Demo Contact Channel Information
            </span>
          </div>

          <div className="tech-support-grid">
            <div className="tech-support-item">
              <div className="tech-support-icon">
                <Mail size={18} />
              </div>
              <div className="tech-support-details">
                <span className="tech-support-label">Email Support</span>
                <span className="tech-support-val">support@smartcivic.example</span>
                <span className="tech-support-sub">Response within 4 business hours</span>
              </div>
            </div>

            <div className="tech-support-item">
              <div className="tech-support-icon">
                <Phone size={18} />
              </div>
              <div className="tech-support-details">
                <span className="tech-support-label">Toll-Free Helpline</span>
                <span className="tech-support-val">+91 1800 000 000</span>
                <span className="tech-support-sub">Toll-free across municipal jurisdiction</span>
              </div>
            </div>

            <div className="tech-support-item">
              <div className="tech-support-icon">
                <Clock size={18} />
              </div>
              <div className="tech-support-details">
                <span className="tech-support-label">Operating Schedule</span>
                <span className="tech-support-val">Monday – Friday, 9 AM – 6 PM</span>
                <span className="tech-support-sub">Standard Indian Standard Time (IST)</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. SUPPORT STATISTICS CARDS */}
      <section className="support-stats-grid" aria-label="Support Statistics">
        <div className="support-stat-card">
          <div className="support-stat-info">
            <span className="support-stat-label">Open Requests</span>
            <span className="support-stat-val" style={{ color: 'var(--danger)' }}>
              {stats.open}
            </span>
          </div>
          <div className="support-stat-icon stat-icon-open">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="support-stat-card">
          <div className="support-stat-info">
            <span className="support-stat-label">In Progress</span>
            <span className="support-stat-val" style={{ color: '#b45309' }}>
              {stats.progress}
            </span>
          </div>
          <div className="support-stat-icon stat-icon-progress">
            <Clock size={20} />
          </div>
        </div>

        <div className="support-stat-card">
          <div className="support-stat-info">
            <span className="support-stat-label">Resolved</span>
            <span className="support-stat-val" style={{ color: 'var(--success)' }}>
              {stats.resolved}
            </span>
          </div>
          <div className="support-stat-icon stat-icon-resolved">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="support-stat-card">
          <div className="support-stat-info">
            <span className="support-stat-label">Average Response</span>
            <span className="support-stat-val" style={{ color: 'var(--primary)' }}>
              {stats.avgResponse}
            </span>
          </div>
          <div className="support-stat-icon stat-icon-time">
            <Clock size={20} />
          </div>
        </div>
      </section>

      {/* 9. RECENT SUPPORT REQUESTS TABLE */}
      <section className="support-requests-section" aria-label="Recent Support Requests">
        <div className="requests-header-row">
          <div className="requests-title-group">
            <h2 className="help-section-title">
              <FileText size={20} style={{ color: 'var(--primary)' }} />
              Recent Support Requests
            </h2>
            <span className="requests-counter-badge">
              {filteredRequests.length} of {supportRequests.length}
            </span>
          </div>

          <button
            type="button"
            className="btn-new-ticket"
            onClick={() => setIsSubmitModalOpen(true)}
          >
            <Plus size={16} />
            <span>New Support Request</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="requests-filter-toolbar">
          <div className="requests-search-wrap">
            <Search size={15} className="requests-search-icon" />
            <input
              type="text"
              className="requests-search-input"
              placeholder="Search support requests by ID, subject, details..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="requests-filter-select"
            value={ticketStatusFilter}
            onChange={(e) => setTicketStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            className="requests-filter-select"
            value={ticketPriorityFilter}
            onChange={(e) => setTicketPriorityFilter(e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            className="requests-filter-select"
            value={ticketCategoryFilter}
            onChange={(e) => setTicketCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="All">All Categories</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Complaint Management">Complaint Management</option>
            <option value="User Management">User Management</option>
            <option value="Department Management">Department Management</option>
            <option value="Maps">Maps</option>
            <option value="Notifications">Notifications</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>

          {(ticketSearch || ticketStatusFilter !== 'All' || ticketPriorityFilter !== 'All' || ticketCategoryFilter !== 'All') && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Requests Table */}
        {filteredRequests.length > 0 ? (
          <div className="support-table-container">
            <table className="support-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Last Activity</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.ticketId}>
                    <td>
                      <span className="ticket-id-pill">{req.ticketId}</span>
                    </td>
                    <td>
                      <span className="ticket-subject-cell" title={req.subject}>
                        {req.subject}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {req.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-priority ${getPriorityBadgeClass(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {req.createdAt}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {req.lastUpdated}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-view-ticket"
                        onClick={() => setViewingTicket(req)}
                        aria-label={`View ticket ${req.ticketId}`}
                      >
                        <span>View</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="faq-empty-state" style={{ padding: '2.5rem 1rem' }}>
            <div className="faq-empty-icon">
              <FileText size={24} />
            </div>
            <h3 className="faq-empty-title">No support requests found</h3>
            <p className="faq-empty-desc">
              No tickets matched your current search filters. Try adjusting your status, category, or search keywords.
            </p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
            >
              <RotateCcw size={13} />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </section>

      {/* ====================================================================
          MODAL 1: SUBMIT SUPPORT REQUEST
          ==================================================================== */}
      {isSubmitModalOpen && (
        <div
          className="help-modal-backdrop"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="help-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="submit-ticket-title"
          >
            <div className="help-modal-header">
              <h3 id="submit-ticket-title" className="help-modal-title">
                <Plus size={18} style={{ color: 'var(--primary)' }} />
                Submit Support Request
              </h3>
              <button
                type="button"
                className="help-modal-close"
                onClick={() => setIsSubmitModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="help-modal-body">
                {/* Subject */}
                <div className="help-form-group">
                  <label htmlFor="ticket-subject" className="help-form-label">
                    Subject <span className="help-required-star">*</span>
                  </label>
                  <input
                    id="ticket-subject"
                    type="text"
                    className={`help-form-input ${formErrors.subject ? 'has-error' : ''}`}
                    placeholder="Brief summary of the issue (e.g., 'Complaint map marker glitch')"
                    value={newTicketForm.subject}
                    onChange={(e) => {
                      setNewTicketForm({ ...newTicketForm, subject: e.target.value });
                      if (formErrors.subject) setFormErrors({ ...formErrors, subject: '' });
                    }}
                  />
                  {formErrors.subject && (
                    <span className="help-error-text">
                      <AlertCircle size={13} /> {formErrors.subject}
                    </span>
                  )}
                </div>

                {/* Category & Priority Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="help-form-group">
                    <label htmlFor="ticket-category" className="help-form-label">
                      Category <span className="help-required-star">*</span>
                    </label>
                    <select
                      id="ticket-category"
                      className={`help-form-select ${formErrors.category ? 'has-error' : ''}`}
                      value={newTicketForm.category}
                      onChange={(e) => {
                        setNewTicketForm({ ...newTicketForm, category: e.target.value });
                        if (formErrors.category) setFormErrors({ ...formErrors, category: '' });
                      }}
                    >
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Complaint Management">Complaint Management</option>
                      <option value="User Management">User Management</option>
                      <option value="Department Management">Department Management</option>
                      <option value="Maps">Maps</option>
                      <option value="Notifications">Notifications</option>
                      <option value="Account">Account</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.category && (
                      <span className="help-error-text">
                        <AlertCircle size={13} /> {formErrors.category}
                      </span>
                    )}
                  </div>

                  <div className="help-form-group">
                    <label htmlFor="ticket-priority" className="help-form-label">
                      Priority
                    </label>
                    <select
                      id="ticket-priority"
                      className="help-form-select"
                      value={newTicketForm.priority}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="help-form-group">
                  <label htmlFor="ticket-desc" className="help-form-label">
                    Description <span className="help-required-star">*</span>
                  </label>
                  <textarea
                    id="ticket-desc"
                    className={`help-form-textarea ${formErrors.description ? 'has-error' : ''}`}
                    placeholder="Provide details about what happened, steps to reproduce, or administrative questions (minimum 10 characters)..."
                    value={newTicketForm.description}
                    onChange={(e) => {
                      setNewTicketForm({ ...newTicketForm, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                    }}
                  />
                  <div className="help-helper-text">
                    <span>
                      {formErrors.description ? (
                        <span className="help-error-text">
                          <AlertCircle size={13} /> {formErrors.description}
                        </span>
                      ) : (
                        'Min. 10 characters'
                      )}
                    </span>
                    <span>{newTicketForm.description.length} characters</span>
                  </div>
                </div>
              </div>

              <div className="help-modal-footer">
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-new-ticket">
                  <Send size={15} />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: VIEW TICKET DETAILS
          ==================================================================== */}
      {viewingTicket && (
        <div
          className="help-modal-backdrop"
          onClick={() => setViewingTicket(null)}
        >
          <div
            className="help-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="view-ticket-title"
          >
            <div className="help-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="ticket-id-pill">{viewingTicket.ticketId}</span>
                <h3 id="view-ticket-title" className="help-modal-title" style={{ fontSize: '1.1rem' }}>
                  Ticket Details
                </h3>
              </div>
              <button
                type="button"
                className="help-modal-close"
                onClick={() => setViewingTicket(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="help-modal-body">
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                  {viewingTicket.subject}
                </h4>
              </div>

              <div className="ticket-details-meta-grid">
                <div className="ticket-meta-block">
                  <span className="ticket-meta-label">Category</span>
                  <span className="ticket-meta-val">{viewingTicket.category}</span>
                </div>
                <div className="ticket-meta-block">
                  <span className="ticket-meta-label">Priority</span>
                  <div>
                    <span className={`badge-priority ${getPriorityBadgeClass(viewingTicket.priority)}`}>
                      {viewingTicket.priority}
                    </span>
                  </div>
                </div>
                <div className="ticket-meta-block">
                  <span className="ticket-meta-label">Status</span>
                  <div>
                    <span className={`badge-status ${getStatusBadgeClass(viewingTicket.status)}`}>
                      {viewingTicket.status}
                    </span>
                  </div>
                </div>
                <div className="ticket-meta-block">
                  <span className="ticket-meta-label">Created / Last Updated</span>
                  <span className="ticket-meta-val" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {viewingTicket.createdAt} (updated {viewingTicket.lastUpdated})
                  </span>
                </div>
              </div>

              <div className="help-form-group">
                <label className="help-form-label" style={{ color: 'var(--text-muted)' }}>
                  Request Description
                </label>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.6'
                }}>
                  {viewingTicket.description}
                </div>
              </div>

              {viewingTicket.supportResponse && (
                <div className="ticket-response-box">
                  <div className="ticket-response-header">
                    <MessageSquare size={16} />
                    <span>Support Team Response</span>
                  </div>
                  <p className="ticket-response-body">
                    {viewingTicket.supportResponse}
                  </p>
                </div>
              )}
            </div>

            <div className="help-modal-footer">
              <button
                type="button"
                className="btn-new-ticket"
                onClick={() => setViewingTicket(null)}
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST NOTIFICATION
          ==================================================================== */}
      {toast.show && (
        <div className="help-toast" role="status" aria-live="polite">
          <CheckCircle size={18} style={{ color: 'var(--success)' }} />
          <span>{toast.message}</span>
          <button
            type="button"
            className="help-toast-close"
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;
