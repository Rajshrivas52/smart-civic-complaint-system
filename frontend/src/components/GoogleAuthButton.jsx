import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GoogleRoleModal from './GoogleRoleModal';

/**
 * Google Identity Services (GIS) Official Authentication Button
 * Renders the official Google-rendered button, handles credential callbacks,
 * and displays an onboarding role selection modal for first-time users.
 */
const GoogleAuthButton = ({ onSuccess, onError, text = 'continue_with', role }) => {
  const buttonRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);

  // First-time Google onboarding modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCredential, setPendingCredential] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Handle Google Credential Response from GIS
  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      if (onError) onError('No credential received from Google account selector.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginWithGoogle(response.credential, role);
      
      // If the backend indicates this is a brand new account needing role selection
      if (data && data.needsRoleSelection) {
        setPendingCredential(response.credential);
        setGoogleProfile(data.googleProfile);
        setIsModalOpen(true);
        setLoading(false);
        return;
      }

      if (data && data.success && data.user) {
        if (onSuccess) {
          onSuccess(data.user);
        }
      } else {
        if (onError) onError(data?.message || 'Google authentication failed.');
      }
    } catch (err) {
      console.error('[GoogleAuthButton] Error during authentication:', err);
      if (onError) onError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };

  // Complete registration after user chooses their role in modal
  const handleRoleSubmit = async (selectedRole, departmentName) => {
    try {
      setModalLoading(true);
      setModalError('');

      const data = await loginWithGoogle(pendingCredential, selectedRole, { departmentName });
      
      if (data && data.success && data.user) {
        setIsModalOpen(false);
        setPendingCredential(null);
        setGoogleProfile(null);
        if (onSuccess) {
          onSuccess(data.user);
        }
      } else {
        setModalError(data?.message || 'Failed to complete registration with chosen role.');
      }
    } catch (err) {
      console.error('[GoogleAuthButton] Error completing role onboarding:', err);
      setModalError(err.message || 'Failed to complete account registration.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingCredential(null);
    setGoogleProfile(null);
    setModalError('');
  };

  useEffect(() => {
    let checkInterval = null;

    const initializeGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);

        if (!clientId) {
          return;
        }

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (buttonRef.current) {
            buttonRef.current.innerHTML = '';
            // Determine container width
            const containerWidth = Math.min(buttonRef.current.parentElement?.offsetWidth || 380, 400);

            window.google.accounts.id.renderButton(buttonRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: text,
              shape: 'rectangular',
              logo_alignment: 'left',
              width: containerWidth > 200 ? containerWidth : 320
            });
          }
        } catch (initErr) {
          console.error('[GoogleAuthButton] GIS initialization error:', initErr);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initializeGis();
    } else {
      // Poll briefly for script load if async
      let attempts = 0;
      checkInterval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initializeGis();
        } else if (attempts > 30) {
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId, text]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Official GIS rendered button container */}
      <div 
        ref={buttonRef} 
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '44px' 
        }} 
      />

      {loading && (
        <p style={{ fontSize: '0.82rem', color: 'var(--primary)', marginTop: '0.5rem', textAlign: 'center' }}>
          Verifying Google account with CivicAI...
        </p>
      )}

      {/* Configuration Notice if VITE_GOOGLE_CLIENT_ID is not yet filled in .env */}
      {!clientId && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.65rem 0.85rem',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          border: '1px dashed rgba(59, 130, 246, 0.4)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: '#2563eb',
          textAlign: 'center',
          width: '100%'
        }}>
          <span>Configure <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code> to activate live Google authentication.</span>
        </div>
      )}

      {/* First-Time Role Onboarding Modal */}
      <GoogleRoleModal
        isOpen={isModalOpen}
        profile={googleProfile}
        loading={modalLoading}
        error={modalError}
        onSubmit={handleRoleSubmit}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default GoogleAuthButton;
