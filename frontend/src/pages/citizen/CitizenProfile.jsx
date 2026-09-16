import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Shield,
  Bell,
  Activity,
  Lock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Key,
  Smartphone,
  Laptop,
  Check,
  X,
  FileText,
  Sliders,
  Download,
  Trash2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  RotateCcw,
  Save,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './CitizenProfile.css';

// Chart Sample Data
const monthlyActivityData = [
  { month: 'Apr', complaints: 2, resolved: 2 },
  { month: 'May', complaints: 4, resolved: 3 },
  { month: 'Jun', complaints: 5, resolved: 4 },
  { month: 'Jul', complaints: 3, resolved: 3 },
  { month: 'Aug', complaints: 6, resolved: 4 },
  { month: 'Sep', complaints: 4, resolved: 2 }
];

const categoryDistribution = [
  { name: 'Roads & Potholes', value: 10, color: '#4f46e5' },
  { name: 'Water & Sewage', value: 6, color: '#0284c7' },
  { name: 'Sanitation & Waste', value: 5, color: '#10b981' },
  { name: 'Street Lighting', value: 3, color: '#f59e0b' }
];

const CitizenProfile = () => {
  const navigate = useNavigate();
  const { tab: urlTab } = useParams();

  // Active Tab state ('personal' | 'security' | 'notifications' | 'activity')
  const [activeTab, setActiveTab] = useState(urlTab || 'personal');

  // Sync state with URL parameter if present
  useEffect(() => {
    if (urlTab && ['personal', 'security', 'notifications', 'activity'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/citizen/profile/${tabKey}`, { replace: true });
  };

  // Toast Notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // 1. Personal Information State
  const [profileData, setProfileData] = useState({
    fullName: 'Raj Shrivas',
    email: 'raj@example.com',
    phone: '+91 98765 43210',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    ward: 'Ward 12 - Central Gwalior',
    language: 'English',
    avatar: null
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePersonalForm = () => {
    const errors = {};
    if (!profileData.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!profileData.email.trim() || !/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!profileData.phone.trim()) errors.phone = 'Phone number is required.';
    if (!profileData.city.trim()) errors.city = 'City is required.';
    return errors;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = validatePersonalForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerToast('Please fix the errors before saving.', 'error');
      return;
    }
    setIsEditing(false);
    triggerToast('Profile updated successfully! Personal information saved.');
  };

  // 2. Account Security State & Modals
  const [securityState, setSecurityState] = useState({
    emailVerified: true,
    phoneVerified: true,
    passwordLastChanged: '14 days ago',
    twoFactorEnabled: false
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: '#cbd5e1' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2 || score === 3) return { score: 2, label: 'Moderate', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required.';
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long.';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setSecurityState(prev => ({ ...prev, passwordLastChanged: 'Just now' }));
    triggerToast('Password changed successfully!');
  };

  const toggleTwoFactor = () => {
    const nextState = !securityState.twoFactorEnabled;
    setSecurityState(prev => ({ ...prev, twoFactorEnabled: nextState }));
    triggerToast(nextState ? 'Two-Factor Authentication Enabled!' : 'Two-Factor Authentication Disabled');
  };

  // Sessions Modal
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);

  // 3. Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    complaintSubmitted: true,
    complaintAssigned: true,
    statusChanged: true,
    complaintResolved: true,
    civicAnnouncements: true,
    serviceUpdates: true,
    importantAlerts: true,
    inAppChannel: true,
    emailChannel: true,
    smsChannel: false
  });

  const handlePrefToggle = (key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePrefs = () => {
    triggerToast('Notification preferences saved successfully!');
  };

  const handleResetPrefs = () => {
    setNotifPrefs({
      complaintSubmitted: true,
      complaintAssigned: true,
      statusChanged: true,
      complaintResolved: true,
      civicAnnouncements: true,
      serviceUpdates: true,
      importantAlerts: true,
      inAppChannel: true,
      emailChannel: true,
      smsChannel: false
    });
    triggerToast('Notification preferences reset to default.');
  };

  // 4. Privacy & Danger Zone State
  const [privacySettings, setPrivacySettings] = useState({
    locationPermission: true,
    profileVisibility: 'Public',
    dataSharing: false
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setIsDeleteModalOpen(false);
    triggerToast('Account deletion request initiated.', 'error');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="citizen-profile-page animate-fade-in">
      {/* Toast Feedback */}
      {toast.show && (
        <div className={`profile-toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <span className="breadcrumb-item" onClick={() => navigate('/citizen/dashboard')}>Dashboard</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">Profile</span>
      </nav>

      {/* Main Header */}
      <header className="profile-page-header">
        <div>
          <h1 className="header-title">My Profile</h1>
          <p className="header-subtitle">Manage your personal information, account settings and preferences.</p>
        </div>
      </header>

      {/* 2. Profile Overview Header Card */}
      <section className="profile-overview-card">
        <div className="overview-left">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              {profileData.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <label className="avatar-upload-btn" title="Upload new photo">
              <Camera size={14} />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={() => triggerToast('Profile picture updated!')} />
            </label>
          </div>

          <div className="user-identity">
            <div className="identity-name-row">
              <h2 className="user-full-name">{profileData.fullName}</h2>
              <span className="badge badge-primary">Citizen</span>
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> Verified Citizen
              </span>
            </div>
            <p className="user-email">{profileData.email}</p>
          </div>
        </div>

        <div className="overview-right">
          <div className="meta-info-item">
            <span className="meta-label">Member Since</span>
            <span className="meta-value">August 2026</span>
          </div>
          <div className="meta-info-item">
            <span className="meta-label">Location</span>
            <span className="meta-value">
              <MapPin size={14} /> {profileData.city}, {profileData.state}
            </span>
          </div>
          <button
            className="btn btn-primary btn-edit-profile"
            onClick={() => {
              handleTabChange('personal');
              setIsEditing(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      </section>

      {/* 3. Navigation Tabs */}
      <nav className="profile-tabs-bar" aria-label="Profile navigation tabs">
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => handleTabChange('personal')}
        >
          <User size={18} />
          <span>Personal Information</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => handleTabChange('security')}
        >
          <Shield size={18} />
          <span>Account Security</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => handleTabChange('notifications')}
        >
          <Bell size={18} />
          <span>Notification Preferences</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => handleTabChange('activity')}
        >
          <Activity size={18} />
          <span>Complaint Activity</span>
        </button>
      </nav>

      {/* Tab Content Container */}
      <div className="profile-tab-content">
        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="tab-pane animate-fade-in">
            <div className="content-card">
              <div className="card-header-bar">
                <div>
                  <h3 className="card-title">Personal Information</h3>
                  <p className="card-subtitle">Update your personal contact details and residential address.</p>
                </div>
                {!isEditing && (
                  <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </button>
                )}
              </div>

              {/* Info Note Banner */}
              <div className="info-alert-banner">
                <Info size={18} className="alert-icon" />
                <span>Your personal information is used to manage your complaints and provide relevant civic service updates.</span>
              </div>

              <form onSubmit={handleSaveProfile} className="personal-form">
                <div className="form-grid-2">
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <div className="input-wrapper">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <div className="input-wrapper">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <div className="input-wrapper">
                      <Phone size={16} className="input-icon" />
                      <input
                        type="text"
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </div>

                  {/* City */}
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <div className="input-wrapper">
                      <MapPin size={16} className="input-icon" />
                      <input
                        type="text"
                        className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                  </div>

                  {/* State */}
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Ward / Local Area */}
                  <div className="form-group">
                    <label className="form-label">Ward / Local Area</label>
                    <select
                      className="form-control select-control"
                      value={profileData.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="Ward 12 - Central Gwalior">Ward 12 - Central Gwalior</option>
                      <option value="Ward 04 - Morar North">Ward 04 - Morar North</option>
                      <option value="Ward 18 - Lashkar West">Ward 18 - Lashkar West</option>
                      <option value="Ward 22 - City Center">Ward 22 - City Center</option>
                    </select>
                  </div>

                  {/* Preferred Language */}
                  <div className="form-group">
                    <label className="form-label">Preferred Language</label>
                    <div className="input-wrapper">
                      <Globe size={16} className="input-icon" />
                      <select
                        className="form-control select-control"
                        value={profileData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ACCOUNT SECURITY */}
        {activeTab === 'security' && (
          <div className="tab-pane animate-fade-in">
            <div className="content-card">
              <h3 className="card-title">Account Security</h3>
              <p className="card-subtitle">Manage login passwords, verification status and security preferences.</p>

              {/* Security Status Rows */}
              <div className="security-status-list">
                <div className="security-item">
                  <div className="security-item-info">
                    <div className="security-icon-box bg-success-light">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="item-title">Email Verification</h4>
                      <p className="item-desc">{profileData.email}</p>
                    </div>
                  </div>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>

                <div className="security-item">
                  <div className="security-item-info">
                    <div className="security-icon-box bg-success-light">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="item-title">Phone Verification</h4>
                      <p className="item-desc">{profileData.phone}</p>
                    </div>
                  </div>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>

                <div className="security-item">
                  <div className="security-item-info">
                    <div className="security-icon-box bg-primary-light">
                      <Key size={18} />
                    </div>
                    <div>
                      <h4 className="item-title">Password</h4>
                      <p className="item-desc">Last changed: {securityState.passwordLastChanged}</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setIsPasswordModalOpen(true)}>
                    Change Password
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-item-info">
                    <div className="security-icon-box bg-warning-light">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h4 className="item-title">Two-Factor Authentication (2FA)</h4>
                      <p className="item-desc">Add an extra layer of security to your civic account.</p>
                    </div>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <input
                      type="checkbox"
                      id="2fa-toggle"
                      className="toggle-checkbox"
                      checked={securityState.twoFactorEnabled}
                      onChange={toggleTwoFactor}
                    />
                    <label htmlFor="2fa-toggle" className="toggle-switch-label" />
                  </div>
                </div>

                <div className="security-item">
                  <div className="security-item-info">
                    <div className="security-icon-box bg-info-light">
                      <Laptop size={18} />
                    </div>
                    <div>
                      <h4 className="item-title">Active Logged-in Sessions</h4>
                      <p className="item-desc">Currently active on 1 browser session (Windows Chrome).</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setIsSessionsModalOpen(true)}>
                    Manage Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATION PREFERENCES */}
        {activeTab === 'notifications' && (
          <div className="tab-pane animate-fade-in">
            <div className="content-card">
              <h3 className="card-title">Notification Preferences</h3>
              <p className="card-subtitle">Choose how and when CivicAI alerts you about updates on your complaints.</p>

              <div className="prefs-sections-grid">
                {/* Complaint Updates Toggles */}
                <div className="prefs-category">
                  <h4 className="prefs-category-title">
                    <FileText size={18} /> Complaint Updates
                  </h4>
                  <div className="toggle-list">
                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Complaint Submitted</span>
                        <p className="toggle-sub">Receive notification when a complaint is received.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="notif-sub"
                          className="toggle-checkbox"
                          checked={notifPrefs.complaintSubmitted}
                          onChange={() => handlePrefToggle('complaintSubmitted')}
                        />
                        <label htmlFor="notif-sub" className="toggle-switch-label" />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Complaint Assigned</span>
                        <p className="toggle-sub">Notify when assigned to a specific department or officer.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="notif-ass"
                          className="toggle-checkbox"
                          checked={notifPrefs.complaintAssigned}
                          onChange={() => handlePrefToggle('complaintAssigned')}
                        />
                        <label htmlFor="notif-ass" className="toggle-switch-label" />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Complaint Status Changed</span>
                        <p className="toggle-sub">Notify me when my complaint status changes (e.g. In Progress).</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="notif-status"
                          className="toggle-checkbox"
                          checked={notifPrefs.statusChanged}
                          onChange={() => handlePrefToggle('statusChanged')}
                        />
                        <label htmlFor="notif-status" className="toggle-switch-label" />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Complaint Resolved</span>
                        <p className="toggle-sub">Instant notification when field work is completed and resolved.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="notif-res"
                          className="toggle-checkbox"
                          checked={notifPrefs.complaintResolved}
                          onChange={() => handlePrefToggle('complaintResolved')}
                        />
                        <label htmlFor="notif-res" className="toggle-switch-label" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Notifications Toggles */}
                <div className="prefs-category">
                  <h4 className="prefs-category-title">
                    <Bell size={18} /> System Notifications
                  </h4>
                  <div className="toggle-list">
                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Civic Announcements</span>
                        <p className="toggle-sub">Updates about local municipal ward services and drives.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="notif-ann"
                          className="toggle-checkbox"
                          checked={notifPrefs.civicAnnouncements}
                          onChange={() => handlePrefToggle('civicAnnouncements')}
                        />
                        <label htmlFor="notif-ann" className="toggle-switch-label" />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Service Maintenance Updates</span>
                        <p className="toggle-sub">Alerts regarding planned water/power outages.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="notif-serv"
                          className="toggle-checkbox"
                          checked={notifPrefs.serviceUpdates}
                          onChange={() => handlePrefToggle('serviceUpdates')}
                        />
                        <label htmlFor="notif-serv" className="toggle-switch-label" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Channels */}
                <div className="prefs-category">
                  <h4 className="prefs-category-title">
                    <Sliders size={18} /> Notification Delivery Channels
                  </h4>
                  <div className="toggle-list">
                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">In-App Notifications</span>
                        <p className="toggle-sub">Show alerts in the citizen web portal top bell icon.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="chan-app"
                          className="toggle-checkbox"
                          checked={notifPrefs.inAppChannel}
                          onChange={() => handlePrefToggle('inAppChannel')}
                        />
                        <label htmlFor="chan-app" className="toggle-switch-label" />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">Email Notifications</span>
                        <p className="toggle-sub">Send detailed progress updates to raj@example.com.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="chan-email"
                          className="toggle-checkbox"
                          checked={notifPrefs.emailChannel}
                          onChange={() => handlePrefToggle('emailChannel')}
                        />
                        <label htmlFor="chan-email" className="toggle-switch-label" />
                      </div>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <span className="toggle-label">SMS Notifications</span>
                        <p className="toggle-sub">Send SMS alerts to registered mobile phone number.</p>
                      </div>
                      <div className="toggle-switch-wrapper">
                        <input
                          type="checkbox"
                          id="chan-sms"
                          className="toggle-checkbox"
                          checked={notifPrefs.smsChannel}
                          onChange={() => handlePrefToggle('smsChannel')}
                        />
                        <label htmlFor="chan-sms" className="toggle-switch-label" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={handleResetPrefs}>
                  <RotateCcw size={16} /> Reset to Default
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSavePrefs}>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLAINT ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="tab-pane animate-fade-in">
            <div className="content-card">
              <div className="card-header-bar">
                <div>
                  <h3 className="card-title">My Civic Activity</h3>
                  <p className="card-subtitle">Analytics and track record of your submitted issues.</p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/citizen/my-complaints')}>
                  View All Complaints <ChevronRight size={14} />
                </button>
              </div>

              {/* Sample Data Disclaimer Badge */}
              <div className="sample-data-badge">
                <BarChart2 size={14} />
                <span>Showing aggregated activity statistics based on ticket history.</span>
              </div>

              {/* 4 Stats Cards */}
              <div className="activity-stats-grid">
                <div className="activity-stat-card">
                  <span className="stat-label">Total Complaints</span>
                  <span className="stat-value text-primary">24</span>
                  <span className="stat-sub">Lifetime submitted</span>
                </div>

                <div className="activity-stat-card">
                  <span className="stat-label">Resolved</span>
                  <span className="stat-value text-success">18</span>
                  <span className="stat-sub">75% Resolution Rate</span>
                </div>

                <div className="activity-stat-card">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value text-warning">4</span>
                  <span className="stat-sub">Under field action</span>
                </div>

                <div className="activity-stat-card">
                  <span className="stat-label">Pending Review</span>
                  <span className="stat-value text-info">2</span>
                  <span className="stat-sub">Under review</span>
                </div>
              </div>

              {/* Recharts Analytics Section */}
              <div className="charts-grid-2">
                <div className="chart-card">
                  <h4 className="chart-title">Complaints & Resolutions (Last 6 Months)</h4>
                  <div style={{ width: '100%', height: 240, marginTop: '1rem' }}>
                    <ResponsiveContainer>
                      <BarChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="complaints" name="Submitted" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h4 className="chart-title">Most Reported Issue Categories</h4>
                  <div style={{ width: '100%', height: 240, marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={3}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pie-legend">
                      {categoryDistribution.map((item) => (
                        <div key={item.name} className="legend-item">
                          <span className="legend-dot" style={{ backgroundColor: item.color }} />
                          <span className="legend-text">{item.name}</span>
                          <span className="legend-count">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. PRIVACY & DATA SETTINGS SECTION */}
      <section className="profile-section-card margin-top-lg">
        <h3 className="card-title">Privacy & Data Settings</h3>
        <p className="card-subtitle">Control location permissions, data visibility, and export options.</p>

        <div className="info-alert-banner warning-tint">
          <Info size={18} className="alert-icon" />
          <span>Your location is used to help identify and manage civic complaints. Review your permissions and privacy preferences.</span>
        </div>

        <div className="privacy-options-list">
          <div className="privacy-item">
            <div>
              <h4 className="item-title">Location Permissions</h4>
              <p className="item-desc">Allow CivicAI GPS auto-tagging when reporting complaints.</p>
            </div>
            <div className="toggle-switch-wrapper">
              <input
                type="checkbox"
                id="loc-toggle"
                className="toggle-checkbox"
                checked={privacySettings.locationPermission}
                onChange={() => {
                  setPrivacySettings(prev => ({ ...prev, locationPermission: !prev.locationPermission }));
                  triggerToast('Location permissions updated');
                }}
              />
              <label htmlFor="loc-toggle" className="toggle-switch-label" />
            </div>
          </div>

          <div className="privacy-item">
            <div>
              <h4 className="item-title">Export My Personal Civic Data</h4>
              <p className="item-desc">Download a copy of your reported complaints and profile logs in JSON/CSV format.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => triggerToast('Data export initiated. Download link sent to your email.')}>
              <Download size={14} /> Request Data Export
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone-box">
          <div className="danger-info">
            <h4 className="danger-title">Danger Zone</h4>
            <p className="danger-desc">Deleting your account removes all personal profile credentials. Submitted public complaints will remain archived anonymously for municipal records.</p>
          </div>
          <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </section>

      {/* 9. NEED HELP & SUPPORT SECTION */}
      <section className="profile-section-card margin-top-lg support-card-bg">
        <div className="support-flex">
          <div className="support-text">
            <h3 className="card-title">Need Help?</h3>
            <p className="card-subtitle">Have questions about your account or complaints? Our support section is here to help.</p>
          </div>
          <div className="support-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/citizen/help-support')}>
              <HelpCircle size={16} /> Help Center
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/citizen/help-support')}>
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* MODAL 1: CHANGE PASSWORD */}
      {isPasswordModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-box bg-primary-light">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Change Account Password</h3>
                  <span className="modal-sub">Ensure your account is using a strong password.</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsPasswordModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Current Password *</label>
                  <input
                    type="password"
                    className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  {passwordErrors.currentPassword && <span className="error-text">{passwordErrors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input
                    type="password"
                    className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  {passwordErrors.newPassword && <span className="error-text">{passwordErrors.newPassword}</span>}

                  {/* Password Strength Indicator */}
                  {passwordForm.newPassword && (
                    <div className="password-strength-bar">
                      <div className="strength-meter">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${(getPasswordStrength(passwordForm.newPassword).score / 3) * 100}%`,
                            backgroundColor: getPasswordStrength(passwordForm.newPassword).color
                          }}
                        />
                      </div>
                      <span className="strength-label" style={{ color: getPasswordStrength(passwordForm.newPassword).color }}>
                        Strength: {getPasswordStrength(passwordForm.newPassword).label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  {passwordErrors.confirmPassword && <span className="error-text">{passwordErrors.confirmPassword}</span>}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE SESSIONS */}
      {isSessionsModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsSessionsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-box bg-info-light">
                  <Laptop size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Active Logged-in Sessions</h3>
                  <span className="modal-sub">Devices currently authenticated to your CivicAI account.</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsSessionsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="session-item-row">
                <Laptop size={24} className="text-primary" />
                <div className="session-info">
                  <h4 className="session-device">Chrome on Windows (Current Session)</h4>
                  <p className="session-location">Gwalior, India • IP: 157.42.18.9</p>
                </div>
                <span className="badge badge-success">Active Now</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsSessionsModalOpen(false)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setIsSessionsModalOpen(false);
                  triggerToast('Other sessions logged out.');
                }}
              >
                Log Out Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE ACCOUNT CONFIRMATION */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-box bg-danger-light">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="modal-title text-danger">Delete Account</h3>
                  <span className="modal-sub">This action is permanent and cannot be undone.</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-message-text">
                Are you sure you want to delete your CivicAI citizen account? Type <strong>DELETE</strong> in the box below to confirm account removal.
              </p>

              <div className="form-group margin-top-md">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleteConfirmationText !== 'DELETE'}
                onClick={handleDeleteAccount}
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenProfile;
