import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = 'primary' }) => {
  return (
    <Card className="flex flex-col gap-2" style={{ borderTop: `4px solid var(--${colorClass})` }}>
      <div className="flex justify-between items-start">
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
        {Icon && (
          <div style={{ 
            color: `var(--${colorClass})`, 
            backgroundColor: `var(--${colorClass}-bg, var(--primary-light))`,
            padding: '0.5rem',
            borderRadius: '50%'
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>
        {value}
      </div>
      {trend && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {trend}
        </p>
      )}
    </Card>
  );
};

export default StatCard;
