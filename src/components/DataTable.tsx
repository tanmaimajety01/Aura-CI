import { useEffect, useMemo, useState } from 'react';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  SlidersHorizontal,
  Download
} from 'lucide-react';
import type { Customer } from '../data/dataGenerator';

interface DataTableProps {
  data: Customer[];
  onRowClick: (customer: Customer) => void;
}

type SortField = 'id' | 'name' | 'subscriptionPlan' | 'region' | 'tenure' | 'clv' | 'predictedChurnProb' | 'supportTickets' | 'csat';
type SortOrder = 'asc' | 'desc';

export default function DataTable({ data, onRowClick }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('clv');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Column Visibility State
  const [columns, setColumns] = useState({
    id: { label: 'ID', visible: true },
    name: { label: 'Name', visible: true },
    plan: { label: 'Plan', visible: true },
    region: { label: 'Region', visible: true },
    tenure: { label: 'Tenure', visible: true },
    clv: { label: 'CLV', visible: true },
    churnProb: { label: 'Churn Probability', visible: true },
    support: { label: 'Support Tickets', visible: true },
    csat: { label: 'CSAT', visible: true }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Memoized sorted data
  const sortedData = useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle strings
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      // Handle numbers
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [data, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  useEffect(() => {
    if (sortedData.length === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, sortedData.length, totalPages]);
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIdx, startIdx + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const toggleColumn = (key: keyof typeof columns) => {
    setColumns(prev => ({
      ...prev,
      [key]: { ...prev[key], visible: !prev[key].visible }
    }));
  };

  const exportToCSV = () => {
    const visibleCols = Object.keys(columns).filter(key => columns[key as keyof typeof columns].visible);
    const headers = visibleCols.map(key => columns[key as keyof typeof columns].label).join(',');
    
    const rows = data.map(cust => {
      return [
        columns.id.visible ? cust.id : null,
        columns.name.visible ? `"${cust.name}"` : null,
        columns.plan.visible ? cust.subscriptionPlan : null,
        columns.region.visible ? `"${cust.region}"` : null,
        columns.tenure.visible ? cust.tenure : null,
        columns.clv.visible ? cust.clv : null,
        columns.churnProb.visible ? cust.predictedChurnProb : null,
        columns.support.visible ? cust.supportTickets : null,
        columns.csat.visible ? cust.csat : null
      ]
        .filter(val => val !== null)
        .join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_intelligence_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      
      {/* Table Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            Customer Ledger
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Showing {Math.min(data.length, (currentPage - 1) * rowsPerPage + 1)} - {Math.min(data.length, currentPage * rowsPerPage)} of {data.length.toLocaleString()} accounts
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          
          {/* Export Specific CSV */}
          <button 
            onClick={exportToCSV}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            <Download size={14} /> Export Segment
          </button>

          {/* Column selector toggle */}
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            <SlidersHorizontal size={14} /> Columns
          </button>

          {showColumnSelector && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '38px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 30,
              padding: '12px',
              width: '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Toggle Columns
              </span>
              {Object.keys(columns).map(colKey => {
                const key = colKey as keyof typeof columns;
                return (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={columns[key].visible}
                      onChange={() => toggleColumn(key)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    {columns[key].label}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid Container for table with Sticky Headers */}
      <div style={{ 
        overflowX: 'auto', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-md)',
        maxHeight: '480px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left'
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            zIndex: 10,
            borderBottom: '1px solid var(--border-color)'
          }}>
            <tr>
              {columns.id.visible && (
                <th onClick={() => handleSort('id')} style={{ padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ID <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.name.visible && (
                <th onClick={() => handleSort('name')} style={{ padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Name <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.plan.visible && (
                <th onClick={() => handleSort('subscriptionPlan')} style={{ padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Plan <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.region.visible && (
                <th onClick={() => handleSort('region')} style={{ padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Region <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.tenure.visible && (
                <th onClick={() => handleSort('tenure')} style={{ padding: '14px 16px', cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    Tenure <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.clv.visible && (
                <th onClick={() => handleSort('clv')} style={{ padding: '14px 16px', cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    CLV <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.churnProb.visible && (
                <th onClick={() => handleSort('predictedChurnProb')} style={{ padding: '14px 16px', cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    Churn Risk <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.support.visible && (
                <th onClick={() => handleSort('supportTickets')} style={{ padding: '14px 16px', cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    Tickets <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {columns.csat.visible && (
                <th onClick={() => handleSort('csat')} style={{ padding: '14px 16px', cursor: 'pointer', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    CSAT <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No customer records match your filters.
                </td>
              </tr>
            ) : (
              paginatedData.map(cust => {
                const getPlanBadgeClass = (plan: string) => {
                  if (plan === 'Enterprise') return 'badge-danger';
                  if (plan === 'Premium') return 'badge-warning';
                  if (plan === 'Pro') return 'badge-info';
                  return 'badge-neutral';
                };

                const getChurnBadgeClass = (prob: number) => {
                  if (prob > 0.7) return 'badge-danger';
                  if (prob > 0.4) return 'badge-warning';
                  return 'badge-success';
                };

                return (
                  <tr 
                    key={cust.id} 
                    onClick={() => onRowClick(cust)}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {columns.id.visible && (
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--primary)' }}>
                        {cust.id}
                      </td>
                    )}
                    {columns.name.visible && (
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        <div>{cust.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 400 }}>{cust.email}</div>
                      </td>
                    )}
                    {columns.plan.visible && (
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${getPlanBadgeClass(cust.subscriptionPlan)}`}>
                          {cust.subscriptionPlan}
                        </span>
                      </td>
                    )}
                    {columns.region.visible && (
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {cust.region}
                      </td>
                    )}
                    {columns.tenure.visible && (
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        {cust.tenure} mo
                      </td>
                    )}
                    {columns.clv.visible && (
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                        ${cust.clv.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    )}
                    {columns.churnProb.visible && (
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span className={`badge ${getChurnBadgeClass(cust.predictedChurnProb)}`}>
                          {(cust.predictedChurnProb * 100).toFixed(0)}%
                        </span>
                      </td>
                    )}
                    {columns.support.visible && (
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: cust.supportTickets >= 4 ? 'var(--accent-rose)' : 'var(--text-secondary)', fontWeight: cust.supportTickets >= 4 ? 600 : 400 }}>
                        {cust.supportTickets}
                      </td>
                    )}
                    {columns.csat.visible && (
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: cust.csat <= 2 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                        {cust.csat} / 5
                      </td>
                    )}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button 
                        className="btn-icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(cust);
                        }}
                        style={{ padding: '4px' }}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        paddingTop: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Rows per page:</span>
          <select 
            value={rowsPerPage} 
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
              className="btn-icon" 
              style={{ padding: '4px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1}
              className="btn-icon" 
              style={{ padding: '4px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="btn-icon" 
              style={{ padding: '4px', opacity: (currentPage === totalPages || totalPages === 0) ? 0.4 : 1, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="btn-icon" 
              style={{ padding: '4px', opacity: (currentPage === totalPages || totalPages === 0) ? 0.4 : 1, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
