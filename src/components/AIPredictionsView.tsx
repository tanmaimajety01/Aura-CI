import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  Gauge, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { getModelMetrics } from '../data/dataGenerator';

export default function AIPredictionsView() {
  const metrics = getModelMetrics();

  const formattedFeatureImportance = metrics.featureImportance.map(feat => ({
    name: feat.feature,
    weight: feat.weight,
    description: feat.description,
    absWeight: Math.abs(feat.weight)
  })).sort((a, b) => b.absWeight - a.absWeight);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Top Section: Model Overview & Scores */}
      <div className="grid-container grid-cols-4">
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>MODEL ACCURACY</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            {(metrics.accuracy * 100).toFixed(1)}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingUp size={12} /> Outperforms baseline by 14%
          </span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>PRECISION</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-blue)' }}>
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Confidence of positive prediction</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>RECALL (TPR)</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)' }}>
            {(metrics.recall * 100).toFixed(1)}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Ratio of actual churn detected</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>F1 SCORE</span>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-amber)' }}>
            {(metrics.f1Score * 100).toFixed(1)}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Harmonic mean of metrics</span>
        </div>
      </div>

      {/* Charts Section: Confusion Matrix & ROC Curve */}
      <div className="grid-container grid-cols-2">
        
        {/* Confusion Matrix Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Confusion Matrix (Test Split)
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Binary classification results on 50,000 holdout ledger</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1fr',
            gap: '12px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600
          }}>
            {/* Row 1 Headers */}
            <div />
            <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>PREDICTED ACTIVE</div>
            <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>PREDICTED CHURN</div>

            {/* Row 2: Actual Active */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>ACTUAL ACTIVE</div>
            <div style={{ 
              backgroundColor: 'var(--accent-emerald-light)', 
              color: 'var(--accent-emerald)', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{metrics.confusionMatrix.tn.toLocaleString()}</div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>True Negative (Correct)</div>
            </div>
            <div style={{ 
              backgroundColor: 'var(--accent-rose-light)', 
              color: 'var(--accent-rose)', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{metrics.confusionMatrix.fp.toLocaleString()}</div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>False Positive (Type I)</div>
            </div>

            {/* Row 3: Actual Churn */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>ACTUAL CHURN</div>
            <div style={{ 
              backgroundColor: 'var(--accent-rose-light)', 
              color: 'var(--accent-rose)', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{metrics.confusionMatrix.fn.toLocaleString()}</div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>False Negative (Type II)</div>
            </div>
            <div style={{ 
              backgroundColor: 'var(--accent-emerald-light)', 
              color: 'var(--accent-emerald)', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{metrics.confusionMatrix.tp.toLocaleString()}</div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>True Positive (Correct)</div>
            </div>
          </div>
        </div>

        {/* ROC Curve Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={16} /> ROC Curve (Receiver Operating Characteristic)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>AUC = 0.912</span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.rocCurve} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 10 }} name="FPR" />
                <YAxis dataKey="tpr" type="number" domain={[0, 1]} tick={{ fontSize: 10 }} name="TPR" />
                <Tooltip 
                  formatter={(value) => [Number(value).toFixed(2), 'Rate']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <ReferenceLine x={0} y={0} stroke="var(--text-tertiary)" strokeDasharray="3 3" />
                {/* Diagonal line representation */}
                <Line data={[{fpr:0, tpr:0}, {fpr:1, tpr:1}]} dataKey="tpr" stroke="#64748b" strokeWidth={1} strokeDasharray="5 5" activeDot={false} />
                <Line type="monotone" dataKey="tpr" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Importance & SHAP explanations */}
      <div className="grid-container grid-cols-12">
        
        {/* SHAP Weights (8 cols) */}
        <div className="col-span-8 card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Explainable AI (SHAP Feature Importance)
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Relative contribution of core attributes to churn classifications</p>
          </div>

          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedFeatureImportance}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value) => [value, 'Weight']}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                />
                <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                  {formattedFeatureImportance.map((entry, index) => {
                    // Color positive weights red (churn accelerators) and negative weights green (churn reducers)
                    const isPositive = entry.weight > 0;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isPositive ? 'var(--accent-rose)' : 'var(--accent-emerald)'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainers Checklist (4 cols) */}
        <div className="col-span-4 card card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ color: 'var(--accent-amber)' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Top Churn Drivers (SHAP Key)</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {metrics.featureImportance.slice(0, 4).map((feat, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <span>{feat.feature}</span>
                  <span style={{ color: feat.weight > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                    {feat.weight > 0 ? '+' : ''}{feat.weight}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.3 }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
