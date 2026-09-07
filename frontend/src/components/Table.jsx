import React from 'react';

const Table = ({ headers = [], children }) => {
  const tableContainer = {
    width: '100%',
    overflowX: 'auto',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  };

  const thStyle = {
    padding: '1rem',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--text-muted)',
    fontWeight: '600',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.9rem'
  };

  return (
    <div style={tableContainer}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

// Also export a TR and TD for consistency if needed, though raw <tr> and <td> work fine with global styles.
// But to ensure styles are applied cleanly without global clashes:

export const Td = ({ children, style = {}, ...props }) => {
  return (
    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.95rem', ...style }} {...props}>
      {children}
    </td>
  );
}

export const Tr = ({ children, className = '', ...props }) => {
  return (
    <tr className={`table-row ${className}`} style={{ transition: 'background-color 0.2s' }} {...props}>
      {children}
    </tr>
  );
}

export default Table;
