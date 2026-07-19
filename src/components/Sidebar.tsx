
import { 
  LayoutDashboard, 
  UserCheck, 
  BrainCircuit, 
  PieChart, 
  TrendingDown, 
  Gem, 
  Megaphone, 
  BarChart3, 
  FileSpreadsheet, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  theme,
  toggleTheme
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customer360', label: 'Customer 360', icon: UserCheck },
    { id: 'aiPredictions', label: 'AI Predictions', icon: BrainCircuit },
    { id: 'segmentation', label: 'Segmentation', icon: PieChart },
    { id: 'churnAnalysis', label: 'Churn Analysis', icon: TrendingDown },
    { id: 'clv', label: 'Customer Lifetime Value', icon: Gem },
    { id: 'marketing', label: 'Marketing Campaigns', icon: Megaphone },
    { id: 'revenue', label: 'Revenue Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '0' : '0 20px',
          borderBottom: '1px solid var(--border-color)',
          position: 'relative'
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Sparkles size={16} />
            </div>
            <span style={{ 
              fontWeight: 700, 
              fontSize: '16px',
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(to right, var(--text-primary), var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Aura CI
            </span>
          </div>
        )}
        {isCollapsed && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
            <Sparkles size={16} />
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn-icon"
          style={{
            position: isCollapsed ? 'absolute' : 'relative',
            right: isCollapsed ? 'auto' : '0',
            top: isCollapsed ? 'auto' : 'auto',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation list */}
      <nav style={{
        flexGrow: 1,
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? '0' : '12px',
                padding: '12px 14px',
                border: 'none',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                width: '100%',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Highlight bar */}
              {isActive && !isCollapsed && (
                <div style={{
                  position: 'absolute',
                  left: '4px',
                  width: '4px',
                  height: '18px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '2px'
                }} />
              )}
              
              <Icon size={18} style={{ 
                strokeWidth: isActive ? 2.2 : 1.8,
                flexShrink: 0 
              }} />
              
              {!isCollapsed && (
                <span style={{ 
                  whiteSpace: 'nowrap',
                  opacity: 1,
                  transition: 'opacity 0.2s ease'
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div style={{
        padding: '16px 8px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: isCollapsed ? '0' : '12px',
            padding: '10px 14px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            width: '100%',
            transition: 'all 0.15s ease'
          }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={16} />
              {!isCollapsed && <span>Dark Mode</span>}
            </>
          ) : (
            <>
              <Sun size={16} />
              {!isCollapsed && <span>Light Mode</span>}
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
