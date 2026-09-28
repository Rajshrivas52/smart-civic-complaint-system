import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, Shield, Loader2, X } from 'lucide-react';
import { getAuthUser, searchComplaints } from '../services/api';

const AdminNavbar = ({ title = 'Admin Dashboard', toggleSidebar, unreadNotifications = 3 }) => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const displayName = user?.name || 'System Admin';
  const displayRole = user?.role === 'admin' ? 'Municipal Overseer' : (user?.role || 'Admin');
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      setIsOpen(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }

    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const response = await searchComplaints(trimmed, controller.signal);
        setResults(response.data || []);
        setIsLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Admin complaint search error:', err);
        setError('Unable to search complaints. Please try again.');
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectComplaint = (complaint) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/admin/complaints/${complaint.complaintId || complaint._id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectComplaint(results[0]);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
  };

  return (
    <header className="citizen-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle Navigation Menu">
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 className="header-title">{title}</h2>
          <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
            <Shield size={10} style={{ marginRight: '0.2rem' }} /> Municipal Command
          </span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-search" ref={searchContainerRef}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search complaints, citizens, departments..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim()) setIsOpen(true); }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button 
              type="button" 
              className="header-search-clear" 
              onClick={handleClear}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {isOpen && (
            <div className="search-dropdown-menu">
              {isLoading && (
                <div className="search-dropdown-state">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Searching...</span>
                </div>
              )}

              {!isLoading && error && (
                <div className="search-dropdown-error">
                  {error}
                </div>
              )}

              {!isLoading && !error && results.length === 0 && (
                <div className="search-dropdown-state">
                  No complaints found
                </div>
              )}

              {!isLoading && !error && results.length > 0 && (
                <div className="search-results-list">
                  {results.map((complaint) => {
                    const priorityClass = (complaint.priority || 'medium').toLowerCase();
                    return (
                      <div 
                        key={complaint.complaintId || complaint._id}
                        className="search-result-item"
                        onClick={() => handleSelectComplaint(complaint)}
                      >
                        <div className="search-result-top">
                          <span className="search-result-id">{complaint.complaintId}</span>
                          <span className={`search-priority-badge priority-${priorityClass}`}>
                            {complaint.priority?.toUpperCase() || 'MEDIUM'}
                          </span>
                        </div>
                        <div className="search-result-title">{complaint.title}</div>
                        <div className="search-result-meta">
                          <span className="search-result-dept">{complaint.departmentName || 'Civic Services'}</span>
                          {complaint.status && (
                            <span className="search-result-status">{complaint.status}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={20} />
          {unreadNotifications > 0 && <span className="notification-badge"></span>}
        </button>
        
        <div className="header-user">
          <div className="user-avatar" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}>
            {initials}
          </div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{displayRole}</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

