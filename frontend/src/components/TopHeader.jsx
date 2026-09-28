import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, Loader2, X } from 'lucide-react';
import { getAuthUser, searchComplaints } from '../services/api';

const TopHeader = ({ title = 'Dashboard', toggleSidebar, unreadNotifications = 5 }) => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const displayName = user?.name || 'Raj Shrivas';
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Citizen';
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
        console.error('Complaint search error:', err);
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
    navigate(`/citizen/complaints/${complaint.complaintId || complaint._id}`);
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
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="header-title">{title}</h2>
      </div>
      
      <div className="header-right">
        <div className="header-search" ref={searchContainerRef}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search complaints..." 
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
        
        <button 
          className="header-icon-btn" 
          onClick={() => navigate('/citizen/notifications')}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadNotifications > 0 && <span className="notification-badge"></span>}
        </button>
        
        <div className="header-user" onClick={() => navigate('/citizen/profile')} title="My Profile" style={{ cursor: 'pointer' }}>
          <div className="user-avatar">
            {initials}
          </div>
          <div className="user-info hidden md:flex" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <span className="user-name">{displayName}</span>
            <span className="user-role">{displayRole}</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;

