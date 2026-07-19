import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  BarChart2,
  GitFork
} from 'lucide-react';
import type { Customer } from '../data/dataGenerator';

interface MarketingViewProps {
  customers: Customer[];
}

export default function MarketingView({ customers }: MarketingViewProps) {
  
  // 1. Calculate Marketing Stats
  const stats = useMemo(() => {
    // Total responding to campaigns
    const respondedCount = customers.filter(c => c.campaignResponse === 'Responded').length;
    const conversionRate = customers.length > 0 ? (respondedCount / customers.length) * 100 : 4.2;
    
    // Simulating values based on customer demographics
    const totalSpend = 420000;
    const cac = totalSpend / customers.length; // Simple simulated calculation
    const roi = 310; // 310%

    return { respondedCount, conversionRate, totalSpend, cac, roi };
  }, [customers]);

  // Campaign table data
  const campaignData = [
    { name: 'Google Ads Search', spend: 120000, clicks: 84000, CTR: '2.4%', conversions: 3520, CAC: 34, ROI: '280%' },
    { name: 'LinkedIn Account Based', spend: 150000, clicks: 38000, CTR: '1.2%', conversions: 2150, CAC: 70, ROI: '340%' },
    { name: 'Email Re-engagement Q2', spend: 30000, clicks: 120000, CTR: '18.5%', conversions: 4620, CAC: 6.5, ROI: '620%' },
    { name: 'Partner Co-Marketing', spend: 80000, clicks: 22000, CTR: '3.1%', conversions: 1180, CAC: 67, ROI: '180%' },
    { name: 'Newsletter Referral', spend: 40000, clicks: 45000, CTR: '4.2%', conversions: 1890, CAC: 21, ROI: '410%' }
  ];

  // Funnel representation data
  const funnelData = [
    { stage: 'Awareness', count: 500000, percentage: 100, fill: '#6366f1' },
    { stage: 'Consideration', count: 180000, percentage: 36, fill: '#3b82f6' },
    { stage: 'Acquisition', count: 50000, percentage: 10, fill: '#10b981' },
    { stage: 'Retention', count: 43640, percentage: 8.7, fill: '#34d399' }
  ];

  // Trend lines data
  const trendData = [
    { month: 'Jan', CTR: 2.1, Conversion: 3.4 },
    { month: 'Feb', CTR: 2.4, Conversion: 3.6 },
    { month: 'Mar', CTR: 2.5, Conversion: 3.8 },
    { month: 'Apr', CTR: 2.8, Conversion: 4.1 },
    { month: 'May', CTR: 3.0, Conversion: 4.3 },
    { month: 'Jun', CTR: 3.2, Conversion: 4.5 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Marketing KPIs */}
      <div className="grid-container grid-cols-4">
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>CUSTOMER ACQUISITION COST</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-rose)' }}>
            ${stats.cac.toFixed(2)}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingUp size={12} /> Decreased 4.8% MoM
          </span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>MARKETING ROI</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)' }}>
            {stats.roi}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingUp size={12} /> LTV expansion yields higher return
          </span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>CONVERSION RATE</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            {stats.conversionRate.toFixed(1)}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Across all campaign responses</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>TOTAL MARKETING SPEND</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            ${stats.totalSpend.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Q2 Campaign budget allocation</span>
        </div>
      </div>

      {/* Funnel & Trend charts */}
      <div className="grid-container grid-cols-12">
        
        {/* Conversion Funnel (5 cols) */}
        <div className="col-span-5 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitFork size={16} /> Acquisition Funnel
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Conversion counts from impression to active retention</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {funnelData.map((stage, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '100px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {stage.stage}
                </div>
                
                {/* Funnel Block */}
                <div style={{ 
                  flexGrow: 1, 
                  position: 'relative', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: stage.fill,
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                  width: `${stage.percentage}%`,
                  minWidth: '110px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'width 0.5s ease'
                }}>
                  <span>{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Trend Line (7 cols) */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={16} /> Campaign Engagement trends
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Performance metrics (percent)</span>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="CTR" name="Avg CTR" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Conversion" name="Avg Conversion" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart2 size={16} /> Campaign Breakdown Ledger
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                <th style={{ padding: '12px 8px' }}>Campaign</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Spend</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Clicks</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>CTR</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Conversions</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>CAC</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>ROI</th>
              </tr>
            </thead>
            <tbody>
              {campaignData.map((camp, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>{camp.name}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>${camp.spend.toLocaleString()}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>{camp.clicks.toLocaleString()}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--accent-blue)', fontWeight: 500 }}>{camp.CTR}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 500 }}>{camp.conversions.toLocaleString()}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>${camp.CAC}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--accent-emerald)', fontWeight: 600 }}>{camp.ROI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
