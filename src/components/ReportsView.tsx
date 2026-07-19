import { 
  FileText, 
  Download, 
  Clock, 
  Filter, 
  CheckCircle2, 
  FileSpreadsheet
} from 'lucide-react';

export default function ReportsView() {
  const reportsList = [
    { title: 'Executive Churn Risk Summary', type: 'PDF', size: '2.4 MB', date: '2026-07-18', author: 'AI Copilot' },
    { title: 'Q2 Marketing Performance & ROI Attribution', type: 'Spreadsheet', size: '12.8 MB', date: '2026-07-15', author: 'Keerthi S.' },
    { title: 'Revenue Waterfall Reconciliation (Jul 2026)', type: 'PDF', size: '1.8 MB', date: '2026-07-02', author: 'Billing System' },
    { title: 'Customer Lifetime Value (CLV) Distribution & Cohorts', type: 'Spreadsheet', size: '8.4 MB', date: '2026-06-28', author: 'Data Science Team' },
    { title: 'CSAT Drift Analysis & SLA Audit', type: 'PDF', size: '3.1 MB', date: '2026-06-15', author: 'Support Ops' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Overview text */}
      <div className="card card-glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Executive Reporting Center
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Access, filter, and compile compliance and executive summaries. Reports are automatically refreshed and generated at the end of each fiscal period or on demand via the AI pipeline.
        </p>
      </div>

      {/* Reports Directory */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Generated Reports Ledger</h3>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}>
            <Filter size={14} /> Filter Reports
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reportsList.map((rep, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: rep.type === 'PDF' ? 'var(--accent-rose-light)' : 'var(--accent-emerald-light)',
                  color: rep.type === 'PDF' ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {rep.type === 'PDF' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{rep.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {rep.date}</span>
                    <span>Size: {rep.size}</span>
                    <span>Compiled by: {rep.author}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="badge badge-success" style={{ fontSize: '9px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <CheckCircle2 size={10} /> Verified
                </span>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
                  title="Download Attachment"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
