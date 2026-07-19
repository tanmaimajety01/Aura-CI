import { useEffect, useRef, useState } from 'react';
import { Search, Download, Bell, Filter, Calendar, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  regionFilter: string;
  setRegionFilter: (val: string) => void;
  segmentFilter: string;
  setSegmentFilter: (val: string) => void;
  channelFilter: string;
  setChannelFilter: (val: string) => void;
  onExport: () => void;
  activeTabLabel: string;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  regionFilter,
  setRegionFilter,
  segmentFilter,
  setSegmentFilter,
  channelFilter,
  setChannelFilter,
  onExport,
  activeTabLabel
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showNotifications) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotifications]);

  const notifications = [
    {
      id: 1,
      title: 'High Churn Alert',
      desc: 'Churn risk spike detected in Premium plan users (West India).',
      time: '10m ago',
      unread: true
    },
    {
      id: 2,
      title: 'CLV Opportunity',
      desc: '32 users upgraded to Enterprise tier. Predicted CLV increased by $240k.',
      time: '1h ago',
      unread: true
    },
    {
      id: 3,
      title: 'Campaign Attribution Spark',
      desc: 'Q3 Email Campaign conversion rate outperformed benchmarks by 18%.',
      time: '4h ago',
      unread: false
    }
  ];

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Title / Context section */}
      <div className="header-title-block" style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
          {activeTabLabel}
        </h1>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          Aura AI Enterprise Platform
        </span>
      </div>

      {/* Global Actions Panel */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1, justifyContent: 'flex-end', maxWidth: '85%' }}>
        {/* Search */}
        <div className="header-search" style={{ position: 'relative', width: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }}
          />
          <input
            type="text"
            placeholder="Global search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '36px',
              height: '38px',
              fontSize: '13px',
              borderRadius: 'var(--radius-sm)'
            }}
          />
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
          <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
            style={{
              height: '38px',
              padding: '0 28px 0 8px',
              fontSize: '12px',
              borderRadius: 'var(--radius-sm)',
              width: '110px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 180 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        {/* Filters Wrapper */}
        <div className="header-filters" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
          
          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="input-field"
            style={{
              height: '38px',
              padding: '0 28px 0 8px',
              fontSize: '12px',
              borderRadius: 'var(--radius-sm)',
              width: '115px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Regions</option>
            <option value="North India">North India</option>
            <option value="South India">South India</option>
            <option value="East India">East India</option>
            <option value="West India">West India</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
          </select>

          {/* Segment Filter */}
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="input-field"
            style={{
              height: '38px',
              padding: '0 28px 0 8px',
              fontSize: '12px',
              borderRadius: 'var(--radius-sm)',
              width: '115px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Segments</option>
            <option value="VIP">VIP Customers</option>
            <option value="Loyal">Loyal Customers</option>
            <option value="High Risk">High Risk</option>
            <option value="New">New Accounts</option>
            <option value="Dormant">Dormant</option>
            <option value="Price Sensitive">Price Sensitive</option>
          </select>

          {/* Sales Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="input-field"
            style={{
              height: '38px',
              padding: '0 28px 0 8px',
              fontSize: '12px',
              borderRadius: 'var(--radius-sm)',
              width: '115px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Channels</option>
            <option value="Online">Online</option>
            <option value="Direct">Direct</option>
            <option value="Partner">Partner</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="btn btn-secondary"
          style={{
            height: '38px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 14px',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Export filtered customer dataset to CSV"
        >
          <Download size={14} />
          <span>Export</span>
        </button>

        {/* Notification Bell */}
        <div ref={notificationRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
            className="btn-icon"
            style={{
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--accent-rose)',
                borderRadius: '50%'
              }}
            />
          </button>

          {showNotifications && (
            <div
              className="card card-glass animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '300px',
                zIndex: 100,
                padding: '16px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  AI Agent Insights
                </span>
                <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: n.unread ? 'var(--primary-light)' : 'transparent',
                      borderLeft: n.unread ? '3px solid var(--primary)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: n.unread ? 'var(--primary)' : 'var(--text-primary)' }}>{n.title}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
