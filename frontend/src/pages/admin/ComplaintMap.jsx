import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  X, 
  RotateCcw, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  Compass, 
  Crosshair, 
  Maximize2, 
  Eye, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';

import './ComplaintMap.css';

import { 
  mockMapComplaints,
  GWALIOR_CENTER,
  MAP_CATEGORIES,
  MAP_PRIORITIES,
  MAP_STATUSES,
  MAP_DEPARTMENTS,
  MAP_AREAS
} from '../../utils/mockData';

const DATE_RANGE_OPTIONS = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom'];

// Gwalior coordinate boundary for GIS fallback projection
const GWALIOR_BOUNDS = {
  minLat: 26.185,
  maxLat: 26.260,
  minLng: 78.145,
  maxLng: 78.235
};

const ComplaintMap = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const googleMapInstance = useRef(null);
  const markersRef = useRef([]);
  const heatmapLayerRef = useRef(null);

  // Environment variable for Google Maps API Key
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Google Maps Loading states
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [isHeatmapEnabled, setIsHeatmapEnabled] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Active selected complaint (for InfoWindow / popup card)
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filtered complaints computation
  const filteredComplaints = useMemo(() => {
    return mockMapComplaints.filter((item) => {
      // 1. Search Query (ID, Title, Category, Area, Department)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(query);
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        const matchArea = item.area.toLowerCase().includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        if (!matchId && !matchTitle && !matchCategory && !matchArea && !matchDept) {
          return false;
        }
      }

      // 2. Category
      if (categoryFilter !== 'All' && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // 3. Priority
      if (priorityFilter !== 'All' && item.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      // 4. Status
      if (statusFilter !== 'All' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // 5. Department
      if (departmentFilter !== 'All' && item.department.toLowerCase() !== departmentFilter.toLowerCase()) {
        return false;
      }

      // 6. Area
      if (areaFilter !== 'All' && item.area.toLowerCase() !== areaFilter.toLowerCase()) {
        return false;
      }

      // 7. Date Range
      if (dateFilter !== 'All') {
        const itemDateStr = item.reportedDate;
        const itemTime = new Date(itemDateStr).getTime();
        const now = Math.max(Date.now(), new Date('2026-09-06').getTime());
        const oneDay = 24 * 60 * 60 * 1000;

        if (dateFilter === 'Today') {
          if (itemDateStr !== '2026-09-06' && Math.abs(now - itemTime) > oneDay) return false;
        } else if (dateFilter === 'Last 7 Days') {
          if (now - itemTime > 7 * oneDay) return false;
        } else if (dateFilter === 'Last 30 Days') {
          if (now - itemTime > 30 * oneDay) return false;
        } else if (dateFilter === 'Custom') {
          if (customStartDate && itemDateStr < customStartDate) return false;
          if (customEndDate && itemDateStr > customEndDate) return false;
        }
      }

      return true;
    });
  }, [searchQuery, categoryFilter, priorityFilter, statusFilter, departmentFilter, areaFilter, dateFilter, customStartDate, customEndDate]);

  // Dynamically computed map summary counts
  const summaryCounts = useMemo(() => {
    return {
      total: filteredComplaints.length,
      highPriority: filteredComplaints.filter(c => c.priority === 'High').length,
      pending: filteredComplaints.filter(c => c.status === 'Pending').length,
      inProgress: filteredComplaints.filter(c => c.status === 'In Progress').length,
      resolved: filteredComplaints.filter(c => c.status === 'Resolved').length
    };
  }, [filteredComplaints]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setStatusFilter('All');
    setDepartmentFilter('All');
    setAreaFilter('All');
    setDateFilter('All');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedComplaint(null);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    categoryFilter !== 'All' ||
    priorityFilter !== 'All' ||
    statusFilter !== 'All' ||
    departmentFilter !== 'All' ||
    areaFilter !== 'All' ||
    dateFilter !== 'All' ||
    customStartDate ||
    customEndDate
  );

  // Center & Select Complaint
  const handleSelectComplaint = useCallback((complaint) => {
    setSelectedComplaint(complaint);

    if (googleMapInstance.current && window.google?.maps) {
      googleMapInstance.current.panTo({
        lat: complaint.latitude,
        lng: complaint.longitude
      });
      googleMapInstance.current.setZoom(15);
    }
  }, []);

  // Recenter Map
  const handleRecenter = () => {
    if (googleMapInstance.current && window.google?.maps) {
      googleMapInstance.current.panTo(GWALIOR_CENTER);
      googleMapInstance.current.setZoom(12);
    } else {
      setSelectedComplaint(null);
    }
  };

  // Fit All Markers
  const handleFitBounds = () => {
    if (googleMapInstance.current && window.google?.maps && filteredComplaints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredComplaints.forEach((c) => {
        bounds.extend({ lat: c.latitude, lng: c.longitude });
      });
      googleMapInstance.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  };

  // Toggle Heatmap
  const handleToggleHeatmap = () => {
    if (!window.google?.maps?.visualization) return;

    if (isHeatmapEnabled) {
      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.setMap(null);
      }
      setIsHeatmapEnabled(false);
    } else {
      const points = filteredComplaints.map(c => new window.google.maps.LatLng(c.latitude, c.longitude));
      if (!heatmapLayerRef.current) {
        heatmapLayerRef.current = new window.google.maps.visualization.HeatmapLayer({
          data: points,
          map: googleMapInstance.current,
          radius: 30
        });
      } else {
        heatmapLayerRef.current.setData(points);
        heatmapLayerRef.current.setMap(googleMapInstance.current);
      }
      setIsHeatmapEnabled(true);
    }
  };

  // Google Maps authentication failure handler
  useEffect(() => {
    window.gm_authFailure = () => {
      console.warn('Google Maps authentication failed - check VITE_GOOGLE_MAPS_API_KEY');
      setMapLoadError(true);
      setIsMapLoaded(false);
    };

    return () => {
      delete window.gm_authFailure;
    };
  }, []);

  // Google Maps JS API script injection (when valid apiKey is provided)
  useEffect(() => {
    const trimmedKey = (googleMapsApiKey || '').trim();
    if (!trimmedKey || trimmedKey === 'your_google_maps_api_key' || trimmedKey === 'YOUR_API_KEY') {
      setIsMapLoaded(false);
      return;
    }

    if (window.google && window.google.maps) {
      setIsMapLoaded(true);
      return;
    }

    const scriptId = 'google-maps-sdk';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${trimmedKey}&libraries=places,visualization`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsMapLoaded(true);
        setMapLoadError(false);
      };

      script.onerror = () => {
        setMapLoadError(true);
        setIsMapLoaded(false);
      };

      document.head.appendChild(script);
    } else {
      if (window.google?.maps) {
        setIsMapLoaded(true);
      } else {
        script.addEventListener('load', () => {
          setIsMapLoaded(true);
          setMapLoadError(false);
        });
        script.addEventListener('error', () => {
          setMapLoadError(true);
          setIsMapLoaded(false);
        });
      }
    }
  }, [googleMapsApiKey]);

  // Initialize live Google Map instance
  useEffect(() => {
    if (!isMapLoaded || !mapContainerRef.current || !window.google?.maps) return;

    if (!googleMapInstance.current) {
      googleMapInstance.current = new window.google.maps.Map(mapContainerRef.current, {
        center: GWALIOR_CENTER,
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
        ]
      });
    }

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Create markers for filtered complaints
    filteredComplaints.forEach((complaint) => {
      const color = complaint.priority === 'High' 
        ? '#ef4444' 
        : complaint.priority === 'Medium' 
          ? '#f59e0b' 
          : '#10b981';

      const markerIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1.5,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 22)
      };

      const marker = new window.google.maps.Marker({
        position: { lat: complaint.latitude, lng: complaint.longitude },
        map: googleMapInstance.current,
        title: `${complaint.id}: ${complaint.title}`,
        icon: markerIcon
      });

      marker.addListener('click', () => {
        handleSelectComplaint(complaint);
      });

      markersRef.current.push(marker);
    });
  }, [isMapLoaded, filteredComplaints, handleSelectComplaint]);

  // Navigate to Complaint Details
  const handleViewComplaint = (complaintId) => {
    navigate(`/admin/complaints/${complaintId}`);
  };

  return (
    <div className="complaint-map-page">
      
      {/* 1. PAGE HEADER */}
      <header className="map-header-card">
        <div className="map-title-area">
          <h1 className="map-main-title">
            Complaint Map
            <span className="map-city-badge">
              <Compass size={12} />
              Gwalior GIS Zone (26.2183° N, 78.1828° E)
            </span>
          </h1>
          <p className="map-subtitle">
            Monitor, locate and analyze civic complaints across municipal sectors.
          </p>
        </div>

        <div className="map-live-status">
          <span className="pulse-dot" />
          <span>Live Municipal Geotagging</span>
        </div>
      </header>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <section className="map-filter-card" aria-label="Complaint Map Filters">
        {/* Search input */}
        <div className="map-filter-top-row">
          <div className="map-search-wrapper">
            <Search size={16} className="map-search-icon" />
            <input 
              type="text"
              className="map-search-input"
              placeholder="Search complaints, area or complaint ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search complaints by keyword or area"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="map-search-clear-btn" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="map-filters-row">
          {/* Category */}
          <div className="map-control-group">
            <label htmlFor="map-filter-cat" className="map-control-label">Category</label>
            <select
              id="map-filter-cat"
              className={`map-select ${categoryFilter !== 'All' ? 'active-filter' : ''}`}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {MAP_CATEGORIES.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="map-control-group">
            <label htmlFor="map-filter-pri" className="map-control-label">Priority</label>
            <select
              id="map-filter-pri"
              className={`map-select ${priorityFilter !== 'All' ? 'active-filter' : ''}`}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {MAP_PRIORITIES.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="map-control-group">
            <label htmlFor="map-filter-st" className="map-control-label">Status</label>
            <select
              id="map-filter-st"
              className={`map-select ${statusFilter !== 'All' ? 'active-filter' : ''}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {MAP_STATUSES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="map-control-group">
            <label htmlFor="map-filter-dept" className="map-control-label">Department</label>
            <select
              id="map-filter-dept"
              className={`map-select ${departmentFilter !== 'All' ? 'active-filter' : ''}`}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {MAP_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="map-control-group">
            <label htmlFor="map-filter-area" className="map-control-label">Area</label>
            <select
              id="map-filter-area"
              className={`map-select ${areaFilter !== 'All' ? 'active-filter' : ''}`}
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              {MAP_AREAS.map(a => (
                <option key={a} value={a}>{a === 'All' ? 'All Areas' : a}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="map-control-group">
            <label htmlFor="map-filter-date" className="map-control-label">Date Range</label>
            <select
              id="map-filter-date"
              className={`map-select ${dateFilter !== 'All' ? 'active-filter' : ''}`}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {DATE_RANGE_OPTIONS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Dates' : d}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button 
            type="button" 
            className="map-reset-btn"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title="Reset all search queries and map filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Custom Date Range Row */}
        {dateFilter === 'Custom' && (
          <div className="map-custom-dates-row">
            <div className="map-control-group">
              <label htmlFor="map-custom-start" className="map-control-label">From Date</label>
              <input
                id="map-custom-start"
                type="date"
                className="map-date-input"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div className="map-control-group">
              <label htmlFor="map-custom-end" className="map-control-label">To Date</label>
              <input
                id="map-custom-end"
                type="date"
                className="map-date-input"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. MAP SUMMARY CARDS */}
      <section className="map-summary-strip" aria-label="Map Metrics Summary">
        {/* Total */}
        <div className="map-summary-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Total Complaints</span>
            <span className="summary-card-count">{summaryCounts.total}</span>
          </div>
          <div className="summary-card-icon icon-total">
            <MapPin size={16} />
          </div>
        </div>

        {/* High Priority */}
        <div className="map-summary-card">
          <div className="summary-card-info">
            <span className="summary-card-label">High Priority</span>
            <span className="summary-card-count" style={{ color: 'var(--danger)' }}>
              {summaryCounts.highPriority}
            </span>
          </div>
          <div className="summary-card-icon icon-high">
            <AlertTriangle size={16} />
          </div>
        </div>

        {/* Pending */}
        <div className="map-summary-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Pending</span>
            <span className="summary-card-count">{summaryCounts.pending}</span>
          </div>
          <div className="summary-card-icon icon-pending">
            <Clock size={16} />
          </div>
        </div>

        {/* In Progress */}
        <div className="map-summary-card">
          <div className="summary-card-info">
            <span className="summary-card-label">In Progress</span>
            <span className="summary-card-count">{summaryCounts.inProgress}</span>
          </div>
          <div className="summary-card-icon icon-progress">
            <Activity size={16} />
          </div>
        </div>

        {/* Resolved */}
        <div className="map-summary-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Resolved</span>
            <span className="summary-card-count" style={{ color: 'var(--success)' }}>
              {summaryCounts.resolved}
            </span>
          </div>
          <div className="summary-card-icon icon-resolved">
            <CheckCircle2 size={16} />
          </div>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE: MAP (LEFT) & COMPLAINT LIST (RIGHT) */}
      <section className="map-workspace-grid">
        
        {/* Left: Map Container */}
        <div className="map-canvas-container">
          
          {/* Floating Controls */}
          <div className="map-floating-controls">
            <button 
              type="button" 
              className="map-control-btn"
              onClick={handleRecenter}
              title="Recenter Map on Gwalior Center"
            >
              <Crosshair size={14} />
              <span>Recenter Map</span>
            </button>

            <button 
              type="button" 
              className="map-control-btn"
              onClick={handleFitBounds}
              title="Fit bounds to display all current filtered markers"
            >
              <Maximize2 size={14} />
              <span>Fit All Markers</span>
            </button>

            {isMapLoaded && (
              <button 
                type="button" 
                className={`map-control-btn ${isHeatmapEnabled ? 'active' : ''}`}
                onClick={handleToggleHeatmap}
                title="Toggle complaint concentration density heatmap"
              >
                <Flame size={14} />
                <span>Complaint Heatmap</span>
              </button>
            )}
          </div>

          {/* Floating Priority Legend */}
          <div className="map-floating-legend">
            <span className="legend-item">
              <span className="legend-dot dot-high" />
              <span>High Priority</span>
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-medium" />
              <span>Medium Priority</span>
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-low" />
              <span>Low Priority</span>
            </span>
          </div>

          {/* Live Google Map vs. Graceful Fallback GIS Canvas */}
          {googleMapsApiKey && isMapLoaded && !mapLoadError ? (
            /* Live Google Map Container */
            <div ref={mapContainerRef} className="google-map-element" />
          ) : (
            /* Safe Fallback Interactive GIS Municipal Canvas */
            <div className="map-fallback-view">
              {/* Fallback explanation banner */}
              <div className="map-fallback-notice">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={16} style={{ color: '#b45309' }} />
                  <span>
                    <strong>Google Maps API key is not configured.</strong> Showing interactive municipal GIS vector preview.
                  </span>
                </div>
                <span style={{ fontSize: '0.725rem', color: '#92400e', fontStyle: 'italic' }}>
                  Set VITE_GOOGLE_MAPS_API_KEY in .env to activate Google Maps satellite & road tiles.
                </span>
              </div>

              {/* Interactive GIS Grid plotting complaints */}
              <div className="map-interactive-grid">
                <div className="gis-grid-label">
                  Gwalior Municipal Grid Sector [26.185°N – 26.260°N | 78.145°E – 78.235°E]
                </div>

                <div className="gis-center-marker">
                  <Compass size={120} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gwalior Civic Center</span>
                </div>

                {/* Plot individual complaint pins */}
                {filteredComplaints.map((complaint) => {
                  // Project lat/lng to percentage on GIS canvas
                  const latSpan = GWALIOR_BOUNDS.maxLat - GWALIOR_BOUNDS.minLat;
                  const lngSpan = GWALIOR_BOUNDS.maxLng - GWALIOR_BOUNDS.minLng;

                  // Normalize to 12% - 88% range for neat aesthetic containment
                  const topPercent = 88 - ((complaint.latitude - GWALIOR_BOUNDS.minLat) / latSpan) * 76;
                  const leftPercent = 12 + ((complaint.longitude - GWALIOR_BOUNDS.minLng) / lngSpan) * 76;

                  const isSelected = selectedComplaint?.id === complaint.id;
                  const priClass = complaint.priority === 'High' 
                    ? 'pin-high' 
                    : complaint.priority === 'Medium' 
                      ? 'pin-medium' 
                      : 'pin-low';

                  return (
                    <div
                      key={complaint.id}
                      className={`gis-complaint-pin ${isSelected ? 'active-pin' : ''}`}
                      style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                      onClick={() => handleSelectComplaint(complaint)}
                      title={`${complaint.id}: ${complaint.title} (${complaint.area})`}
                    >
                      <div className={`pin-icon-wrap ${priClass}`}>
                        <div className="pin-inner-dot" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating Marker Info Popup Card */}
          {selectedComplaint && (
            <div className="map-marker-popup-card">
              <div className="popup-header">
                <span className="popup-id-badge">{selectedComplaint.id}</span>
                <button 
                  type="button" 
                  className="popup-close-btn"
                  onClick={() => setSelectedComplaint(null)}
                  aria-label="Close details"
                >
                  <X size={14} />
                </button>
              </div>

              <h4 className="popup-title">{selectedComplaint.title}</h4>

              <div className="popup-meta-grid">
                <div className="popup-meta-item">
                  <span className="popup-meta-label">Category</span>
                  <span style={{ fontWeight: 600 }}>{selectedComplaint.category}</span>
                </div>
                <div className="popup-meta-item">
                  <span className="popup-meta-label">Priority</span>
                  <span style={{ 
                    fontWeight: 700, 
                    color: selectedComplaint.priority === 'High' 
                      ? 'var(--danger)' 
                      : selectedComplaint.priority === 'Medium' 
                        ? 'var(--warning-text)' 
                        : 'var(--success-text)' 
                  }}>
                    {selectedComplaint.priority}
                  </span>
                </div>
                <div className="popup-meta-item">
                  <span className="popup-meta-label">Status</span>
                  <span>{selectedComplaint.status}</span>
                </div>
                <div className="popup-meta-item">
                  <span className="popup-meta-label">Area</span>
                  <span>{selectedComplaint.area}</span>
                </div>
                <div className="popup-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="popup-meta-label">Department</span>
                  <span>{selectedComplaint.department}</span>
                </div>
              </div>

              <button 
                type="button" 
                className="popup-action-btn"
                onClick={() => handleViewComplaint(selectedComplaint.id)}
              >
                <Eye size={13} />
                <span>View Complaint</span>
              </button>
            </div>
          )}

        </div>

        {/* Right: Complaint List */}
        <div className="complaint-list-card">
          <div className="complaint-list-header">
            <h3 className="list-header-title">
              <span>Geo-tagged Complaints</span>
              <span className="list-counter-badge">{filteredComplaints.length}</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              Click to locate on map
            </span>
          </div>

          <div className="complaint-scroll-feed">
            {filteredComplaints.length === 0 ? (
              <div className="map-list-empty">
                <MapPin size={32} />
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>No complaints match filters</span>
                <span style={{ fontSize: '0.8rem' }}>Try clearing filters or search criteria</span>
              </div>
            ) : (
              filteredComplaints.map((complaint) => {
                const isSelected = selectedComplaint?.id === complaint.id;
                const priClass = complaint.priority === 'High' 
                  ? 'badge-pri-high' 
                  : complaint.priority === 'Medium' 
                    ? 'badge-pri-medium' 
                    : 'badge-pri-low';

                const stClass = complaint.status === 'Pending'
                  ? 'badge-st-pending'
                  : complaint.status === 'Assigned'
                    ? 'badge-st-assigned'
                    : complaint.status === 'In Progress'
                      ? 'badge-st-progress'
                      : complaint.status === 'Resolved'
                        ? 'badge-st-resolved'
                        : 'badge-st-rejected';

                return (
                  <article
                    key={complaint.id}
                    className={`map-complaint-item ${isSelected ? 'selected-item' : ''}`}
                    onClick={() => handleSelectComplaint(complaint)}
                  >
                    <div className="item-top-row">
                      <span className="item-id">{complaint.id}</span>
                      <span className="item-area-tag">
                        <MapPin size={11} style={{ color: '#ef4444' }} />
                        {complaint.area}
                      </span>
                    </div>

                    <h4 className="item-title">{complaint.title}</h4>

                    <div className="item-badges-row">
                      <span className={`map-badge-priority ${priClass}`}>
                        {complaint.priority}
                      </span>
                      <span className={`map-badge-status ${stClass}`}>
                        {complaint.status}
                      </span>
                    </div>

                    <div className="item-dept-row">
                      <span>{complaint.department}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Locate <ChevronRight size={13} />
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

      </section>

    </div>
  );
};

export default ComplaintMap;
