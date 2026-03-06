import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full text-textPrimary pt-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]"></div>
      </div>

      <PageContainer className="relative z-10">
        {/* HERO SECTION */}
        <div className="text-center max-w-5xl mx-auto mb-20 pt-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">AI-Powered Content Analysis</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Don't Trust Content.
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Interrogate It.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Uncover hidden biases, detect manipulation tactics, and expose uncertainty 
            across every medium — from written narratives to visual media and video streams.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        {/* ANALYSIS CARDS GRID */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-heading font-semibold text-slate-200 mb-2">Choose Analysis Type</h2>
            <p className="text-slate-500">Select the content format you want to investigate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <AnalysisCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Text Intelligence"
              subtitle="Written Content"
              description="Detect emotional manipulation, logical fallacies, unsupported claims, and linguistic patterns designed to influence opinion without evidence."
              features={["Sentiment Analysis", "Claim Verification", "Bias Detection", "Source Attribution"]}
              color="from-emerald-500 to-teal-600"
              accentColor="emerald"
              onClick={() => navigate("/upload/text")}
            />

            <AnalysisCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Visual Intelligence"
              subtitle="Images & Graphics"
              description="Analyze image composition, detect selective framing, identify manipulated or out-of-context visuals, and trace source authenticity."
              features={["Image Forensics", "Context Analysis", "Metadata Extraction", "Reverse Search"]}
              color="from-purple-500 to-indigo-600"
              accentColor="purple"
              onClick={() => navigate("/upload/image")}
            />

            <AnalysisCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
              title="Video Intelligence"
              subtitle="Video Content"
              description="Multi-layered video analysis examining frame sequences, audio-text alignment, deepfake indicators, and narrative construction techniques."
              features={["Frame Analysis", "Audio Sync Check", "Deepfake Detection", "Transcript Analysis"]}
              color="from-orange-500 to-rose-600"
              accentColor="orange"
              onClick={() => navigate("/upload/video")}
            />
          </div>
        </div>

        {/* TRUST INDICATORS */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-slate-400">Accuracy Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50ms</div>
                <div className="text-sm text-slate-400">Response Time</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-slate-400">Availability</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Zero</div>
                <div className="text-sm text-slate-400">Data Retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="max-w-4xl mx-auto text-center pb-20">
          <div className="inline-flex items-start gap-3 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
            <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-200/80 leading-relaxed text-left">
              <span className="font-semibold text-amber-300">Important:</span> This system provides 
              probabilistic assessments based on pattern recognition, not absolute truth claims. 
              Results should inform — not replace — human critical thinking and verification in 
              high-stakes information environments.
            </p>
          </div>
        </div>

      </PageContainer>
    </div>
  );
}

/* ENHANCED ANALYSIS CARD */
function AnalysisCard({ icon, title, subtitle, description, features, color, accentColor, onClick }) {
  const accentColors = {
    emerald: "group-hover:shadow-emerald-500/20 group-hover:border-emerald-500/50",
    purple: "group-hover:shadow-purple-500/20 group-hover:border-purple-500/50",
    orange: "group-hover:shadow-orange-500/20 group-hover:border-orange-500/50"
  };

  const buttonColors = {
    emerald: "from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500",
    purple: "from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500",
    orange: "from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500"
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative
        bg-slate-900/50 backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-8
        cursor-pointer
        transition-all duration-500
        hover:-translate-y-3
        hover:bg-slate-800/50
        ${accentColors[accentColor]}
        shadow-xl shadow-black/20
      `}
    >
      {/* Gradient orb on hover */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${color} rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

      {/* Icon container */}
      <div className={`
        inline-flex items-center justify-center
        w-16 h-16 rounded-2xl mb-6
        bg-gradient-to-br ${color}
        text-white
        shadow-lg
        transform group-hover:scale-110 group-hover:rotate-3
        transition-all duration-500
      `}>
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{subtitle}</div>
        <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed mb-6 text-sm">
          {description}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {features.map((feature, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300 transition-colors"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button className={`
          w-full py-4 rounded-xl
          bg-gradient-to-r ${buttonColors[accentColor]}
          text-white font-semibold text-sm
          shadow-lg shadow-black/30
          transform group-hover:translate-y-0
          transition-all duration-300
          flex items-center justify-center gap-2
          group/btn
        `}>
          <span>Start Analysis</span>
          <svg 
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-tr-3xl transition-opacity duration-500`}></div>
    </div>
  );
}