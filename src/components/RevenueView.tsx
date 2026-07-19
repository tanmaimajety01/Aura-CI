import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Compass, 
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import type { Customer } from '../data/dataGenerator';

interface RevenueViewProps {
  customers: Customer[];
}

export default function RevenueView({ customers }: RevenueViewProps) {
  
  // 1. Calculate Revenue Metrics
  const stats = useMemo(() => {
    const totalMonthlyRev = customers.reduce((acc, c) => acc + c.monthlyRevenue, 0);
    const arpu = customers.length > 0 ? totalMonthlyRev / customers.length : 0;
    const arr = totalMonthlyRev * 12;

    return { totalMonthlyRev, arpu, arr };
  }, [customers]);

  // Chart A: Monthly Revenue Trend + Forecast (last 6 months + 3 forecast)
  const trendData = [
    { month: 'Feb', Actual: 1120, Forecast: null },
    { month: 'Mar', Actual: 1190, Forecast: null },
    { month: 'Apr', Actual: 1240, Forecast: null },
    { month: 'May', Actual: 1290, Forecast: null },
    { month: 'Jun', Actual: 1380, Forecast: null },
    { month: 'Jul', Actual: 1450, Forecast: 1450 },
    { month: 'Aug (F)', Actual: null, Forecast: 1510 },
    { month: 'Sep (F)', Actual: null, Forecast: 1560 },
    { month: 'Oct (F)', Actual: null, Forecast: 1620 }
  ];

  // Chart B: Waterfall Chart Data (MRR Reconciliation)
  // Float bars represented as [ymin, ymax]
  const waterfallData = [
    { name: 'Start MRR', range: [0, 1200], value: 1200, fill: '#6366f1' },
    { name: 'New Sales', range: [1200, 1340], value: 140, fill: '#10b981' },
    { name: 'Expansions', range: [1340, 1395], value: 55, fill: '#34d399' },
    { name: 'Churn', range: [1365, 1395], value: -30, fill: '#f43f5e' }, // Churn offsets downwards
    { name: 'Contraction', range: [1345, 1365], value: -20, fill: '#f87171' },
    { name: 'End MRR', range: [0, 1345], value: 1345, fill: '#3b82f6' }
  ];

  // Chart C: Revenue by Region
  const regionRevData = useMemo(() => {
    const regMap: Record<string, number> = {};
    customers.forEach(c => {
      regMap[c.region] = (regMap[c.region] || 0) + c.monthlyRevenue;
    });
    return Object.keys(regMap).map(key => ({
      region: key,
      Revenue: Math.round(regMap[key])
    })).sort((a, b) => b.Revenue - a.Revenue);
  }, [customers]);

  // Chart D: Revenue by Product (Radar representation)
  const productRevData = useMemo(() => {
    const prodMap: Record<string, number> = {};
    customers.forEach(c => {
      c.productsPurchased.forEach(p => {
        // Estimate average monthly product value
        let val = 15;
        if (p === 'Product X') val = 45;
        else if (p === 'AI Analytics Pro') val = 30;
        prodMap[p] = (prodMap[p] || 0) + val;
      });
    });
    return Object.keys(prodMap).map(key => ({
      subject: key,
      Revenue: Math.round(prodMap[key]),
      fullMark: 150000
    }));
  }, [customers]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Metrics Row */}
      <div className="grid-container grid-cols-3">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>MONTHLY RECURRING REVENUE (MRR)</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            ${stats.totalMonthlyRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingUp size={12} /> +6.8% MoM growth rate
          </span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>AVERAGE REVENUE PER USER (ARPU)</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-blue)' }}>
            ${stats.arpu.toFixed(2)}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Across all 4 active plans</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>ANNUALIZED RUN-RATE (ARR)</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)' }}>
            ${(stats.arr / 1000000).toFixed(2)}M
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={12} /> Target ARR is $18.0M
          </span>
        </div>
      </div>

      {/* Primary Trend Charts */}
      <div className="grid-container grid-cols-2">
        
        {/* Monthly Trend / Forecast */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> Monthly Revenue Trend & Forecast
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Values in Thousands ($USD)</span>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip 
                  formatter={(value) => [`$${value}k`, '']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <Area type="monotone" dataKey="Actual" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="Forecast" stroke="var(--accent-blue)" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waterfall Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart3 size={16} /> MRR Waterfall Reconciliation (Q2)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Values in Thousands ($USD)</span>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip 
                  formatter={(_value, _name, props) => {
                    const diff = props.payload.value;
                    return [`$${Math.abs(diff)}k`, diff > 0 ? 'Gain' : 'Contraction'];
                  }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <Bar dataKey="range" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional & Product Revenue distributions */}
      <div className="grid-container grid-cols-12">
        
        {/* Revenue by Region Table / Bar (7 cols) */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} /> Regional Revenue Share
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Geographic revenue distribution sorted by performance</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Region</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Active MRR</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>ARR Run-rate</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {regionRevData.map((item, i) => {
                  const contribution = ((item.Revenue / stats.totalMonthlyRev) * 100).toFixed(1);
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{item.region}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 500 }}>${item.Revenue.toLocaleString()}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>${(item.Revenue * 12).toLocaleString()}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <span>{contribution}%</span>
                          <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${contribution}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by Product Radar (5 cols) */}
        <div className="col-span-5 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '320px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> Revenue Distribution by Products
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Radar mapping of product license values</p>
          </div>

          <div style={{ width: '100%', height: '90%', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={productRevData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150000]} tick={{ fontSize: 8 }} />
                <Radar name="MRR Value" dataKey="Revenue" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                <RechartsTooltip 
                  formatter={(value: any) => [value !== undefined ? `$${value.toLocaleString()}` : '0', 'MRR']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
