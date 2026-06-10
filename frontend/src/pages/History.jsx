import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHistory } from "../api/analysisApi";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();

        const formatted = data.map(item => ({
          id: item._id,
          type: item.contentType,
          verdict: item.label,
          confidence: item.score,
          timestamp: new Date(item.createdAt).toLocaleString(),
          dateObj: new Date(item.createdAt)
        }));

        setHistory(formatted.sort((a, b) => b.dateObj - a.dateObj));
      } catch (err) {
        console.error("History load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getVerdictStyle = (verdict) => {
    const v = verdict?.toLowerCase() || "";
    if (v.includes("manipulated") || v.includes("high")) {
      return { 
        color: "text-rose-600", 
        bg: "bg-rose-50", 
        border: "border-rose-200", 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
        gradient: "from-rose-500 to-orange-500"
      };
    }
    if (v.includes("authentic") || v.includes("low")) {
      return { 
        color: "text-emerald-600", 
        bg: "bg-emerald-50", 
        border: "border-emerald-200", 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        gradient: "from-emerald-500 to-teal-500"
      };
    }
    return { 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      border: "border-amber-200", 
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-400 to-orange-400"
    };
  };

  const getTypeIcon = (type) => {
    const icons = {
      text: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      image: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      video: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    };
    return icons[type] || icons.text;
  };

  const filteredHistory = filter === 'all' ? history : history.filter(h => {
    if (filter === 'high') return h.confidence > 75;
    if (filter === 'medium') return h.confidence > 50 && h.confidence <= 75;
    if (filter === 'low') return h.confidence <= 50;
    return true;
  });

  const stats = {
    total: history.length,
    highRisk: history.filter(h => h.confidence > 75).length,
    mediumRisk: history.filter(h => h.confidence > 50 && h.confidence <= 75).length,
    lowRisk: history.filter(h => h.confidence <= 50).length
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-gradient-to-br from-white via-purple-50 to-indigo-50 text-slate-800 pt-14 sm:pt-16 md:pt-20">
      {/* Full coverage background layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50/90 to-indigo-100/70 -z-10"></div>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-0 left-0 w-full h-full bg-white/40"></div>
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-purple-200/50 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-indigo-200/40 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/3 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] bg-violet-100/60 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[130px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16 md:pb-20">
        {/* Header Section */}
        <div className="text-center w-full mb-8 sm:mb-10 md:mb-12 pt-6 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border border-purple-200 shadow-sm mb-6 sm:mb-8 hover:bg-purple-50/50 transition-colors cursor-default">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wider">Analysis Archive</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="text-slate-800">History</span>
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {" "}Dashboard
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium px-2 sm:px-0">
            Review past analyses, track patterns, and export detailed forensic reports from your investigation history.
          </p>
        </div>

        {/* Stats Grid */}
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-6xl mx-auto">
            <StatCard 
              label="Total Analyses" 
              value={stats.total} 
              icon="📊"
              color="purple"
            />
            <StatCard 
              label="High Risk" 
              value={stats.highRisk} 
              icon="⚠️"
              color="rose"
            />
            <StatCard 
              label="Moderate Risk" 
              value={stats.mediumRisk} 
              icon="◐"
              color="amber"
            />
            <StatCard 
              label="Low Risk" 
              value={stats.lowRisk} 
              icon="✓"
              color="emerald"
            />
          </div>
        )}

        {/* Filter Tabs */}
        {!loading && history.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-6xl mx-auto">
            {[
              { key: 'all', label: 'All Results', count: stats.total },
              { key: 'high', label: 'High Risk', count: stats.highRisk },
              { key: 'medium', label: 'Moderate', count: stats.mediumRisk },
              { key: 'low', label: 'Low Risk', count: stats.lowRisk }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                  filter === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 sm:scale-105'
                    : 'bg-white/80 border border-purple-200 text-slate-600 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                {tab.label}
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${filter === tab.key ? 'bg-white/20' : 'bg-purple-100 text-purple-700'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 max-w-6xl mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3 sm:mb-4"></div>
            <p className="text-slate-600 font-medium text-sm sm:text-base animate-pulse">Loading investigation history...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="text-center py-12 sm:py-20 max-w-sm sm:max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-100/50 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">No History Found</h3>
            <p className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-8">Start your first analysis to build your investigation history.</p>
            <button
              onClick={() => navigate("/home")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all"
            >
              Start New Analysis
            </button>
          </div>
        )}

        {/* History List */}
        {!loading && filteredHistory.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800">
                Recent Analyses 
                <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-normal text-slate-500">({filteredHistory.length} results)</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredHistory.map((item, idx) => {
                const verdictStyle = getVerdictStyle(item.verdict);
                const typeIcon = getTypeIcon(item.type);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      localStorage.setItem(
                        "result",
                        JSON.stringify({
                          verdict: item.verdict,
                          confidence: item.confidence,
                          signals: {},
                          type: item.type
                        })
                      );
                      navigate("/result");
                    }}
                    className="group relative bg-white/95 backdrop-blur-xl border border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                      
                      {/* Left: Type & Date */}
                      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                          {typeIcon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <span className="text-base sm:text-lg font-bold text-slate-800 capitalize">{item.type}</span>
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                              Analysis
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{item.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Verdict Badge */}
                      <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${verdictStyle.bg} border ${verdictStyle.border} self-start md:self-auto`}>
                        <span className={verdictStyle.color}>{verdictStyle.icon}</span>
                        <span className={`font-bold text-xs sm:text-sm ${verdictStyle.color} truncate`}>{item.verdict}</span>
                      </div>

                      {/* Right: Confidence */}
                      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 self-start md:self-auto">
                        <div className="text-left md:text-right">
                          <div className="text-xs sm:text-sm text-slate-500 font-medium mb-0.5 sm:mb-1">Confidence</div>
                          <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${verdictStyle.color}`}>
                            {Math.round(item.confidence)}%
                          </div>
                        </div>
                        
                        {/* Progress Ring */}
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              className="text-purple-100 sm:hidden"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray={125.7}
                              strokeDashoffset={125.7 - (125.7 * item.confidence) / 100}
                              className={`${verdictStyle.color} transition-all duration-1000 sm:hidden`}
                              strokeLinecap="round"
                            />
                            <circle
                              cx="28"
                              cy="28"
                              r="24"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              className="text-purple-100 hidden sm:block md:hidden"
                            />
                            <circle
                              cx="28"
                              cy="28"
                              r="24"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray={150.8}
                              strokeDashoffset={150.8 - (150.8 * item.confidence) / 100}
                              className={`${verdictStyle.color} transition-all duration-1000 hidden sm:block md:hidden`}
                              strokeLinecap="round"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-purple-100 hidden md:block"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={175.9}
                              strokeDashoffset={175.9 - (175.9 * item.confidence) / 100}
                              className={`${verdictStyle.color} transition-all duration-1000 hidden md:block`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${verdictStyle.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Filtered Results */}
        {!loading && history.length > 0 && filteredHistory.length === 0 && (
          <div className="text-center py-12 sm:py-16 max-w-sm sm:max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-100/50 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1.5 sm:mb-2">No results found</h3>
            <p className="text-slate-600 text-sm sm:text-base">Try adjusting your filter to see more results.</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* Enhanced Stat Card */
function StatCard({ label, value, icon, color }) {
  const colorStyles = {
    purple: "from-purple-500 to-indigo-600 shadow-purple-200",
    rose: "from-rose-500 to-orange-500 shadow-rose-200",
    amber: "from-amber-400 to-orange-400 shadow-amber-200",
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-200"
  };

  return (
    <div className="relative group bg-white/95 backdrop-blur-xl border border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-white text-base sm:text-xl shadow-lg mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-0.5 sm:mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-800">{value}</div>
      
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorStyles[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );
}