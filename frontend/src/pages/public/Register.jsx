import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();

  const redirectMessage = location.state?.message;
  const redirectFrom = location.state?.from;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'citizen',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        password: formData.password
      });

      setSuccess('Registration successful! Redirecting to your dashboard...');

      setTimeout(() => {
        const role = (data.user?.role || formData.role || '').toLowerCase();
        
        if (redirectFrom) {
          if (redirectFrom.startsWith('/admin') && role !== 'admin') {
            navigate('/citizen/dashboard');
            return;
          }
          if (redirectFrom.startsWith('/department') && role !== 'department' && role !== 'admin') {
            navigate('/citizen/dashboard');
            return;
          }
          navigate(redirectFrom);
          return;
        }

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'department') {
          navigate('/department/dashboard');
        } else {
          navigate('/citizen/dashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      <Card style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to report and track civic issues</p>
        </div>

        {/* Redirect / Auth Guard Message */}
        {redirectMessage && !error && !success && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#b45309',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: '500'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, color: '#f59e0b' }} />
            <span>{redirectMessage}</span>
          </div>
        )}

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
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Full Name" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe" 
              required 
            />
            <Input 
              label="Mobile Number" 
              id="phone" 
              type="tel" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210" 
              required 
            />
          </div>
          
          <Input 
            label="Email Address" 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com" 
            required 
          />
          
          <Select 
            label="Account Role" 
            id="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'citizen', label: 'Citizen' },
              { value: 'admin', label: 'Admin' },
              { value: 'department', label: 'Department' }
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Password" 
              id="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required 
            />
            <Input 
              label="Confirm Password" 
              id="confirmPassword" 
              type="password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required 
            />
          </div>

          <label className="flex items-center gap-2" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" required defaultChecked />
            <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)' }}>Terms and Conditions</a></span>
          </label>

          <Button type="submit" fullWidth disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" state={{ from: redirectFrom, message: redirectMessage }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
