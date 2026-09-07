import React from 'react';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  const baseStyle = {
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const hoverStyle = hoverable ? {
    cursor: 'pointer',
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow)'
  } : {};

  return (
    <div 
      className={`card ${className}`} 
      style={{ ...baseStyle, ...(hoverable ? hoverStyle : {}) }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
