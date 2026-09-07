import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'success':
        return { backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' };
      case 'pending':
      case 'warning':
        return { backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' };
      case 'high':
      case 'danger':
        return { backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)' };
      case 'in progress':
      case 'info':
        return { backgroundColor: 'var(--info-bg)', color: 'var(--info-text)' };
      default:
        return { backgroundColor: 'var(--border)', color: 'var(--text-main)' };
    }
  };

  const style = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '500',
    ...getStatusStyles()
  };

  return (
    <span className={`badge ${className}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
