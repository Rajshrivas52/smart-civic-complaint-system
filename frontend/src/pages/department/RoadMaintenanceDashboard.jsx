import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  RotateCcw,
  Eye,
  Edit3,
  ChevronRight,
  TrendingUp,
  MapPin,
  UserCheck,
  Building2,
  SlidersHorizontal,
  HardHat,
  ShieldAlert,
  BarChart2,
  Calendar,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import DepartmentHeader from '../../components/department/DepartmentHeader';
import ComplaintDetailsModal from '../../components/department/ComplaintDetailsModal';
import StatusUpdateModal from '../../components/department/StatusUpdateModal';
import { getDepartmentById, DEPARTMENTS } from '../../utils/departmentConfig';
import { initialRoadComplaints, initialDepartmentActivities } from '../../utils/mockRoadMaintenanceData';
import './RoadMaintenanceDashboard.css';

// Monthly SLA Chart Data
const slaPerformanceData = [
  { month: 'Apr', assigned: 15, resolved: 14 },
  { month: 'May', assigned: 18, resolved: 16 },
  { month: 'Jun', assigned: 22, resolved: 19 },
  { month: 'Jul', assigned: 20, resolved: 18 },
  { month: 'Aug', assigned: 25, resolved: 22 },
  { month: 'Sep', assigned: 18, resolved: 14 }
];

const RoadMaintenanceDashboard = () => {
  const navigate = useNavigate();

  // Selected Department ID State ('road-maintenance' default)
  const [selectedDeptId, setSelectedDeptId] = useState('road-maintenance');
  const activeDepartment = useMemo(() => getDepartmentById(selectedDeptId), [selectedDeptId]);

  // Complaints State
  const [complaints, setComplaints] = useState(initialRoadComplaints);

  // Department Activity Logs State
  const [activities, setActivities] = useState(initialDepartmentActivities);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Work Queue Active Tab ('all' | 'urgent' | 'awaiting' | 'resolved')
  const [queueTab, setQueueTab] = useState('all');

  // Selected Complaint for Details Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Selected Complaint for Status Update Modal
  const [updatingComplaint, setUpdatingComplaint] = useState(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Compute Summary KPI Counts dynamically
  const kpis = useMemo(() => {
    const totalAssigned = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const highCritical = complaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length;
    return {
      totalAssigned,
      pending,
      inProgress,
      resolved,
      highCritical,
      avgResolutionTime: '1.8 Days'
    };
  }, [complaints]);

  // Compute Department Categories Summary Counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    activeDepartment.categories.forEach(cat => {
      counts[cat] = complaints.filter(c => c.category === cat).length;
    });
    return counts;
  }, [complaints, activeDepartment]);

  // Filtered Complaints List
  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      // 1. Queue tab filter
      if (queueTab === 'urgent' && item.priority !== 'Critical' && item.priority !== 'High') return false;
      if (queueTab === 'awaiting' && item.status !== 'Pending') return false;
      if (queueTab === 'resolved' && item.status !== 'Resolved') return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchStaff = item.assignedStaff ? item.assignedStaff.toLowerCase().includes(q) : false;
        if (!matchId && !matchTitle && !matchLoc && !matchStaff) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;

      // 4. Priority filter
      if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;

      // 5. Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;

      // 6. Date filter
      if (dateFilter !== 'All') {
        const itemDate = new Date(item.submittedDate);
        const now = new Date('2026-09-16');
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (dateFilter === 'Today' && diffDays > 1) return false;
        if (dateFilter === 'Last 7 Days' && diffDays > 7) return false;
        if (dateFilter === 'Last 30 Days' && diffDays > 30) return false;
      }

      return true;
    });
  }, [complaints, queueTab, searchQuery, statusFilter, priorityFilter, categoryFilter, dateFilter]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setDateFilter('All');
    setQueueTab('all');
  };

  // Status Update Handler (Updates React state & appends log to activity feed)
  const handleSaveStatusUpdate = (updatedPayload) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === updatedPayload.id) {
        const newTimeline = [...(c.timeline || [])];
        newTimeline.push({
          step: `Status updated to ${updatedPayload.status}`,
          date: new Date().toLocaleString(),
          by: activeDepartment.staffName
        });
        return {
          ...c,
          status: updatedPayload.status,
          assignedStaff: updatedPayload.assignedStaff,
          workRemarks: updatedPayload.workRemarks,
          ...(updatedPayload.resolutionRemarks && {
            resolutionRemarks: updatedPayload.resolutionRemarks,
            resolutionDate: updatedPayload.resolutionDate
          }),
          timeline: newTimeline
        };
      }
      return c;
    }));

    // Add activity log entry
    const newActivity = {
      id: `act-${Date.now()}`,
      type: updatedPayload.status === 'Resolved' ? 'resolved' : 'status_change',
      title: `Complaint ${updatedPayload.id} updated to ${updatedPayload.status}`,
      description: updatedPayload.workRemarks || updatedPayload.resolutionRemarks || 'Status update saved by officer.',
      timestamp: 'Just now',
      date: new Date().toLocaleString()
    };
    setActivities(prev => [newActivity, ...prev]);

    triggerToast(`Status for ${updatedPayload.id} updated to ${updatedPayload.status}`);
  };

  // Render priority badge helper
  const renderPriorityBadge = (priority) => {
    const isCritical = priority === 'Critical';
    const isHigh = priority === 'High';
    return (
      <span className={`badge ${isCritical ? 'badge-danger font-bold' : isHigh ? 'badge-danger' : priority === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
        {isCritical && <ShieldAlert size={12} className="icon-pulse" />}
        {priority}
      </span>
    );
  };

  // Render status badge helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Resolved</span>;
      case 'In Progress':
        return <span className="badge badge-warning"><Clock size={12} /> In Progress</span>;
      case 'On Hold':
        return <span className="badge badge-default">On Hold</span>;
      default:
        return <span className="badge badge-primary">Pending</span>;
    }
  };

  return (
    <div className="dept-dashboard-container animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="dept-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DEPARTMENT HEADER COMPONENT */}
      <DepartmentHeader 
        department={activeDepartment}
        onSelectDepartment={(deptId) => setSelectedDeptId(deptId)}
        unreadCount={kpis.pending}
      />

      {/* PREVIEW STATE FOR NON-ROAD DEPARTMENTS */}
      {selectedDeptId !== 'road-maintenance' ? (
        <div className="dept-coming-soon-card animate-fade-in">
          <div className="coming-soon-badge">
            <Building2 size={24} />
          </div>
          <h2>{activeDepartment.name} Module</h2>
          <p>
            The dedicated dashboard interface for <strong>{activeDepartment.name}</strong> ({activeDepartment.code}) is under initialization for upcoming sprint release.
          </p>
          <p className="sub-note">
            Currently, the <strong>Road Maintenance Department</strong> dashboard is active with live complaint workflows, SLA monitoring, and queue management.
          </p>
          <button className="btn btn-primary" onClick={() => setSelectedDeptId('road-maintenance')}>
            Switch Back to Road Maintenance Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* SUMMARY STATISTICS KPI CARDS */}
          <section className="kpi-cards-grid" aria-label="Department Summary KPIs">
            <div className="kpi-card card-hover">
              <div className="kpi-icon-box bg-primary-light">
                <FileText size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-value">{kpis.totalAssigned}</span>
                <span className="kpi-label">Assigned Complaints</span>
                <span className="kpi-sub">Total ward workload</span>
              </div>
            </div>

            <div className="kpi-card card-hover">
              <div className="kpi-icon-box bg-info-light">
                <Clock size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-value">{kpis.pending}</span>
                <span className="kpi-label">Pending Complaints</span>
                <span className="kpi-sub">Awaiting field action</span>
              </div>
            </div>

            <div className="kpi-card card-hover">
              <div className="kpi-icon-box bg-warning-light">
                <Wrench size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-value">{kpis.inProgress}</span>
                <span className="kpi-label">In Progress</span>
                <span className="kpi-sub">Field crew deployed</span>
              </div>
            </div>

            <div className="kpi-card card-hover">
              <div className="kpi-icon-box bg-success-light">
                <CheckCircle2 size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-value">{kpis.resolved}</span>
                <span className="kpi-label">Resolved</span>
                <span className="kpi-sub">82% SLA compliance</span>
              </div>
            </div>

            <div className="kpi-card card-hover highlight-urgent">
              <div className="kpi-icon-box bg-danger-light">
                <ShieldAlert size={22} className="icon-pulse" />
              </div>
              <div className="kpi-details">
                <span className="kpi-value text-danger">{kpis.highCritical}</span>
                <span className="kpi-label">High / Critical Priority</span>
                <span className="kpi-sub">Urgent hazard SLA</span>
              </div>
            </div>

            <div className="kpi-card card-hover">
              <div className="kpi-icon-box bg-purple-light">
                <TrendingUp size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-value">{kpis.avgResolutionTime}</span>
                <span className="kpi-label">Avg Resolution Time</span>
                <span className="kpi-sub">Target SLA: 2.5 Days</span>
              </div>
            </div>
          </section>

          {/* DEPARTMENT CATEGORIES BREAKDOWN */}
          <section className="categories-summary-section">
            <div className="section-title-wrap">
              <h3 className="section-title">
                <Layers size={18} /> Road Maintenance Category Distribution
              </h3>
              <span className="text-muted-sm">Click a category card to filter complaint list</span>
            </div>

            <div className="categories-grid">
              {activeDepartment.categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isSelected = categoryFilter === cat;
                return (
                  <div
                    key={cat}
                    className={`category-summary-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCategoryFilter(isSelected ? 'All' : cat)}
                  >
                    <div className="cat-card-top">
                      <span className="cat-name">{cat}</span>
                      <span className="cat-count-pill">{count}</span>
                    </div>
                    <div className="cat-progress-bar">
                      <div 
                        className="cat-progress-fill" 
                        style={{ width: `${Math.min(100, (count / (complaints.length || 1)) * 100 * 3)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* WORK QUEUE & COMPLAINTS SECTION */}
          <section className="work-queue-section">
            <div className="queue-header-bar">
              <div className="queue-tabs">
                <button 
                  className={`queue-tab ${queueTab === 'all' ? 'active' : ''}`}
                  onClick={() => setQueueTab('all')}
                >
                  All Assigned ({complaints.length})
                </button>
                <button 
                  className={`queue-tab urgent-tab ${queueTab === 'urgent' ? 'active' : ''}`}
                  onClick={() => setQueueTab('urgent')}
                >
                  <ShieldAlert size={14} /> Urgent Queue ({kpis.highCritical})
                </button>
                <button 
                  className={`queue-tab ${queueTab === 'awaiting' ? 'active' : ''}`}
                  onClick={() => setQueueTab('awaiting')}
                >
                  Awaiting Action ({kpis.pending})
                </button>
                <button 
                  className={`queue-tab ${queueTab === 'resolved' ? 'active' : ''}`}
                  onClick={() => setQueueTab('resolved')}
                >
                  Recently Resolved ({kpis.resolved})
                </button>
              </div>
            </div>

            {/* SEARCH & FILTERS CONTROL CARD */}
            <div className="dept-controls-card">
              <div className="search-box-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Complaint ID (e.g. CIV-2026-00128), location, or officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters-grid">
                {/* Status Filter */}
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="filter-group">
                  <label className="filter-label">Priority</label>
                  <select
                    className="filter-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="filter-group">
                  <label className="filter-label">Category</label>
                  <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {activeDepartment.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="filter-group">
                  <label className="filter-label">Date</label>
                  <select
                    className="filter-select"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || dateFilter !== 'All' || queueTab !== 'all') && (
                  <button className="btn-reset" onClick={handleResetFilters} title="Reset all filters">
                    <RotateCcw size={14} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* ASSIGNED COMPLAINTS TABLE / MOBILE CARDS */}
            <div className="complaints-table-container">
              {filteredComplaints.length === 0 ? (
                <div className="dept-empty-table">
                  <FileText size={40} className="text-muted" />
                  <h4>No Complaints Match Current Filters</h4>
                  <p>Try resetting your search query or selecting a different status/priority filter.</p>
                  <button className="btn btn-outline btn-sm" onClick={handleResetFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* DESKTOP & TABLET TABLE */}
                  <table className="dept-table hidden-mobile-table">
                    <thead>
                      <tr>
                        <th>Complaint ID</th>
                        <th>Title & Location</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Assigned Staff</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((item) => (
                        <tr key={item.id} className={item.priority === 'Critical' ? 'row-critical' : ''}>
                          <td className="font-bold text-primary">{item.id}</td>
                          <td>
                            <div className="cell-title-block">
                              <span className="cell-title">{item.title}</span>
                              <span className="cell-sub"><MapPin size={11} /> {item.location}</span>
                            </div>
                          </td>
                          <td>
                            <span className="dept-cat-badge">{item.category}</span>
                          </td>
                          <td>{renderPriorityBadge(item.priority)}</td>
                          <td className="text-muted-sm">{item.submittedDate}</td>
                          <td>{renderStatusBadge(item.status)}</td>
                          <td>
                            <span className="cell-staff">
                              <UserCheck size={13} className="text-muted" /> {item.assignedStaff}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <button 
                                className="btn-action-icon"
                                title="View Details"
                                onClick={() => setSelectedComplaint(item)}
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                className="btn-action-icon btn-update-icon"
                                title="Update Status"
                                onClick={() => setUpdatingComplaint(item)}
                              >
                                <Edit3 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* MOBILE STACKED COMPLAINT CARDS */}
                  <div className="mobile-complaints-list visible-mobile-only">
                    {filteredComplaints.map((item) => (
                      <div key={item.id} className={`mobile-complaint-card ${item.priority === 'Critical' ? 'border-critical' : ''}`}>
                        <div className="card-top-row">
                          <span className="font-bold text-primary">{item.id}</span>
                          <div className="flex-badges">
                            {renderPriorityBadge(item.priority)}
                            {renderStatusBadge(item.status)}
                          </div>
                        </div>

                        <h4 className="mobile-card-title">{item.title}</h4>
                        
                        <div className="mobile-card-meta">
                          <span><MapPin size={12} /> {item.location}</span>
                          <span><Layers size={12} /> {item.category}</span>
                          <span><UserCheck size={12} /> {item.assignedStaff}</span>
                        </div>

                        <div className="mobile-card-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => setSelectedComplaint(item)}>
                            <Eye size={14} /> Details
                          </button>
                          <button className="btn btn-primary btn-sm" onClick={() => setUpdatingComplaint(item)}>
                            <Edit3 size={14} /> Update Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* LOWER TWO-COLUMN GRID: RECENT ACTIVITY & PERFORMANCE ANALYTICS */}
          <div className="dashboard-bottom-grid">
            {/* RECENT ACTIVITY FEED */}
            <div className="bottom-card">
              <div className="card-title-bar">
                <h3 className="card-title">
                  <Clock size={18} /> Department Recent Activity
                </h3>
                <span className="badge badge-default">Live Feed</span>
              </div>

              <div className="activity-feed-list">
                {activities.map((act) => (
                  <div key={act.id} className="activity-feed-item">
                    <div className="activity-icon-box">
                      {act.type === 'resolved' ? (
                        <CheckCircle2 size={16} className="text-success" />
                      ) : act.type === 'assigned' ? (
                        <UserCheck size={16} className="text-primary" />
                      ) : (
                        <Wrench size={16} className="text-warning" />
                      )}
                    </div>
                    <div className="activity-body">
                      <h4 className="activity-item-title">{act.title}</h4>
                      <p className="activity-item-desc">{act.description}</p>
                      <span className="activity-item-time">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEPARTMENT PERFORMANCE & SLA CHART */}
            <div className="bottom-card">
              <div className="card-title-bar">
                <h3 className="card-title">
                  <BarChart2 size={18} /> Department SLA & Resolution Trend
                </h3>
                <span className="badge badge-success">82% SLA Met</span>
              </div>

              <div className="performance-metrics-strip">
                <div className="perf-metric">
                  <span className="perf-val">14</span>
                  <span className="perf-lbl">Resolved this month</span>
                </div>
                <div className="perf-metric">
                  <span className="perf-val">1.8 Days</span>
                  <span className="perf-lbl">Avg Response Time</span>
                </div>
                <div className="perf-metric">
                  <span className="perf-val text-warning">4</span>
                  <span className="perf-lbl">Pending Workload</span>
                </div>
              </div>

              {/* Recharts Bar Chart */}
              <div style={{ width: '100%', height: 210, marginTop: '1rem' }}>
                <ResponsiveContainer>
                  <BarChart data={slaPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="assigned" name="Assigned" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* COMPLAINT DETAILS MODAL */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onOpenStatusModal={(c) => setUpdatingComplaint(c)}
        />
      )}

      {/* STATUS UPDATE WORKFLOW MODAL */}
      {updatingComplaint && (
        <StatusUpdateModal
          complaint={updatingComplaint}
          officers={activeDepartment.officers}
          onClose={() => setUpdatingComplaint(null)}
          onSaveUpdate={handleSaveStatusUpdate}
        />
      )}
    </div>
  );
};

export default RoadMaintenanceDashboard;
