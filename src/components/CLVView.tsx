import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';
import { 
  Gem, 
  TrendingUp, 
  ArrowUpRight, 
  Info,
  Calendar,
  Table
} from 'lucide-react';
import type { Customer } from '../data/dataGenerator';

interface CLVViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export default function CLVView({ customers, onSelectCustomer }: CLVViewProps) {
  
  // 1. Calculate CLV metrics
  const stats = useMemo(() => {
    const sorted = [...customers].sort((a, b) => b.clv - a.clv);
    const top10 = sorted.slice(0, 10);
    
    // Calculate bins
    const bins = [
      { range: '$0 - 1k', count: 0 },
      { range: '$1k - 2k', count: 0 },
      { range: '$2k - 3k', count: 0 },
      { range: '$3k - 5k', count: 0 },
      { range: '$5k - 10k', count: 0 },
      { range: '$10k+', count: 0 }
    ];

    customers.forEach(c => {
      if (c.clv < 1000) bins[0].count++;
      else if (c.clv < 2000) bins[1].count++;
      else if (c.clv < 3000) bins[2].count++;
      else if (c.clv < 5000) bins[3].count++;
      else if (c.clv < 10000) bins[4].count++;
      else bins[5].count++;
    });

    const averageClv = customers.reduce((acc, c) => acc + c.clv, 0) / customers.length;
    const projectedClvTotal = customers.reduce((acc, c) => acc + (c.monthlyRevenue * 12), 0) + sumClv(customers);

    function sumClv(list: Customer[]) {
      return list.reduce((acc, c) => acc + c.clv, 0);
    }

    return { top10, bins, averageClv, projectedClvTotal };
  }, [customers]);

  // CLV Forecast over 12 months
  const forecastData = useMemo(() => {
    const baseRev = customers.reduce((acc, c) => acc + c.monthlyRevenue, 0);
    const data = [];
    let cumulative = customers.reduce((acc, c) => acc + c.clv, 0);

    for (let month = 1; month <= 12; month++) {
      // Simulate 1.2% compounded monthly expansion and 0.5% churn impact
      const monthlyAdd = baseRev * Math.pow(1.012, month) * 0.995;
      cumulative += monthlyAdd;
      data.push({
        name: `Month ${month}`,
        Projected: Math.round(cumulative / 100000) / 10, // In Millions
        Baseline: Math.round((cumulative - (monthlyAdd * 0.05 * month)) / 100000) / 10
      });
    }
    return data;
  }, [customers]);

  // Heatmap: Plan (Rows) vs Region (Cols) CLV Averages
  const heatmapData = useMemo(() => {
    const plans = ['Basic', 'Pro', 'Premium', 'Enterprise'] as const;
    const regions = ['North India', 'South India', 'East India', 'West India', 'North America', 'Europe', 'Asia Pacific'] as const;
    
    const matrix: Record<string, Record<string, { sum: number, count: number }>> = {};

    plans.forEach(p => {
      matrix[p] = {};
      regions.forEach(r => {
        matrix[p][r] = { sum: 0, count: 0 };
      });
    });

    customers.forEach(c => {
      if (matrix[c.subscriptionPlan] && matrix[c.subscriptionPlan][c.region]) {
        matrix[c.subscriptionPlan][c.region].sum += c.clv;
        matrix[c.subscriptionPlan][c.region].count++;
      }
    });

    return plans.map(plan => {
      return {
        plan,
        regions: regions.map(reg => {
          const cell = matrix[plan][reg];
          const avg = cell.count > 0 ? cell.sum / cell.count : 0;
          return {
            region: reg,
            avg: Math.round(avg),
            count: cell.count
          };
        })
      };
    });
  }, [customers]);

  // Helper to color heatmap cells
  const getHeatmapColor = (val: number) => {
    // Max average is around $12,000 for enterprise, min is $200 for basic
    if (val > 10000) return 'rgba(79, 70, 229, 0.85)'; // Indigo dark
    if (val > 5000) return 'rgba(99, 102, 241, 0.65)';  // Indigo med
    if (val > 2500) return 'rgba(59, 130, 246, 0.5)';   // Blue
    if (val > 1000) return 'rgba(14, 165, 233, 0.3)';   // Light Blue
    if (val > 500) return 'rgba(16, 185, 129, 0.2)';    // Light Emerald
    return 'rgba(241, 245, 249, 0.8)';                  // Cool Gray
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Top Metrics Cards */}
      <div className="grid-container grid-cols-3">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>AVERAGE CLV PER ACCOUNT</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            ${stats.averageClv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingUp size={12} /> +4.2% expansion vs Q1
          </span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>12-MONTH PROJECTED VALUE</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-blue)' }}>
            ${(stats.projectedClvTotal / 1000000).toFixed(2)}M
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Includes contract expansions</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>LTV-TO-CAC RATIO</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)' }}>
            4.2x
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={12} /> Exceeds SaaS benchmark (3.0x)
          </span>
        </div>
      </div>

      {/* Distribution & Forecast */}
      <div className="grid-container grid-cols-2">
        
        {/* Histogram Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gem size={16} /> CLV Distribution Histogram
            </h3>
            <span title="Account distribution across LTV ranges">
              <Info size={14} style={{ color: 'var(--text-tertiary)' }} />
            </span>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bins} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip 
                  formatter={(value: any) => [value !== undefined ? value.toLocaleString() : '', 'Accounts']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> Cumulative LTV Forecast (12 Months)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Values in Millions ($USD)</span>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip 
                  formatter={(value) => [`$${value}M`, '']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Projected" name="Optimistic (Expansion)" stroke="var(--accent-emerald)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Baseline" name="Baseline (Current Run)" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap & Top Customers */}
      <div className="grid-container grid-cols-12">
        
        {/* Heatmap Plan vs Region (7 cols) */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'auto' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>CLV Heatmap Matrix</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Average CLV ($USD) cross-referenced by Plan Tier and Region</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Plan</th>
                <th style={{ padding: '8px' }}>N. India</th>
                <th style={{ padding: '8px' }}>S. India</th>
                <th style={{ padding: '8px' }}>E. India</th>
                <th style={{ padding: '8px' }}>W. India</th>
                <th style={{ padding: '8px' }}>N. America</th>
                <th style={{ padding: '8px' }}>Europe</th>
                <th style={{ padding: '8px' }}>APAC</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'left', color: 'var(--text-primary)' }}>{row.plan}</td>
                  {row.regions.map((cell, j) => (
                    <td 
                      key={j} 
                      style={{
                        padding: '12px 4px',
                        backgroundColor: getHeatmapColor(cell.avg),
                        color: cell.avg > 4000 ? '#fff' : 'var(--text-primary)',
                        fontWeight: cell.avg > 2500 ? 600 : 400,
                        borderRadius: '4px',
                        transition: 'transform 0.15s ease'
                      }}
                      title={`${cell.count} accounts`}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      ${cell.avg.toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top 10 Customers table (5 cols) */}
        <div className="col-span-5 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Table size={16} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Top High-Value VIP Accounts</h3>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                  <th style={{ padding: '6px 8px' }}>ID</th>
                  <th style={{ padding: '6px 8px' }}>Name</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>CLV</th>
                </tr>
              </thead>
              <tbody>
                {stats.top10.map(c => (
                  <tr 
                    key={c.id}
                    onClick={() => onSelectCustomer(c)}
                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '8px', fontWeight: 600, color: 'var(--primary)' }}>{c.id}</td>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>${c.clv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
