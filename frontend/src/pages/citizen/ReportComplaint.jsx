import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { mockCategories } from '../../utils/mockData';

const ReportComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate AI processing and submission delay
    setTimeout(() => {
      alert("Complaint submitted successfully! AI has auto-categorized your issue.");
      navigate('/citizen/complaints');
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Report an Issue</h1>
          <p className="page-subtitle">Help us improve the city by reporting civic problems.</p>
        </div>
      </div>

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Issue Title" 
            id="title" 
            placeholder="e.g. Large pothole on main road" 
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Description</label>
            <textarea 
              id="description" 
              rows="4" 
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical'
              }} 
              placeholder="Describe the issue in detail..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category (Optional - AI can auto-detect)" 
              id="category"
              options={mockCategories}
            />
            <Select 
              label="Perceived Severity" 
              id="severity"
              options={['Low', 'Medium', 'High', 'Critical']}
              required
            />
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Location</label>
            <div style={{ 
              height: '200px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              border: '2px dashed var(--border)'
            }}>
              <MapPin size={32} style={{ marginBottom: '0.5rem' }} />
              <p>Map UI Foundation</p>
              <p style={{ fontSize: '0.8rem' }}>Click to select location on map</p>
            </div>
            <Input 
              id="address" 
              placeholder="Enter exact address/landmark" 
              style={{ marginTop: '0.5rem' }}
              required 
            />
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Upload Image (Required for AI Analysis)</label>
            <div style={{ 
              padding: '2rem', 
              border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}>
              <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
              <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>Click to upload or drag and drop</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--info-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AlertCircle color="var(--info)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--info-text)' }}>
              Our AI will analyze your image and description to automatically categorize the issue and route it to the correct department.
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing via AI...' : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportComplaint;
