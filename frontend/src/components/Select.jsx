import React from 'react';

const Select = ({ label, id, error, options = [], className = '', ...props }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    marginBottom: '1rem',
    width: '100%'
  };

  const labelStyle = {
    fontWeight: '500',
    fontSize: '0.9rem',
    color: 'var(--text-main)'
  };

  const selectStyle = {
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: 'var(--surface)',
    cursor: 'pointer'
  };

  const errorStyle = {
    color: 'var(--danger)',
    fontSize: '0.8rem',
    marginTop: '0.2rem'
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <select 
        id={id}
        style={selectStyle}
        onFocus={(e) => !error && (e.target.style.borderColor = 'var(--primary)')}
        onBlur={(e) => !error && (e.target.style.borderColor = 'var(--border)')}
        {...props} 
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default Select;
