import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  List as ListIcon, 
  Clock, 
  CheckCircle, 
  Activity, 
  MapPin, 
  ChevronRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';

import { 
  mockComplaints, 
  mockNotifications, 
  mockActivities, 
  mockAnalytics 
} from '../../utils/mockData';

const COLORS = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981'
};

const CitizenDashboard = () => {
  const { kpis, complaintsByStatus } = mockAnalytics;
  
  return (
    <div className="animate-fade-in">
      
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-light) 0%, #ffffff 100%)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
            Good afternoon, Citizen! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
            Track your civic complaints and stay updated on the issues you've reported in your neighborhood.
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/citizen/report" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <PlusCircle size={20} /> Report a Problem
            </button>
          </Link>
          <Link to="/citizen/complaints" style={{ textDecoration: 'none' }}>
            <button className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
              View My Complaints
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard 
            title="Total Complaints" 
            value={kpis.total} 
            icon={ListIcon} 
            trend="+2 this month" 
            colorClass="primary" 
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard 
            title="Pending" 
            value={kpis.pending} 
            icon={Clock} 
            colorClass="warning" 
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard 
            title="In Progress" 
            value={kpis.inProgress} 
            icon={Activity} 
            colorClass="info" 
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard 
            title="Resolved" 
            value={kpis.resolved} 
            icon={CheckCircle} 
            trend="+1 this week" 
            colorClass="success" 
          />
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column - Main Content */}
        <div style={{ gridColumn: 'span 8' }} className="flex flex-col gap-6">
          
          {/* Recent Complaints */}
          <Card>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Recent Complaints</h2>
              <Link to="/citizen/complaints" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                View All
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {mockComplaints.map(complaint => (
                <div key={complaint.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--background)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div className="flex flex-col gap-1">
                    <Link to={`/citizen/complaints/${complaint.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{complaint.title}</h3>
                    </Link>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {complaint.id} • {new Date(complaint.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge>{complaint.category}</Badge>
                    <Badge status={complaint.priority === 'High' ? 'danger' : 'default'}>{complaint.priority} Priority</Badge>
                    <Badge status={complaint.status}>{complaint.status}</Badge>
                    <Link to={`/citizen/complaints/${complaint.id}`} style={{ color: 'var(--text-muted)' }}>
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity Timeline */}
          <Card>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Activity</h2>
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ 
                position: 'absolute', 
                left: '7px', 
                top: '0', 
                bottom: '0', 
                width: '2px', 
                backgroundColor: 'var(--border)' 
              }}></div>
              
              {mockActivities.map((activity, idx) => (
                <div key={activity.id} style={{ position: 'relative', marginBottom: idx === mockActivities.length - 1 ? 0 : '1.5rem' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-28px', 
                    top: '4px', 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: `var(--${activity.type})`,
                    border: '3px solid white',
                    boxShadow: '0 0 0 1px var(--border)'
                  }}></div>
                  <p style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {activity.action}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Side Widgets */}
        <div style={{ gridColumn: 'span 4' }} className="flex flex-col gap-6">
          
          {/* Quick Actions */}
          <Card>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link to="/citizen/report" style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                  <PlusCircle size={18} /> Report a Problem
                </button>
              </Link>
              <Link to="/citizen/complaints" style={{ textDecoration: 'none' }}>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
                  <FileText size={18} /> My Complaints
                </button>
              </Link>
            </div>
          </Card>

          {/* Complaint Status Overview Chart */}
          <Card>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Overview</h2>
            <div style={{ height: '200px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complaintsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {complaintsByStatus.map(item => (
                <div key={item.name} className="flex items-center gap-1">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[item.name] }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem' }}>Notifications</h2>
            </div>
            <div className="flex flex-col gap-3">
              {mockNotifications.map(notification => (
                <div key={notification.id} style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: notification.read ? 'transparent' : 'var(--primary-light)',
                  border: '1px solid',
                  borderColor: notification.read ? 'var(--border)' : 'var(--primary)',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}>
                  <AlertCircle size={18} style={{ color: notification.read ? 'var(--text-muted)' : 'var(--primary)', marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem', fontWeight: notification.read ? '400' : '600' }}>
                      {notification.message}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Civic Insight (Map Placeholder) */}
          <Card style={{ background: 'linear-gradient(45deg, var(--surface), var(--primary-light))' }}>
            <div className="flex items-start gap-3">
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Civic Issues Near You</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  3 reported issues in your area (Road Damage, Garbage, Streetlight).
                </p>
                <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}>
                  View Map
                </button>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
