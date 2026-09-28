import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Tag, 
  Loader2, 
  User,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { getComplaintById, getAuthUser } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getAuthUser();
  const userRole = (user?.role || 'citizen').toLowerCase();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComplaintById(id);
      if (response.success && response.data) {
        setComplaint(response.data);
      } else {
        setError('Complaint not found.');
      }
    } catch (err) {
      console.error('Failed to fetch complaint details:', err);
      setError(err.message || 'Unable to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const backUrl = userRole === 'admin' ? '/admin/complaints' : '/citizen/my-complaints';

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading complaint #{id}...</span>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '2.5rem' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Complaint Unavailable</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error || `Complaint with identifier "${id}" could not be found.`}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button variant="outline" onClick={() => navigate(backUrl)}>
              <ArrowLeft size={16} style={{ marginRight: '0.4rem' }} /> Back to Complaints
            </Button>
            <Button variant="primary" onClick={fetchDetails}>
              <RotateCcw size={16} style={{ marginRight: '0.4rem' }} /> Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const priorityClass = (complaint.priority || 'medium').toLowerCase();
  const statusClass = (complaint.status || 'pending').toLowerCase().replace(' ', '-');

  const formattedDate = complaint.createdAt 
    ? new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Breadcrumb & Back Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button 
          onClick={() => navigate(backUrl)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            cursor: 'pointer', 
            color: 'var(--text-muted)',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={18} /> Back to Complaints
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            fontWeight: '700',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            background: 'var(--primary-light)',
            color: 'var(--primary)'
          }}>
            {complaint.complaintId}
          </span>
          <span className={`search-priority-badge priority-${priorityClass}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
            {complaint.priority?.toUpperCase()} PRIORITY
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            backgroundColor: complaint.status === 'Resolved' ? 'var(--success-bg)' : complaint.status === 'In Progress' ? 'var(--info-bg)' : 'var(--warning-bg)',
            color: complaint.status === 'Resolved' ? 'var(--success-text)' : complaint.status === 'In Progress' ? 'var(--info-text)' : 'var(--warning-text)'
          }}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Main Complaint Overview Card */}
      <Card style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.3' }}>
          {complaint.title}
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          padding: '1rem', 
          background: 'var(--background)', 
          borderRadius: 'var(--radius)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={18} color="var(--primary)" />
            <div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Department</div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{complaint.departmentName || 'Unassigned'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Tag size={18} color="var(--accent)" />
            <div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Category</div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{complaint.category || 'General'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={18} color="var(--danger)" />
            <div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Location / Area</div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{complaint.area || 'City Ward'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={18} color="var(--warning)" />
            <div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Submitted On</div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{formattedDate}</div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Issue Description
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
            {complaint.description}
          </p>
        </div>

        {/* Specific Address */}
        {complaint.address && (
          <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', borderLeft: '3px solid var(--primary)', background: 'var(--surface-hover)', borderRadius: '0 6px 6px 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Specific Address / Landmark:</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{complaint.address}</div>
          </div>
        )}

        {/* Attached Photo if available */}
        {complaint.image && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Attached Evidence Photo:</h4>
            <img 
              src={complaint.image} 
              alt={complaint.title} 
              style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: 'var(--radius)', objectFit: 'cover' }}
            />
          </div>
        )}
      </Card>

      {/* Resolution & Timeline Section */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="var(--primary)" /> Progress & Timeline
        </h3>

        {(!complaint.timeline || complaint.timeline.length === 0) ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No status updates have been recorded yet.
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border)' }}>
            {complaint.timeline.map((entry, idx) => (
              <div key={idx} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                {/* Timeline node circle */}
                <div style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '0.15rem',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: idx === complaint.timeline.length - 1 ? 'var(--primary)' : 'var(--border)',
                  border: '3px solid var(--surface)'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {entry.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {entry.date ? new Date(entry.date).toLocaleString() : ''}
                  </span>
                </div>

                {entry.note && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0' }}>
                    {entry.note}
                  </p>
                )}

                {entry.updatedByName && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'inline-block' }}>
                    Updated by: {entry.updatedByName}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ComplaintDetails;
