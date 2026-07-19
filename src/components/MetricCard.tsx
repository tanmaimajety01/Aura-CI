import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  sparklineData: number[];
  sparklineColor: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function MetricCard({
  id,
  title,
  value,
  change,
  trend,
  sparklineData,
  sparklineColor,
  isSelected,
  onClick
}: MetricCardProps) {
  
  // Custom SVG Sparkline generation
  const width = 110;
  const height = 30;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min === 0 ? 1 : max - min;
  const points = sparklineData
    .map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2; // Keep padding
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div 
      onClick={onClick}
      className={`card ${isSelected ? 'selected-card' : ''}`}
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
        boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transform: isSelected ? 'translateY(-2px)' : 'none'
      }}
    >
      {/* Top Section: Title & Trend indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em'
        }}>
          {title}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px 6px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: 600,
          backgroundColor: trend === 'up' 
            ? (id === 'churnRisk' ? 'var(--accent-rose-light)' : 'var(--accent-emerald-light)') 
            : (id === 'churnRisk' ? 'var(--accent-emerald-light)' : 'var(--accent-rose-light)'),
          color: trend === 'up' 
            ? (id === 'churnRisk' ? 'var(--accent-rose)' : 'var(--accent-emerald)') 
            : (id === 'churnRisk' ? 'var(--accent-emerald)' : 'var(--accent-rose)')
        }}>
          {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span>{change}</span>
        </div>
      </div>

      {/* Middle Section: Big Value */}
      <div style={{
        fontSize: '24px',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        color: 'var(--text-primary)',
        lineHeight: 1.1
      }}>
        {value}
      </div>

      {/* Bottom Section: Sparkline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          {isSelected ? 'Filter active' : 'vs last period'}
        </span>
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          {/* Subtle gradient fill below sparkline */}
          <defs>
            <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
            fill={`url(#grad-${id})`}
          />
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      {/* Small Indicator dot if filter is active */}
      {isSelected && (
        <span style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)'
        }} />
      )}
    </div>
  );
}
