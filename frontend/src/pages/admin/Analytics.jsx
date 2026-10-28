import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Star, 
  Download, 
  Filter, 
  RotateCcw, 
  Building2, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  CheckCircle,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

import './Analytics.css';
import { getAnalytics } from '../../services/api';

// Filter options
const FILTER_DATE_RANGES = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'This Year'];
const FILTER_CATEGORIES = ['All Categories', 'Road Damage', 'Garbage', 'Streetlight', 'Water', 'Drainage', 'Traffic', 'Environment', 'Other'];
const FILTER_DEPARTMENTS = ['All Departments', 'Public Works', 'Sanitation', 'Water Supply', 'Electricity', 'Traffic Management', 'Parks & Environment'];
const FILTER_AREAS = ['All Areas', 'City Center', 'Thatipur', 'Lashkar', 'Morar', 'Gola Ka Mandir', 'Phool Bagh', 'Hazira', 'DD Nagar', 'University Road'];
const FILTER_PRIORITIES = ['All', 'Low', 'Medium', 'High'];
const FILTER_STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

// Local Color Palettes
const CATEGORY_COLORS = {
  'Road Damage': '#4f46e5',
  'Pothole': '#4f46e5',
  'Garbage': '#10b981',
  'Streetlight': '#f59e0b',
  'Water': '#3b82f6',
  'Water Leakage': '#3b82f6',
  'Drainage': '#06b6d4',
  'Traffic': '#ec4899',
  'Environment': '#84cc16',
  'Other': '#64748b'
};

const STATUS_COLORS = {
  'Pending': '#f59e0b',
  'Assigned': '#3b82f6',
  'In Progress': '#8b5cf6',
  'Resolved': '#10b981',
  'Rejected': '#ef4444'
};

const PRIORITY_COLORS = {
  'High': '#ef4444',
  'Medium': '#f59e0b',
  'Low': '#10b981'
};

const AREA_COLORS = [
  '#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', 
  '#ec4899', '#8b5cf6', '#64748b', '#14b8a6', '#f97316'
];

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip" style={{
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '0.6rem 0.85rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
      }}>
        <span className="tooltip-title" style={{ display: 'block', fontWeight: 600, color: '#f8fafc', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
          {label}
        </span>
        {payload.map((entry, idx) => (
          <div key={`item-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color || entry.fill }} />
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.8rem', color: '#ffffff' }}>{entry.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Period toggle: 'monthly' | 'weekly'
  const [trendPeriod, setTrendPeriod] = useState('monthly');

  // Filter Form State
  const [dateRange, setDateRange] = useState('Last 6 Months');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Applied Filters State
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'Last 6 Months',
    category: 'All Categories',
    department: 'All Departments',
    area: 'All Areas',
    priority: 'All',
    status: 'All'
  });

  // Raw API Analytics Data
  const [analyticsData, setAnalyticsData] = useState({
    kpis: {
      totalComplaints: 0,
      resolvedComplaints: 0,
      resolutionRate: '0%',
      avgResolutionTimeDays: 0,
      pendingComplaints: 0,
      highPriorityCount: 0,
      citizenSatisfaction: 4.2
    },
    trendsByMonth: [],
    categoryDistribution: [],
    statusDistribution: [],
    departmentPerformance: [],
    areaDistribution: [],
    priorityDistribution: [],
    recentComplaints: []
  });

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  // Fetch Analytics from Backend API
  const fetchAnalyticsData = useCallback(async (filters, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const queryParams = {};
      if (filters.dateRange && filters.dateRange !== 'Last 6 Months') queryParams.dateRange = filters.dateRange;
      if (filters.category && filters.category !== 'All Categories') queryParams.category = filters.category;
      if (filters.department && filters.department !== 'All Departments') queryParams.department = filters.department;
      if (filters.area && filters.area !== 'All Areas') queryParams.area = filters.area;
      if (filters.priority && filters.priority !== 'All') queryParams.priority = filters.priority;
      if (filters.status && filters.status !== 'All') queryParams.status = filters.status;

      const response = await getAnalytics(queryParams);

      if (response && response.success && response.data) {
        setAnalyticsData(response.data);
        setLastUpdated(new Date());
      } else if (response && response.data) {
        setAnalyticsData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response?.message || 'Invalid analytics data structure received');
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError(err.message || 'Failed to load civic analytics. Please check backend connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAnalyticsData(appliedFilters);
  }, [fetchAnalyticsData, appliedFilters]);

  // Handle Apply Filters
  const handleApplyFilters = () => {
    const nextFilters = {
      dateRange,
      category: selectedCategory,
      department: selectedDepartment,
      area: selectedArea,
      priority: selectedPriority,
      status: selectedStatus
    };
    setAppliedFilters(nextFilters);
    fetchAnalyticsData(nextFilters);
    showToast('Analytics filters applied successfully');
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    const defaultFilters = {
      dateRange: 'Last 6 Months',
      category: 'All Categories',
      department: 'All Departments',
      area: 'All Areas',
      priority: 'All',
      status: 'All'
    };
    setDateRange('Last 6 Months');
    setSelectedCategory('All Categories');
    setSelectedDepartment('All Departments');
    setSelectedArea('All Areas');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setAppliedFilters(defaultFilters);
    fetchAnalyticsData(defaultFilters);
    showToast('Analytics filters reset to default');
  };

  const hasActiveFilters = Boolean(
    appliedFilters.dateRange !== 'Last 6 Months' ||
    appliedFilters.category !== 'All Categories' ||
    appliedFilters.department !== 'All Departments' ||
    appliedFilters.area !== 'All Areas' ||
    appliedFilters.priority !== 'All' ||
    appliedFilters.status !== 'All'
  );

  // Process and decorate API data for charts
  const kpis = analyticsData.kpis || {};
  const totalComplaints = kpis.totalComplaints || 0;
  const resolutionRate = kpis.resolutionRate || '0%';
  const avgResolutionTime = kpis.avgResolutionTimeDays != null ? `${kpis.avgResolutionTimeDays} days` : '0 days';
  const highPriorityCount = kpis.highPriorityCount || 0;
  const citizenSatisfaction = kpis.citizenSatisfaction ? `${kpis.citizenSatisfaction} / 5` : '4.2 / 5';

  // Trends Data
  const activeTrends = useMemo(() => {
    const trends = analyticsData.trendsByMonth || [];
    if (!trends.length) {
      return [
        { month: 'No Data', total: 0, resolved: 0, pending: 0 }
      ];
    }
    return trends;
  }, [analyticsData.trendsByMonth]);

  // Categories Distribution Data with Colors
  const activeCategories = useMemo(() => {
    const list = analyticsData.categoryDistribution || [];
    if (!list.length) return [];
    return list.map((item, index) => {
      const color = CATEGORY_COLORS[item.name] || AREA_COLORS[index % AREA_COLORS.length];
      return {
        ...item,
        color
      };
    });
  }, [analyticsData.categoryDistribution]);

  // Status Distribution Data with Colors
  const activeStatuses = useMemo(() => {
    const list = analyticsData.statusDistribution || [];
    if (!list.length) return [];
    return list.map((item) => ({
      ...item,
      color: STATUS_COLORS[item.name] || '#64748b'
    }));
  }, [analyticsData.statusDistribution]);

  // Department Performance with Ratings
  const activeDepartments = useMemo(() => {
    const list = analyticsData.departmentPerformance || [];
    return list.map((dept) => {
      let rating = 'Good';
      const rate = typeof dept.rate === 'number' ? dept.rate : parseInt(dept.rate, 10) || 0;
      if (rate >= 85) rating = 'Excellent';
      else if (rate < 60) rating = 'Needs Attention';

      return {
        ...dept,
        rate,
        rating: dept.rating || rating
      };
    });
  }, [analyticsData.departmentPerformance]);

  // Area Distribution Data with Colors
  const activeAreas = useMemo(() => {
    const list = analyticsData.areaDistribution || [];
    return list.map((item, index) => ({
      ...item,
      color: AREA_COLORS[index % AREA_COLORS.length]
    }));
  }, [analyticsData.areaDistribution]);

  // Priority Distribution Data with Colors
  const activePriorities = useMemo(() => {
    const list = analyticsData.priorityDistribution || [];
    return list.map((item) => ({
      ...item,
      color: PRIORITY_COLORS[item.priority] || '#64748b',
      desc: item.desc || (item.priority === 'High' 
        ? 'Critical hazards & immediate municipal emergencies' 
        : item.priority === 'Medium' 
          ? 'Standard service disruptions and municipal upkeep' 
          : 'Low-impact routine grievances and aesthetic maintenance')
    }));
  }, [analyticsData.priorityDistribution]);

  // Top Civic Issues
  const topCivicIssues = useMemo(() => {
    return [...activeCategories].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5);
  }, [activeCategories]);

  // Key Insights derived from real datasets
  const keyInsights = useMemo(() => {
    const topIssue = topCivicIssues[0] || { name: 'None', value: 0 };
    const topDept = [...activeDepartments].sort((a, b) => b.rate - a.rate)[0] || { department: 'All Units', rate: 0 };
    const topArea = [...activeAreas].sort((a, b) => (b.count || 0) - (a.count || 0))[0] || { area: 'None', count: 0 };
    const highPri = activePriorities.find(p => p.priority === 'High') || { count: highPriorityCount, percentage: '0%' };

    return [
      {
        id: 'ins-1',
        title: 'Most Frequent Issue',
        desc: topIssue.value > 0 
          ? `${topIssue.name} is the highest volume civic complaint with ${topIssue.value.toLocaleString()} registered cases.` 
          : 'No complaint data currently logged for this period.',
        icon: AlertTriangle,
        accent: 'insight-accent-danger'
      },
      {
        id: 'ins-2',
        title: 'Highest Resolution Efficiency',
        desc: topDept.rate > 0 
          ? `${topDept.department} leads municipal performance with a ${topDept.rate}% resolution throughput.` 
          : 'Department resolution rates will update as cases are completed.',
        icon: CheckCircle2,
        accent: 'insight-accent-success'
      },
      {
        id: 'ins-3',
        title: 'Area Complaint Concentration',
        desc: topArea.count > 0 
          ? `${topArea.area} shows the highest case concentration with ${topArea.count.toLocaleString()} reported issues.` 
          : 'Geographic distribution is uniform across city wards.',
        icon: MapPin,
        accent: 'insight-accent-info'
      },
      {
        id: 'ins-4',
        title: 'High Priority Triage Impact',
        desc: `High-priority grievances represent ${highPri.percentage || 'a portion'} (${highPri.count || 0} cases) of total volume and receive emergency field dispatch.`,
        icon: ShieldAlert,
        accent: 'insight-accent-warning'
      },
      {
        id: 'ins-5',
        title: 'Average Civic Turnaround',
        desc: `Average resolution turnaround is currently ${avgResolutionTime}, tracking municipal service delivery SLAs.`,
        icon: TrendingUp,
        accent: 'insight-accent-success'
      }
    ];
  }, [topCivicIssues, activeDepartments, activeAreas, activePriorities, highPriorityCount, avgResolutionTime]);

  // Export Analytics Report to CSV using Real Data
  const handleExportReport = () => {
    try {
      const csvSections = [];
      csvSections.push('=== SMART CIVIC COMPLAINT ANALYTICS REPORT ===');
      csvSections.push(`Generated: ${new Date().toLocaleString()}`);
      csvSections.push(`Scope: ${appliedFilters.dateRange} | Category: ${appliedFilters.category} | Department: ${appliedFilters.department} | Area: ${appliedFilters.area}`);
      csvSections.push('');

      // KPIs
      csvSections.push('--- KEY PERFORMANCE INDICATORS ---');
      csvSections.push('Metric,Value');
      csvSections.push(`Total Complaints,${totalComplaints}`);
      csvSections.push(`Resolved Complaints,${kpis.resolvedComplaints || 0}`);
      csvSections.push(`Pending Complaints,${kpis.pendingComplaints || 0}`);
      csvSections.push(`Resolution Rate,${resolutionRate}`);
      csvSections.push(`Average Resolution Time,${avgResolutionTime}`);
      csvSections.push(`High Priority Issues,${highPriorityCount}`);
      csvSections.push(`Citizen Satisfaction,${citizenSatisfaction}`);
      csvSections.push('');

      // Monthly Trends
      csvSections.push('--- MONTHLY TRENDS ---');
      csvSections.push('Month,Total Received,Resolved,Pending');
      activeTrends.forEach(t => {
        csvSections.push(`"${t.month}",${t.total},${t.resolved},${t.pending}`);
      });
      csvSections.push('');

      // Department Performance
      csvSections.push('--- DEPARTMENT PERFORMANCE ---');
      csvSections.push('Department,Total Complaints,Resolved,Pending,Resolution Rate,Avg Time,Performance');
      activeDepartments.forEach(d => {
        csvSections.push(`"${d.department}",${d.total},${d.resolved},${d.pending},${d.rate}%,${d.avgTime || 'N/A'},"${d.rating}"`);
      });
      csvSections.push('');

      // Categories
      csvSections.push('--- CATEGORY BREAKDOWN ---');
      csvSections.push('Category,Count,Percentage');
      activeCategories.forEach(c => {
        csvSections.push(`"${c.name}",${c.value},${c.percentage || ''}`);
      });
      csvSections.push('');

      // Areas
      csvSections.push('--- AREA CONCENTRATION ---');
      csvSections.push('Area,Complaints,Percentage');
      activeAreas.forEach(a => {
        csvSections.push(`"${a.area}",${a.count},${a.percentage || ''}`);
      });

      const csvContent = csvSections.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `smart_civic_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Real analytics report exported successfully');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      showToast('Error exporting CSV report');
    }
  };

  return (
    <div className="analytics-page">
      
      {/* 1. PAGE HEADER */}
      <header className="analytics-header-card">
        <div className="analytics-title-area">
          <h1 className="analytics-main-title">
            Civic Analytics
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Live Backend Data
            </span>
          </h1>
          <p className="analytics-subtitle">
            <span>Analyze real-time complaint trends, civic issues and department performance across the city.</span>
            <span className="analytics-timestamp">
              <Clock size={13} />
              Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>

        <div className="analytics-header-actions">
          <button 
            type="button" 
            className="analytics-export-btn"
            onClick={() => fetchAnalyticsData(appliedFilters, true)}
            disabled={refreshing || loading}
            title="Refresh analytics data"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button 
            type="button" 
            className="analytics-export-btn" 
            onClick={handleExportReport}
            title="Download CSV Analytics Summary Report"
            disabled={loading || totalComplaints === 0}
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* Error State Banner */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#dc2626',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderColor: '#dc2626', color: '#dc2626' }}
            onClick={() => fetchAnalyticsData(appliedFilters)}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 2. FILTER BAR */}
      <section className="analytics-filter-card" aria-label="Analytics Filters">
        <div className="analytics-filter-header">
          <div className="analytics-filter-title">
            <Filter size={16} style={{ color: 'var(--primary)' }} />
            <span>Filter Analytics Data</span>
            {hasActiveFilters && (
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem' }}>
                (Custom Filters Applied)
              </span>
            )}
          </div>
        </div>

        <div className="analytics-filters-grid">
          {/* Date Range */}
          <div className="analytics-control-group">
            <label htmlFor="filter-date-range" className="analytics-control-label">Date Range</label>
            <select 
              id="filter-date-range"
              className={`analytics-select ${dateRange !== 'Last 6 Months' ? 'active-filter' : ''}`}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {FILTER_DATE_RANGES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="analytics-control-group">
            <label htmlFor="filter-cat" className="analytics-control-label">Category</label>
            <select 
              id="filter-cat"
              className={`analytics-select ${selectedCategory !== 'All Categories' ? 'active-filter' : ''}`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {FILTER_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="analytics-control-group">
            <label htmlFor="filter-department" className="analytics-control-label">Department</label>
            <select 
              id="filter-department"
              className={`analytics-select ${selectedDepartment !== 'All Departments' ? 'active-filter' : ''}`}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {FILTER_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="analytics-control-group">
            <label htmlFor="filter-area" className="analytics-control-label">Area</label>
            <select 
              id="filter-area"
              className={`analytics-select ${selectedArea !== 'All Areas' ? 'active-filter' : ''}`}
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {FILTER_AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="analytics-control-group">
            <label htmlFor="filter-priority" className="analytics-control-label">Priority</label>
            <select 
              id="filter-priority"
              className={`analytics-select ${selectedPriority !== 'All' ? 'active-filter' : ''}`}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              {FILTER_PRIORITIES.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="analytics-control-group">
            <label htmlFor="filter-status" className="analytics-control-label">Status</label>
            <select 
              id="filter-status"
              className={`analytics-select ${selectedStatus !== 'All' ? 'active-filter' : ''}`}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {FILTER_STATUSES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>

          {/* Apply Button */}
          <button 
            type="button" 
            className="analytics-btn-apply"
            onClick={handleApplyFilters}
            title="Update dashboard charts with selected filters"
            disabled={loading}
          >
            Apply Filters
          </button>

          {/* Reset Button */}
          <button 
            type="button" 
            className="analytics-btn-reset"
            onClick={handleResetFilters}
            title="Reset filters to default"
            disabled={loading}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* Loading Skeleton Indicator */}
      {loading ? (
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '3rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Aggregating Live Civic Analytics...</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fetching grievance metrics, resolution velocity, and municipal benchmarks</span>
        </div>
      ) : (
        <>
          {/* 3. 5 KPI CARDS */}
          <section className="analytics-kpi-grid" aria-label="Key Performance Indicators">
            {/* Card 1: Total Complaints */}
            <div className="analytics-kpi-card kpi-border-primary">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-label">Total Complaints</span>
                <div className="analytics-kpi-icon-wrap kpi-icon-primary">
                  <BarChart2 size={18} />
                </div>
              </div>
              <div className="analytics-kpi-value">{totalComplaints.toLocaleString()}</div>
              <div className="analytics-kpi-supporting">
                <span className="trend-badge-positive">
                  <ArrowUpRight size={13} />
                  Live Total
                </span>
                <span>registered civic cases</span>
              </div>
            </div>

            {/* Card 2: Resolution Rate */}
            <div className="analytics-kpi-card kpi-border-success">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-label">Resolution Rate</span>
                <div className="analytics-kpi-icon-wrap kpi-icon-success">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="analytics-kpi-value">{resolutionRate}</div>
              <div className="analytics-kpi-supporting">
                <span className="trend-badge-positive">
                  <ArrowUpRight size={13} />
                  {kpis.resolvedComplaints || 0}
                </span>
                <span>complaints resolved</span>
              </div>
            </div>

            {/* Card 3: Avg Resolution Time */}
            <div className="analytics-kpi-card kpi-border-info">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-label">Avg. Resolution Time</span>
                <div className="analytics-kpi-icon-wrap kpi-icon-info">
                  <Clock size={18} />
                </div>
              </div>
              <div className="analytics-kpi-value">{avgResolutionTime}</div>
              <div className="analytics-kpi-supporting">
                <span className="trend-badge-positive">
                  <ArrowDownRight size={13} />
                  Turnaround
                </span>
                <span>from report to closure</span>
              </div>
            </div>

            {/* Card 4: High Priority Issues */}
            <div className="analytics-kpi-card kpi-border-danger">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-label">High Priority Issues</span>
                <div className="analytics-kpi-icon-wrap kpi-icon-danger">
                  <AlertTriangle size={18} />
                </div>
              </div>
              <div className="analytics-kpi-value">
                {highPriorityCount.toLocaleString()}
              </div>
              <div className="analytics-kpi-supporting">
                <span className="trend-badge-neutral">
                  {totalComplaints > 0 ? `${((highPriorityCount / totalComplaints) * 100).toFixed(1)}%` : '0%'}
                </span>
                <span>of total complaints</span>
              </div>
            </div>

            {/* Card 5: Citizen Satisfaction */}
            <div className="analytics-kpi-card kpi-border-purple">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-label">Citizen Satisfaction</span>
                <div className="analytics-kpi-icon-wrap kpi-icon-purple">
                  <Star size={18} />
                </div>
              </div>
              <div className="analytics-kpi-value">{citizenSatisfaction}</div>
              <div className="analytics-kpi-supporting">
                <span className="trend-badge-positive">
                  ★ Verified
                </span>
                <span>citizen ratings & feedback</span>
              </div>
            </div>
          </section>

          {/* 4. CHART 1 — COMPLAINT TRENDS */}
          <section className="analytics-chart-card">
            <div className="analytics-chart-header">
              <div className="chart-header-titles">
                <h2 className="chart-title-text">Complaint Trends</h2>
                <p className="chart-subtitle-text">
                  Track incoming civic grievances and resolution throughput over time.
                </p>
              </div>

              <div className="period-toggle-group">
                <button 
                  type="button" 
                  className={`period-toggle-btn ${trendPeriod === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTrendPeriod('monthly')}
                >
                  Monthly
                </button>
                <button 
                  type="button" 
                  className={`period-toggle-btn ${trendPeriod === 'weekly' ? 'active' : ''}`}
                  onClick={() => setTrendPeriod('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div style={{ width: '100%', height: 320 }}>
              {activeTrends.length === 0 || totalComplaints === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No complaint trends recorded yet for the selected scope
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="totalComplaintsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="resolvedComplaintsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey={trendPeriod === 'monthly' ? 'month' : (activeTrends[0]?.week ? 'week' : 'month')} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      name="Total Complaints" 
                      stroke="#4f46e5" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#totalComplaintsGrad)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resolved" 
                      name="Resolved Complaints" 
                      stroke="#10b981" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#resolvedComplaintsGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* 5. CHARTS 2 & 3 — CATEGORY & STATUS DISTRIBUTION */}
          <section className="analytics-charts-grid-2col">
            {/* Donut Chart: Complaints by Category */}
            <div className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Complaints by Category</h3>
                  <p className="chart-subtitle-text">Proportion of reported issues by category domain.</p>
                </div>
              </div>

              <div className="category-chart-wrapper">
                <div style={{ width: '100%', height: 260 }}>
                  {activeCategories.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No category distribution data
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activeCategories}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={3}
                        >
                          {activeCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Centered Total */}
                <div className="donut-center-metric">
                  <div className="donut-center-number">{totalComplaints.toLocaleString()}</div>
                  <div className="donut-center-label">Complaints</div>
                </div>

                {/* Custom Legend */}
                <div className="category-legend-list">
                  {activeCategories.map((cat) => (
                    <div key={cat.name} className="category-legend-item">
                      <span className="legend-item-name">
                        <span className="legend-color-dot" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="legend-item-values">
                        {cat.value} ({cat.percentage || `${totalComplaints > 0 ? ((cat.value / totalComplaints) * 100).toFixed(1) : 0}%`})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart: Complaint Status Distribution */}
            <div className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Complaint Status Distribution</h3>
                  <p className="chart-subtitle-text">Workflow triage stages across active complaints.</p>
                </div>
              </div>

              <div style={{ width: '100%', height: 340 }}>
                {activeStatuses.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No status distribution data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeStatuses} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Bar dataKey="count" name="Complaints" radius={[6, 6, 0, 0]}>
                        {activeStatuses.map((entry, index) => (
                          <Cell key={`status-cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          {/* 6. DEPARTMENT PERFORMANCE TABLE */}
          <section className="department-table-card" aria-label="Department Performance Section">
            <div className="analytics-chart-header">
              <div className="chart-header-titles">
                <h3 className="chart-title-text">Department Performance</h3>
                <p className="chart-subtitle-text">Efficiency metrics, resolution rates and SLA turnaround times by department.</p>
              </div>
            </div>

            <div className="dept-table-wrapper">
              <table className="dept-performance-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Complaints</th>
                    <th>Resolved</th>
                    <th>Pending</th>
                    <th>Resolution Rate</th>
                    <th>Avg. Resolution Time</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDepartments.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No department performance data available
                      </td>
                    </tr>
                  ) : (
                    activeDepartments.map((dept) => {
                      let badgeClass = 'rating-good';
                      if (dept.rating === 'Excellent') badgeClass = 'rating-excellent';
                      if (dept.rating === 'Needs Attention') badgeClass = 'rating-attention';

                      return (
                        <tr key={dept.department}>
                          <td className="dept-name-cell">
                            <Building2 size={16} style={{ color: 'var(--primary)' }} />
                            {dept.department}
                          </td>
                          <td><strong>{dept.total}</strong></td>
                          <td style={{ color: 'var(--success)' }}>{dept.resolved}</td>
                          <td style={{ color: 'var(--warning)' }}>{dept.pending}</td>
                          <td>
                            <div className="rate-bar-wrapper">
                              <div className="rate-progress-track">
                                <div 
                                  className="rate-progress-fill" 
                                  style={{ 
                                    width: `${dept.rate}%`,
                                    backgroundColor: dept.rate >= 85 ? 'var(--success)' : 'var(--primary)'
                                  }} 
                                />
                              </div>
                              <span style={{ fontWeight: 600, fontSize: '0.825rem' }}>{dept.rate}%</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{dept.avgTime || '2.5 days'}</td>
                          <td>
                            <span className={`rating-badge ${badgeClass}`}>
                              {dept.rating}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. AREA ANALYSIS & PRIORITY ANALYSIS */}
          <section className="analytics-charts-grid-2col">
            {/* Horizontal Bar Chart: Complaints by Area */}
            <div className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Complaints by Area</h3>
                  <p className="chart-subtitle-text">Geographic distribution of issues across key city wards.</p>
                </div>
              </div>

              <div style={{ width: '100%', height: 290 }}>
                {activeAreas.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No area distribution data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={activeAreas}
                      margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                      <YAxis 
                        dataKey="area" 
                        type="category" 
                        tick={{ fill: 'var(--text-main)', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Bar dataKey="count" name="Complaints" radius={[0, 6, 6, 0]}>
                        {activeAreas.map((entry, index) => (
                          <Cell key={`area-cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Priority Distribution</h3>
                  <p className="chart-subtitle-text">Severity breakdown requiring administrative triage.</p>
                </div>
              </div>

              <div className="priority-analysis-box">
                {/* Stacked Proportional Bar */}
                <div className="priority-stacked-bar" title="Priority Severity Split">
                  {activePriorities.map(p => (
                    <div 
                      key={p.priority} 
                      className="priority-segment" 
                      style={{ width: p.percentage || `${totalComplaints > 0 ? ((p.count / totalComplaints) * 100).toFixed(1) : 0}%`, backgroundColor: p.color }}
                      title={`${p.priority}: ${p.percentage || ''}`}
                    />
                  ))}
                </div>

                {/* Cards for High, Medium, Low */}
                <div className="priority-cards-row">
                  {activePriorities.map(p => (
                    <div key={p.priority} className="priority-stat-card" style={{ borderLeft: `3px solid ${p.color}` }}>
                      <div className="priority-stat-header">
                        <span className="priority-stat-label" style={{ color: p.color }}>{p.priority} Priority</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {p.percentage || `${totalComplaints > 0 ? ((p.count / totalComplaints) * 100).toFixed(1) : 0}%`}
                        </span>
                      </div>
                      <div className="priority-stat-val">{(p.count || 0).toLocaleString()}</div>
                      <span className="priority-stat-desc">{p.desc}</span>
                    </div>
                  ))}
                </div>

                <p className="priority-note-text">
                  High-priority complaints trigger emergency notifications and receive fast-tracked field crew assignment.
                </p>
              </div>
            </div>
          </section>

          {/* 8. RESOLUTION PERFORMANCE & MONTHLY RESOLUTION PERFORMANCE */}
          <section className="analytics-charts-grid-2col">
            {/* Resolution Rate & Turnaround Time */}
            <div className="resolution-metric-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Resolution Performance</h3>
                  <p className="chart-subtitle-text">Overall turnaround rate and municipal SLA benchmark.</p>
                </div>
              </div>

              {/* Rate Circular Meter */}
              <div className="resolution-rate-display">
                <div className="circular-gauge-box">
                  {(() => {
                    const parsedPct = parseFloat(resolutionRate) || 0;
                    const strokeDashoffset = 251.2 - (251.2 * parsedPct) / 100;
                    return (
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="var(--border)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="var(--success)"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                        />
                      </svg>
                    );
                  })()}
                  <div className="circular-gauge-center">
                    <div className="gauge-pct-text">{resolutionRate}</div>
                    <div className="gauge-pct-sub">Resolved</div>
                  </div>
                </div>

                <div className="resolution-details-group">
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Municipal SLA Compliance</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Standard civic resolution benchmark: 80% resolution within target cycle. {parseFloat(resolutionRate) >= 80 ? 'Target achieved.' : 'Ongoing optimization.'}
                  </p>
                </div>
              </div>

              {/* Turnaround Time Metric */}
              <div className="res-time-comparison-box">
                <div className="time-compare-item">
                  <span className="time-compare-label">SLA Benchmark</span>
                  <span className="time-compare-val" style={{ color: 'var(--text-muted)' }}>3.0 days</span>
                </div>

                <div className="time-compare-arrow">
                  <TrendingUp size={20} />
                </div>

                <div className="time-compare-item">
                  <span className="time-compare-label">Current Average</span>
                  <span className="time-compare-val" style={{ color: 'var(--success)' }}>{avgResolutionTime}</span>
                </div>
              </div>
            </div>

            {/* Monthly Resolution Performance Chart */}
            <div className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Monthly Resolution Volume</h3>
                  <p className="chart-subtitle-text">Comparison of incoming vs resolved complaints by month.</p>
                </div>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                {activeTrends.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No monthly volume data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }} 
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Legend verticalAlign="top" align="right" height={32} iconType="circle" />
                      <Bar dataKey="total" name="Received" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          {/* 9. TOP CIVIC ISSUES & KEY INSIGHTS */}
          <section className="analytics-charts-grid-3col">
            {/* Top Civic Issues */}
            <div className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Top Civic Issues</h3>
                  <p className="chart-subtitle-text">Ranked top categories by volume of reported incidents.</p>
                </div>
              </div>

              <div className="top-issues-list">
                {topCivicIssues.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No reported incidents recorded
                  </div>
                ) : (
                  topCivicIssues.map((issue, idx) => (
                    <div key={issue.name} className="top-issue-row">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="issue-rank-badge">{idx + 1}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{issue.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{issue.value}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({issue.percentage || ''})</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Key Insights Cards */}
            <div className="analytics-chart-card" style={{ gridColumn: 'span 2' }}>
              <div className="analytics-chart-header">
                <div className="chart-header-titles">
                  <h3 className="chart-title-text">Live Municipal Insights</h3>
                  <p className="chart-subtitle-text">Data-driven observations calculated directly from active civic database records.</p>
                </div>
              </div>

              <div className="insights-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {keyInsights.slice(0, 4).map((ins) => {
                  const IconComp = ins.icon;
                  return (
                    <div key={ins.id} className={`insight-card ${ins.accent}`}>
                      <div className="insight-icon-box">
                        <IconComp size={18} />
                      </div>
                      <div className="insight-content">
                        <h4 className="insight-title">{ins.title}</h4>
                        <p className="insight-desc">{ins.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 10. TOAST NOTIFICATION */}
      {toast.show && (
        <div className="analytics-toast" role="status" aria-live="polite">
          <CheckCircle size={18} style={{ color: '#34d399' }} />
          <span>{toast.message}</span>
          <button 
            type="button" 
            className="analytics-toast-close"
            onClick={() => setToast({ show: false, message: '' })}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
};

export default Analytics;
