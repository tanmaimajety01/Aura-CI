import { useState, useMemo, useEffect } from 'react';
import { generateCustomers, type Customer } from './data/dataGenerator';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import Customer360View from './components/Customer360View';
import AIPredictionsView from './components/AIPredictionsView';
import SegmentationView from './components/SegmentationView';
import CLVView from './components/CLVView';
import RevenueView from './components/RevenueView';
import MarketingView from './components/MarketingView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import NLSearch from './components/NLSearch';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  // Selected Customer for Customer 360 View
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Generate 50,000 synthetic customers in memory exactly once
  const allCustomers = useMemo(() => generateCustomers(50000), []);

  // Update theme tag on html node when state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Filter accounts for global headers (used to calculate export and propagate details)
  const globallyFilteredCustomers = useMemo(() => {
    return allCustomers.filter(c => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!c.id.toLowerCase().includes(q) && 
            !c.name.toLowerCase().includes(q) && 
            !c.email.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Date Range (Days ago limit)
      if (dateRange !== 'all') {
        const limitDays = parseInt(dateRange, 10);
        if (c.lastPurchaseDaysAgo > limitDays) return false;
      }

      // Region Filter
      if (regionFilter !== 'all' && c.region !== regionFilter) return false;

      // Segment Filter
      if (segmentFilter !== 'all') {
        if (segmentFilter === 'VIP' && c.clv < 4500) return false;
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
  }, [allCustomers, searchTerm, dateRange, regionFilter, segmentFilter, channelFilter]);

  // Global CSV Export Handler
  const handleGlobalExport = () => {
    const headers = 'ID,Name,Email,Age,Gender,Region,Device,Payment Method,Sales Channel,Tenure,Subscription Plan,CSAT,Support Tickets,Churn Probability,CLV,Monthly Revenue';
    const rows = globallyFilteredCustomers.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.age,
      c.gender,
      `"${c.region}"`,
      c.device,
      c.paymentMethod,
      c.salesChannel,
      c.tenure,
      c.subscriptionPlan,
      c.csat,
      c.supportTickets,
      c.predictedChurnProb,
      c.clv,
      c.monthlyRevenue
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aura_customer_intelligence_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Switch to Customer 360 view when selecting a customer row
  const handleSelectCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setActiveTab('customer360');
    }
  };

  // Get human-readable page titles
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Hub';
      case 'customer360': return 'Customer 360 Profile';
      case 'aiPredictions': return 'AI Predictions Classifier';
      case 'segmentation': return 'Customer Segmentation';
      case 'churnAnalysis': return 'Churn Analysis';
      case 'clv': return 'Customer Lifetime Value';
      case 'marketing': return 'Marketing Campaigns';
      case 'revenue': return 'Revenue Analytics';
      case 'reports': return 'Reports Centre';
      case 'settings': return 'Platform Settings';
      default: return 'Customer Intelligence';
    }
  };

  return (
    <div className="app-container">
      {/* Collapsible Left Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Workspace Frame */}
      <div 
        className="main-content"
        style={{
          paddingLeft: 0 // sidebar pushes it naturally via flexbox structure
        }}
      >
        {/* Global Navigation Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          segmentFilter={segmentFilter}
          setSegmentFilter={setSegmentFilter}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          onExport={handleGlobalExport}
          activeTabLabel={getTabLabel()}
        />

        {/* Content View Routing Shell */}
        <main className="content-body">
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Natural Language Query Panel on Dashboard */}
              <NLSearch 
                allCustomers={allCustomers} 
                onSelectCustomer={handleSelectCustomer} 
              />
              <DashboardView
                customers={allCustomers}
                onSelectCustomer={handleSelectCustomer}
                searchTerm={searchTerm}
                dateRange={dateRange}
                regionFilter={regionFilter}
                segmentFilter={segmentFilter}
                channelFilter={channelFilter}
              />
            </div>
          )}

          {activeTab === 'customer360' && (
            <Customer360View
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={handleSelectCustomer}
              allCustomers={allCustomers}
            />
          )}

          {(activeTab === 'aiPredictions' || activeTab === 'churnAnalysis') && (
            <AIPredictionsView />
          )}

          {activeTab === 'segmentation' && (
            <SegmentationView customers={globallyFilteredCustomers} />
          )}

          {activeTab === 'clv' && (
            <CLVView 
              customers={globallyFilteredCustomers}
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingView customers={globallyFilteredCustomers} />
          )}

          {activeTab === 'revenue' && (
            <RevenueView customers={globallyFilteredCustomers} />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
