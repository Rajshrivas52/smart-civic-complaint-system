import React, { useState } from 'react';
import { 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import './GoogleRoleModal.css';

const DEFAULT_DEPARTMENTS = [
  'Road Maintenance',
  'Sanitation & Waste Management',
  'Electricity & Lighting',
  'Water Supply & Drainage',
  'Public Health & Safety',
  'Other Department'
];

/**
 * GoogleRoleModal
 * Interactive first-time onboarding modal for users signing up with Google.
 * Lets users pick Citizen, Department Officer, or Municipal Administrator.
 */
const GoogleRoleModal = ({
  isOpen,
  profile,
  onSubmit,
  onCancel,
  loading = false,
  error = ''
}) => {
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [departmentSelection, setDepartmentSelection] = useState('Road Maintenance');
  const [customDepartment, setCustomDepartment] = useState('');
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    let finalDeptName = '';
    if (selectedRole === 'department') {
      if (departmentSelection === 'Other Department') {
        if (!customDepartment.trim()) {
          setLocalError('Please enter the name of your department.');
          return;
        }
        finalDeptName = customDepartment.trim();
      } else {
        finalDeptName = departmentSelection;
      }
    }

    if (onSubmit) {
      onSubmit(selectedRole, finalDeptName);
    }
  };

  const displayName = profile?.name || 'New User';
  const displayEmail = profile?.email || '';
  const displayAvatar = profile?.picture;
  const initial = displayName.charAt(0).toUpperCase() || 'U';

  const displayErrorMessage = error || localError;

  return (
    <div 
      className="google-role-modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="google-role-title"
    >
      <div className="google-role-modal-card">
        {/* Close Button */}
        <button 
          type="button" 
          className="google-role-modal-close-btn"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header with Profile Info */}
        <div className="google-role-modal-header">
          <div className="google-user-pill">
            {displayAvatar ? (
              <img 
                src={displayAvatar} 
                alt={displayName} 
                className="google-user-avatar"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="google-user-avatar-placeholder">
                {initial}
              </div>
            )}
            <div className="google-user-info-text">
              <span className="google-user-name">{displayName}</span>
              <span className="google-user-email">{displayEmail}</span>
            </div>
          </div>

          <h2 id="google-role-title" className="google-role-modal-title">
            Choose Your Account Type
          </h2>
          <p className="google-role-modal-subtitle">
            Finish setting up your CivicAI profile by selecting your role in the system.
          </p>
        </div>

        {/* Modal Body with Role Options */}
        <form onSubmit={handleSubmit}>
          <div className="google-role-modal-body">
            {displayErrorMessage && (
              <div className="google-role-modal-error">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{displayErrorMessage}</span>
              </div>
            )}

            <div className="google-role-options">
              {/* Option 1: Citizen */}
              <div 
                className={`google-role-option-card ${selectedRole === 'citizen' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('citizen')}
              >
                <div className="google-role-icon-box google-role-icon-citizen">
                  <UserCheck size={22} />
                </div>
                <div className="google-role-content">
                  <div className="google-role-title-row">
                    <span className="google-role-name">Citizen</span>
                    <span className="google-role-badge badge-citizen">Public Access</span>
                  </div>
                  <p className="google-role-desc">
                    Report civic complaints (potholes, garbage, water leaks), view live progress, and receive instant resolution updates.
                  </p>
                </div>
                <div className="google-role-radio-check">
                  {selectedRole === 'citizen' && <Check size={14} />}
                </div>
              </div>

              {/* Option 2: Department Officer */}
              <div 
                className={`google-role-option-card ${selectedRole === 'department' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('department')}
              >
                <div className="google-role-icon-box google-role-icon-department">
                  <Building2 size={22} />
                </div>
                <div className="google-role-content">
                  <div className="google-role-title-row">
                    <span className="google-role-name">Department Officer</span>
                    <span className="google-role-badge badge-department">Municipal Staff</span>
                  </div>
                  <p className="google-role-desc">
                    Manage, assign, and resolve field complaints for your municipal department with photo proof and status tracking.
                  </p>
                </div>
                <div className="google-role-radio-check">
                  {selectedRole === 'department' && <Check size={14} />}
                </div>
              </div>

              {/* Expandable Department Selection */}
              {selectedRole === 'department' && (
                <div className="google-dept-dropdown-panel">
                  <label className="google-dept-label" htmlFor="google-dept-select">
                    Assigned Municipal Department:
                  </label>
                  <select
                    id="google-dept-select"
                    className="google-dept-select"
                    value={departmentSelection}
                    onChange={(e) => setDepartmentSelection(e.target.value)}
                  >
                    {DEFAULT_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>

                  {departmentSelection === 'Other Department' && (
                    <input 
                      type="text"
                      className="google-dept-input"
                      placeholder="Enter custom department name..."
                      value={customDepartment}
                      onChange={(e) => setCustomDepartment(e.target.value)}
                      required
                    />
                  )}
                </div>
              )}

              {/* Option 3: Administrator */}
              <div 
                className={`google-role-option-card ${selectedRole === 'admin' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('admin')}
              >
                <div className="google-role-icon-box google-role-icon-admin">
                  <ShieldCheck size={22} />
                </div>
                <div className="google-role-content">
                  <div className="google-role-title-row">
                    <span className="google-role-name">Municipal Administrator</span>
                    <span className="google-role-badge badge-admin">City Authority</span>
                  </div>
                  <p className="google-role-desc">
                    Full city-level administrative governance: oversee departments, staff performance, system analytics, and escalations.
                  </p>
                </div>
                <div className="google-role-radio-check">
                  {selectedRole === 'admin' && <Check size={14} />}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="google-role-modal-footer">
            <button 
              type="button" 
              className="google-role-btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="google-role-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="google-role-spinner" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoogleRoleModal;
