import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  FileText, 
  Camera, 
  Calendar,
  Save,
  AlertTriangle
} from 'lucide-react';
import './StatusUpdateModal.css';

const StatusUpdateModal = ({ complaint, officers, onClose, onSaveUpdate }) => {
  if (!complaint) return null;

  const [newStatus, setNewStatus] = useState(complaint.status);
  const [assignedStaff, setAssignedStaff] = useState(complaint.assignedStaff || officers[1]);
  const [workRemarks, setWorkRemarks] = useState(complaint.workRemarks || '');
  const [resolutionRemarks, setResolutionRemarks] = useState(complaint.resolutionRemarks || '');
  const [resolutionDate, setResolutionDate] = useState(
    complaint.resolutionDate || new Date().toISOString().split('T')[0]
  );
  const [uploadProof, setUploadProof] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatePayload = {
      id: complaint.id,
      status: newStatus,
      assignedStaff,
      workRemarks,
      ...(newStatus === 'Resolved' && {
        resolutionRemarks: resolutionRemarks || 'Field repairs completed and verified by site inspector.',
        resolutionDate
      })
    };

    onSaveUpdate(updatePayload);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card status-update-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-box bg-primary-light">
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="modal-title">Update Complaint Status</h3>
              <p className="modal-sub">Ref: {complaint.id} • {complaint.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Current vs New Status */}
            <div className="status-selection-box">
              <div className="current-status-display">
                <span className="display-label">Current Status:</span>
                <span className="badge badge-primary">{complaint.status}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Select New Status *</label>
                <select
                  className="form-control select-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Pending">Pending (Awaiting Inspection)</option>
                  <option value="In Progress">In Progress (Field Team Deployed)</option>
                  <option value="On Hold">On Hold (Stock/Delay Issue)</option>
                  <option value="Resolved">Resolved (Work Completed)</option>
                </select>
              </div>
            </div>

            {/* Assign Staff Officer */}
            <div className="form-group margin-top-md">
              <label className="form-label">Assign / Reassign Field Officer</label>
              <select
                className="form-control select-control"
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
              >
                {officers.map(officer => (
                  <option key={officer} value={officer}>{officer}</option>
                ))}
              </select>
            </div>

            {/* Work Remarks */}
            <div className="form-group margin-top-md">
              <label className="form-label">Work Log & Field Remarks</label>
              <textarea
                className="form-control textarea-control"
                rows="3"
                placeholder="Enter field update notes, equipment dispatched, or delay reasons..."
                value={workRemarks}
                onChange={(e) => setWorkRemarks(e.target.value)}
              />
            </div>

            {/* RESOLUTION SPECIFIC FIELDS */}
            {newStatus === 'Resolved' && (
              <div className="resolution-fields-box animate-fade-in">
                <div className="box-title text-success">
                  <CheckCircle2 size={16} /> Resolution Completion Form
                </div>

                <div className="form-group">
                  <label className="form-label">Resolution Details & Remarks *</label>
                  <textarea
                    className="form-control textarea-control"
                    rows="2"
                    placeholder="Describe how the complaint was fixed (e.g. Cold-mix asphalt applied and compacted)..."
                    value={resolutionRemarks}
                    onChange={(e) => setResolutionRemarks(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Completion Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={resolutionDate}
                      onChange={(e) => setResolutionDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group flex-center">
                    <label className="toggle-proof-label">
                      <input 
                        type="checkbox" 
                        checked={uploadProof} 
                        onChange={(e) => setUploadProof(e.target.checked)} 
                      />
                      <span>Attach Photo Proof of Completion</span>
                    </label>
                  </div>
                </div>

                {uploadProof && (
                  <div className="proof-upload-box">
                    <Camera size={20} className="text-primary" />
                    <span>Upload completion photo proof for citizen verification.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Status Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
