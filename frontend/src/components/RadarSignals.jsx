import PropTypes from 'prop-types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

// Custom tooltip - DEFINED OUTSIDE to prevent recreation
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
        <p className="text-lg font-bold text-cyan-600">{item.value}%</p>
        <p className="text-xs text-slate-500">of max intensity</p>
      </div>
    );
  }
  return null;
};

// PropTypes for CustomTooltip
CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array
};

CustomTooltip.defaultProps = {
  active: false,
  payload: []
};

export default function RadarSignals({ signals }) {
  // Handle empty or invalid data
  if (!signals || Object.keys(signals).length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No radar data available</p>
        </div>
      </div>
    );
  }

  // Safe value extraction
  const safeValue = (val) => typeof val === 'number' && !isNaN(val) ? val : 0;

  const data = [
    { name: "Linguistic", value: safeValue(signals.linguisticPattern), fullMark: 100 },
    { name: "Clickbait", value: safeValue(signals.clickbaitLevel), fullMark: 100 },
    { name: "Emotional", value: safeValue(signals.emotionalIntensity), fullMark: 100 },
    { name: "Absolutist", value: safeValue(signals.absolutistLanguage), fullMark: 100 },
    { name: "ML Score", value: safeValue(signals.mlProbability), fullMark: 100 },
  ];

  // Calculate average for insights
  const values = data.map(d => d.value);
  const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const maxSignal = data.reduce((prev, current) => (prev.value > current.value) ? prev : current);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-slate-900">Signal Radar</h3>
          <p className="text-sm text-slate-500">Multi-dimensional analysis</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase">Dominant</p>
          <p className="text-sm font-bold text-cyan-600">{maxSignal.name}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="70%" data={data}>
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <PolarGrid 
              stroke="#e2e8f0" 
              radialLines={true}
            />
            
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            />
            
            <PolarRadiusAxis 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickCount={6}
              stroke="#cbd5e1"
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
            
            <Radar
              name="Signal Strength"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#radarGradient)"
              fillOpacity={1}
            />
            
            {/* Reference radar for average */}
            <Radar
              name="Average Baseline"
              dataKey="fullMark"
              stroke="#94a3b8"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
              fillOpacity={0}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-100">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-xs text-slate-500 mb-1">{item.name}</p>
            <p className={`text-sm font-bold ${
              item.value > 75 ? 'text-rose-600' :
              item.value > 50 ? 'text-amber-600' :
              item.value > 25 ? 'text-cyan-600' :
              'text-emerald-600'
            }`}>
              {item.value}%
            </p>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 rounded-xl bg-cyan-50 border border-cyan-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-cyan-800">
            <span className="font-semibold">{maxSignal.name}</span> shows highest intensity at {maxSignal.value}%
          </p>
        </div>
      </div>
    </div>
  );
}

// PropTypes
RadarSignals.propTypes = {
  signals: PropTypes.shape({
    linguisticPattern: PropTypes.number,
    clickbaitLevel: PropTypes.number,
    emotionalIntensity: PropTypes.number,
    absolutistLanguage: PropTypes.number,
    mlProbability: PropTypes.number,
  })
};

RadarSignals.defaultProps = {
  signals: null
};