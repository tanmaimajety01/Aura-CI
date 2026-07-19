import { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Lightbulb, 
  ArrowRight,
  Brain
} from 'lucide-react';
import { parseNLQuery, type Customer, type NLQueryResult } from '../data/dataGenerator';

interface NLSearchProps {
  allCustomers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export default function NLSearch({ allCustomers, onSelectCustomer }: NLSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NLQueryResult | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const sampleQueries = [
    "Show churn in South India",
    "Highest CLV customers",
    "Basic plan with 4+ tickets",
    "Product X users",
    "High churn risk accounts"
  ];

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (qText: string) => {
    if (!qText.trim()) return;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setResult(null);
    setQuery(qText);

    timeoutRef.current = window.setTimeout(() => {
      const res = parseNLQuery(qText, allCustomers);
      setResult(res);
      setLoading(false);
      timeoutRef.current = null;
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Bar Input */}
      <div className="card card-glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={14} />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            AI-Driven Natural Language Query (NLQ)
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Ask anything (e.g., 'Show churn in South India', 'Highest CLV customers', 'Basic plan with support issues')"
            style={{ height: '44px', fontSize: '14px', borderRadius: 'var(--radius-md)' }}
          />
          <button 
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="btn btn-primary"
            style={{ padding: '0 20px', borderRadius: 'var(--radius-md)', height: '44px' }}
          >
            <span>Analyze</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Suggestions:
          </span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(q)}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <div className="skeleton" style={{ height: '24px', width: '200px' }} />
          <div className="skeleton" style={{ height: '60px', width: '100%' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="skeleton" style={{ height: '80px', flexGrow: 1 }} />
            <div className="skeleton" style={{ height: '80px', flexGrow: 1 }} />
            <div className="skeleton" style={{ height: '80px', flexGrow: 1 }} />
          </div>
        </div>
      )}

      {/* Query Output & Explainable AI details */}
      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
          
          {/* Main Results Panel */}
          <div className="grid-container grid-cols-12">
            
            {/* Left Column: Query Explanation and SQL (8 cols) */}
            <div className="col-span-8 card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* SQL Panel */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Terminal size={14} />
                  <span>Synthesized SQL Script</span>
                </div>
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  overflowX: 'auto',
                  lineHeight: 1.5
                }}>
                  {/* SQL Syntax Highlight representation */}
                  <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>SELECT</span> * <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>FROM</span> customers
                  {result.sql.includes('WHERE') && (
                    <>
                      <br />
                      <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>WHERE</span>{' '}
                      {result.sql.split('WHERE')[1].split('ORDER BY')[0].split('LIMIT')[0].trim().split(' ').map((word, i) => {
                        if (word.startsWith("'") || word.includes('%')) return <span key={i} style={{ color: '#10b981' }}> {word}</span>;
                        if (['AND', 'OR', 'LIKE', '=', '>=', '<='].includes(word)) return <span key={i} style={{ color: '#0ea5e9', fontWeight: 'bold' }}> {word}</span>;
                        return <span key={i} style={{ color: 'var(--text-primary)' }}> {word}</span>;
                      })}
                    </>
                  )}
                  {result.sql.includes('ORDER BY') && (
                    <>
                      <br />
                      <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>ORDER BY</span>{' '}
                      {result.sql.split('ORDER BY')[1].split('LIMIT')[0].trim()}
                    </>
                  )}
                  {result.sql.includes('LIMIT') && (
                    <>
                      <br />
                      <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>LIMIT</span>{' '}
                      {result.sql.split('LIMIT')[1].trim()}
                    </>
                  )}
                </div>
              </div>

              {/* Text Explanation */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Lightbulb size={14} />
                  <span>AI Summary & Model Explanation</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {result.explanation}
                </p>
              </div>
            </div>

            {/* Right Column: Key KPIs for Segment (4 cols) */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Segment Statistics
                </span>
                
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Total Volume</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {result.summaryMetrics.count.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Average CLV</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ${result.summaryMetrics.avgClv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    <span>Predicted Churn Rate</span>
                    <span className={`badge ${result.summaryMetrics.churnRate > 30 ? 'badge-danger' : 'badge-success'}`}>
                      {result.summaryMetrics.churnRate}%
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    marginTop: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, result.summaryMetrics.churnRate)}%`,
                      backgroundColor: result.summaryMetrics.churnRate > 30 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Recommendations */}
          <div className="card card-glass" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Brain size={16} />
              <span>Recommended Strategic Actions</span>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {result.sql.includes('churn_predicted') || result.sql.includes('predicted_churn_prob') ? (
                <>
                  <li><strong>Automated Retention Email:</strong> Trigger the <em>High-Risk Loyalty Campaign</em> offering a 20% discount on renewal values.</li>
                  <li><strong>Customer Success Contact:</strong> Flag accounts for Customer Success Manager (CSM) live check-in within 48 hours.</li>
                  <li><strong>Feedback Loop:</strong> Issue a CSAT check-in to identify primary operational friction (e.g., ticket resolution delays).</li>
                </>
              ) : result.sql.includes('clv DESC') ? (
                <>
                  <li><strong>VIP Loyalty Club:</strong> Enroll these customers in the exclusive <em>Platinum Circle Benefits</em> to protect recurring revenue.</li>
                  <li><strong>Co-Design Program:</strong> Invite top accounts to product advisory boards for feature co-designing.</li>
                  <li><strong>Expansion Targeting:</strong> Coordinate with account executives to pitch enterprise-wide licenses or custom add-ons.</li>
                </>
              ) : (
                <>
                  <li><strong>Targeted Content:</strong> Deliver plan-specific tips to maximize product adoption and customer satisfaction scores.</li>
                  <li><strong>Upsell Funnel:</strong> Design personalized marketing sequences targeting lower tier users for expansion deals.</li>
                  <li><strong>Service Audits:</strong> Audit ticket resolution times for this segment to verify service standard level agreements.</li>
                </>
              )}
            </ul>
          </div>

          {/* Results Preview Table */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Query Results Preview (Top 5 Matches)</span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Showing 5 of {result.summaryMetrics.count}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>ID</th>
                    <th style={{ padding: '8px' }}>Name</th>
                    <th style={{ padding: '8px' }}>Plan</th>
                    <th style={{ padding: '8px' }}>Region</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>CLV</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Churn Probability</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {result.filteredCustomers.slice(0, 5).map(cust => (
                    <tr 
                      key={cust.id} 
                      onClick={() => onSelectCustomer(cust)}
                      style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--primary)' }}>{cust.id}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 500 }}>{cust.name}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className={`badge ${cust.subscriptionPlan === 'Enterprise' ? 'badge-danger' : cust.subscriptionPlan === 'Premium' ? 'badge-warning' : cust.subscriptionPlan === 'Pro' ? 'badge-info' : 'badge-neutral'}`}>
                          {cust.subscriptionPlan}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{cust.region}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600 }}>${cust.clv.toLocaleString()}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        <span className={`badge ${cust.predictedChurnProb > 0.7 ? 'badge-danger' : cust.predictedChurnProb > 0.4 ? 'badge-warning' : 'badge-success'}`}>
                          {(cust.predictedChurnProb * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <button className="btn-icon" style={{ padding: '2px' }} onClick={() => onSelectCustomer(cust)}>
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
