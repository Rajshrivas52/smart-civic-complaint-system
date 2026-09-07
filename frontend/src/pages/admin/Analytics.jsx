import React, { useState, useMemo } from 'react';
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
  X
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

import { 
  complaintTrendsMonthly,
  complaintTrendsWeekly,
  categoryDistributionData,
  statusDistributionData,
  departmentPerformanceData,
  areaAnalyticsData,
  priorityAnalyticsData,
  analyticsKpisData
} from '../../utils/mockData';

const FILTER_DATE_RANGES = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'This Year'];
const FILTER_CATEGORIES = ['All Categories', 'Road Damage', 'Garbage', 'Streetlight', 'Water', 'Drainage', 'Traffic', 'Environment', 'Other'];
const FILTER_DEPARTMENTS = ['All Departments', 'Public Works', 'Sanitation', 'Water Supply', 'Electricity', 'Traffic Management', 'Parks & Environment'];
const FILTER_AREAS = ['All Areas', 'City Center', 'Main Market', 'Railway Road', 'College Area', 'Residential Area'];
const FILTER_PRIORITIES = ['All', 'Low', 'Medium', 'High'];
const FILTER_STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <span className="tooltip-title">{label}</span>
        {payload.map((entry, idx) => (
          <div key={`item-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
  // Period toggle: 'monthly' | 'weekly'
  const [trendPeriod, setTrendPeriod] = useState('monthly');

  // Filter Form State
  const [dateRange, setDateRange] = useState('Last 6 Months');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Applied Filters State (triggers recalculation)
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'Last 6 Months',
    category: 'All Categories',
    department: 'All Departments',
    area: 'All Areas',
    priority: 'All',
    status: 'All'
  });

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      dateRange,
      category: selectedCategory,
      department: selectedDepartment,
      area: selectedArea,
      priority: selectedPriority,
      status: selectedStatus
    });
    showToast('Analytics filters applied successfully');
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setDateRange('Last 6 Months');
    setSelectedCategory('All Categories');
    setSelectedDepartment('All Departments');
    setSelectedArea('All Areas');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setAppliedFilters({
      dateRange: 'Last 6 Months',
      category: 'All Categories',
      department: 'All Departments',
      area: 'All Areas',
      priority: 'All',
      status: 'All'
    });
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

  // Dynamic Multiplier based on filters to simulate realistic frontend data modification
  const filterMultiplier = useMemo(() => {
    let factor = 1.0;
    if (appliedFilters.dateRange === 'Today') factor *= 0.05;
    else if (appliedFilters.dateRange === 'Last 7 Days') factor *= 0.15;
    else if (appliedFilters.dateRange === 'Last 30 Days') factor *= 0.35;
    else if (appliedFilters.dateRange === 'This Year') factor *= 1.4;

    if (appliedFilters.category !== 'All Categories') factor *= 0.25;
    if (appliedFilters.department !== 'All Departments') factor *= 0.3;
    if (appliedFilters.area !== 'All Areas') factor *= 0.25;
    if (appliedFilters.priority !== 'All') factor *= 0.35;
    if (appliedFilters.status !== 'All') factor *= 0.3;

    return Math.max(0.02, factor);
  }, [appliedFilters]);

  // Scaled / Filtered datasets
  const activeTrends = useMemo(() => {
    const base = trendPeriod === 'monthly' ? complaintTrendsMonthly : complaintTrendsWeekly;
    if (!hasActiveFilters && trendPeriod === 'monthly') return base;
    return base.map(item => ({
      ...item,
      total: Math.max(1, Math.round(item.total * filterMultiplier)),
      resolved: Math.max(0, Math.round(item.resolved * filterMultiplier)),
      pending: Math.max(0, Math.round(item.pending * filterMultiplier))
    }));
  }, [trendPeriod, filterMultiplier, hasActiveFilters]);

  // Filtered Category Distribution
  const activeCategories = useMemo(() => {
    if (appliedFilters.category !== 'All Categories') {
      return categoryDistributionData.filter(c => c.name === appliedFilters.category);
    }
    if (!hasActiveFilters) return categoryDistributionData;
    const scaled = categoryDistributionData.map(c => ({
      ...c,
      value: Math.max(1, Math.round(c.value * filterMultiplier))
    }));
    const totalVal = scaled.reduce((acc, curr) => acc + curr.value, 0) || 1;
    return scaled.map(c => ({
      ...c,
      percentage: `${((c.value / totalVal) * 100).toFixed(1)}%`
    }));
  }, [appliedFilters.category, filterMultiplier, hasActiveFilters]);

  // Filtered Status Distribution
  const activeStatuses = useMemo(() => {
    if (appliedFilters.status !== 'All') {
      return statusDistributionData.filter(s => s.name === appliedFilters.status);
    }
    if (!hasActiveFilters) return statusDistributionData;
    const scaled = statusDistributionData.map(s => ({
      ...s,
      count: Math.max(1, Math.round(s.count * filterMultiplier))
    }));
    const totalCount = scaled.reduce((acc, curr) => acc + curr.count, 0) || 1;
    return scaled.map(s => ({
      ...s,
      percentage: `${((s.count / totalCount) * 100).toFixed(1)}%`
    }));
  }, [appliedFilters.status, filterMultiplier, hasActiveFilters]);

  // Filtered Department Performance
  const activeDepartments = useMemo(() => {
    if (appliedFilters.department !== 'All Departments') {
      return departmentPerformanceData.filter(d => d.department === appliedFilters.department);
    }
    if (!hasActiveFilters) return departmentPerformanceData;
    return departmentPerformanceData.map(d => {
      const tot = Math.max(1, Math.round(d.total * filterMultiplier));
      const res = Math.max(0, Math.round(d.resolved * filterMultiplier));
      const pend = Math.max(0, tot - res);
      const rate = tot > 0 ? Math.round((res / tot) * 100) : 0;
      return {
        ...d,
        total: tot,
        resolved: res,
        pending: pend,
        rate
      };
    });
  }, [appliedFilters.department, filterMultiplier, hasActiveFilters]);

  // Filtered Area Analytics
  const activeAreas = useMemo(() => {
    if (appliedFilters.area !== 'All Areas') {
      return areaAnalyticsData.filter(a => a.area === appliedFilters.area);
    }
    if (!hasActiveFilters) return areaAnalyticsData;
    const scaled = areaAnalyticsData.map(a => ({
      ...a,
      count: Math.max(1, Math.round(a.count * filterMultiplier))
    }));
    const totalArea = scaled.reduce((acc, curr) => acc + curr.count, 0) || 1;
    return scaled.map(a => ({
      ...a,
      percentage: `${((a.count / totalArea) * 100).toFixed(1)}%`
    }));
  }, [appliedFilters.area, filterMultiplier, hasActiveFilters]);

  // Filtered Priority Analytics
  const activePriorities = useMemo(() => {
    if (appliedFilters.priority !== 'All') {
      return priorityAnalyticsData.filter(p => p.priority === appliedFilters.priority);
    }
    if (!hasActiveFilters) return priorityAnalyticsData;
    const scaled = priorityAnalyticsData.map(p => ({
      ...p,
      count: Math.max(1, Math.round(p.count * filterMultiplier))
    }));
    const totalPri = scaled.reduce((acc, curr) => acc + curr.count, 0) || 1;
    return scaled.map(p => ({
      ...p,
      percentage: `${((p.count / totalPri) * 100).toFixed(1)}%`
    }));
  }, [appliedFilters.priority, filterMultiplier, hasActiveFilters]);

  // Computed total complaints for center of Donut & KPI
  const computedTotalComplaints = useMemo(() => {
    if (!hasActiveFilters) return 1245;
    return activeCategories.reduce((sum, item) => sum + item.value, 0);
  }, [activeCategories, hasActiveFilters]);

  // Top 5 Civic Issues
  const topCivicIssues = useMemo(() => {
    return [...activeCategories].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [activeCategories]);

  // Key Insights calculated programmatically from active datasets
  const keyInsights = useMemo(() => {
    const topIssue = topCivicIssues[0] || { name: 'Road Damage', value: 310 };
    const topDept = [...activeDepartments].sort((a, b) => b.rate - a.rate)[0] || { department: 'Sanitation', rate: 92 };
    const topArea = [...activeAreas].sort((a, b) => b.count - a.count)[0] || { area: 'City Center', count: 320 };
    const highPri = activePriorities.find(p => p.priority === 'High') || { count: 95, percentage: '7.6%' };

    return [
      {
        id: 'ins-1',
        title: 'Most Frequent Issue',
        desc: `${topIssue.name} is currently the most frequently reported civic problem with ${topIssue.value.toLocaleString()} reports.`,
        icon: AlertTriangle,
        accent: 'insight-accent-danger'
      },
      {
        id: 'ins-2',
        title: 'Highest Resolution Efficiency',
        desc: `${topDept.department} leads all municipal units with an outstanding resolution rate of ${topDept.rate}%.`,
        icon: CheckCircle2,
        accent: 'insight-accent-success'
      },
      {
        id: 'ins-3',
        title: 'Area Complaint Concentration',
        desc: `${topArea.area} has the highest complaint concentration, accounting for ${topArea.count.toLocaleString()} registered cases.`,
        icon: MapPin,
        accent: 'insight-accent-info'
      },
      {
        id: 'ins-4',
        title: 'High Priority Triage Impact',
        desc: `High-priority complaints represent ${highPri.percentage} (${highPri.count.toLocaleString()} cases) of current volume and receive prioritized crew dispatch.`,
        icon: ShieldAlert,
        accent: 'insight-accent-warning'
      },
      {
        id: 'ins-5',
        title: 'Resolution Time Improvement',
        desc: 'Average civic resolution time has improved from 3.2 days down to 2.8 days, beating the municipal 3-day SLA target.',
        icon: TrendingUp,
        accent: 'insight-accent-success'
      }
    ];
  }, [topCivicIssues, activeDepartments, activeAreas, activePriorities]);

  // Export Analytics Report to CSV
  const handleExportReport = () => {
    const csvSections = [];
    csvSections.push('=== SMART CIVIC ANALYTICS REPORT ===');
    csvSections.push(`Generated: ${new Date().toLocaleString()}`);
    csvSections.push(`Scope: ${appliedFilters.dateRange} | Category: ${appliedFilters.category} | Department: ${appliedFilters.department}`);
    csvSections.push('');

    // KPIs
    csvSections.push('--- KEY PERFORMANCE INDICATORS ---');
    csvSections.push('Metric,Value,Supporting Trend');
    csvSections.push(`Total Complaints,${computedTotalComplaints},${analyticsKpisData.totalComplaints.change}`);
    csvSections.push(`Resolution Rate,${analyticsKpisData.resolutionRate.value},${analyticsKpisData.resolutionRate.change}`);
    csvSections.push(`Average Resolution Time,${analyticsKpisData.avgResolutionTime.value},${analyticsKpisData.avgResolutionTime.change}`);
    csvSections.push(`High Priority Issues,${analyticsKpisData.highPriorityIssues.value},${analyticsKpisData.highPriorityIssues.change}`);
    csvSections.push(`Citizen Satisfaction,${analyticsKpisData.citizenSatisfaction.value},${analyticsKpisData.citizenSatisfaction.change}`);
    csvSections.push('');

    // Department Performance
    csvSections.push('--- DEPARTMENT PERFORMANCE ---');
    csvSections.push('Department,Total Complaints,Resolved,Pending,Resolution Rate,Avg Time,Performance');
    activeDepartments.forEach(d => {
      csvSections.push(`"${d.department}",${d.total},${d.resolved},${d.pending},${d.rate}%,${d.avgTime},"${d.rating}"`);
    });
    csvSections.push('');

    // Top Categories
    csvSections.push('--- CATEGORY BREAKDOWN ---');
    csvSections.push('Category,Count,Percentage');
    activeCategories.forEach(c => {
      csvSections.push(`"${c.name}",${c.value},${c.percentage}`);
    });
    csvSections.push('');

    // Areas
    csvSections.push('--- AREA CONCENTRATION ---');
    csvSections.push('Area,Complaints,Percentage');
    activeAreas.forEach(a => {
      csvSections.push(`"${a.area}",${a.count},${a.percentage}`);
    });

    const csvContent = csvSections.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_civic_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics summary report downloaded successfully');
  };

  return (
    <div className="analytics-page">
      
      {/* 1. PAGE HEADER */}
      <header className="analytics-header-card">
        <div className="analytics-title-area">
          <h1 className="analytics-main-title">
            Civic Analytics
            <span className="analytics-demo-badge">Demonstration Data</span>
          </h1>
          <p className="analytics-subtitle">
            <span>Analyze complaint trends, civic issues and department performance across the city.</span>
            <span className="analytics-timestamp">
              <Clock size={13} />
              Last updated: Just now
            </span>
          </p>
        </div>

        <div className="analytics-header-actions">
          <button 
            type="button" 
            className="analytics-export-btn" 
            onClick={handleExportReport}
            title="Download CSV Analytics Summary Report"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </header>

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
          >
            Apply Filters
          </button>

          {/* Reset Button */}
          <button 
            type="button" 
            className="analytics-btn-reset"
            onClick={handleResetFilters}
            title="Reset filters to default"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </section>

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
          <div className="analytics-kpi-value">{computedTotalComplaints.toLocaleString()}</div>
          <div className="analytics-kpi-supporting">
            <span className="trend-badge-positive">
              <ArrowUpRight size={13} />
              +12%
            </span>
            <span>vs previous period</span>
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
          <div className="analytics-kpi-value">{analyticsKpisData.resolutionRate.value}</div>
          <div className="analytics-kpi-supporting">
            <span className="trend-badge-positive">
              <ArrowUpRight size={13} />
              +4.2%
            </span>
            <span>improvement</span>
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
          <div className="analytics-kpi-value">{analyticsKpisData.avgResolutionTime.value}</div>
          <div className="analytics-kpi-supporting">
            <span className="trend-badge-positive">
              <ArrowDownRight size={13} />
              -0.4 days
            </span>
            <span>faster resolution</span>
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
            {hasActiveFilters 
              ? (activePriorities.find(p => p.priority === 'High')?.count || 0)
              : analyticsKpisData.highPriorityIssues.value}
          </div>
          <div className="analytics-kpi-supporting">
            <span className="trend-badge-neutral">
              7.6%
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
          <div className="analytics-kpi-value">{analyticsKpisData.citizenSatisfaction.value}</div>
          <div className="analytics-kpi-supporting">
            <span className="trend-badge-positive">
              ★ High
            </span>
            <span>based on demo feedback</span>
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
                dataKey={trendPeriod === 'monthly' ? 'month' : 'week'} 
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
            </div>

            {/* Centered Total */}
            <div className="donut-center-metric">
              <div className="donut-center-number">{computedTotalComplaints.toLocaleString()}</div>
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
                    {cat.value} ({cat.percentage})
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
              {activeDepartments.map((dept) => {
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
                    <td style={{ color: 'var(--text-muted)' }}>{dept.avgTime}</td>
                    <td>
                      <span className={`rating-badge ${badgeClass}`}>
                        {dept.rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
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
                  style={{ width: p.percentage, backgroundColor: p.color }}
                  title={`${p.priority}: ${p.percentage}`}
                />
              ))}
            </div>

            {/* Cards for High, Medium, Low */}
            <div className="priority-cards-row">
              {activePriorities.map(p => (
                <div key={p.priority} className="priority-stat-card" style={{ borderLeft: `3px solid ${p.color}` }}>
                  <div className="priority-stat-header">
                    <span className="priority-stat-label" style={{ color: p.color }}>{p.priority} Priority</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{p.percentage}</span>
                  </div>
                  <div className="priority-stat-val">{p.count.toLocaleString()}</div>
                  <span className="priority-stat-desc">{p.desc}</span>
                </div>
              ))}
            </div>

            <p className="priority-note-text">
              High-priority complaints require faster administrative attention and expedited resolution workflows.
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
              <p className="chart-subtitle-text">Overall turnaround rate and historical comparison.</p>
            </div>
          </div>

          {/* Rate Circular Meter */}
          <div className="resolution-rate-display">
            <div className="circular-gauge-box">
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
                  strokeDashoffset="38.7"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="circular-gauge-center">
                <div className="gauge-pct-text">84.6%</div>
                <div className="gauge-pct-sub">Resolved</div>
              </div>
            </div>

            <div className="resolution-details-group">
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Municipal SLA Compliance</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target benchmark: 80% resolution within standard cycle. Current performance exceeds threshold by +4.6%.
              </p>
            </div>
          </div>

          {/* Average Resolution Time comparison */}
          <div className="res-time-comparison-box">
            <div className="time-compare-item">
              <span className="time-compare-label">Previous Period</span>
              <span className="time-compare-val" style={{ color: 'var(--text-muted)' }}>3.2 days</span>
            </div>

            <div className="time-compare-arrow">
              <TrendingUp size={20} />
            </div>

            <div className="time-compare-item">
              <span className="time-compare-label">Current Period</span>
              <span className="time-compare-val" style={{ color: 'var(--success)' }}>2.8 days</span>
            </div>
          </div>
        </div>

        {/* Monthly Resolution Performance Chart */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="chart-header-titles">
              <h3 className="chart-title-text">Monthly Resolution Performance</h3>
              <p className="chart-subtitle-text">Comparison of incoming vs resolved complaints by month.</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintTrendsMonthly} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
            {topCivicIssues.map((issue, idx) => (
              <div key={issue.name} className="top-issue-row">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="issue-rank-badge">{idx + 1}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{issue.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{issue.value}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({issue.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="chart-header-titles">
              <h3 className="chart-title-text">Key Insights</h3>
              <p className="chart-subtitle-text">Data-driven observations calculated from active demo records.</p>
            </div>
          </div>

          <div className="insights-grid" style={{ gridTemplateColumns: '1fr' }}>
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
