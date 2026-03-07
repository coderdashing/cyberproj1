import { ShieldAlert, AlertTriangle, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      {/* Immersive Alert Banner */}
      <div 
        className="animate-slide-up"
        style={{ 
          maxWidth: '800px', 
          width: '100%', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-xl)', 
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ backgroundColor: 'var(--error)', padding: '2rem', textAlign: 'center', color: 'white' }}>
          <AlertTriangle size={64} style={{ margin: '0 auto 1rem', animation: 'pulse 2s infinite' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>Oops! That was a test.</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
            You just clicked a link in a mock phishing email. Don't worry, you are safe!
          </p>
        </div>

        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--warning-bg)', borderRadius: '50%', color: 'var(--warning)', flexShrink: 0 }}>
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Why am I seeing this?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Your company runs these regular simulations to help train employees on spotting dangerous emails. If this had been a real attack, your credentials or company network could have been compromised.
              </p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info className="text-accent" /> How to Spot Phishing Next Time
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>🚩 Sense of Urgency</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Phishers rely on fear (e.g., "Your account will be suspended in 24 hours!") to make you click without thinking.
              </p>
            </div>
            
            <div className="glass-card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>🚩 Too Good to be True</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Unexpected rewards like $50 Amazon Gift Cards from "HR" are common tactics to lower your guard.
              </p>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--error)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>🚩 Hover Before You Click</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Always hover your mouse over links to see the real destination. If it looks like a strange, unofficial URL, don't click it.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={18} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
