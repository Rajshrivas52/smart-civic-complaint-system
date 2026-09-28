import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, ShieldAlert, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './SessionTimeoutModal.css';

/**
 * SessionTimeoutModal
 * Monitors user inactivity and warns before automatically logging out.
 * 
 * @param {number} idleTimeoutMinutes - Inactivity duration before showing warning modal (default: 14 mins)
 * @param {number} warningDurationSeconds - Warning modal countdown duration before auto-logout (default: 60s)
 */
const SessionTimeoutModal = ({ 
  idleTimeoutMinutes = 14, 
  warningDurationSeconds = 60 
}) => {
  const { isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(warningDurationSeconds);

  const lastActivityRef = useRef(Date.now());
  const isWarningOpenRef = useRef(false);

  const IDLE_MS = idleTimeoutMinutes * 60 * 1000;
  const WARNING_MS = warningDurationSeconds * 1000;
  const TOTAL_MS = IDLE_MS + WARNING_MS;

  // Synchronize ref with state for interval callbacks
  useEffect(() => {
    isWarningOpenRef.current = isWarningOpen;
  }, [isWarningOpen]);

  // Reset inactivity timer on user interaction
  const handleUserActivity = useCallback(() => {
    // Only update timestamp if modal is NOT open (or if user clicks extend)
    if (!isWarningOpenRef.current) {
      const now = Date.now();
      // Throttle updating timestamp to once per second
      if (now - lastActivityRef.current > 1000) {
        lastActivityRef.current = now;
      }
    }
  }, []);

  const handleExtendSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsWarningOpen(false);
    setSecondsLeft(warningDurationSeconds);
  }, [warningDurationSeconds]);

  const handleForceLogout = useCallback(() => {
    setIsWarningOpen(false);
    logoutUser();
    navigate('/login', { 
      state: { message: 'You have logged out of your session.' } 
    });
  }, [logoutUser, navigate]);

  // Setup activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      setIsWarningOpen(false);
      return;
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, handleUserActivity]);

  // Periodic interval check (runs every 1 sec)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;

      if (elapsed >= TOTAL_MS) {
        // Auto Logout
        setIsWarningOpen(false);
        logoutUser();
        navigate('/login', { 
          state: { message: 'Your session expired due to inactivity. Please log in again.' } 
        });
      } else if (elapsed >= IDLE_MS) {
        // Show Warning Modal & calculate remaining seconds
        const remainingSeconds = Math.max(0, Math.ceil((TOTAL_MS - elapsed) / 1000));
        setSecondsLeft(remainingSeconds);
        if (!isWarningOpenRef.current) {
          setIsWarningOpen(true);
        }
      } else {
        // User was active before idle threshold was reached
        if (isWarningOpenRef.current) {
          setIsWarningOpen(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, IDLE_MS, TOTAL_MS, logoutUser, navigate]);

  // Check tab focus / visibility state change
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= TOTAL_MS) {
          setIsWarningOpen(false);
          logoutUser();
          navigate('/login', { 
            state: { message: 'Your session expired due to inactivity. Please log in again.' } 
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, TOTAL_MS, logoutUser, navigate]);

  if (!isAuthenticated || !isWarningOpen) {
    return null;
  }

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="session-timeout-overlay" role="dialog" aria-modal="true" aria-labelledby="session-modal-title">
      <div className="session-timeout-card">
        <div className="session-timeout-header">
          <div className="session-timeout-icon-badge">
            <ShieldAlert size={24} />
          </div>
          <div className="session-timeout-title-group">
            <h2 id="session-modal-title">Session Expiring Soon</h2>
            <p>Inactive user detected</p>
          </div>
        </div>

        <div className="session-timeout-body">
          <p className="session-timeout-msg">
            You have been inactive for a while. For security reasons, your session will automatically end.
          </p>

          <div className="session-countdown-wrapper">
            <div className="session-countdown-ring">
              <span className="session-countdown-value">{formatTime(secondsLeft)}</span>
            </div>
          </div>

          <p className="session-timeout-subtext">
            Click <strong>Stay Logged In</strong> to continue working without losing progress.
          </p>
        </div>

        <div className="session-timeout-actions">
          <button 
            type="button" 
            className="session-btn-logout"
            onClick={handleForceLogout}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
          
          <button 
            type="button" 
            className="session-btn-extend"
            onClick={handleExtendSession}
          >
            <RefreshCw size={16} />
            <span>Stay Logged In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
