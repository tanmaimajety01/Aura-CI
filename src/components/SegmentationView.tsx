import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Treemap,
  Cell
} from 'recharts';
import { 
  PieChart as PieIcon, 
  Layers, 
  Info 
} from 'lucide-react';
import type { Customer } from '../data/dataGenerator';

interface SegmentationViewProps {
  customers: Customer[];
}

export default function SegmentationView({ customers }: SegmentationViewProps) {
  
  // Calculate Segment Cards Stats
  const segmentStats = useMemo(() => {
    const segments = {
      vip: { name: 'VIP Customers', filter: (c: Customer) => c.clv >= 4500, count: 0, sumClv: 0, sumRev: 0, churnCount: 0 },
      loyal: { name: 'Loyal Customers', filter: (c: Customer) => c.tenure >= 24 && c.clv < 4500, count: 0, sumClv: 0, sumRev: 0, churnCount: 0 },
      highRisk: { name: 'High Risk', filter: (c: Customer) => c.predictedChurnProb >= 0.7, count: 0, sumClv: 0, sumRev: 0, churnCount: 0 },
      new: { name: 'New Customers', filter: (c: Customer) => c.tenure <= 6 && c.predictedChurnProb < 0.7, count: 0, sumClv: 0, sumRev: 0, churnCount: 0 },
      dormant: { name: 'Dormant', filter: (c: Customer) => c.lastPurchaseDaysAgo >= 180 && c.predictedChurnProb < 0.7, count: 0, sumClv: 0, sumRev: 0, churnCount: 0 },
      priceSensitive: { name: 'Price Sensitive', filter: (c: Customer) => c.subscriptionPlan === 'Basic' && c.predictedChurnProb < 0.7 && c.clv < 4500, count: 0, sumClv: 0, sumRev: 0, churnCount: 0 }
    };

    customers.forEach(c => {
      Object.keys(segments).forEach(key => {
        const seg = segments[key as keyof typeof segments];
        if (seg.filter(c)) {
          seg.count++;
          seg.sumClv += c.clv;
          seg.sumRev += c.monthlyRevenue;
          if (c.churnPredicted === 1) seg.churnCount++;
        }
      });
    });

    return Object.keys(segments).map(key => {
      const seg = segments[key as keyof typeof segments];
      return {
        key,
        name: seg.name,
        count: seg.count,
        avgClv: seg.count > 0 ? seg.sumClv / seg.count : 0,
        avgRev: seg.count > 0 ? seg.sumRev / seg.count : 0,
        churnRate: seg.count > 0 ? (seg.churnCount / seg.count) * 100 : 0
      };
    });
  }, [customers]);

  // Scatter plot data - sample 200 customers to keep chart rendering smooth
  const scatterData = useMemo(() => {
    // Pick 200 random points using deterministic offset
    const step = Math.max(1, Math.floor(customers.length / 200));
    const sample: any[] = [];
    for (let i = 0; i < customers.length; i += step) {
      const c = customers[i];
      sample.push({
        name: c.name,
        tenure: c.tenure,
        clv: Math.round(c.clv),
        monthlyRevenue: Math.round(c.monthlyRevenue),
        churnProb: c.predictedChurnProb
      });
    }
    return sample;
  }, [customers]);

  // Treemap data format
  const treemapData = useMemo(() => {
    return [
      {
        name: 'Segment Volumes',
        children: segmentStats.map(seg => ({
          name: seg.name,
          size: seg.count
        }))
      }
    ];
  }, [segmentStats]);

  // Custom Treemap Content Renderer to make it look premium
  const CustomizedTreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, name } = props;
    
    // Gradient coloring based on segment index
    const segmentColors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#64748b', '#f43f5e'];
    const fill = segmentColors[index % segmentColors.length];

    if (depth !== 1) return null;
    if (width < 30 || height < 30) return null;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill,
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
            rx: 6
          }}
        />
        <text
          x={x + 12}
          y={y + 24}
          fill="#fff"
          fontSize={12}
          fontWeight={600}
        >
          {name}
        </text>
        <text
          x={x + 12}
          y={y + 42}
          fill="#fff"
          fontSize={11}
          opacity={0.8}
        >
          {(props.value ?? props.payload?.size ?? 0).toLocaleString()} accounts
        </text>
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Segment Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {segmentStats.map(seg => (
          <div key={seg.key} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{seg.name}</span>
              <span className={`badge ${seg.churnRate > 30 ? 'badge-danger' : seg.churnRate > 15 ? 'badge-warning' : 'badge-success'}`}>
                {seg.churnRate.toFixed(1)}% Churn
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Volume</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {seg.count.toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Avg. CLV</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${seg.avgClv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>Avg Monthly Revenue:</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                ${seg.avgRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid-container grid-cols-12">
        
        {/* Bubble Scatter Chart (8 cols) */}
        <div className="col-span-8 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> Segment Cluster Matrix (CLV vs Tenure)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Info size={12} /> Bubbles sized by Monthly Revenue
            </span>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" dataKey="tenure" name="Tenure" unit=" mo" tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="clv" name="CLV" unit="$" tick={{ fontSize: 10 }} />
                <ZAxis type="number" dataKey="monthlyRevenue" range={[30, 400]} name="MRR" unit="$" />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                />
                <Scatter name="Customers" data={scatterData} fill="var(--primary)" fillOpacity={0.65}>
                  {scatterData.map((entry, index) => {
                    // Color bubbles red if churn risk > 0.6
                    const color = entry.churnProb > 0.6 ? 'var(--accent-rose)' : 'var(--primary)';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treemap (4 cols) */}
        <div className="col-span-4 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '400px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PieIcon size={16} /> Segment Share Treemap
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Relative volume sizes across customer classifications</p>
          </div>

          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="var(--primary)"
                content={<CustomizedTreemapContent />}
              />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
