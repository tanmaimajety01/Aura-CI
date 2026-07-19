import { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Key, 
  Check, 
  RefreshCw,
  Server
} from 'lucide-react';

export default function SettingsView() {
  const [churnThreshold, setChurnThreshold] = useState(0.5);
  const [apiKey, setApiKey] = useState('agy_live_7a3d9f2e8c5b1a47f0d');
  const [copied, setCopied] = useState(false);
  const [syncRate, setSyncRate] = useState('hourly');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* 2-Column layout */}
      <div className="grid-container grid-cols-2">
        
        {/* ML Model Adjustments */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={16} style={{ color: 'var(--primary)' }} /> AI Churn Classifier Calibration
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Adjust the sensitivity threshold for Churn Probability flagging</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
              <span>Decision Threshold</span>
              <span style={{ color: 'var(--primary)' }}>{churnThreshold.toFixed(2)}</span>
            </div>
            
            <input 
              type="range" 
              min={0.1} 
              max={0.9} 
              step={0.05}
              value={churnThreshold}
              onChange={(e) => setChurnThreshold(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--primary)',
                height: '6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-tertiary)'
            }}>
              <span>Low Risk Flag (Strict)</span>
              <span>High Risk Flag (Lenient)</span>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              marginTop: '10px'
            }}>
              <strong>Operational Impact:</strong> A threshold of <strong>{churnThreshold.toFixed(2)}</strong> balances precision and recall, yielding approximately <strong>{churnThreshold > 0.5 ? 'fewer false alarms but higher missed churn cases' : 'more alerts with a higher rate of correct proactive interventions'}</strong>.
            </div>
          </div>
        </div>

        {/* Data Sync Controls */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={16} style={{ color: 'var(--accent-blue)' }} /> Data Ingestion Pipeline
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Sync rates with Salesforce, HubSpot, and MS Fabric</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Synchronization Frequency:</span>
              <select 
                value={syncRate}
                onChange={(e) => setSyncRate(e.target.value)}
                className="input-field"
                style={{ width: '140px', height: '36px', padding: '6px 12px' }}
              >
                <option value="realtime">Real-time (Webhooks)</option>
                <option value="hourly">Hourly batch</option>
                <option value="daily">Daily cron (00:00 UTC)</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '14px',
              marginTop: '4px'
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>Manual Trigger Run</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Last run: 45 minutes ago</div>
              </div>
              <button 
                onClick={handleSyncData}
                disabled={isSyncing}
                className="btn btn-secondary"
                style={{ gap: '6px', fontSize: '12px', padding: '8px 12px' }}
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} style={{ animation: isSyncing ? 'pulse-slow 1s infinite' : 'none' }} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Developer API & System Health */}
      <div className="grid-container grid-cols-2">
        
        {/* Developer credentials */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} style={{ color: 'var(--accent-emerald)' }} /> API Developer Credentials
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Authenticate external scripts or ETL endpoints</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <span>Private API Key:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field"
                style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: 'var(--bg-tertiary)', flexGrow: 1 }}
              />
              <button 
                onClick={handleCopyKey}
                className="btn btn-primary"
                style={{ width: '80px', fontSize: '12px', padding: '0 12px' }}
              >
                {copied ? <Check size={14} /> : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={16} style={{ color: 'var(--accent-amber)' }} /> System Node Health
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Operational status of machine learning & API clusters</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span>ML Inference Engine:</span>
              <span className="badge badge-success" style={{ fontSize: '9px', padding: '2px 6px' }}>Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span>Database Cluster (Vite SQL Context):</span>
              <span className="badge badge-success" style={{ fontSize: '9px', padding: '2px 6px' }}>Healthy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Webhooks Broker:</span>
              <span className="badge badge-success" style={{ fontSize: '9px', padding: '2px 6px' }}>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
