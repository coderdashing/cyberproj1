import { useState, useEffect } from 'react';
import { Send, Users, Activity, CheckCircle, AlertOctagon } from 'lucide-react';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [template, setTemplate] = useState('password_reset');
  const [sending, setSending] = useState(false);

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/campaigns');
      const data = await res.json();
      if (data.message === 'success') {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // Poll every 5 seconds to see live clicks
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!name || !targetEmail) return;
    
    setSending(true);
    try {
      const res = await fetch('http://localhost:3000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, target_email: targetEmail, template }),
      });
      
      if (res.ok) {
        setName('');
        setTargetEmail('');
        fetchCampaigns(); // Refresh list immediately
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setSending(false);
    }
  };

  // Calculate Metrics
  const totalSent = campaigns.length;
  const totalClicks = campaigns.filter(c => c.clicked).length;
  const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Campaign Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor and send phishing simulations to test employee awareness.</p>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--accent-glow)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
            <Send size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Sent</p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{totalSent}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--error-bg)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>
            <AlertOctagon size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Clicked</p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{totalClicks}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Vulnerability Rate</p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{clickRate}%</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Create Campaign Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} className="text-accent" /> New Simulation
          </h3>
          
          <form onSubmit={handleCreateCampaign}>
            <div className="form-group">
              <label className="form-label">Campaign Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Q3 Security Test"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Target Email(s)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="employee1@company.com, employee2@company.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Separate multiple emails with commas.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Email Template</label>
              <select 
                className="form-select"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="password_reset">Urgent: Password Reset</option>
                <option value="gift_card">Reward: $50 Amazon Gift Card</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Simulation Email'}
              {!sending && <Send size={18} />}
            </button>
          </form>
        </div>

        {/* Recent Campaigns Table */}
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent History</h3>
          
          {loading ? (
             <p style={{ color: 'var(--text-muted)' }}>Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
               <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
               <p>No campaigns sent yet. Create one to get started.</p>
             </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Target</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id}>
                    <td style={{ fontWeight: 500 }}>{camp.name}</td>
                    <td>{camp.target_email}</td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {camp.template.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {camp.clicked ? (
                        <span className="badge badge-error">Clicked</span>
                      ) : (
                        <span className="badge badge-success">Sent (Safe)</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {new Date(camp.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
