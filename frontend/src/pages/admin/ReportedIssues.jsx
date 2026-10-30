import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Eye, 
  Calendar, 
  MapPin, 
  Tag, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Code,
  ExternalLink,
  X
} from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { getReportIssues } from '../../services/api';
import { mockCategories } from '../../utils/mockData';

const ReportedIssues = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [inspectModalDoc, setInspectModalDoc] = useState(null);
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [stats, setStats] = useState({ total: 0, withImages: 0 });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await getReportIssues(params);
      if (res && res.data) {
        setReports(res.data);
        const imgCount = res.data.filter(r => r.image && r.image.length > 50).length;
        setStats({ total: res.total || res.data.length, withImages: imgCount });
      }
    } catch (err) {
      console.error('Failed to load reported issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Reported Issues (Database)</h1>
            <span style={{ 
              backgroundColor: '#dbeafe', 
              color: '#1d4ed8', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Database size={12} />
              Collection: reportissues
            </span>
          </div>
          <p className="page-subtitle">
            Direct database records submitted from the citizen Report Issue page, stored with in-database Base64 evidence images.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={fetchReports} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh DB
          </Button>
        </div>
      </div>

      {/* Database Collection Info Banner */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        borderRadius: 'var(--radius)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              MongoDB Atlas / Local Database
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>smart_civic_db</span>
              <span style={{ color: '#64748b' }}>/</span>
              <span style={{ color: '#38bdf8' }}>reportissues</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Documents</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>{stats.total}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>In-DB Images</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#4ade80' }}>{stats.withImages}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Image Format</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginTop: '0.2rem' }}>Base64 Data URI</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Input 
              placeholder="Search reports by title, ID, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ width: '180px' }}>
            <Select 
              options={['All', ...mockCategories]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>

          <div style={{ width: '150px' }}>
            <Select 
              options={['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected']}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
          </div>

          <Button type="submit">Filter</Button>
        </form>
      </Card>

      {/* Reports Grid / Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <p>Querying 'reportissues' collection in database...</p>
        </div>
      ) : reports.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <Database size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Reports Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Submit a new issue from the Citizen "Report Issue" page to populate this database collection.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {reports.map((report) => (
            <Card key={report._id || report.reportId} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Card Image Area (Stored directly in DB) */}
              <div style={{
                height: '180px',
                backgroundColor: '#f1f5f9',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderBottom: '1px solid var(--border)'
              }}>
                {report.image ? (
                  <>
                    <img 
                      src={report.image} 
                      alt={report.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setActiveImageModal(report.image)}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#4ade80',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Database size={10} />
                      Stored in MongoDB (Base64)
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ImageIcon size={32} style={{ margin: '0 auto 0.25rem auto', opacity: 0.5 }} />
                    <span style={{ fontSize: '0.8rem' }}>No Image Attached</span>
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: report.status === 'Resolved' ? '#dcfce7' : report.status === 'Assigned' ? '#e0e7ff' : '#fef3c7',
                    color: report.status === 'Resolved' ? '#166534' : report.status === 'Assigned' ? '#3730a3' : '#92400e'
                  }}>
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {report.reportId}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {report.title}
                </h3>

                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {report.description}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={13} color="var(--primary)" />
                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{report.category}</span>
                    <span style={{ margin: '0 0.2rem' }}>•</span>
                    <span style={{ color: report.priority === 'High' ? '#dc2626' : 'inherit' }}>{report.priority} Priority</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={13} color="var(--danger)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.address || report.area}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                    onClick={() => setInspectModalDoc(report)}
                  >
                    <Code size={14} />
                    Inspect JSON
                  </Button>
                  {report.image && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                      onClick={() => setActiveImageModal(report.image)}
                    >
                      <Eye size={14} />
                      View Image
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* JSON Inspector Modal */}
      {inspectModalDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderRadius: 'var(--radius)',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                  MongoDB Document: reportissues._id = {inspectModalDoc._id}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{inspectModalDoc.title}</h3>
              </div>
              <button 
                onClick={() => setInspectModalDoc(null)} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <pre style={{
                margin: 0,
                color: '#a7f3d0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {JSON.stringify({
                  _id: inspectModalDoc._id,
                  reportId: inspectModalDoc.reportId,
                  title: inspectModalDoc.title,
                  description: inspectModalDoc.description,
                  category: inspectModalDoc.category,
                  priority: inspectModalDoc.priority,
                  severity: inspectModalDoc.severity,
                  status: inspectModalDoc.status,
                  citizen: inspectModalDoc.citizen,
                  citizenName: inspectModalDoc.citizenName,
                  address: inspectModalDoc.address,
                  area: inspectModalDoc.area,
                  location: inspectModalDoc.location,
                  image: inspectModalDoc.image ? `${inspectModalDoc.image.substring(0, 80)}... [Base64 In-Database Image Data, Length: ${inspectModalDoc.image.length} chars]` : null,
                  imageMetadata: inspectModalDoc.imageMetadata,
                  createdAt: inspectModalDoc.createdAt,
                  updatedAt: inspectModalDoc.updatedAt
                }, null, 2)}
              </pre>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #334155', textAlign: 'right' }}>
              <Button onClick={() => setInspectModalDoc(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {activeImageModal && (
        <div 
          onClick={() => setActiveImageModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '1.5rem'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img 
              src={activeImageModal} 
              alt="Database Stored Report Evidence" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', objectFit: 'contain' }}
            />
            <button
              onClick={() => setActiveImageModal(null)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedIssues;
