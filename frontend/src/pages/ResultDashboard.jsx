import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar,
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export default function ResultDashboard() {
  const navigate = useNavigate();
  const reportRef = useRef();
  const result = getSafeResult();

  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  if (!result) {
    return (
      <section className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500">No analysis result found.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Start New Analysis
          </button>
        </div>
      </section>
    );
  }

  const confidence = result.confidence || 0;
  const signals = result.signals || {};
  const type = result.type || 'text';

  /* ================= CONFIDENCE ANIMATION ================= */
  useEffect(() => {
    let start = 0;
    const end = confidence;
    const duration = 800;
    const step = 15;
    const increment = end / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedConfidence(start);
    }, step);

    return () => clearInterval(timer);
  }, [confidence]);

  /* ================= CHART CONFIGURATION ================= */
  const getChartColors = () => {
    const base = confidence > 75 ? 'rose' : confidence > 50 ? 'amber' : 'emerald';
    const colors = {
      rose: { primary: '#f43f5e', bg: 'rgba(244,63,94,0.2)', light: '#fda4af' },
      amber: { primary: '#f59e0b', bg: 'rgba(245,158,11,0.2)', light: '#fcd34d' },
      emerald: { primary: '#10b981', bg: 'rgba(16,185,129,0.2)', light: '#6ee7b7' }
    };
    return colors[base];
  };

  const chartColors = getChartColors();

  const radarData = {
    labels: Object.keys(signals),
    datasets: [
      {
        label: "Signal Strength",
        data: Object.values(signals),
        backgroundColor: chartColors.bg,
        borderColor: chartColors.primary,
        borderWidth: 2,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors.primary
      }
    ]
  };

  const timelineData = {
    labels: Object.keys(signals),
    datasets: [
      {
        label: "Signal Distribution",
        data: Object.values(signals),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#64748b',
          font: { size: 12, family: 'Inter' }
        }
      }
    },
    scales: {
      r: {
        grid: { color: '#e2e8f0' },
        angleLines: { color: '#cbd5e1' },
        pointLabels: { color: '#64748b' },
        ticks: { color: '#94a3b8', backdropColor: 'transparent' }
      },
      x: {
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b' }
      }
    }
  };

  /* ================= PDF ================= */
  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#f8fafc',
      scale: 2
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("forensic-report.pdf");
  };

  const uncertainty = Math.max(5, 100 - confidence) * 0.2;

  // Determine status styling
  const getStatusConfig = () => {
    if (confidence > 75) return {
      label: 'High Risk',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      gradient: 'from-rose-500 to-orange-500',
      icon: '⚠️',
      desc: 'Strong manipulation signals detected'
    };
    if (confidence > 50) return {
      label: 'Moderate Risk',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      gradient: 'from-amber-400 to-orange-400',
      icon: '◐',
      desc: 'Some anomaly patterns detected'
    };
    return {
      label: 'Low Risk',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      gradient: 'from-emerald-400 to-teal-500',
      icon: '✓',
      desc: 'Within normal parameters'
    };
  };

  const status = getStatusConfig();

  return (
    <div
      ref={reportRef}
      className="min-h-screen bg-slate-50 text-slate-800 px-6 py-8 md:px-12 md:py-12"
    >
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition-colors">Dashboard</button>
          <span>/</span>
          <span className="text-slate-800 font-medium">Analysis Report</span>
        </div>

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Forensic Report</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3 text-slate-900">
            AI Intelligence
            <span className="text-indigo-600"> Report</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Multi-layer deception detection analysis with probabilistic fusion modeling 
            and explainable signal breakdown.
          </p>
        </div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className={`${status.bg} border ${status.border} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{status.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Status</span>
            </div>
            <p className={`text-2xl font-heading font-bold ${status.color}`}>{status.label}</p>
            <p className="text-xs text-slate-500 mt-1">{status.desc}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Confidence</span>
            </div>
            <p className="text-3xl font-heading font-bold text-slate-900">{Math.round(animatedConfidence)}%</p>
            <p className="text-xs text-slate-500 mt-1">±{uncertainty.toFixed(1)}% uncertainty</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Signals</span>
            </div>
            <p className="text-3xl font-heading font-bold text-slate-900">{Object.keys(signals).length}</p>
            <p className="text-xs text-slate-500 mt-1">Patterns detected</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Content Type</span>
            </div>
            <p className="text-3xl font-heading font-bold text-slate-900 capitalize">{type}</p>
            <p className="text-xs text-slate-500 mt-1">Analyzed content</p>
          </div>
        </div>

        {/* CONFIDENCE METER */}
        <div className="bg-white rounded-2xl p-8 mb-10 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900">Confidence Distribution</h2>
              <p className="text-sm text-slate-500 mt-1">Aggregated signal probability</p>
            </div>
            <div className="text-right">
              <span className={`text-4xl font-mono font-bold ${status.color}`}>
                {Math.round(animatedConfidence)}%
              </span>
            </div>
          </div>

          {/* Gradient progress bar */}
          <div className="h-6 bg-slate-200 rounded-full overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r ${status.gradient} transition-all duration-1000 ease-out relative`}
              style={{ width: `${confidence}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            {/* Markers */}
            <div className="absolute top-0 left-[25%] h-full w-px bg-white/50"></div>
            <div className="absolute top-0 left-[50%] h-full w-px bg-white/50"></div>
            <div className="absolute top-0 left-[75%] h-full w-px bg-white/50"></div>
          </div>
          
          <div className="flex justify-between mt-3 text-xs text-slate-400 font-medium">
            <span>Low Risk</span>
            <span>Moderate</span>
            <span>High Risk</span>
          </div>
        </div>

        {/* VISUAL SECTION - CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-slate-900">Signal Radar</h3>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">Multi-dimensional</span>
            </div>
            <div className="aspect-square max-h-[400px]">
              <Radar data={radarData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-slate-900">Signal Timeline</h3>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">Distribution</span>
            </div>
            <div className="h-[400px]">
              <Line data={timelineData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* HEATMAP GRID */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-slate-900">Signal Intensity Heatmap</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              <span>High</span>
              <span className="w-3 h-3 rounded bg-amber-400 ml-2"></span>
              <span>Med</span>
              <span className="w-3 h-3 rounded bg-emerald-400 ml-2"></span>
              <span>Low</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(signals).map(([key, value]) => {
              const intensity = value > 75 ? 'bg-rose-500 text-white' : 
                              value > 50 ? 'bg-amber-400 text-white' : 
                              value > 25 ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-slate-600';
              
              return (
                <div
                  key={key}
                  className={`rounded-xl p-5 text-center transition-transform hover:scale-105 cursor-default ${intensity}`}
                >
                  <div className="text-xs font-medium opacity-90 mb-1 uppercase tracking-wider">{key}</div>
                  <div className="text-2xl font-bold">{value}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXPLAINABILITY */}
        <div className={`${status.bg} border ${status.border} rounded-2xl p-8 mb-10`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${status.bg} border ${status.border} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-6 h-6 ${status.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold mb-3 text-slate-900">Interpretation Summary</h3>
              
              {confidence > 75 && (
                <div className="space-y-2">
                  <p className="text-rose-700 leading-relaxed">
                    <span className="font-semibold">High manipulation probability detected.</span> Multiple converging signals 
                    indicate coordinated deceptive patterns including emotional intensity spikes, absolutist language structures, 
                    and statistical anomalies in linguistic distribution.
                  </p>
                  <ul className="text-sm text-rose-600 space-y-1 mt-3 ml-4 list-disc">
                    <li>Emotional manipulation markers present</li>
                    <li>Absolutist terminology frequency above threshold</li>
                    <li>Source credibility indicators weak or absent</li>
                  </ul>
                </div>
              )}

              {confidence > 50 && confidence <= 75 && (
                <div className="space-y-2">
                  <p className="text-amber-700 leading-relaxed">
                    <span className="font-semibold">Moderate anomaly distribution.</span> Detected rhetorical framing 
                    signals and some statistical deviations, but patterns remain partially within normal parameters. 
                    Recommend additional verification.
                  </p>
                  <ul className="text-sm text-amber-600 space-y-1 mt-3 ml-4 list-disc">
                    <li>Selective presentation of facts detected</li>
                    <li>Some contextual omissions identified</li>
                    <li>Mixed credibility indicators</li>
                  </ul>
                </div>
              )}

              {confidence <= 50 && (
                <div className="space-y-2">
                  <p className="text-emerald-700 leading-relaxed">
                    <span className="font-semibold">Low deception indicators.</span> Linguistic structure and semantic 
                    patterns remain within normal statistical distribution. No significant manipulation signatures detected.
                  </p>
                  <ul className="text-sm text-emerald-600 space-y-1 mt-3 ml-4 list-disc">
                    <li>Balanced presentation of information</li>
                    <li>Appropriate uncertainty markers present</li>
                    <li>Credible sourcing detected</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 max-w-md">
            <span className="font-medium text-slate-700">Note:</span> This analysis provides 
            probabilistic indicators, not definitive truth. Always apply human judgment.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/explain")}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Deep Dive
            </button>

            <button
              onClick={() => navigate("/history")}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>

            <button
              onClick={downloadPDF}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SAFE STORAGE */
function getSafeResult() {
  try {
    const stored = localStorage.getItem("result");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}