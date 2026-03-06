import PropTypes from 'prop-types';

export default function ConfidenceMeter({ value }) {
  const percentage = Math.round(value * 100);

  // Determine color scheme based on confidence level
  const getColorScheme = () => {
    if (percentage > 70) {
      return {
        bar: 'bg-gradient-to-r from-rose-500 to-red-600',
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        label: 'High Risk',
        icon: '⚠️'
      };
    }
    if (percentage > 40) {
      return {
        bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        label: 'Moderate',
        icon: '◐'
      };
    }
    return {
      bar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: 'Low Risk',
      icon: '✓'
    };
  };

  const scheme = getColorScheme();

  return (
    <div className={`w-full rounded-2xl border ${scheme.border} ${scheme.bg} p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{scheme.icon}</span>
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${scheme.text}`}>
              {scheme.label}
            </p>
            <p className="text-xs text-slate-500">Confidence Assessment</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${scheme.text}`}>
            {percentage}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
        {/* Background track markers */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 h-full border-r border-white/50"></div>
          <div className="w-1/4 h-full border-r border-white/50"></div>
          <div className="w-1/4 h-full border-r border-white/50"></div>
          <div className="w-1/4 h-full"></div>
        </div>
        
        {/* Animated fill */}
        <div
          className={`h-full ${scheme.bar} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      {/* Context text */}
      <p className="mt-4 text-sm text-slate-600 leading-relaxed">
        {percentage > 70 
          ? "Strong indicators of manipulation detected. High confidence in deceptive content assessment."
          : percentage > 40
          ? "Mixed signals detected. Moderate uncertainty requires additional verification."
          : "Content appears consistent with authentic patterns. Low deception probability."
        }
      </p>
    </div>
  );
}

// PropTypes for type safety
ConfidenceMeter.propTypes = {
  value: PropTypes.number.isRequired
};

// Default props
ConfidenceMeter.defaultProps = {
  value: 0
};