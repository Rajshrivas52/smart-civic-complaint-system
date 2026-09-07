import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate frontend registration success
    alert("Registration successful! (Mock)");
    navigate('/login');
  };

  return (
    <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <Card style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to report and track civic issues</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" id="name" placeholder="John Doe" required />
            <Input label="Mobile Number" id="phone" type="tel" placeholder="+91 9876543210" required />
          </div>
          
          <Input label="Email Address" id="email" type="email" placeholder="john@example.com" required />
          
          <Select 
            label="Role (For Demonstration)" 
            id="role"
            options={[
              { value: 'citizen', label: 'Citizen' },
              { value: 'department', label: 'Department Staff' },
              { value: 'admin', label: 'Administrator' }
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" id="password" type="password" required />
            <Input label="Confirm Password" id="confirmPassword" type="password" required />
          </div>

          <label className="flex items-center gap-2" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" required />
            <span>I agree to the <a href="#" style={{ color: 'var(--primary)' }}>Terms and Conditions</a></span>
          </label>

          <Button type="submit" fullWidth>
            <UserPlus size={18} /> Register
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
