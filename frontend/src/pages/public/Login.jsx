import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import GoogleAuthButton from '../../components/GoogleAuthButton';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, loginWithGoogle } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const queryRole = searchParams.get('role') || location.state?.role || null;

  const redirectMessage = location.state?.message;
  const redirectFrom = location.state?.from;

  const [email, setEmail] = useState(() => location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mandatory Role Selection Modal state for new Google OAuth users
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingCredential, setPendingCredential] = useState(null);
  const [selectedRole, setSelectedRole] = useState('citizen');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      setSuccess(`Welcome back, ${data.user.name}! Redirecting...`);

      setTimeout(() => {
        const role = (data.user.role || '').toLowerCase();
        
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
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelectionSubmit = async (e) => {
    e.preventDefault();
    if (!pendingCredential) return;
    setLoading(true);
    setError('');

    try {
      const data = await loginWithGoogle(pendingCredential, selectedRole);
      setShowRoleModal(false);
      if (data && data.user) {
        setSuccess(`Account registered as ${selectedRole.toUpperCase()}! Redirecting...`);
        setTimeout(() => {
          if (selectedRole === 'admin') navigate('/admin/dashboard');
          else if (selectedRole === 'department') navigate('/department/dashboard');
          else navigate('/citizen/dashboard');
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete Google registration.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      <Card style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {queryRole ? `Sign in as ${queryRole.toUpperCase()}` : 'Login with your registered civic account'}
          </p>
        </div>

        {/* Redirect / Auth Guard Message */}
        {redirectMessage && !error && !success && !redirectMessage.toLowerCase().includes('successful') && (
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

        {(success || (redirectMessage && redirectMessage.toLowerCase().includes('successful'))) && (
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
            <span>{success || redirectMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input 
            label="Email Address" 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. raj@example.com or admin@civis.gov" 
            required 
          />
          
          <div style={{ position: 'relative' }}>
            <Input 
              label="Password" 
              id="password" 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
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
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
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
          text="continue_with"
          role={queryRole}
          onSuccess={(userData) => {
            const role = (userData.role || 'citizen').toLowerCase();
            setSuccess(`Welcome, ${userData.name}! Redirecting...`);
            setTimeout(() => {
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
            }, 600);
          }}
          onError={(err, meta) => {
            if (meta?.requiresRoleSelection) {
              setPendingCredential(meta.credential);
              setShowRoleModal(true);
            } else {
              setError(typeof err === 'string' ? err : (err?.message || 'Google Authentication failed.'));
            }
          }}
        />

        {/* Mandatory Role Selection Modal for Google users without pre-defined role */}
        {showRoleModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'var(--surface, #ffffff)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Select Account Role</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                First-time Google Sign-Up requires assigning a role before creating your account.
              </p>
              <form onSubmit={handleRoleSelectionSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="citizen" 
                      checked={selectedRole === 'citizen'} 
                      onChange={() => setSelectedRole('citizen')} 
                    />
                    <div>
                      <strong style={{ display: 'block' }}>Citizen Account</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Report public issues, track complaints</span>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="department" 
                      checked={selectedRole === 'department'} 
                      onChange={() => setSelectedRole('department')} 
                    />
                    <div>
                      <strong style={{ display: 'block' }}>Department Officer</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage work orders & resolve assigned issues</span>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={selectedRole === 'admin'} 
                      onChange={() => setSelectedRole('admin')} 
                    />
                    <div>
                      <strong style={{ display: 'block' }}>Municipal Admin</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System configuration & full oversight</span>
                    </div>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowRoleModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Completing...' : 'Complete Onboarding'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Demo Quick-Fill Shortcuts */}
        <div style={{ marginTop: '1.5rem', padding: '0.85rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            ⚡ Quick Fill Seeded Accounts:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              onClick={() => fillDemoAccount('admin@civis.gov', 'Admin@123')}
            >
              Admin
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              onClick={() => fillDemoAccount('raj@example.com', 'Citizen@123')}
            >
              Citizen
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              onClick={() => fillDemoAccount('road@smartcivic.gov.in', 'Dept@123')}
            >
              Roads Dept
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/register" state={{ from: redirectFrom, message: redirectMessage }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
        </p>
      </Card>
    </div>
  );
};


export default Login;
