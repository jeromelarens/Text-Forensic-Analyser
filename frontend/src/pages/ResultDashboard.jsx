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
      <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-gradient-to-br from-white via-purple-50 to-indigo-50 flex items-center justify-center p-4 pt-14 sm:pt-16">
        <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50/90 to-indigo-100/70 -z-10"></div>
        <div className="text-center bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xl shadow-indigo-100/50 w-full max-w-sm sm:max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-600 text-base sm:text-lg font-medium mb-4 sm:mb-6">No analysis result found.</p>
          <button 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all"
          >
            Start New Analysis
          </button>
        </div>
      </div>
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
      rose: { primary: '#e11d48', bg: 'rgba(225,29,72,0.2)', light: '#fda4af' },
      amber: { primary: '#d97706', bg: 'rgba(217,119,6,0.2)', light: '#fcd34d' },
      emerald: { primary: '#059669', bg: 'rgba(5,150,105,0.2)', light: '#6ee7b7' }
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
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#7c3aed',
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
          font: { size: 11, family: 'Inter' }
        }
      }
    },
    scales: {
      r: {
        grid: { color: '#e2e8f0' },
        angleLines: { color: '#cbd5e1' },
        pointLabels: { 
          color: '#64748b',
          font: { size: 10 }
        },
        ticks: { color: '#94a3b8', backdropColor: 'transparent' }
      },
      x: {
        grid: { color: '#e2e8f0' },
        ticks: { 
          color: '#64748b',
          font: { size: 10 }
        }
      },
      y: {
        grid: { color: '#e2e8f0' },
        ticks: { 
          color: '#64748b',
          font: { size: 10 }
        }
      }
    }
  };

  /* ================= PDF ================= */
  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#faf5ff',
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
      className="fixed inset-0 w-screen h-screen overflow-y-auto bg-gradient-to-br from-white via-purple-50 to-indigo-50 text-slate-800 pt-14 sm:pt-16 md:pt-20"
    >
      {/* Full coverage background layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50/90 to-indigo-100/70 -z-10"></div>
      
      {/* Animated background elements - Purple/Indigo organic shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-0 left-0 w-full h-full bg-white/40"></div>
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-purple-200/50 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-indigo-200/40 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/3 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] bg-violet-100/60 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[130px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-fuchsia-100/40 rounded-full blur-[50px] sm:blur-[70px] lg:blur-[90px] animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 pb-12 sm:pb-16 md:pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 max-w-7xl mx-auto overflow-hidden">
          <button onClick={() => navigate("/")} className="hover:text-purple-600 transition-colors font-medium truncate">Dashboard</button>
          <span className="flex-shrink-0">/</span>
          <span className="text-slate-800 font-bold truncate">Analysis Report</span>
        </div>

        {/* HEADER */}
        <div className="text-center w-full mb-8 sm:mb-10 md:mb-12 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border border-purple-200 shadow-sm mb-6 sm:mb-8 hover:bg-purple-50/50 transition-colors cursor-default">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200/50 flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wider">Forensic Report</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="text-slate-800">AI Intelligence</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Report
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium px-2 sm:px-0">
            Multi-layer deception detection analysis with probabilistic fusion modeling 
            and explainable signal breakdown.
          </p>
        </div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 max-w-7xl mx-auto">
          <div className={`${status.bg} border ${status.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <span className="text-xl sm:text-2xl">{status.icon}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">Status</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${status.color}`}>{status.label}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{status.desc}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">Confidence</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{Math.round(animatedConfidence)}%</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">±{uncertainty.toFixed(1)}% uncertainty</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-100 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">Signals</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{Object.keys(signals).length}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Patterns detected</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-violet-100 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">Content Type</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize">{type}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Analyzed content</p>
          </div>
        </div>

        {/* CONFIDENCE METER */}
        <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 mb-8 sm:mb-10 shadow-sm max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">Confidence Distribution</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Aggregated signal probability</p>
            </div>
            <div className="text-left sm:text-right">
              <span className={`text-3xl sm:text-4xl md:text-5xl font-mono font-bold ${status.color}`}>
                {Math.round(animatedConfidence)}%
              </span>
            </div>
          </div>

          {/* Gradient progress bar */}
          <div className="h-3 sm:h-4 md:h-6 bg-purple-100 rounded-full overflow-hidden relative">
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
          
          <div className="flex justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500 font-medium">
            <span>Low Risk</span>
            <span>Moderate</span>
            <span>High Risk</span>
          </div>
        </div>

        {/* VISUAL SECTION - CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Signal Radar</h3>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] sm:text-xs font-semibold">Multi-dimensional</span>
            </div>
            <div className="aspect-square max-h-[280px] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px]">
              <Radar data={radarData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Signal Timeline</h3>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] sm:text-xs font-semibold">Distribution</span>
            </div>
            <div className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
              <Line data={timelineData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* HEATMAP GRID */}
        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-purple-100 shadow-sm mb-8 sm:mb-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Signal Intensity Heatmap</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-rose-500"></span>
              <span>High</span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-amber-400 ml-2 sm:ml-3"></span>
              <span>Med</span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-emerald-400 ml-2 sm:ml-3"></span>
              <span>Low</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {Object.entries(signals).map(([key, value]) => {
              const intensity = value > 75 ? 'bg-rose-500 text-white' : 
                              value > 50 ? 'bg-amber-400 text-white' : 
                              value > 25 ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-slate-600';
              
              return (
                <div
                  key={key}
                  className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center transition-transform hover:scale-105 cursor-default ${intensity}`}
                >
                  <div className="text-[10px] sm:text-xs font-bold opacity-90 mb-1 uppercase tracking-wider truncate">{key}</div>
                  <div className="text-xl sm:text-2xl font-bold">{value}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXPLAINABILITY */}
        <div className={`${status.bg} border ${status.border} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 mb-8 sm:mb-10 max-w-7xl mx-auto shadow-sm`}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${status.bg} border ${status.border} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${status.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-slate-900">Interpretation Summary</h3>
              
              {confidence > 75 && (
                <div className="space-y-2">
                  <p className="text-rose-700 leading-relaxed font-medium text-sm sm:text-base">
                    <span className="font-bold">High manipulation probability detected.</span> Multiple converging signals 
                    indicate coordinated deceptive patterns including emotional intensity spikes, absolutist language structures, 
                    and statistical anomalies in linguistic distribution.
                  </p>
                  <ul className="text-xs sm:text-sm text-rose-600 space-y-1 mt-2 sm:mt-3 ml-4 list-disc font-medium">
                    <li>Emotional manipulation markers present</li>
                    <li>Absolutist terminology frequency above threshold</li>
                    <li>Source credibility indicators weak or absent</li>
                  </ul>
                </div>
              )}

              {confidence > 50 && confidence <= 75 && (
                <div className="space-y-2">
                  <p className="text-amber-700 leading-relaxed font-medium text-sm sm:text-base">
                    <span className="font-bold">Moderate anomaly distribution.</span> Detected rhetorical framing 
                    signals and some statistical deviations, but patterns remain partially within normal parameters. 
                    Recommend additional verification.
                  </p>
                  <ul className="text-xs sm:text-sm text-amber-600 space-y-1 mt-2 sm:mt-3 ml-4 list-disc font-medium">
                    <li>Selective presentation of facts detected</li>
                    <li>Some contextual omissions identified</li>
                    <li>Mixed credibility indicators</li>
                  </ul>
                </div>
              )}

              {confidence <= 50 && (
                <div className="space-y-2">
                  <p className="text-emerald-700 leading-relaxed font-medium text-sm sm:text-base">
                    <span className="font-bold">Low deception indicators.</span> Linguistic structure and semantic 
                    patterns remain within normal statistical distribution. No significant manipulation signatures detected.
                  </p>
                  <ul className="text-xs sm:text-sm text-emerald-600 space-y-1 mt-2 sm:mt-3 ml-4 list-disc font-medium">
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between pt-6 sm:pt-8 border-t border-purple-100 max-w-7xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            <span className="font-bold text-slate-700">Note:</span> This analysis provides 
            probabilistic indicators, not definitive truth. Always apply human judgment.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/explain")}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-purple-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Deep Dive
            </button>

            <button
              onClick={() => navigate("/history")}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-purple-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>

            <button
              onClick={downloadPDF}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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