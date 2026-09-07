import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  UserCheck, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Eye, 
  UserPlus, 
  Building2, 
  BarChart2, 
  Filter, 
  ExternalLink,
  Zap,
  Sliders,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import StatCard from '../../components/StatCard';

import { 
  adminKpis, 
  complaintTrendsData, 
  categoryDistributionData, 
  statusDistributionData, 
  departmentPerformanceData, 
  highPriorityComplaints, 
  recentComplaintsAdmin, 
  adminActivities, 
  adminAttentionAlerts, 
  civicHotspots 
} from '../../utils/mockData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('Last 6 months');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedComplaintAction, setSelectedComplaintAction] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated('Just now');
      setIsRefreshing(false);
    }, 600);
  };

  const handleQuickAssign = (complaintId) => {
    setSelectedComplaintAction(`Assigned ${complaintId} to department`);
    setActionSuccessMsg(`Complaint ${complaintId} successfully updated!`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Map icon names from mockData to Lucide React icons
  const getKpiIcon = (iconName) => {
    switch (iconName) {
      case 'ClipboardList': return ClipboardList;
      case 'Clock': return Clock;
      case 'UserCheck': return UserCheck;
      case 'Activity': return Activity;
      case 'CheckCircle': return CheckCircle;
      case 'AlertTriangle': return AlertTriangle;
      default: return ClipboardList;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. WELCOME / HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ backgroundColor: 'var(--surface)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Good afternoon, Admin 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Monitor civic complaints, department activity and resolution performance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--background)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>Last updated: <strong>{lastUpdated}</strong></span>
          </div>
          <button 
            onClick={handleRefresh}
            className="btn btn-outline" 
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
            title="Refresh dashboard data"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <Check size={18} />
          {actionSuccessMsg}
        </div>
      )}

      {/* 2. KPI STATISTICS (6 CARDS) */}
      <div className="grid-cols-6" style={{ display: 'grid', gap: '1rem' }}>
        {adminKpis.map((kpi) => {
          const IconComp = getKpiIcon(kpi.iconName);
          return (
            <StatCard 
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.change}
              icon={IconComp}
              colorClass={kpi.color}
            />
          );
        })}
      </div>

      {/* 3. CHARTS ROW 1: COMPLAINT TRENDS (8 Cols) + CATEGORY BREAKDOWN (4 Cols) */}
      <div className="dashboard-grid">
        
        {/* COMPLAINT TREND CHART */}
        <Card className="col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Complaint Trends</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Comparison of total complaints received vs resolved over time</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', backgroundColor: 'var(--surface)', color: 'var(--text-main)' }}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintTrendsData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="resolvedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" name="Total Complaints" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Complaints" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#resolvedColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#4f46e5', borderRadius: '3px', display: 'inline-block' }}></span>
              Total Complaints Received
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px', display: 'inline-block' }}></span>
              Successfully Resolved
            </div>
          </div>
        </Card>

        {/* COMPLAINT CATEGORY CHART */}
        <Card className="col-span-4 flex flex-col gap-3">
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Complaints by Category</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Breakdown by issue classification</p>
          </div>

          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val, name) => [`${val} complaints`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto', fontSize: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
            {categoryDistributionData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.15rem 0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{item.name}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{item.percentage}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* 4. CHARTS ROW 2: COMPLAINT STATUS (4 Cols) + CIVIC ISSUE HOTSPOTS (8 Cols) */}
      <div className="dashboard-grid">

        {/* COMPLAINT STATUS CHART */}
        <Card className="col-span-4 flex flex-col gap-3">
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Complaint Status</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current distribution across workflow stages</p>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistributionData} margin={{ top: 15, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val} complaints`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CIVIC ISSUE HOTSPOTS (MAP PREVIEW) */}
        <Card className="col-span-8 flex flex-col gap-3">
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                Civic Issue Hotspots
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Areas with highest complaint concentration</p>
            </div>
            <Link to="/admin/map" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Full Interactive Map <ExternalLink size={12} />
            </Link>
          </div>

          <div className="map-preview-container">
            <div className="map-grid-bg"></div>

            {/* Stylized Hotspot Pins */}
            <div className="hotspot-pin" style={{ top: '22%', left: '30%' }}>
              <span className="hotspot-dot" style={{ backgroundColor: '#ef4444' }}></span>
              Central Market (48)
            </div>

            <div className="hotspot-pin" style={{ top: '55%', left: '62%' }}>
              <span className="hotspot-dot" style={{ backgroundColor: '#ef4444' }}></span>
              Main Gate (36)
            </div>

            <div className="hotspot-pin" style={{ top: '35%', left: '75%' }}>
              <span className="hotspot-dot" style={{ backgroundColor: '#f59e0b' }}></span>
              Railway Road (24)
            </div>

            <div className="hotspot-pin" style={{ top: '70%', left: '25%' }}>
              <span className="hotspot-dot" style={{ backgroundColor: '#10b981' }}></span>
              City Center (12)
            </div>

            <div style={{ position: 'absolute', bottom: '10px', right: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={12} /> Leaflet + OpenStreetMap Preview Ready
            </div>
          </div>

          {/* Hotspot summary list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
            {civicHotspots.map((spot) => (
              <div key={spot.name} style={{ backgroundColor: 'var(--background)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{spot.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>{spot.count}</span>
                  <Badge status={spot.intensity === 'High' ? 'danger' : spot.intensity === 'Medium' ? 'warning' : 'success'}>
                    {spot.intensity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* 5. MIDDLE ROW: DEPARTMENT PERFORMANCE (8 Cols) + ADMIN ALERTS & QUICK ACTIONS (4 Cols) */}
      <div className="dashboard-grid">
        
        {/* DEPARTMENT PERFORMANCE TABLE */}
        <Card className="col-span-8 flex flex-col gap-3">
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Department Performance</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Resolution rates and average turnaround time per department</p>
            </div>
            <Link to="/admin/departments" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              Manage Depts
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Assigned</th>
                  <th>Resolved</th>
                  <th>Pending</th>
                  <th>Resolution Rate</th>
                  <th>Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {departmentPerformanceData.map((dept) => {
                  const fillPercent = `${dept.rate}%`;
                  const barColor = dept.rate >= 90 ? 'var(--success)' : dept.rate >= 80 ? 'var(--info)' : dept.rate >= 75 ? 'var(--warning)' : 'var(--danger)';
                  return (
                    <tr key={dept.department}>
                      <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{dept.department}</td>
                      <td>{dept.assigned}</td>
                      <td style={{ color: 'var(--success-text)', fontWeight: '600' }}>{dept.resolved}</td>
                      <td style={{ color: 'var(--warning-text)' }}>{dept.pending}</td>
                      <td style={{ width: '160px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: fillPercent, backgroundColor: barColor }}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', minWidth: '32px' }}>{fillPercent}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{dept.avgTime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ADMIN ALERTS & QUICK ACTIONS */}
        <div className="col-span-4 flex flex-col gap-4">
          
          {/* REQUIRES ATTENTION ALERTS */}
          <Card className="flex flex-col gap-3">
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-text)' }}>
                <AlertTriangle size={16} /> Requires Attention
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {adminAttentionAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  style={{ 
                    backgroundColor: alert.severity === 'danger' ? 'var(--danger-bg)' : alert.severity === 'warning' ? 'var(--warning-bg)' : 'var(--info-bg)',
                    color: alert.severity === 'danger' ? 'var(--danger-text)' : alert.severity === 'warning' ? 'var(--warning-text)' : 'var(--info-text)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    borderLeft: `3px solid ${alert.severity === 'danger' ? 'var(--danger)' : alert.severity === 'warning' ? 'var(--warning)' : 'var(--info)'}`
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{alert.title}</strong>
                  {alert.message}
                </div>
              ))}
            </div>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="flex flex-col gap-3">
            <h2 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} style={{ color: 'var(--primary)' }} /> Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button onClick={() => navigate('/admin/complaints')} className="btn-primary" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>
                <ClipboardList size={16} /> View All Complaints
              </Button>
              <Button onClick={() => handleQuickAssign('CMP1048')} className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>
                <UserPlus size={16} /> Assign Complaints
              </Button>
              <Button onClick={() => navigate('/admin/departments')} className="btn-outline" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>
                <Building2 size={16} /> Manage Departments
              </Button>
              <Button onClick={() => navigate('/admin/analytics')} className="btn-outline" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>
                <BarChart2 size={16} /> View Analytics
              </Button>
            </div>
          </Card>

        </div>

      </div>

      {/* 6. BOTTOM ROW: HIGH PRIORITY COMPLAINTS (6 Cols) + RECENT ACTIVITY FEED (6 Cols) */}
      <div className="dashboard-grid">
        
        {/* HIGH PRIORITY COMPLAINTS */}
        <Card className="col-span-6 flex flex-col gap-3">
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-text)' }}>
              <AlertTriangle size={18} color="var(--danger)" /> High Priority Complaints
            </h2>
            <span className="badge badge-danger">Urgent Action</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {highPriorityComplaints.map((item) => (
              <div key={item.id} className="high-priority-card flex justify-between items-center">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>{item.id}</span>
                    <Badge status="danger">HIGH</Badge>
                    <Badge status={item.status}>{item.status}</Badge>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Category: <strong>{item.category}</strong> • {item.time}
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/admin/complaints')}
                  className="btn-outline" 
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <Eye size={14} /> View
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* RECENT ACTIVITY FEED */}
        <Card className="col-span-6 flex flex-col gap-3">
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={18} style={{ color: 'var(--primary)' }} /> Recent Activity
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time logs</span>
          </div>

          <div className="timeline" style={{ marginTop: '0.5rem' }}>
            {adminActivities.map((act) => (
              <div key={act.id} className="timeline-item">
                <div className={`timeline-dot ${act.type}`}></div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>
                  {act.text}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* 7. FULL-WIDTH TABLE: RECENT COMPLAINTS */}
      <Card className="flex flex-col gap-4">
        <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Complaints</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest submitted civic grievances across all sectors</p>
          </div>
          <Link to="/admin/complaints" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            View All Complaints <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Citizen</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaintsAdmin.map((comp) => (
                <tr key={comp.id}>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{comp.id}</td>
                  <td style={{ fontWeight: '500', maxWidth: '200px' }}>{comp.title}</td>
                  <td><span style={{ fontSize: '0.8rem', backgroundColor: 'var(--background)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}>{comp.category}</span></td>
                  <td>{comp.citizen}</td>
                  <td>
                    <Badge status={comp.priority.toLowerCase() === 'high' ? 'danger' : comp.priority.toLowerCase() === 'medium' ? 'warning' : 'default'}>
                      {comp.priority}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comp.department}</td>
                  <td>
                    <Badge status={comp.status}>
                      {comp.status}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comp.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button 
                        onClick={() => navigate('/admin/complaints')}
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} 
                        title="View details"
                      >
                        <Eye size={12} />
                      </button>
                      <button 
                        onClick={() => handleQuickAssign(comp.id)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} 
                        title="Assign Department"
                      >
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default AdminDashboard;
