import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Zap, ArrowRight, Activity } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleTrackComplaintClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/citizen/dashboard',
          message: 'Authentication required: Please sign in or register to track your complaints.'
        }
      });
    } else {
      navigate('/citizen/dashboard');
    }
  };

  const handleReportProblemClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/citizen/report',
          message: 'Authentication required: Please sign in or register to report a new issue.'
        }
      });
    } else {
      navigate('/citizen/report');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)',
        padding: '5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '1.5rem', fontWeight: '700' }}>
            Empowering Citizens.<br />Smarter Cities.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            An AI-enabled civic complaint management system that categorizes, prioritizes, and routes public issues to the right department for faster resolution.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              onClick={handleReportProblemClick}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: 'white', color: 'var(--primary)' }}
            >
              Report a Problem <ArrowRight size={20} />
            </Button>
            <Button 
              onClick={handleTrackComplaintClick}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Track Complaint
            </Button>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section style={{ margin: '4rem 0' }}>
        <div className="page-header justify-center" style={{ textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="page-title">How It Works</h2>
          <p className="page-subtitle">A seamless process from reporting to resolution.</p>
        </div>
        
        <div className="grid grid-cols-3" style={{ marginTop: '3rem' }}>
          <Card hoverable className="items-center" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <MapPin size={32} color="var(--primary)" />
            </div>
            <h3>1. Report & Locate</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Upload a photo and description. We'll automatically capture the location data.</p>
          </Card>
          
          <Card hoverable className="items-center" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'var(--warning-bg)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Zap size={32} color="var(--warning)" />
            </div>
            <h3>2. AI Analysis</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Our AI predicts the category and priority, instantly routing it to the right department.</p>
          </Card>
          
          <Card hoverable className="items-center" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'var(--success-bg)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <ShieldCheck size={32} color="var(--success)" />
            </div>
            <h3>3. Rapid Resolution</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Track progress in real-time as the assigned team resolves the issue.</p>
          </Card>
        </div>
      </section>

      {/* Statistics Demo */}
      <section style={{ margin: '4rem 0', backgroundColor: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>System Impact (Demo Data)</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real-time statistics of civic issue resolutions.</p>
          </div>
          <Activity size={32} color="var(--primary)" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h4 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '700' }}>24k+</h4>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Total Complaints</p>
          </div>
          <div>
            <h4 style={{ fontSize: '2.5rem', color: 'var(--success)', fontWeight: '700' }}>92%</h4>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Resolution Rate</p>
          </div>
          <div>
            <h4 style={{ fontSize: '2.5rem', color: 'var(--warning)', fontWeight: '700' }}>2.4</h4>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Avg. Days to Resolve</p>
          </div>
          <div>
            <h4 style={{ fontSize: '2.5rem', color: 'var(--info)', fontWeight: '700' }}>8+</h4>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Departments Integrated</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
        <p>&copy; 2026 Smart Civic Complaint System. All rights reserved.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>A Phase 2A Prototype.</p>
      </footer>
    </div>
  );
};

export default Landing;
