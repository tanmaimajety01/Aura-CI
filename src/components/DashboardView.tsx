import { useState, useMemo } from 'react';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import type { Customer } from '../data/dataGenerator';
import MetricCard from './MetricCard';
import DataTable from './DataTable';

interface DashboardViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  searchTerm: string;
  dateRange: string;
  regionFilter: string;
  segmentFilter: string;
  channelFilter: string;
}

interface AIInsightItem {
  id: string;
  title: string;
  text: string;
  confidence: number;
  why: string;
  actions: string[];
}

export default function DashboardView({
  customers,
  onSelectCustomer,
  searchTerm,
  dateRange,
  regionFilter,
  segmentFilter,
  channelFilter
}: DashboardViewProps) {
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  // AI Insights data
  const aiInsights: AIInsightItem[] = [
    {
      id: 'insight1',
      title: 'Premium Tier Churn Spike',
      text: 'Customer churn increased by 12% among Premium users in the West region.',
      confidence: 94,
      why: 'Analysis reveals a combination of regional routing outages during peak business hours and competitors launching a targeted promotion offering free migration support.',
      actions: [
        'Dispatch immediate outreach to West-region Premium accounts with custom service recovery credits.',
        'Partner with engineering to deploy server redundancy in the regional node.',
        'Brief sales teams on competitive defense talking points regarding migration speed.'
      ]
    },
    {
      id: 'insight2',
      title: 'Support Overhead Corelation',
      text: 'Customers with more than 4 support tickets have a 76% probability of churn.',
      confidence: 88,
      why: 'CSAT analysis shows that support latency peaks around the 4th ticket. The primary issue is repeat tickets for integration issues that remain unresolved.',
      actions: [
        'Create a trigger that auto-escalates any account reaching 3 tickets to the L2 engineering queue.',
        'Develop self-service integration sandboxes for basic API set up.',
        'Introduce a CSAT-triggered call sequence within 24 hours of ticket resolution.'
      ]
    },
    {
      id: 'insight3',
      title: 'Product X Adoption Value',
      text: 'Customers using Product X generate 2.3× higher lifetime value.',
      confidence: 91,
      why: 'Product X is our core integration hub. Once enabled, client systems are highly coupled, which drives a 94% retention rate and increases the likelihood of cross-purchasing storage.',
      actions: [
        'Deliver in-app recommendations promoting Product X to active standard subscribers.',
        'Incentivize customer success managers with performance bonuses based on Product X adoption rates.',
        'Offer a 30-day trial of Product X with pre-loaded dummy data.'
      ]
    }
  ];

  // 1. Filter customers by global header filters
  const globallyFilteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search Term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchId = c.id.toLowerCase().includes(search);
        const matchName = c.name.toLowerCase().includes(search);
        const matchEmail = c.email.toLowerCase().includes(search);
        if (!matchId && !matchName && !matchEmail) return false;
      }
      
      // Date Range (Simulated via lastPurchaseDaysAgo)
      if (dateRange !== 'all') {
        const days = parseInt(dateRange, 10);
        if (c.lastPurchaseDaysAgo > days) return false;
      }

      // Region Filter
      if (regionFilter !== 'all' && c.region !== regionFilter) return false;

      // Segment Filter
      if (segmentFilter !== 'all') {
        if (segmentFilter === 'VIP' && c.clv < 5000) return false;
        if (segmentFilter === 'Loyal' && c.tenure < 24) return false;
        if (segmentFilter === 'High Risk' && c.predictedChurnProb < 0.7) return false;
        if (segmentFilter === 'New' && c.tenure > 6) return false;
        if (segmentFilter === 'Dormant' && c.lastPurchaseDaysAgo < 180) return false;
        if (segmentFilter === 'Price Sensitive' && c.subscriptionPlan !== 'Basic') return false;
      }

      // Channel Filter
      if (channelFilter !== 'all' && c.salesChannel !== channelFilter) return false;

      return true;
    });
  }, [customers, searchTerm, dateRange, regionFilter, segmentFilter, channelFilter]);

  // 2. Further filter by KPI Card selection
  const filteredCustomers = useMemo(() => {
    if (!activeKpiFilter) return globallyFilteredCustomers;

    switch (activeKpiFilter) {
      case 'totalCustomers':
        return globallyFilteredCustomers;
      case 'activeCustomers':
        return globallyFilteredCustomers.filter(c => c.churnPredicted === 0);
      case 'churnRisk':
        return globallyFilteredCustomers.filter(c => c.churnPredicted === 1);
      case 'avgClv':
        return globallyFilteredCustomers.filter(c => c.clv > 3000); // High CLV
      case 'monthlyRevenue':
        return globallyFilteredCustomers.filter(c => c.subscriptionPlan === 'Enterprise' || c.subscriptionPlan === 'Premium');
      case 'retentionRate':
        return globallyFilteredCustomers.filter(c => c.tenure >= 18); // Retained > 1.5yr
      case 'netRevenueGrowth':
        return globallyFilteredCustomers.filter(c => c.campaignResponse === 'Responded');
      case 'aiConfidence':
        return globallyFilteredCustomers.filter(c => c.predictedChurnProb >= 0.8 || c.predictedChurnProb <= 0.1); // Strong ML certainty
      default:
        return globallyFilteredCustomers;
    }
  }, [globallyFilteredCustomers, activeKpiFilter]);

  // Calculate Metrics based on active filters
  const metrics = useMemo(() => {
    const list = globallyFilteredCustomers; // Metrics represent the global state under header filters
    const total = list.length;
    const active = list.filter(c => c.churnPredicted === 0).length;
    const churnCount = list.filter(c => c.churnPredicted === 1).length;
    const churnPercent = total > 0 ? (churnCount / total) * 100 : 0;
    
    const sumClv = list.reduce((acc, c) => acc + c.clv, 0);
    const avgClv = total > 0 ? sumClv / total : 0;

    const sumRev = list.reduce((acc, c) => acc + c.monthlyRevenue, 0);
    
    // Retention rate
    const retained = list.filter(c => c.tenure >= 12 && c.churnPredicted === 0).length;
    const eligible = list.filter(c => c.tenure >= 12).length;
    const retentionRate = eligible > 0 ? (retained / eligible) * 100 : 88.4;

    return {
      total,
      active,
      churnPercent,
      avgClv,
      monthlyRevenue: sumRev,
      retentionRate,
      growth: 14.8, // Fixed simulated indicator
      aiConfidence: 91.2
    };
  }, [globallyFilteredCustomers]);

  // Sparkline data generator
  const sparklines = {
    total: [48200, 48500, 48900, 49200, 49500, 49800, 50000],
    active: [41500, 41800, 42000, 42400, 42700, 43100, 43640],
    churn: [14.2, 13.8, 13.5, 13.2, 12.9, 12.8, 12.72],
    clv: [2100, 2140, 2180, 2220, 2260, 2300, 2356],
    revenue: [1.2, 1.25, 1.3, 1.32, 1.38, 1.41, 1.45],
    retention: [86.5, 86.9, 87.2, 87.5, 87.8, 88.1, 88.4],
    growth: [12.4, 13.1, 13.5, 13.9, 14.2, 14.5, 14.8],
    confidence: [89.5, 89.9, 90.2, 90.5, 90.8, 91.0, 91.2]
  };

  // Chart 1: Churn Probability Distribution (Area Chart)
  const churnDistributionData = useMemo(() => {
    const bins = Array(10).fill(0);
    globallyFilteredCustomers.forEach(c => {
      const idx = Math.min(9, Math.floor(c.predictedChurnProb * 10));
      bins[idx]++;
    });
    return bins.map((count, i) => ({
      range: `${i*10}-${(i+1)*10}%`,
      count
    }));
  }, [globallyFilteredCustomers]);

  // Chart 2: Revenue By subscriptionPlan
  const revenueByPlanData = useMemo(() => {
    const plans: Record<string, number> = { Basic: 0, Pro: 0, Premium: 0, Enterprise: 0 };
    globallyFilteredCustomers.forEach(c => {
      plans[c.subscriptionPlan] += c.monthlyRevenue;
    });
    return Object.keys(plans).map(plan => ({
      name: plan,
      revenue: Math.round(plans[plan])
    }));
  }, [globallyFilteredCustomers]);

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

  const toggleInsight = (id: string) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 8 Interactive KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <MetricCard
          id="totalCustomers"
          title="Total Customers"
          value={metrics.total.toLocaleString()}
          change="+3.6%"
          trend="up"
          sparklineData={sparklines.total}
          sparklineColor="var(--primary)"
          isSelected={activeKpiFilter === 'totalCustomers'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'totalCustomers' ? null : 'totalCustomers')}
        />
        <MetricCard
          id="activeCustomers"
          title="Active Customers"
          value={metrics.active.toLocaleString()}
          change="+4.8%"
          trend="up"
          sparklineData={sparklines.active}
          sparklineColor="var(--accent-blue)"
          isSelected={activeKpiFilter === 'activeCustomers'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'activeCustomers' ? null : 'activeCustomers')}
        />
        <MetricCard
          id="churnRisk"
          title="Churn Risk"
          value={`${metrics.churnPercent.toFixed(1)}%`}
          change="-1.2%"
          trend="down" // positive since churn risk is dropping
          sparklineData={sparklines.churn}
          sparklineColor="var(--accent-rose)"
          isSelected={activeKpiFilter === 'churnRisk'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'churnRisk' ? null : 'churnRisk')}
        />
        <MetricCard
          id="avgClv"
          title="Average CLV"
          value={`$${metrics.avgClv.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change="+5.2%"
          trend="up"
          sparklineData={sparklines.clv}
          sparklineColor="var(--accent-emerald)"
          isSelected={activeKpiFilter === 'avgClv'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'avgClv' ? null : 'avgClv')}
        />
        <MetricCard
          id="monthlyRevenue"
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change="+6.8%"
          trend="up"
          sparklineData={sparklines.revenue}
          sparklineColor="var(--accent-amber)"
          isSelected={activeKpiFilter === 'monthlyRevenue'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'monthlyRevenue' ? null : 'monthlyRevenue')}
        />
        <MetricCard
          id="retentionRate"
          title="Retention Rate"
          value={`${metrics.retentionRate.toFixed(1)}%`}
          change="+0.8%"
          trend="up"
          sparklineData={sparklines.retention}
          sparklineColor="var(--accent-emerald)"
          isSelected={activeKpiFilter === 'retentionRate'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'retentionRate' ? null : 'retentionRate')}
        />
        <MetricCard
          id="netRevenueGrowth"
          title="Net Revenue Growth"
          value={`${metrics.growth.toFixed(1)}%`}
          change="+2.1%"
          trend="up"
          sparklineData={sparklines.growth}
          sparklineColor="var(--accent-blue)"
          isSelected={activeKpiFilter === 'netRevenueGrowth'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'netRevenueGrowth' ? null : 'netRevenueGrowth')}
        />
        <MetricCard
          id="aiConfidence"
          title="AI Confidence"
          value={`${metrics.aiConfidence.toFixed(1)}%`}
          change="+0.5%"
          trend="up"
          sparklineData={sparklines.confidence}
          sparklineColor="var(--primary)"
          isSelected={activeKpiFilter === 'aiConfidence'}
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'aiConfidence' ? null : 'aiConfidence')}
        />
      </div>

      {/* Main Analytical Section: Charts & AI Insights Panel */}
      <div className="grid-container grid-cols-12">
        
        {/* Left Side: Dynamic Charts (8 cols) */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="grid-container grid-cols-2">
            
            {/* Chart A: Churn Risk distribution */}             <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '340px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Churn Risk Distribution</span>
                <span title="Number of customers per 10% probability increment">
                  <Info size={14} style={{ color: 'var(--text-tertiary)' }} />
                </span>
              </div>
              <div style={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={churnDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} 
                      labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="var(--accent-rose)" fill="var(--accent-rose-light)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: Monthly Revenue by Plan */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '340px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Monthly Revenue by Plan</span>
                <span title="Cumulative monthly recurring revenue per tier">
                  <Info size={14} style={{ color: 'var(--text-tertiary)' }} />
                </span>
              </div>
              <div style={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={revenueByPlanData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip 
                      formatter={(value: any) => [`$${value !== undefined ? value.toLocaleString() : '0'}`, 'Revenue']}
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {revenueByPlanData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Insights Panel (4 cols) */}
        <div className="col-span-4 card card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid var(--primary)', maxHeight: '340px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                AI Copilot Insights
              </h3>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Real-time generative analytics</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aiInsights.map((insight) => {
              const isExpanded = expandedInsight === insight.id;
              return (
                <div 
                  key={insight.id}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => toggleInsight(insight.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span>{insight.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        Conf {insight.confidence}%
                      </span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                    {insight.text}
                  </p>

                  {isExpanded && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Lightbulb size={11} /> Why did this happen?
                        </span>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                          {insight.why}
                        </p>
                      </div>

                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={11} /> Recommended Action
                        </span>
                        <ul style={{ paddingLeft: '14px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {insight.actions.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer List section using the standard DataTable */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
              Active Customer Ledger
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {activeKpiFilter ? `Filtered by ${activeKpiFilter} card` : 'Showing full customer directory'}
            </p>
          </div>
          {activeKpiFilter && (
            <button 
              onClick={() => setActiveKpiFilter(null)}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
            >
              Clear KPI Filter
            </button>
          )}
        </div>
        <DataTable 
          data={filteredCustomers}
          onRowClick={onSelectCustomer}
        />
      </div>
    </div>
  );
}
