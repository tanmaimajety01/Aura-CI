import { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Mail, MapPin, Calendar, Smartphone, CreditCard, ShoppingBag, 
  AlertTriangle, ShieldCheck, ArrowLeft, CheckCircle, 
  Sparkles, Star, DollarSign, Clock, MessageSquare, ChevronRight, Search
} from 'lucide-react';
import type { Customer } from '../data/dataGenerator';

interface Customer360ViewProps {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  allCustomers: Customer[];
}

export default function Customer360View({
  selectedCustomer,
  setSelectedCustomer,
  allCustomers
}: Customer360ViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'orders' | 'support' | 'marketing'>('overview');
  
  // Search query within Customer 360 selection page
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Filtering for high risk accounts for the select page
  const highRiskCustomers = useMemo(() => {
    return allCustomers
      .filter(c => c.predictedChurnProb > 0.75)
      .slice(0, 8);
  }, [allCustomers]);

  // Filtered list of all customers when searching
  const filteredSearchList = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allCustomers
      .filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 10);
  }, [searchQuery, allCustomers]);

  // Generate realistic support tickets for the selected customer based on supportTickets count
  const simulatedTickets = useMemo(() => {
    if (!selectedCustomer) return [];
    const tickets = [];
    const subjects = [
      'API Integration timeout error',
      'Billing discrepancy on credit card charge',
      'Cannot configure Cloud Storage folder share permissions',
      'Vulnerability scanning query regarding security suite',
      'Slow report generation in AI Analytics workspace',
      'Request to add extra user seats on Enterprise plan',
      'SSO login configuration issue',
      'Documentation clarification for Webhooks'
    ];


    const count = selectedCustomer.supportTickets;
    for (let i = 0; i < count; i++) {
      const subj = subjects[i % subjects.length];
      const stat = i === 0 && count > 2 ? 'In Progress' : (i === 1 && count > 4 ? 'Open' : 'Resolved');
      const prio = i === 0 && count > 1 ? 'High' : (i % 2 === 0 ? 'Medium' : 'Low');
      
      tickets.push({
        id: `TKT-${8800 + i}`,
        subject: subj,
        status: stat,
        priority: prio,
        created: `${i + 1} weeks ago`,
        updated: `${i * 2 + 1} days ago`
      });
    }
    return tickets;
  }, [selectedCustomer]);

  // Generate realistic purchasing / transaction history based on monthly revenue & tenure
  const simulatedTransactions = useMemo(() => {
    if (!selectedCustomer) return [];
    const txs = [];
    const tenureMonths = selectedCustomer.tenure;
    const baseRevenue = selectedCustomer.monthlyRevenue;
    
    // Create up to 10 historical orders based on tenure
    const orderCount = Math.min(10, tenureMonths);
    for (let i = 0; i < orderCount; i++) {
      const purchaseDate = new Date();
      purchaseDate.setMonth(purchaseDate.getMonth() - i);
      
      const orderId = `ORD-${92000 - i * 15}`;
      const amount = Math.round((baseRevenue + (Math.random() * 20 - 10)) * 100) / 100;
      const status = 'Paid';
      
      txs.push({
        id: orderId,
        date: purchaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        amount,
        status,
        plan: selectedCustomer.subscriptionPlan
      });
    }
    return txs;
  }, [selectedCustomer]);

  // Generate marketing campaign logs
  const simulatedCampaigns = useMemo(() => {
    if (!selectedCustomer) return [];
    return [
      { name: 'Q3 Enterprise Product Launch', date: '3 days ago', status: selectedCustomer.campaignResponse, channel: 'Email' },
      { name: 'Security Add-on Bundle Promo', date: '3 weeks ago', status: selectedCustomer.campaignResponse === 'Unsubscribed' ? 'Unsubscribed' : 'Ignored', channel: 'Email' },
      { name: 'Annual Feedback Survey Invite', date: '2 months ago', status: selectedCustomer.csat >= 4 ? 'Responded' : 'Ignored', channel: 'In-app' },
      { name: 'Self-Service Integration Feature Spotlight', date: '3 months ago', status: 'Ignored', channel: 'Email' }
    ];
  }, [selectedCustomer]);

  // AI-Driven Next Best Action Calculation
  const nextBestAction = useMemo(() => {
    if (!selectedCustomer) return null;
    const p = selectedCustomer.predictedChurnProb;
    const tickets = selectedCustomer.supportTickets;
    const csat = selectedCustomer.csat;
    const plan = selectedCustomer.subscriptionPlan;

    if (p > 0.7) {
      if (tickets > 4) {
        return {
          title: 'Escalate to Engineering L2 & Customer Success VP',
          desc: 'High ticket count and elevated churn risk. Schedule an emergency service recovery call within 24 hours. Offer 1 month free tier credit.',
          type: 'danger'
        };
      }
      return {
        title: 'Launch CS Retention Playbook',
        desc: 'Risk probability is high. Deliver a tailored renewal discount (15% off) and schedule a success review to address onboarding hurdles.',
        type: 'warning'
      };
    }
    
    if (csat <= 2) {
      return {
        title: 'Conduct CSAT Recovery Outreach',
        desc: 'Customer expressed dissatisfaction. A dedicated Customer Success Manager should call to gather feedback and log product team requests.',
        type: 'warning'
      };
    }

    if (plan !== 'Enterprise' && selectedCustomer.clv > 2000) {
      return {
        title: 'Cross-Sell Upsell Recommendation',
        desc: 'Customer has high health score and stable tenure. Pitch the Enterprise plan add-on (Security Suite + Premium Integration SLA).',
        type: 'success'
      };
    }

    return {
      title: 'Maintain Standard Nurture Track',
      desc: 'Account is healthy. Keep automated QBR schedules and include in upcoming product beta test pools.',
      type: 'info'
    };
  }, [selectedCustomer]);

  // AI Explanation Insights
  const recentAIInsights = useMemo(() => {
    if (!selectedCustomer) return [];
    const p = selectedCustomer.predictedChurnProb;
    const tickets = selectedCustomer.supportTickets;
    const csat = selectedCustomer.csat;
    const plan = selectedCustomer.subscriptionPlan;

    const insights = [];

    if (p > 0.5) {
      insights.push({
        id: 'i1',
        title: 'High Churn Probability Alert',
        desc: `AI Model identified a ${(p * 100).toFixed(0)}% likelihood of churn. Key contributors: ${tickets > 3 ? 'Elevated support activity' : 'Short subscription tenure'} combined with a rating of ${csat}/5 stars.`
      });
    }

    if (selectedCustomer.productsPurchased.includes('Product X')) {
      insights.push({
        id: 'i2',
        title: 'Product X Synergy Detected',
        desc: 'User owns Product X. Historic cohorts show 2.3x higher customer lifetime value (CLV) and a 94% lower baseline churn probability.'
      });
    }

    if (selectedCustomer.region === 'South India' && plan === 'Premium') {
      insights.push({
        id: 'i3',
        title: 'Regional Congestion Impact',
        desc: 'Premium accounts in South India are currently experiencing elevated latency on cloud nodes. This matches the uptick in churn probability.'
      });
    }

    // Default insight
    insights.push({
      id: 'i4',
      title: 'Subscription Tenure Stability',
      desc: `Customer has been subscribed for ${selectedCustomer.tenure} months. Tenure provides a stabilizing weight of -0.15 on baseline churn coefficients.`
    });

    return insights;
  }, [selectedCustomer]);

  // Render Selection Dashboard if no customer selected
  if (!selectedCustomer) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Banner Card */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--primary-light) 100%)',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '65%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>
              <Sparkles size={16} />
              <span>AI-Powered 360 Profile Hub</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
              Explore In-Depth Customer Intelligence
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '4px 0 0 0' }}>
              Select a customer below or search the full database of 50,000 users to analyze contract values, CSAT trends, support ticket timelines, marketing engagement logs, and predictive risk indicators.
            </p>
          </div>
          
          <div ref={searchContainerRef} style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by ID (e.g. CUST-00042) or name..."
              value={searchQuery}
              onFocus={() => setIsSearchOpen(Boolean(searchQuery.trim()))}
              onChange={(e) => {
                const nextValue = e.target.value;
                setSearchQuery(nextValue);
                setIsSearchOpen(Boolean(nextValue.trim()));
              }}
              className="input-field"
              style={{
                paddingLeft: '44px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            {isSearchOpen && (
              <div 
                className="card animate-fade-in" 
                style={{
                  position: 'absolute',
                  top: '52px',
                  left: 0,
                  width: '100%',
                  zIndex: 20,
                  padding: '8px',
                  boxShadow: 'var(--shadow-xl)',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {filteredSearchList.length > 0 ? (
                  filteredSearchList.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{c.id} • {c.email} • {c.subscriptionPlan} Plan</span>
                    </button>
                  ))
                ) : (
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    No matching customers found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Priority CS Action List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Critical Churn Risk Action List</h3>
            <span className="badge badge-danger">AI Predicted Churn &gt; 75%</span>
          </div>
          
          <div className="grid-container grid-cols-4">
            {highRiskCustomers.map(c => (
              <div 
                key={c.id} 
                className="card"
                onClick={() => setSelectedCustomer(c)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                {/* Score Tag */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'var(--accent-rose-light)',
                  color: 'var(--accent-rose)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {(c.predictedChurnProb * 100).toFixed(0)}% Risk
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 2px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                    {c.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {c.id} • {c.region}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '8px 0', fontSize: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>PLAN</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.subscriptionPlan}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>TICKETS</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>{c.supportTickets}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>CSAT</span>
                    <span style={{ fontWeight: 600, color: c.csat <= 2 ? 'var(--accent-rose)' : 'var(--text-primary)' }}>{c.csat}/5</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>CLV VALUE</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '13px' }}>${c.clv.toLocaleString()}</span>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render detailed 360-degree view if a customer is selected
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={() => setSelectedCustomer(null)}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Current Scope:</span>
          <span className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}>
            {selectedCustomer.id}
          </span>
        </div>
      </div>

      {/* Main Profile Grid Layout */}
      <div className="grid-container grid-cols-12" style={{ alignItems: 'start' }}>
        
        {/* Left Column: Demographic & AI Risk Indicator */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '28px',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '16px'
            }}>
              {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px', textAlign: 'center' }}>
              {selectedCustomer.name}
            </h3>
            
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} />
              {selectedCustomer.email}
            </span>

            {/* Plan and Status badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <span className={`badge ${
                selectedCustomer.subscriptionPlan === 'Enterprise' ? 'badge-info' :
                selectedCustomer.subscriptionPlan === 'Premium' ? 'badge-warning' : 'badge-neutral'
              }`}>
                {selectedCustomer.subscriptionPlan} Tier
              </span>

              {selectedCustomer.clv > 4000 ? (
                <span className="badge badge-success" style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }}>
                  <Star size={10} fill="#d97706" style={{ marginRight: '2px' }} /> VIP Account
                </span>
              ) : selectedCustomer.predictedChurnProb > 0.5 ? (
                <span className="badge badge-danger">High Risk</span>
              ) : (
                <span className="badge badge-success">Healthy</span>
              )}
            </div>

            {/* Detailed properties */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Region</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCustomer.region}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Tenure</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCustomer.tenure} Months</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Smartphone size={14} /> Device Class</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCustomer.device}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14} /> Payment</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCustomer.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ShoppingBag size={14} /> Sales Channel</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCustomer.salesChannel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Last Purchase</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCustomer.lastPurchaseDaysAgo} days ago</span>
              </div>
            </div>
          </div>

          {/* AI Churn Predictor Box */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                AI Model Prediction
              </span>
              <span className={`badge ${selectedCustomer.predictedChurnProb > 0.5 ? 'badge-danger' : 'badge-success'}`}>
                {(selectedCustomer.predictedChurnProb * 100).toFixed(0)}% Churn Risk
              </span>
            </div>

            {/* Risk Gauge Bar */}
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${(selectedCustomer.predictedChurnProb * 100).toFixed(0)}%`, 
                height: '100%', 
                background: selectedCustomer.predictedChurnProb > 0.7 ? 'var(--accent-rose)' :
                            selectedCustomer.predictedChurnProb > 0.4 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {/* Next Best Action Banner */}
            {nextBestAction && (
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: nextBestAction.type === 'danger' ? 'var(--accent-rose-light)' :
                                 nextBestAction.type === 'warning' ? 'var(--accent-amber-light)' :
                                 nextBestAction.type === 'success' ? 'var(--accent-emerald-light)' : 'var(--primary-light)',
                borderLeft: `4px solid ${
                  nextBestAction.type === 'danger' ? 'var(--accent-rose)' :
                  nextBestAction.type === 'warning' ? 'var(--accent-amber)' :
                  nextBestAction.type === 'success' ? 'var(--accent-emerald)' : 'var(--primary)'
                }`
              }}>
                <span style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  color: nextBestAction.type === 'danger' ? 'var(--accent-rose)' :
                         nextBestAction.type === 'warning' ? 'var(--accent-amber)' :
                         nextBestAction.type === 'success' ? 'var(--accent-emerald)' : 'var(--primary)',
                  marginBottom: '2px' 
                }}>
                  Next Best Action: {nextBestAction.title}
                </span>
                <p style={{ fontSize: '11px', margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {nextBestAction.desc}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Historical analytics tabbed panel & AI Insights */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Value Cards Row */}
          <div className="grid-container grid-cols-3">
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)' }}>
                <DollarSign size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>CUSTOMER LIFETIME VALUE</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>${selectedCustomer.clv.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
                <Clock size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>MONTHLY CONTRACT VALUE</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>${selectedCustomer.monthlyRevenue}/mo</span>
              </div>
            </div>
            
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: selectedCustomer.csat >= 4 ? 'var(--accent-emerald-light)' : 'var(--accent-rose-light)', color: selectedCustomer.csat >= 4 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                <Star size={18} fill={selectedCustomer.csat >= 4 ? 'var(--accent-emerald)' : 'transparent'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>CUSTOMER SATISFACTION</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCustomer.csat}/5 CSAT</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '16px', paddingBottom: '2px' }}>
            <button
              onClick={() => setActiveSubTab('overview')}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: 600,
                color: activeSubTab === 'overview' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeSubTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Overview & Products
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: 600,
                color: activeSubTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeSubTab === 'orders' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Order Timeline ({simulatedTransactions.length})
            </button>
            <button
              onClick={() => setActiveSubTab('support')}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: 600,
                color: activeSubTab === 'support' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeSubTab === 'support' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Support Tickets ({simulatedTickets.length})
            </button>
            <button
              onClick={() => setActiveSubTab('marketing')}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: 600,
                color: activeSubTab === 'marketing' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeSubTab === 'marketing' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Marketing Engagement
            </button>
          </div>

          {/* Sub Tab Contents */}
          <div className="card animate-fade-in" style={{ minHeight: '260px' }}>
            
            {/* OVERVIEW & PRODUCTS */}
            {activeSubTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Active Subscriptions & Products</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedCustomer.productsPurchased.map((p, idx) => (
                      <span key={idx} className="badge badge-info" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={13} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Explainable AI (SHAP Insights)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {recentAIInsights.map(insight => (
                      <div 
                        key={insight.id} 
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: 'var(--radius-sm)', 
                          backgroundColor: 'var(--bg-tertiary)', 
                          display: 'flex', 
                          gap: '10px',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Sparkles size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{insight.title}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{insight.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TIMELINE */}
            {activeSubTab === 'orders' && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Transaction History</h4>
                {simulatedTransactions.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)' }}>
                          <th style={{ padding: '8px' }}>Order ID</th>
                          <th style={{ padding: '8px' }}>Date</th>
                          <th style={{ padding: '8px' }}>Amount</th>
                          <th style={{ padding: '8px' }}>Plan</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulatedTransactions.map(tx => (
                          <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '10px 8px', fontWeight: 600 }}>{tx.id}</td>
                            <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{tx.date}</td>
                            <td style={{ padding: '10px 8px', color: 'var(--accent-emerald)', fontWeight: 600 }}>${tx.amount.toFixed(2)}</td>
                            <td style={{ padding: '10px 8px' }}>{tx.plan}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                              <span className="badge badge-success">{tx.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>No order history recorded.</p>
                )}
              </div>
            )}

            {/* SUPPORT TICKETS */}
            {activeSubTab === 'support' && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Customer Support Log</h4>
                {simulatedTickets.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {simulatedTickets.map(t => (
                      <div 
                        key={t.id} 
                        style={{
                          padding: '12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <MessageSquare size={16} style={{ color: 'var(--text-tertiary)' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.subject}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{t.id} • Opened {t.created}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`badge ${
                            t.priority === 'Critical' || t.priority === 'High' ? 'badge-danger' : 'badge-neutral'
                          }`}>
                            {t.priority} Priority
                          </span>
                          <span className={`badge ${
                            t.status === 'Resolved' || t.status === 'Closed' ? 'badge-success' : 'badge-warning'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px' }}>
                    <CheckCircle size={32} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>No active support requests</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>This account has 0 outstanding tickets.</span>
                  </div>
                )}
              </div>
            )}

            {/* MARKETING ENGAGEMENT */}
            {activeSubTab === 'marketing' && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Marketing Campaign Logs</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {simulatedCampaigns.map((camp, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{camp.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Sent via {camp.channel} • {camp.date}</span>
                      </div>
                      
                      <span className={`badge ${
                        camp.status === 'Responded' ? 'badge-success' :
                        camp.status === 'Unsubscribed' ? 'badge-danger' : 'badge-neutral'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
