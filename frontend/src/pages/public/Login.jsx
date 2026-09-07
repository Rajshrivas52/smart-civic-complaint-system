import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login behavior based on email
    const email = e.target.email.value;
    if (email.includes('admin')) {
      navigate('/admin/dashboard');
    } else if (email.includes('water') || email.includes('roads')) {
      navigate('/department/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  return (
    <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <Input 
            label="Email Address" 
            id="email" 
            type="email" 
            placeholder="e.g. raj@example.com (Citizen), admin@civis.gov (Admin)" 
            required 
          />
          
          <div style={{ position: 'relative' }}>
            <Input 
              label="Password" 
              id="password" 
              type={showPassword ? "text" : "password"} 
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
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</a>
          </div>

          <Button type="submit" fullWidth>
            <LogIn size={18} /> Sign In
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
