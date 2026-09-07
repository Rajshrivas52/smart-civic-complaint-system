import React from 'react';

const Button = ({ children, variant = 'primary', className = '', fullWidth = false, ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: 'var(--primary)', color: 'white', border: 'none' };
      case 'secondary':
        return { backgroundColor: 'var(--secondary)', color: 'white', border: 'none' };
      case 'danger':
        return { backgroundColor: 'var(--danger)', color: 'white', border: 'none' };
      case 'outline':
        return { backgroundColor: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' };
      default:
        return { backgroundColor: 'var(--primary)', color: 'white', border: 'none' };
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      style={{ ...baseStyle, ...getVariantStyles() }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
