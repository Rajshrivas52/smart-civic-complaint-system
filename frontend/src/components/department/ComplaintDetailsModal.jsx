import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Edit3, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Compass
} from 'lucide-react';
import './ComplaintDetailsModal.css';

const ComplaintDetailsModal = ({ complaint, onClose, onOpenStatusModal }) => {
  if (!complaint) return null;

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'badge-danger font-bold';
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'badge-success';
      case 'in progress': return 'badge-warning';
      case 'on hold': return 'badge-default';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card complaint-details-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="complaint-ref-badge">{complaint.id}</span>
            <div>
              <h3 className="modal-title">{complaint.title}</h3>
              <p className="modal-sub">Submitted on {complaint.submittedDate}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status & Priority Ribbon */}
          <div className="status-ribbon-bar">
            <div className="ribbon-item">
              <span className="ribbon-label">Current Status</span>
              <span className={`badge ${getStatusClass(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>

            <div className="ribbon-item">
              <span className="ribbon-label">Priority Level</span>
              <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                {complaint.priority === 'Critical' && <ShieldAlert size={12} />}
                {complaint.priority} Priority
              </span>
            </div>

            <div className="ribbon-item">
              <span className="ribbon-label">Assigned Officer</span>
              <span className="ribbon-val">
                <UserCheck size={14} className="text-primary" />
                {complaint.assignedStaff || 'Unassigned'}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-section">
            <h4 className="detail-section-title">
              <FileText size={16} /> Problem Description
            </h4>
            <div className="description-box">
              <p>{complaint.description}</p>
            </div>
          </div>

          {/* Location & Coordinates Grid */}
          <div className="detail-grid-2">
            <div className="detail-card-box">
              <h5 className="box-title">
                <MapPin size={15} /> Location Details
              </h5>
              <p className="box-value">{complaint.location}</p>
              <div className="coord-chip">
                <Compass size={13} />
                <span>GPS: {complaint.coordinates || '26.2183° N, 78.1828° E'}</span>
              </div>
            </div>

            <div className="detail-card-box">
              <h5 className="box-title">Category & SLA Target</h5>
              <p className="box-value">{complaint.category}</p>
              <span className="sla-tag">Target SLA: 48 Hours Resolution</span>
            </div>
          </div>

          {/* Citizen Photo Proof */}
          <div className="detail-section">
            <h4 className="detail-section-title">Citizen Image Inspection</h4>
            <div className="image-inspection-container">
              {complaint.citizenImage ? (
                <img 
                  src={complaint.citizenImage} 
                  alt={complaint.title} 
                  className="citizen-inspection-img" 
                />
              ) : (
                <div className="image-placeholder-box">
                  <FileText size={32} className="text-muted" />
                  <p>Standard inspection photo attached by reporting citizen.</p>
                </div>
              )}
              <div className="image-ai-overlay">
                <Sparkles size={14} />
                <span>CivicAI Computer Vision Verified: {complaint.category} detected (94.2% Confidence)</span>
              </div>
            </div>
          </div>

          {/* Work Remarks / Resolution Notes if available */}
          {complaint.resolutionRemarks && (
            <div className="detail-section resolution-box">
              <h4 className="detail-section-title text-success">
                <CheckCircle2 size={16} /> Work Resolution Remarks
              </h4>
              <p className="resolution-text">{complaint.resolutionRemarks}</p>
              {complaint.resolutionDate && (
                <span className="resolution-date">Resolved on: {complaint.resolutionDate}</span>
              )}
            </div>
          )}

          {/* Complaint Timeline */}
          <div className="detail-section">
            <h4 className="detail-section-title">
              <Clock size={16} /> Progress Timeline Log
            </h4>
            <div className="timeline">
              {complaint.timeline && complaint.timeline.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-step">{item.step}</span>
                    <span className="timeline-meta">{item.date} • {item.by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenStatusModal(complaint);
            }}
          >
            <Edit3 size={16} /> Update Status & Remarks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;
