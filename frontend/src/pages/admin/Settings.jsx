import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Building2, 
  Bell, 
  Shield, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  X, 
  Lock, 
  KeyRound, 
  Smartphone, 
  Laptop, 
  LogOut, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Clock,
  Globe,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

import './Settings.css';

// Initial default settings
const INITIAL_GENERAL = {
  orgName: 'Smart Civic Complaint System',
  adminEmail: 'admin@civis.gov',
  phone: '+91 98765 43210',
  timeZone: 'Asia/Kolkata (IST)',
  language: 'English'
};

const INITIAL_NOTIFICATIONS = {
  newComplaint: true,
  highPriority: true,
  statusUpdates: true,
  newUserReg: false,
  deptAssignment: true,
  emailNotifs: true
};

const INITIAL_SECURITY = {
  twoFactorAuth: false
};

const INITIAL_PREFERENCES = {
  defaultStatus: 'Pending',
  complaintsPerPage: '10',
  autoRefresh: true,
  refreshInterval: '30 seconds',
  dateFormat: 'DD/MM/YYYY',
  maintenanceMode: false
};

const INITIAL_SESSIONS = [
  {
    id: 'sess-1',
    device: 'Current Device',
    os: 'Windows / Chrome',
    location: 'City Command HQ',
    ip: '103.24.12.8',
    lastActive: 'Just now',
    isCurrent: true
  },
  {
    id: 'sess-2',
    device: 'Field Inspection Tablet',
    os: 'Android 14 / Mobile Chrome',
    location: 'Central Zone Office',
    ip: '157.34.89.21',
    lastActive: '2 hours ago',
    isCurrent: false
  }
];

const Settings = () => {
  // Navigation active tab: 'general' | 'notifications' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [generalForm, setGeneralForm] = useState(INITIAL_GENERAL);
  const [generalErrors, setGeneralErrors] = useState({});

  const [notifForm, setNotifForm] = useState(INITIAL_NOTIFICATIONS);

  const [securityForm, setSecurityForm] = useState(INITIAL_SECURITY);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const [prefForm, setPrefForm] = useState(INITIAL_PREFERENCES);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Confirmation dialog modal for Danger Zone reset
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Helper to display toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // --------------------------------------------------------------------------
  // Tab 1: General Settings Handlers
  // --------------------------------------------------------------------------
  const handleGeneralChange = (field, value) => {
    setGeneralForm((prev) => ({ ...prev, [field]: value }));
    if (generalErrors[field]) {
      setGeneralErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateGeneral = () => {
    const errors = {};
    if (!generalForm.orgName.trim()) {
      errors.orgName = 'Organization / City name is required';
    }
    if (!generalForm.adminEmail.trim()) {
      errors.adminEmail = 'Admin email address is required';
    } else if (!/\S+@\S+\.\S+/.test(generalForm.adminEmail)) {
      errors.adminEmail = 'Enter a valid email address';
    }
    if (!generalForm.phone.trim()) {
      errors.phone = 'Contact phone number is required';
    }
    setGeneralErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (!validateGeneral()) {
      showToast('Please fix the errors in General Settings', 'error');
      return;
    }
    showToast('Settings saved successfully.');
  };

  const handleCancelGeneral = () => {
    setGeneralForm(INITIAL_GENERAL);
    setGeneralErrors({});
    showToast('General settings reverted to last saved state.', 'warning');
  };

  // --------------------------------------------------------------------------
  // Tab 2: Notification Settings Handlers
  // --------------------------------------------------------------------------
  const handleToggleNotification = (key) => {
    setNotifForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = () => {
    showToast('Settings saved successfully.');
  };

  const handleCancelNotifications = () => {
    setNotifForm(INITIAL_NOTIFICATIONS);
    showToast('Notification preferences reverted.', 'warning');
  };

  // --------------------------------------------------------------------------
  // Tab 3: Security Settings Handlers
  // --------------------------------------------------------------------------
  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Enter your current password';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Enter a new password';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }
    // Clear password form
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    showToast('Password updated successfully.');
  };

  const handleToggle2FA = () => {
    const nextState = !securityForm.twoFactorAuth;
    setSecurityForm((prev) => ({ ...prev, twoFactorAuth: nextState }));
    showToast(nextState ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.');
  };

  const handleSignOutOtherSessions = () => {
    const remaining = sessions.filter((s) => s.isCurrent);
    setSessions(remaining);
    showToast('Signed out of other active sessions.');
  };

  // --------------------------------------------------------------------------
  // Tab 4: System Preferences Handlers
  // --------------------------------------------------------------------------
  const handlePrefChange = (field, value) => {
    setPrefForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePreferences = () => {
    showToast('Settings saved successfully.');
  };

  const handleCancelPreferences = () => {
    setPrefForm(INITIAL_PREFERENCES);
    showToast('System preferences reverted.', 'warning');
  };

  // --------------------------------------------------------------------------
  // Danger Zone: Reset Settings
  // --------------------------------------------------------------------------
  const handleConfirmReset = () => {
    setGeneralForm(INITIAL_GENERAL);
    setGeneralErrors({});
    setNotifForm(INITIAL_NOTIFICATIONS);
    setSecurityForm(INITIAL_SECURITY);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setPrefForm(INITIAL_PREFERENCES);
    setSessions(INITIAL_SESSIONS);
    setIsResetModalOpen(false);
    showToast('Settings saved successfully.');
  };

  // Navigation Items
  const navTabs = [
    {
      id: 'general',
      title: 'General',
      subtitle: 'City info & locale',
      icon: Building2
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Alerts & email triggers',
      icon: Bell
    },
    {
      id: 'security',
      title: 'Security',
      subtitle: 'Password & 2FA',
      icon: Shield
    },
    {
      id: 'preferences',
      title: 'System Preferences',
      subtitle: 'Defaults & maintenance',
      icon: SlidersHorizontal
    }
  ];

  return (
    <div className="settings-page-container">
      {/* 1. PAGE HEADER */}
      <header className="settings-header-card">
        <div className="settings-title-block">
          <div className="settings-title-row">
            <div className="settings-title-icon-wrapper">
              <SettingsIcon size={22} />
            </div>
            <h1 className="settings-page-title">Settings</h1>
          </div>
          <p className="settings-page-subtitle">
            Manage your admin panel preferences and system configuration.
          </p>
        </div>

        <div className="settings-header-badge">
          <ShieldCheck size={14} />
          <span>Municipal Config Center</span>
        </div>
      </header>

      {/* 2. TWO-COLUMN SETTINGS LAYOUT */}
      <div className="settings-layout-grid">
        {/* LEFT COLUMN: NAVIGATION CARD */}
        <aside className="settings-nav-card" aria-label="Settings Categories">
          <span className="settings-nav-heading">Configuration</span>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`settings-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="settings-nav-icon-box">
                  <Icon size={18} />
                </div>
                <div className="settings-nav-text">
                  <span className="settings-nav-title">{tab.title}</span>
                  <span className="settings-nav-subtitle">{tab.subtitle}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* RIGHT COLUMN: ACTIVE SECTION CONTENT */}
        <div className="settings-content-wrapper">
          {/* ================================================================
              SECTION 1: GENERAL SETTINGS
              ================================================================ */}
          {activeTab === 'general' && (
            <div className="settings-content-card">
              <div className="settings-section-header">
                <div>
                  <h2 className="settings-section-title">
                    <Building2 size={20} style={{ color: 'var(--primary)' }} />
                    General Settings
                  </h2>
                  <p className="settings-section-desc">
                    Configure your municipality identity, administrative communication details, and localization.
                  </p>
                </div>
              </div>

              <form className="settings-form" onSubmit={handleSaveGeneral}>
                <div className="settings-form-grid">
                  {/* Organization Name */}
                  <div className="settings-form-group full-width">
                    <label htmlFor="orgName" className="settings-label">
                      <Building2 size={15} style={{ color: 'var(--text-muted)' }} />
                      Organization / City Name
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      className={`settings-input ${generalErrors.orgName ? 'has-error' : ''}`}
                      value={generalForm.orgName}
                      onChange={(e) => handleGeneralChange('orgName', e.target.value)}
                      placeholder="e.g. Smart Civic Complaint System"
                    />
                    {generalErrors.orgName && (
                      <span className="settings-field-error">
                        <AlertCircle size={13} /> {generalErrors.orgName}
                      </span>
                    )}
                  </div>

                  {/* Admin Email */}
                  <div className="settings-form-group">
                    <label htmlFor="adminEmail" className="settings-label">
                      <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                      Admin Email
                    </label>
                    <input
                      id="adminEmail"
                      type="email"
                      className={`settings-input ${generalErrors.adminEmail ? 'has-error' : ''}`}
                      value={generalForm.adminEmail}
                      onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                      placeholder="admin@example.com"
                    />
                    {generalErrors.adminEmail && (
                      <span className="settings-field-error">
                        <AlertCircle size={13} /> {generalErrors.adminEmail}
                      </span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="settings-form-group">
                    <label htmlFor="phone" className="settings-label">
                      <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className={`settings-input ${generalErrors.phone ? 'has-error' : ''}`}
                      value={generalForm.phone}
                      onChange={(e) => handleGeneralChange('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {generalErrors.phone && (
                      <span className="settings-field-error">
                        <AlertCircle size={13} /> {generalErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Time Zone */}
                  <div className="settings-form-group">
                    <label htmlFor="timeZone" className="settings-label">
                      <Clock size={15} style={{ color: 'var(--text-muted)' }} />
                      Time Zone
                    </label>
                    <select
                      id="timeZone"
                      className="settings-select"
                      value={generalForm.timeZone}
                      onChange={(e) => handleGeneralChange('timeZone', e.target.value)}
                    >
                      <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - GMT +05:30)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York (EST)">America/New_York (EST - GMT -05:00)</option>
                      <option value="Europe/London (BST)">Europe/London (BST - GMT +01:00)</option>
                      <option value="Asia/Dubai (GST)">Asia/Dubai (GST - GMT +04:00)</option>
                      <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT - GMT +08:00)</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div className="settings-form-group">
                    <label htmlFor="language" className="settings-label">
                      <Globe size={15} style={{ color: 'var(--text-muted)' }} />
                      Language
                    </label>
                    <select
                      id="language"
                      className="settings-select"
                      value={generalForm.language}
                      onChange={(e) => handleGeneralChange('language', e.target.value)}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Spanish">Español (Spanish)</option>
                      <option value="French">Français (French)</option>
                      <option value="German">Deutsch (German)</option>
                    </select>
                  </div>
                </div>

                <div className="settings-action-row">
                  <button type="button" className="btn-cancel" onClick={handleCancelGeneral}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================
              SECTION 2: NOTIFICATION SETTINGS
              ================================================================ */}
          {activeTab === 'notifications' && (
            <div className="settings-content-card">
              <div className="settings-section-header">
                <div>
                  <h2 className="settings-section-title">
                    <Bell size={20} style={{ color: 'var(--primary)' }} />
                    Notification Settings
                  </h2>
                  <p className="settings-section-desc">
                    Control which civic triggers notify administrators and how alerts are dispatched.
                  </p>
                </div>
              </div>

              <div className="settings-toggle-list">
                {/* 1. New Complaint Notifications */}
                <div className="settings-toggle-card">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">New Complaint Notifications</span>
                    <p className="settings-toggle-desc">
                      Receive an alert whenever a new complaint is submitted.
                    </p>
                  </div>
                  <label className="settings-switch-wrapper">
                    <input
                      type="checkbox"
                      className="settings-switch-input"
                      checked={notifForm.newComplaint}
                      onChange={() => handleToggleNotification('newComplaint')}
                    />
                    <span className="settings-switch-pill"></span>
                    <span className="settings-switch-status">
                      {notifForm.newComplaint ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </div>

                {/* 2. High Priority Complaint Alerts */}
                <div className="settings-toggle-card">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">High Priority Complaint Alerts</span>
                    <p className="settings-toggle-desc">
                      Get notified when a critical complaint is reported.
                    </p>
                  </div>
                  <label className="settings-switch-wrapper">
                    <input
                      type="checkbox"
                      className="settings-switch-input"
                      checked={notifForm.highPriority}
                      onChange={() => handleToggleNotification('highPriority')}
                    />
                    <span className="settings-switch-pill"></span>
                    <span className="settings-switch-status">
                      {notifForm.highPriority ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </div>

                {/* 3. Complaint Status Updates */}
                <div className="settings-toggle-card">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Complaint Status Updates</span>
                    <p className="settings-toggle-desc">
                      Receive notifications when complaint progress changes.
                    </p>
                  </div>
                  <label className="settings-switch-wrapper">
                    <input
                      type="checkbox"
                      className="settings-switch-input"
                      checked={notifForm.statusUpdates}
                      onChange={() => handleToggleNotification('statusUpdates')}
                    />
                    <span className="settings-switch-pill"></span>
                    <span className="settings-switch-status">
                      {notifForm.statusUpdates ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </div>

                {/* 4. New User Registration */}
                <div className="settings-toggle-card">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">New User Registration</span>
                    <p className="settings-toggle-desc">
                      Alert when a new citizen or staff account is registered.
                    </p>
                  </div>
                  <label className="settings-switch-wrapper">
                    <input
                      type="checkbox"
                      className="settings-switch-input"
                      checked={notifForm.newUserReg}
                      onChange={() => handleToggleNotification('newUserReg')}
                    />
                    <span className="settings-switch-pill"></span>
                    <span className="settings-switch-status">
                      {notifForm.newUserReg ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </div>

                {/* 5. Department Assignment Notifications */}
                <div className="settings-toggle-card">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Department Assignment Notifications</span>
                    <p className="settings-toggle-desc">
                      Alerts when complaints are routed to departments.
                    </p>
                  </div>
                  <label className="settings-switch-wrapper">
                    <input
                      type="checkbox"
                      className="settings-switch-input"
                      checked={notifForm.deptAssignment}
                      onChange={() => handleToggleNotification('deptAssignment')}
                    />
                    <span className="settings-switch-pill"></span>
                    <span className="settings-switch-status">
                      {notifForm.deptAssignment ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </div>

                {/* 6. Email Notifications */}
                <div className="settings-toggle-card">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Email Notifications</span>
                    <p className="settings-toggle-desc">
                      Send email digest summaries for urgent civic matters.
                    </p>
                  </div>
                  <label className="settings-switch-wrapper">
                    <input
                      type="checkbox"
                      className="settings-switch-input"
                      checked={notifForm.emailNotifs}
                      onChange={() => handleToggleNotification('emailNotifs')}
                    />
                    <span className="settings-switch-pill"></span>
                    <span className="settings-switch-status">
                      {notifForm.emailNotifs ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="settings-action-row">
                <button type="button" className="btn-cancel" onClick={handleCancelNotifications}>
                  Cancel
                </button>
                <button type="button" className="btn-save" onClick={handleSaveNotifications}>
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 3: SECURITY SETTINGS
              ================================================================ */}
          {activeTab === 'security' && (
            <div className="settings-content-card">
              <div className="settings-section-header">
                <div>
                  <h2 className="settings-section-title">
                    <Shield size={20} style={{ color: 'var(--primary)' }} />
                    Security Settings
                  </h2>
                  <p className="settings-section-desc">
                    Manage administrative credentials, two-factor authentication, and monitor active logins.
                  </p>
                </div>
              </div>

              <div className="security-subsections">
                {/* 3.1 Change Password Card */}
                <div className="security-card-box">
                  <div className="security-card-header">
                    <div className="security-card-title-group">
                      <div className="security-card-icon">
                        <KeyRound size={18} />
                      </div>
                      <div>
                        <h3 className="security-card-title">Change Password</h3>
                        <p className="security-card-subtitle">
                          Ensure your admin account uses a strong, unique password.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form className="settings-form" onSubmit={handleUpdatePassword}>
                    <div className="settings-form-grid">
                      {/* Current Password */}
                      <div className="settings-form-group full-width">
                        <label htmlFor="currentPassword" className="settings-label">
                          Current Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="currentPassword"
                            type={showPassword.current ? 'text' : 'password'}
                            className={`settings-input ${passwordErrors.currentPassword ? 'has-error' : ''}`}
                            value={passwordForm.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => ({ ...p, current: !p.current }))}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-light)',
                              cursor: 'pointer'
                            }}
                            aria-label={showPassword.current ? 'Hide password' : 'Show password'}
                          >
                            {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <span className="settings-field-error">
                            <AlertCircle size={13} /> {passwordErrors.currentPassword}
                          </span>
                        )}
                      </div>

                      {/* New Password */}
                      <div className="settings-form-group">
                        <label htmlFor="newPassword" className="settings-label">
                          New Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="newPassword"
                            type={showPassword.new ? 'text' : 'password'}
                            className={`settings-input ${passwordErrors.newPassword ? 'has-error' : ''}`}
                            value={passwordForm.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            placeholder="Min. 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-light)',
                              cursor: 'pointer'
                            }}
                            aria-label={showPassword.new ? 'Hide password' : 'Show password'}
                          >
                            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <span className="settings-field-error">
                            <AlertCircle size={13} /> {passwordErrors.newPassword}
                          </span>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div className="settings-form-group">
                        <label htmlFor="confirmPassword" className="settings-label">
                          Confirm New Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="confirmPassword"
                            type={showPassword.confirm ? 'text' : 'password'}
                            className={`settings-input ${passwordErrors.confirmPassword ? 'has-error' : ''}`}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            placeholder="Re-enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-light)',
                              cursor: 'pointer'
                            }}
                            aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
                          >
                            {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <span className="settings-field-error">
                            <AlertCircle size={13} /> {passwordErrors.confirmPassword}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.25rem' }}>
                      <button type="submit" className="btn-save">
                        <Lock size={15} />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 3.2 Two-Factor Authentication Card */}
                <div className="security-card-box">
                  <div className="security-card-header">
                    <div className="security-card-title-group">
                      <div className="security-card-icon">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h3 className="security-card-title">Two-Factor Authentication</h3>
                        <p className="security-card-subtitle">
                          Add an additional layer of security to your admin account.
                        </p>
                      </div>
                    </div>

                    <label className="settings-switch-wrapper">
                      <input
                        type="checkbox"
                        className="settings-switch-input"
                        checked={securityForm.twoFactorAuth}
                        onChange={handleToggle2FA}
                      />
                      <span className="settings-switch-pill"></span>
                      <span className="settings-switch-status">
                        {securityForm.twoFactorAuth ? 'ON' : 'OFF'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3.3 Active Sessions Card */}
                <div className="security-card-box">
                  <div className="security-card-header">
                    <div className="security-card-title-group">
                      <div className="security-card-icon">
                        <Laptop size={18} />
                      </div>
                      <div>
                        <h3 className="security-card-title">Active Sessions</h3>
                        <p className="security-card-subtitle">
                          Devices and web browsers currently authenticated to this account.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="session-list">
                    {sessions.map((sess) => (
                      <div key={sess.id} className="session-item">
                        <div className="session-item-left">
                          <div className="session-device-icon">
                            {sess.device.includes('Mobile') || sess.device.includes('Tablet') ? (
                              <Smartphone size={18} />
                            ) : (
                              <Laptop size={18} />
                            )}
                          </div>
                          <div className="session-details">
                            <span className="session-device-name">
                              {sess.device} — {sess.os}
                              {sess.isCurrent && (
                                <span className="session-active-pill">Active Now</span>
                              )}
                            </span>
                            <span className="session-meta">
                              Last active: {sess.lastActive} • {sess.location} ({sess.ip})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {sessions.length > 1 && (
                    <button
                      type="button"
                      className="btn-signout-sessions"
                      onClick={handleSignOutOtherSessions}
                    >
                      <LogOut size={14} />
                      <span>Sign out other sessions</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 4: SYSTEM PREFERENCES
              ================================================================ */}
          {activeTab === 'preferences' && (
            <div className="settings-content-card">
              <div className="settings-section-header">
                <div>
                  <h2 className="settings-section-title">
                    <SlidersHorizontal size={20} style={{ color: 'var(--primary)' }} />
                    System Preferences
                  </h2>
                  <p className="settings-section-desc">
                    Fine-tune dashboard pagination, real-time data sync, date formatting, and system maintenance.
                  </p>
                </div>
              </div>

              <div className="settings-form">
                <div className="settings-form-grid">
                  {/* Default Complaint Status */}
                  <div className="settings-form-group">
                    <label htmlFor="defaultStatus" className="settings-label">
                      Default Complaint Status
                    </label>
                    <select
                      id="defaultStatus"
                      className="settings-select"
                      value={prefForm.defaultStatus}
                      onChange={(e) => handlePrefChange('defaultStatus', e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                    <span className="settings-field-helper">
                      Default state assigned to freshly submitted civic issues.
                    </span>
                  </div>

                  {/* Complaints Per Page */}
                  <div className="settings-form-group">
                    <label htmlFor="complaintsPerPage" className="settings-label">
                      Complaints Per Page
                    </label>
                    <select
                      id="complaintsPerPage"
                      className="settings-select"
                      value={prefForm.complaintsPerPage}
                      onChange={(e) => handlePrefChange('complaintsPerPage', e.target.value)}
                    >
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                      <option value="100">100 per page</option>
                    </select>
                    <span className="settings-field-helper">
                      Number of complaint records displayed per page table.
                    </span>
                  </div>

                  {/* Dashboard Auto Refresh */}
                  <div className="settings-form-group">
                    <label htmlFor="autoRefreshToggle" className="settings-label">
                      Dashboard Auto Refresh
                    </label>
                    <select
                      id="autoRefreshToggle"
                      className="settings-select"
                      value={prefForm.autoRefresh ? 'Enabled' : 'Disabled'}
                      onChange={(e) => handlePrefChange('autoRefresh', e.target.value === 'Enabled')}
                    >
                      <option value="Enabled">Enabled</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                    <span className="settings-field-helper">
                      Automatically polling live complaint telemetry in background.
                    </span>
                  </div>

                  {/* Auto Refresh Interval */}
                  <div className="settings-form-group">
                    <label htmlFor="refreshInterval" className="settings-label">
                      Auto Refresh Interval
                    </label>
                    <select
                      id="refreshInterval"
                      className="settings-select"
                      value={prefForm.refreshInterval}
                      onChange={(e) => handlePrefChange('refreshInterval', e.target.value)}
                      disabled={!prefForm.autoRefresh}
                    >
                      <option value="15 seconds">15 seconds</option>
                      <option value="30 seconds">30 seconds</option>
                      <option value="60 seconds">60 seconds (1 minute)</option>
                      <option value="5 minutes">5 minutes</option>
                    </select>
                    <span className="settings-field-helper">
                      Frequency of dashboard analytics synchronization.
                    </span>
                  </div>

                  {/* Date Format */}
                  <div className="settings-form-group">
                    <label htmlFor="dateFormat" className="settings-label">
                      <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      className="settings-select"
                      value={prefForm.dateFormat}
                      onChange={(e) => handlePrefChange('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 07/09/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/07/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-07)</option>
                    </select>
                  </div>
                </div>

                {/* Maintenance Mode Card */}
                <div className={`maintenance-card ${prefForm.maintenanceMode ? 'active' : ''}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <span className="settings-toggle-title">Maintenance Mode</span>
                      <p className="settings-toggle-desc">
                        Temporarily disable public complaint submissions.
                      </p>
                    </div>
                    <label className="settings-switch-wrapper">
                      <input
                        type="checkbox"
                        className="settings-switch-input"
                        checked={prefForm.maintenanceMode}
                        onChange={() => handlePrefChange('maintenanceMode', !prefForm.maintenanceMode)}
                      />
                      <span className="settings-switch-pill"></span>
                      <span className="settings-switch-status">
                        {prefForm.maintenanceMode ? 'ON' : 'OFF'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Maintenance Warning Banner (Active state) */}
                {prefForm.maintenanceMode && (
                  <div className="maintenance-warning-banner" role="alert">
                    <AlertTriangle size={20} className="maintenance-warning-icon" />
                    <div className="maintenance-warning-content">
                      <h4 className="maintenance-warning-title">Maintenance Mode is Active</h4>
                      <p className="maintenance-warning-text">
                        Citizen complaint submissions are currently locked. Citizens accessing the public portal will see a scheduled maintenance notice.
                      </p>
                    </div>
                  </div>
                )}

                <div className="settings-action-row">
                  <button type="button" className="btn-cancel" onClick={handleCancelPreferences}>
                    Cancel
                  </button>
                  <button type="button" className="btn-save" onClick={handleSavePreferences}>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              DANGER ZONE SECTION
              ================================================================ */}
          <div className="settings-danger-card">
            <div className="danger-zone-info">
              <span className="danger-zone-badge">
                <AlertTriangle size={12} />
                Danger Zone
              </span>
              <h3 className="danger-zone-title">Reset Settings</h3>
              <p className="danger-zone-desc">
                Restore all settings to their default values. This will reset general identity, notifications, and system preferences. Existing complaints, users, and department records will not be affected.
              </p>
            </div>
            <button
              type="button"
              className="btn-danger-reset"
              onClick={() => setIsResetModalOpen(true)}
            >
              <RotateCcw size={16} />
              <span>Reset Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          CONFIRMATION DIALOG MODAL (DANGER ZONE RESET)
          ==================================================================== */}
      {isResetModalOpen && (
        <div
          className="settings-modal-backdrop"
          onClick={() => setIsResetModalOpen(false)}
        >
          <div
            className="settings-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="reset-modal-title"
            aria-describedby="reset-modal-desc"
          >
            <div className="confirm-icon-wrap">
              <AlertTriangle size={28} />
            </div>

            <h3 id="reset-modal-title" className="confirm-title">
              Reset All Settings?
            </h3>

            <p id="reset-modal-desc" className="confirm-desc">
              Are you sure you want to restore all settings to their factory default values? All customized notification preferences, system thresholds, and general options will be reset.
            </p>

            <div className="confirm-btn-row">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsResetModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger-reset"
                onClick={handleConfirmReset}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST NOTIFICATION
          ==================================================================== */}
      {toast.show && (
        <div
          className={`settings-toast ${toast.type === 'error' ? 'toast-error' : toast.type === 'warning' ? 'toast-warning' : ''}`}
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon-box">
            {toast.type === 'error' ? (
              <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
            ) : toast.type === 'warning' ? (
              <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
            ) : (
              <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            )}
          </div>
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
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

export default Settings;
