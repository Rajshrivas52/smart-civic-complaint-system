import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, User, Lock } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import GoogleAuthButton from '../../components/GoogleAuthButton';
import { useAuth } from '../../context/AuthContext';

const MUNICIPAL_AREAS = [
  { value: 'City Center', label: 'City Center (Ward 1)' },
  { value: 'Thatipur', label: 'Thatipur (Ward 2)' },
  { value: 'Lashkar', label: 'Lashkar (Ward 3)' },
  { value: 'Morar', label: 'Morar (Ward 4)' },
  { value: 'Gola Ka Mandir', label: 'Gola Ka Mandir (Ward 5)' },
  { value: 'Phool Bagh', label: 'Phool Bagh (Ward 6)' },
  { value: 'Hazira', label: 'Hazira (Ward 7)' },
  { value: 'DD Nagar', label: 'DD Nagar (Ward 8)' },
  { value: 'University Road', label: 'University Road (Ward 9)' },
  { value: 'Other', label: 'Other Ward / Area' }
];

const ROLES = [
  { value: 'citizen', label: 'Citizen (Report & Track Grievances)' },
  { value: 'department', label: 'Department Staff (Field & Maintenance Ops)' }
];

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: 'City Center',
    role: 'citizen',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: '' }));
    }
    setError('');
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (formData.phone && !/^[+0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (8-15 digits)';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) {
      setError('Please fix the errors indicated in the form.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        area: formData.area,
        role: formData.role,
        password: formData.password
      };

      await registerUser(payload);
      setSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login', {
          state: {
            email: formData.email.trim().toLowerCase(),
            message: 'Registration successful! Please log in with your credentials.'
          }
        });
      }, 1200);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '85vh', padding: '2.5rem 1rem' }}>
      <Card style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            color: 'var(--primary)',
            marginBottom: '0.75rem'
          }}>
            <UserPlus size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700 }}>
            Create an Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Register to report civic grievances, track resolutions and help improve your city
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <Input
            label="Full Name *"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Ananya Sen"
            error={fieldErrors.name}
            required
          />

          {/* Email Address */}
          <Input
            label="Email Address *"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. ananya@example.com"
            error={fieldErrors.email}
            required
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            error={fieldErrors.phone}
          />

          {/* Ward / Area & Role Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              label="Ward / Municipal Area"
              id="area"
              value={formData.area}
              onChange={handleChange}
              options={MUNICIPAL_AREAS}
            />

            <Select
              label="Account Role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              options={ROLES}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Input
              label="Password *"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              error={fieldErrors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '36px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div style={{ position: 'relative' }}>
            <Input
              label="Confirm Password *"
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              error={fieldErrors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '36px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Municipal Terms Note */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            margin: '0.5rem 0 1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>
              By registering, you agree to submit legitimate municipal complaints in accordance with the Civic Grievance Redressal Policy.
            </span>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* OR Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ padding: '0 0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>

        {/* Official Google Identity Services Authentication */}
        <GoogleAuthButton
          text="signup_with"
          onSuccess={(userData) => {
            const role = (userData.role || 'citizen').toLowerCase();
            setSuccess(`Account registered as ${userData.name}! Redirecting...`);
            setTimeout(() => {
              if (role === 'admin') {
                navigate('/admin/dashboard');
              } else if (role === 'department') {
                navigate('/department/dashboard');
              } else {
                navigate('/citizen/dashboard');
              }
            }, 600);
          }}
          onError={(errMsg) => {
            setError(errMsg);
          }}
        />

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
