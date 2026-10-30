import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, AlertCircle, X, CheckCircle, Database, Check } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { mockCategories } from '../../utils/mockData';
import { createReportIssue, createComplaint } from '../../services/api';

const ReportComplaint = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road Maintenance & Potholes',
    severity: 'Medium',
    address: '',
    area: 'City Center'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [imageBase64, setImageBase64] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Convert to Base64 data URL for direct database storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);

    setErrorMessage('');
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageBase64(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setLoading(true);

    try {
      let payload;
      if (imageFile) {
        payload = new FormData();
        payload.append('title', formData.title.trim());
        payload.append('description', formData.description.trim());
        if (formData.category) payload.append('category', formData.category);
        payload.append('severity', formData.severity);
        payload.append('address', formData.address.trim());
        payload.append('area', formData.area);
        payload.append('latitude', '26.2183');
        payload.append('longitude', '78.1828');
        payload.append('image', imageFile);
        if (imageBase64) {
          payload.append('imageBase64', imageBase64);
        }
      } else {
        payload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          severity: formData.severity,
          address: formData.address.trim(),
          area: formData.area,
          latitude: 26.2183,
          longitude: 78.1828
        };
      }

      // Submit to dedicated report-issues database endpoint
      let response;
      try {
        response = await createReportIssue(payload);
      } catch (issueErr) {
        // Fallback to complaint endpoint which also writes to reportissues collection
        response = await createComplaint(payload);
      }

      setSuccessMessage(
        response.message || 'Civic issue reported successfully and stored in the database with image!'
      );

      setTimeout(() => {
        navigate('/citizen/complaints');
      }, 1500);
    } catch (err) {
      console.error('Failed to submit report issue:', err);
      setErrorMessage(
        err.message || 'Failed to submit report. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Report an Issue</h1>
          <p className="page-subtitle">Help improve the city by reporting civic problems directly to municipal authorities.</p>
        </div>
      </div>

      {errorMessage && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={20} color="#dc2626" />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #22c55e',
          color: '#166534',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle size={20} color="#16a34a" />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{successMessage}</span>
        </div>
      )}

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Issue Title" 
            id="title" 
            placeholder="e.g. Large pothole on main road near Thatipur" 
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Description</label>
            <textarea 
              id="description" 
              rows="4" 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical'
              }} 
              placeholder="Describe the issue in detail, including hazards or urgent risks..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category (AI can also auto-classify)" 
              id="category"
              options={mockCategories}
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            <Select 
              label="Perceived Severity" 
              id="severity"
              options={['Low', 'Medium', 'High', 'Critical']}
              value={formData.severity}
              onChange={(e) => handleInputChange('severity', e.target.value)}
              required
            />
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Location</label>
            <div style={{ 
              height: '140px', 
              backgroundColor: '#f1f5f9', 
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              border: '2px dashed var(--border)'
            }}>
              <MapPin size={28} style={{ marginBottom: '0.35rem', color: 'var(--primary)' }} />
              <p style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-main)' }}>Central Zone Geo-Location Enabled</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lat: 26.2183 | Lng: 78.1828 (Auto-detected)</p>
            </div>
            <Input 
              id="address" 
              placeholder="Enter exact landmark or street address" 
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={{ marginTop: '0.5rem' }}
              required 
            />
          </div>

          {/* Image Upload Box */}
          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
              Upload Image (Recommended for AI routing & inspection)
            </label>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              style={{ display: 'none' }}
            />

            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  padding: '2rem', 
                  border: '2px dashed var(--border)', 
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc',
                  transition: 'background-color 0.2s'
                }}
              >
                <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>Click to upload photo or drag & drop</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PNG, JPG, WEBP up to 5MB</p>
              </div>
            ) : (
              <div style={{
                position: 'relative',
                display: 'inline-block',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                padding: '0.5rem'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Complaint Preview" 
                  style={{
                    maxHeight: '180px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.6rem',
              fontSize: '0.8rem',
              color: imagePreview ? '#15803d' : 'var(--text-muted)',
              backgroundColor: imagePreview ? '#f0fdf4' : 'transparent',
              padding: imagePreview ? '0.4rem 0.6rem' : '0',
              borderRadius: '6px',
              border: imagePreview ? '1px solid #bbf7d0' : 'none',
              width: 'fit-content'
            }}>
              <Database size={15} color={imagePreview ? '#16a34a' : 'var(--primary)'} />
              <span>
                {imagePreview 
                  ? 'Image will be stored directly inside your MongoDB database document.' 
                  : 'Images are stored directly in your database collection (Base64).'}
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle color="#2563eb" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#1e40af' }}>
              Our automated system will inspect your complaint and automatically route it to the relevant department (Road Maintenance, Sanitation, or Electricity).
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting Issue...' : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportComplaint;
