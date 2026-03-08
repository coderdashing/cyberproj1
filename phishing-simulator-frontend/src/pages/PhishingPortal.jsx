import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const PhishingPortal = () => {
  const { campaignId, email } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // The decoded email from the URL parameter
  const userEmail = decodeURIComponent(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    setSubmitting(true);
    
    try {
      // Send a POST request to our malicious click endpoint to register the "Phish".
      // Note: We intentionally DO NOT send the real password they typed. We only send the email and campaign ID.
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberproj1.onrender.com';
      await fetch(`${apiUrl}/api/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          campaignId, 
          email: userEmail,
          password: "REDACTED-FOR-SAFETY" // Discarding the fake password
        }),
      });
      
      // Redirect them to the learning page to tell them it was a simulation
      navigate('/learning');
      
    } catch (error) {
      console.error("Failed to register click:", error);
      // Fallback redirect just in case
      navigate('/learning');
    }
  };

  // We override the global dark mode here to make it look like a generic corporate login page
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f3f2f1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#323130',
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        borderRadius: '2px'
      }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={28} color="#0078d4" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Corporate Sign In</h1>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>{userEmail}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #8a8886',
                borderRadius: '0',
                fontSize: '15px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0078d4'}
              onBlur={(e) => e.target.style.borderColor = '#8a8886'}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <a href="#" style={{ color: '#0078d4', fontSize: '13px', textDecoration: 'none' }}>Forgot my password</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              type="button" 
              style={{
                padding: '8px 20px',
                backgroundColor: '#e1dfdd',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              style={{
                padding: '8px 32px',
                backgroundColor: '#0078d4',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhishingPortal;
