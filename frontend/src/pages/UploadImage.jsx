import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeImage } from "../api/analysisApi";

export default function UploadImage() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");

  /* ===============================
     CLEANUP PREVIEW MEMORY
  =============================== */
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ===============================
     HANDLE IMAGE SELECT
  =============================== */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type. Please upload an image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ===============================
     HANDLE ANALYSIS
  =============================== */
  const handleAnalyze = async () => {
    if (!image || status === "processing") return;

    try {
      setStatus("processing");

      const data = await analyzeImage(image);

      const result = {
        verdict: data.verdict,
        confidence: Number(data.confidence) || 0,
        description: data.description,
        severity: data.severity,
        riskLevel: data.riskLevel,
        signals: data.signals || {},
        type: "image",
        timestamp: new Date().toLocaleString(),
      };

      localStorage.setItem("result", JSON.stringify(result));
      navigate("/result");

    } catch (err) {
      console.error(err);
      alert("Image analysis failed.");
      setStatus("idle");
    }
  };

  /* ===============================
     RESET IMAGE
  =============================== */
  const resetImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-gradient-to-br from-white via-purple-50 to-indigo-50 text-slate-800 pt-14 sm:pt-16 md:pt-20">
      {/* Full coverage background layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50/90 to-indigo-100/70 -z-10"></div>
      
      {/* Animated background elements - Purple/Indigo organic shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-0 left-0 w-full h-full bg-white/40"></div>
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-purple-200/50 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-indigo-200/40 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] bg-violet-100/60 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[130px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-fuchsia-100/40 rounded-full blur-[50px] sm:blur-[70px] lg:blur-[90px] animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16 md:pb-20">
        {/* Header Section */}
        <div className="text-center w-full mb-8 sm:mb-10 md:mb-12 pt-6 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border border-purple-200 shadow-sm mb-6 sm:mb-8 hover:bg-purple-50/50 transition-colors cursor-default">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-600 animate-pulse flex-shrink-0"></span>
            <span className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wider">Neural Vision Engine v4.4</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="text-slate-800">Image Intelligence</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Forensics
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium px-2 sm:px-0">
            Advanced neural analysis to detect AI-generated content, synthetic media, and digital manipulation signatures.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-indigo-100/50">
              {/* Card Header */}
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 bg-purple-50/30">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200/50 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800">Image Analysis</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Upload for neural scan</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-purple-200 shadow-sm self-start sm:self-auto">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status === "processing" ? "bg-amber-400 animate-pulse" : "bg-purple-500"}`}></div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">
                    {status === "processing" ? "Processing" : "Ready"}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                {!preview ? (
                  <label className="flex flex-col items-center justify-center h-48 sm:h-56 md:h-64 lg:h-72 border-2 border-dashed border-purple-200 rounded-xl sm:rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all group/upload bg-slate-50/50 px-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center mb-3 sm:mb-4 group-hover/upload:scale-110 transition-transform">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-bold text-sm sm:text-base mb-1.5 sm:mb-2 text-center">Drop image or click to upload</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-mono text-center">
                      JPG • PNG • WebP • GIF • Max 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-purple-100 bg-slate-50">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-48 sm:max-h-64 md:max-h-72 lg:max-h-80 object-contain"
                      />
                      
                      {/* Scan Line Effect */}
                      {status === "processing" && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-1 sm:px-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-700 truncate">{image.name}</div>
                          <div className="text-[10px] sm:text-xs text-slate-500 font-mono">{(image.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>

                      <button
                        onClick={resetImage}
                        disabled={status === "processing"}
                        className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-red-200 self-start sm:self-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {status === "processing" && (
                  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600">
                      <span className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 animate-spin text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="truncate">Analyzing neural signatures...</span>
                      </span>
                      <span className="text-purple-600 flex-shrink-0 ml-2">Processing</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 rounded-full animate-progress w-full"></div>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      SHA-256 Verified
                    </span>
                    <span className="w-1 h-1 rounded-full bg-purple-300 flex-shrink-0 hidden sm:block"></span>
                    <span className="hidden sm:inline">3 Neural Models</span>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!image || status === "processing"}
                    className={`relative group px-5 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 self-stretch sm:self-auto ${
                      !image || status === "processing"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 hover:-translate-y-0.5"
                    }`}
                  >
                    {status === "processing" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="truncate">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span className="truncate">Initiate Scan</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto px-2 sm:px-0">
          {[
            "CLIP Vision Analysis",
            "Entropy Detection", 
            "Metadata Forensics",
            "Signature Scanning",
            "Log-Odds Fusion"
          ].map((feature, idx) => (
            <div key={idx} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-purple-200 text-xs sm:text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-default">
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
          100% { transform: translateY(100%); opacity: 0; }
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
    </div>
  );
}