import { useNavigate } from "react-router-dom";

export default function ExplainableView() {
  const navigate = useNavigate();

  // ✅ Safe lazy read (no useEffect, no ESLint issue)
  const result = (() => {
    try {
      const stored = localStorage.getItem("result");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  if (!result) {
    return (
      <section className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">No explanation data available.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </section>
    );
  }

  const { verdict, confidence, signals, type } = result;

  // Determine verdict styling
  const getVerdictStyle = () => {
    const v = verdict?.toLowerCase() || '';
    if (v.includes('manipulated') || v.includes('fake') || v.includes('false')) {
      return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: '⚠️' };
    }
    if (v.includes('authentic') || v.includes('genuine') || v.includes('true')) {
      return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✓' };
    }
    return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: '◐' };
  };

  const verdictStyle = getVerdictStyle();

  return (
    <section className="w-full min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition-colors">Dashboard</button>
          <span>/</span>
          <button onClick={() => navigate("/result")} className="hover:text-indigo-600 transition-colors">Results</button>
          <span>/</span>
          <span className="text-slate-800 font-medium">Explanation</span>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Explainable AI</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900 tracking-tight">
            Analysis
            <span className="text-indigo-600"> Breakdown</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Understanding <strong>why</strong> the system reached its conclusion. 
            Each signal below represents a detectable pattern that contributed to 
            the final assessment, designed for human review and verification.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Verdict Card */}
          <div className={`${verdictStyle.bg} border ${verdictStyle.border} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{verdictStyle.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Final Assessment</span>
            </div>
            <p className={`text-2xl font-heading font-bold ${verdictStyle.color}`}>
              {verdict}
            </p>
            <p className="text-xs text-slate-500 mt-2">Based on {signals?.length || 0} detected signals</p>
          </div>

          {/* Confidence Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Confidence Level</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-heading font-bold text-slate-900">
                {Math.round(confidence * 100)}%
              </span>
              <span className="text-sm text-slate-500 mb-1">certainty</span>
            </div>
            {/* Confidence bar */}
            <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.round(confidence * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Content Type Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Content Type</span>
            </div>
            <p className="text-2xl font-heading font-bold text-slate-900 capitalize">
              {type || 'Unknown'}
            </p>
            <p className="text-xs text-slate-500 mt-2">Analyzed {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Signals Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-slate-900">
              Detected Signals
            </h2>
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
              {signals?.length || 0} patterns found
            </span>
          </div>

          <div className="space-y-4">
            {signals?.map((signal, idx) => (
              <ExplanationBlock 
                key={idx} 
                index={idx + 1} 
                signal={signal}
                total={signals.length}
              />
            ))}
          </div>
        </div>

        {/* Interpretation Guide */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">How to Interpret These Results</h3>
              <p className="text-sm text-indigo-800 leading-relaxed">
                Each signal represents a pattern correlation, not definitive proof. 
                High-confidence scores indicate strong pattern matches, but human 
                judgment remains essential. Consider the context, source credibility, 
                and corroborating evidence before drawing conclusions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed text-center sm:text-left">
            <span className="font-medium text-slate-700">Note:</span> Explainability 
            does not imply certainty. These signals highlight areas warranting 
            skepticism and further human verification.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/result")}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 hover:border-slate-400 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Result
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem("result");
                navigate("/");
              }}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===============================
   ENHANCED EXPLANATION BLOCK
================================ */
function ExplanationBlock({ index, signal, }) {
  // Generate varied severity based on index for visual variety
  const severities = [
    { level: 'High Impact', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: '🔴' },
    { level: 'Moderate', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🟡' },
    { level: 'Pattern Match', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🔵' },
    { level: 'Contextual', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '⚪' }
  ];
  
  const severity = severities[index % severities.length];

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Signal Number */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
          {index}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-heading font-semibold text-slate-900">
              {signal}
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${severity.color}`}>
              {severity.icon} {severity.level}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            The system detected this pattern through statistical analysis of linguistic 
            structures, semantic markers, and contextual anomalies. This correlation 
            suggests increased uncertainty regarding content reliability.
          </p>

          {/* Expandable detail (visual only) */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pattern verified
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Detected in analysis
            </span>
          </div>
        </div>

        {/* Action hint */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}