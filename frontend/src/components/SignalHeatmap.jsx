import PropTypes from 'prop-types';

export default function SignalHeatmap({ signals }) {
  // Handle empty or invalid data
  if (!signals || Object.keys(signals).length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">No signal data available</p>
      </div>
    );
  }

  const items = Object.entries(signals);

  // Get color based on intensity
  const getIntensityStyle = (value) => {
    if (value >= 75) {
      return {
        bg: 'bg-gradient-to-br from-rose-500 to-red-600',
        text: 'text-white',
        border: 'border-rose-400',
        shadow: 'shadow-rose-500/30',
        label: 'Critical'
      };
    }
    if (value >= 50) {
      return {
        bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
        text: 'text-white',
        border: 'border-amber-400',
        shadow: 'shadow-amber-500/30',
        label: 'Elevated'
      };
    }
    if (value >= 25) {
      return {
        bg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
        text: 'text-white',
        border: 'border-cyan-400',
        shadow: 'shadow-cyan-500/30',
        label: 'Moderate'
      };
    }
    return {
      bg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      text: 'text-white',
      border: 'border-emerald-400',
      shadow: 'shadow-emerald-500/30',
      label: 'Low'
    };
  };

  // Calculate statistics
  const values = items.map(([, value]) => value);
  const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div className="space-y-4">
      {/* Stats header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <h3 className="text-lg font-heading font-semibold text-slate-900">Signal Heatmap</h3>
          <p className="text-sm text-slate-500">{items.length} indicators analyzed</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <span className="block text-xs text-slate-500 uppercase">Avg</span>
            <span className="font-bold text-slate-900">{average}%</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-slate-500 uppercase">Max</span>
            <span className="font-bold text-rose-600">{max}%</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-slate-500 uppercase">Min</span>
            <span className="font-bold text-emerald-600">{min}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { color: 'bg-rose-500', label: 'Critical (75-100%)' },
          { color: 'bg-amber-400', label: 'Elevated (50-74%)' },
          { color: 'bg-cyan-400', label: 'Moderate (25-49%)' },
          { color: 'bg-emerald-400', label: 'Low (0-24%)' }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100">
            <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
            <span className="text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map(([key, value]) => {
          const style = getIntensityStyle(value);
          
          return (
            <div
              key={key}
              className={`
                relative p-4 rounded-xl border-2 ${style.border} ${style.bg} ${style.text}
                shadow-lg ${style.shadow} hover:shadow-xl hover:scale-105
                transition-all duration-300 cursor-default group overflow-hidden
              `}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium opacity-90 uppercase tracking-wider">
                    {style.label}
                  </span>
                  <span className="text-lg font-bold">{value}%</span>
                </div>
                
                <div className="text-sm font-semibold leading-tight break-words">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                
                {/* Mini bar */}
                <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/80 rounded-full transition-all duration-500"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// PropTypes
SignalHeatmap.propTypes = {
  signals: PropTypes.objectOf(PropTypes.number)
};

SignalHeatmap.defaultProps = {
  signals: null
};