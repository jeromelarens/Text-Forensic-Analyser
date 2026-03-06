import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeText } from "../api/analysisApi";

export default function UploadText() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    try {
      setStatus("processing");

      const result = await analyzeText(text);

      // ✅ CORRECT BACKEND FIELD MAPPING
      localStorage.setItem(
        "result",
        JSON.stringify({
          verdict: result.label,          // backend -> label
          confidence: result.score,       // backend -> score (0–100)
          signals: result.signals,
          explanation: result.explanation,
          type: result.contentType
        })
      );

      navigate("/result");

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setStatus("idle");
    }
  };

  const charCount = text.length;
  const getCharCountColor = () => {
    if (charCount === 0) return "text-slate-400";
    if (charCount < 100) return "text-amber-600";
    if (charCount < 1000) return "text-emerald-600";
    return "text-cyan-600";
  };

  return (
    <section className="w-full bg-[#0a0a0a] text-slate-100 min-h-screen relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[150px]"></div>

      <div className="max-w-5xl mx-auto relative z-10 px-4 sm:px-6 py-12">

        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Neural Analysis Engine v4.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-violet-200 to-cyan-200 tracking-tight">
            Text Intelligence
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Inspection
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Advanced linguistic pattern recognition to detect emotional manipulation,
            logical fallacies, and rhetorical influence strategies.
          </p>
        </div>

        {/* Main Input Card */}
        <div className="relative group">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-[#111111] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
            {/* Card Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Input Analysis</h3>
                  <p className="text-xs text-slate-500">Paste content to begin scan</p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className={`w-1.5 h-1.5 rounded-full ${status === "processing" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></div>
                <span className="text-xs font-medium text-slate-400">
                  {status === "processing" ? "Processing" : "Ready"}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="relative">
                <textarea
                  className="w-full h-80 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 text-base leading-relaxed resize-none focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 text-slate-300 font-mono text-sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="// Paste your text here for neural analysis..."
                  spellCheck="false"
                />

                {/* Character Count - Floating */}
                <div className={`absolute bottom-4 right-4 text-xs font-mono font-medium ${getCharCountColor()} bg-[#111111] px-4 py-2 rounded-lg border border-white/10 shadow-xl`}>
                  {charCount.toLocaleString()} chars
                </div>

                {/* Scan Line Effect */}
                {status === "processing" && (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
                  </div>
                )}
              </div>

              {/* Processing Status Bar */}
              {status === "processing" && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing linguistic patterns...
                    </span>
                    <span className="text-cyan-400">Processing</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full animate-progress"></div>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI-Powered Detection
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span>9 Signal Vectors</span>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || status === "processing"}
                  className={`relative group px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                    !text.trim() || status === "processing"
                      ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
                      : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 text-white border-0 hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {status === "processing" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Initiate Scan
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            "Sentiment Analysis",
            "Propaganda Detection", 
            "Source Verification",
            "Emotional Manipulation",
            "Logical Fallacies"
          ].map((feature, idx) => (
            <div key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-slate-300 transition-colors cursor-default">
              {feature}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}