import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area
} from "recharts";

// Custom tooltip component - DEFINED OUTSIDE to prevent recreation
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const riskColors = {
      'High': 'text-rose-600 bg-rose-50 border-rose-200',
      'Moderate': 'text-amber-600 bg-amber-50 border-amber-200',
      'Low': 'text-emerald-600 bg-emerald-50 border-emerald-200'
    };
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 min-w-[150px]">
        <p className="text-xs text-slate-500 mb-1">{dataPoint.fullDate}</p>
        <p className="text-2xl font-bold text-slate-900 mb-2">{dataPoint.score}%</p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${riskColors[dataPoint.risk]}`}>
          {dataPoint.risk} Risk
        </span>
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

export default function ForensicTimeline({ history }) {
  // Handle empty or invalid data
  if (!history || history.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No timeline data available</p>
        </div>
      </div>
    );
  }

  // Format data with safety checks
  const data = history
    .filter(item => item && item.createdAt && typeof item.score === 'number')
    .map((item, index) => {
      const date = new Date(item.createdAt);
      return {
        index: index + 1,
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: date.toLocaleString(),
        timestamp: date.getTime(),
        score: Math.round(item.score),
        risk: item.score > 75 ? 'High' : item.score > 50 ? 'Moderate' : 'Low'
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  // If no valid data after filtering
  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Invalid data format</p>
      </div>
    );
  }

  // Calculate statistics
  const averageScore = Math.round(
    data.reduce((sum, item) => sum + item.score, 0) / data.length
  );
  const latestScore = data[data.length - 1].score;
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));

  // Get trend direction
  const getTrend = () => {
    if (data.length < 2) return 'neutral';
    const diff = latestScore - data[0].score;
    if (diff > 5) return 'increasing';
    if (diff < -5) return 'decreasing';
    return 'stable';
  };

  const trend = getTrend();
  const trendIcons = {
    increasing: '↗️',
    decreasing: '↘️',
    stable: '➡️',
    neutral: '➖'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-slate-900">Forensic Timeline</h3>
          <p className="text-sm text-slate-500">Analysis score trend over time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
            <span className="text-xs text-slate-500">Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500/50 border-2 border-indigo-500 border-dashed"></span>
            <span className="text-xs text-slate-500">Average</span>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            trend === 'increasing' ? 'bg-rose-100 text-rose-700' :
            trend === 'decreasing' ? 'bg-emerald-100 text-emerald-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            <span>{trendIcons[trend]}</span>
            <span className="capitalize">{trend}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              dy={10}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }} 
            />
            
            <ReferenceLine 
              y={averageScore} 
              stroke="#6366f1" 
              strokeDasharray="5 5"
              strokeWidth={2}
              ifOverflow="extendDomain"
            />
            
            {/* Area fill */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill="url(#scoreGradient)"
              animationDuration={1500}
            />
            
            {/* Main line */}
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, stroke: '#fff', r: 4 }}
              activeDot={{ r: 6, fill: '#0891b2', stroke: '#fff', strokeWidth: 3 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="text-center p-3 rounded-xl bg-slate-50">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{data.length}</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-indigo-50">
          <p className="text-xs text-indigo-600 uppercase tracking-wider font-medium">Average</p>
          <p className="text-xl font-bold text-indigo-700 mt-1">{averageScore}%</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-slate-50">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Range</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{minScore}-{maxScore}%</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-cyan-50">
          <p className="text-xs text-cyan-600 uppercase tracking-wider font-medium">Latest</p>
          <p className="text-xl font-bold text-cyan-700 mt-1">{latestScore}%</p>
        </div>
      </div>
    </div>
  );
}

// PropTypes
ForensicTimeline.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.oneOfType([
        PropTypes.string, 
        PropTypes.number,
        PropTypes.instanceOf(Date)
      ]),
      score: PropTypes.number
    })
  )
};

ForensicTimeline.defaultProps = {
  history: []
};