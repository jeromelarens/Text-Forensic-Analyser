import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-gradient-to-br from-white via-purple-50 to-indigo-50 text-slate-800 pt-14 sm:pt-16 md:pt-20">
      {/* Full coverage background layer - covers entire viewport */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50/90 to-indigo-100/70 -z-10"></div>

      {/* Animated background elements - Purple/Indigo organic shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-0 left-0 w-full h-full bg-white/40"></div>
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-purple-200/50 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-indigo-200/40 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] bg-violet-100/60 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[130px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-fuchsia-100/40 rounded-full blur-[50px] sm:blur-[70px] lg:blur-[90px] animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen">
        {/* HERO SECTION - Full width */}
        <div className="text-center w-full px-4 sm:px-6 lg:px-8 xl:px-12 mb-12 sm:mb-16 md:mb-20 pt-6 sm:pt-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border border-purple-200 shadow-sm mb-6 sm:mb-8 hover:bg-purple-50/50 transition-colors cursor-default">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-600 animate-pulse flex-shrink-0"></span>
            <span className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wider">AI-Powered Content Analysis</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="text-slate-800">
              Don't Trust Content.
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Interrogate It.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 font-medium px-2 sm:px-0">
            Uncover hidden biases, detect manipulation tactics, and expose uncertainty 
            across every medium — from written narratives to visual media and video streams.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-purple-100 shadow-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-indigo-100 shadow-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-violet-100 shadow-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        {/* ANALYSIS CARDS GRID - Full width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800 mb-2 sm:mb-3">Choose Analysis Type</h2>
            <p className="text-slate-600 text-base sm:text-lg px-2 sm:px-0">Select the content format you want to investigate</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <AnalysisCard
              icon={
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Text Intelligence"
              subtitle="Written Content"
              description="Detect emotional manipulation, logical fallacies, unsupported claims, and linguistic patterns designed to influence opinion without evidence."
              features={["Sentiment Analysis", "Claim Verification", "Bias Detection", "Source Attribution"]}
              color="from-purple-500 to-indigo-600"
              accentColor="purple"
              onClick={() => navigate("/upload/text")}
            />

            <AnalysisCard
              icon={
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Visual Intelligence"
              subtitle="Images & Graphics"
              description="Analyze image composition, detect selective framing, identify manipulated or out-of-context visuals, and trace source authenticity."
              features={["Image Forensics", "Context Analysis", "Metadata Extraction", "Reverse Search"]}
              color="from-indigo-500 to-violet-600"
              accentColor="indigo"
              onClick={() => navigate("/upload/image")}
            />
          </div>
        </div>

        {/* TRUST INDICATORS - Full width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mb-12 sm:mb-16 md:mb-20">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-indigo-900/5 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">98%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Accuracy Rate</div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600">50ms</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Response Time</div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-600">24/7</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Availability</div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-fuchsia-600">Zero</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Data Retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER - Full width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 shadow-sm w-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm sm:text-base text-amber-900 leading-relaxed text-left font-medium">
                <span className="font-bold text-amber-950">Important:</span> This system provides 
                probabilistic assessments based on pattern recognition, not absolute truth claims. 
                Results should inform — not replace — human critical thinking and verification in 
                high-stakes information environments.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ENHANCED ANALYSIS CARD - Purple/Indigo Theme */
function AnalysisCard({ icon, title, subtitle, description, features, color, accentColor, onClick }) {
  const accentColors = {
    purple: "group-hover:shadow-purple-200/60 group-hover:border-purple-300",
    indigo: "group-hover:shadow-indigo-200/60 group-hover:border-indigo-300",
    violet: "group-hover:shadow-violet-200/60 group-hover:border-violet-300"
  };

  const buttonColors = {
    purple: "from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500",
    indigo: "from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500",
    violet: "from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500"
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative
        bg-white/95 backdrop-blur-xl
        border border-purple-100
        rounded-2xl sm:rounded-3xl
        p-5 sm:p-6 md:p-8
        cursor-pointer
        transition-all duration-500
        hover:-translate-y-2 sm:hover:-translate-y-3
        hover:bg-white
        ${accentColors[accentColor]}
        shadow-lg shadow-indigo-100/50
      `}
    >
      {/* Gradient orb on hover */}
      <div className={`absolute -top-20 -right-20 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br ${color} rounded-full blur-[50px] sm:blur-[60px] md:blur-[80px] opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>

      {/* Icon container */}
      <div className={`
        inline-flex items-center justify-center
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 md:mb-6
        bg-gradient-to-br ${color}
        text-white
        shadow-lg shadow-purple-200/50
        transform group-hover:scale-110 group-hover:rotate-3
        transition-all duration-500
      `}>
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-xs sm:text-sm font-bold text-purple-700 uppercase tracking-wider mb-1.5 sm:mb-2">{subtitle}</div>
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-purple-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm font-medium">
          {description}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6 md:mb-8">
          {features.map((feature, idx) => (
            <span 
              key={idx}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[10px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-100 group-hover:text-purple-800 transition-colors"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button className={`
          w-full py-3 sm:py-4 rounded-lg sm:rounded-xl
          bg-gradient-to-r ${buttonColors[accentColor]}
          text-white font-bold text-xs sm:text-sm
          shadow-lg shadow-purple-200/50
          transform group-hover:translate-y-0
          transition-all duration-300
          flex items-center justify-center gap-2
          group/btn
        `}>
          <span>Start Analysis</span>
          <svg 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-tr-2xl sm:rounded-tr-3xl transition-opacity duration-500`}></div>
    </div>
  );
}