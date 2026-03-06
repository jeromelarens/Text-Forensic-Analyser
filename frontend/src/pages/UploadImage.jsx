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
    <section className="min-h-screen bg-[#0a0a0a] text-slate-100 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Neural Vision Engine v4.4</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-violet-200 to-fuchsia-200">
              Image Intelligence
              <span className="block mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Forensics
              </span>
            </h1>
            
            <p className="text-slate-400 max-w-lg mx-auto">
              Advanced neural analysis to detect AI-generated content, synthetic media, and digital manipulation signatures.
            </p>
          </div>

          {/* Main Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#111111] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              {/* Card Header */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Image Analysis</h3>
                    <p className="text-xs text-slate-500">Upload for neural scan</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === "processing" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></div>
                  <span className="text-xs font-medium text-slate-400">
                    {status === "processing" ? "Processing" : "Ready"}
                  </span>
                </div>
              </div>

              <div className="p-8">
                {!preview ? (
                  <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-violet-500/50 hover:bg-white/[0.02] transition-all group/upload">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium mb-2">Drop image or click to upload</span>
                    <span className="text-xs text-slate-500 font-mono">
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
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-80 object-contain"
                      />
                      
                      {/* Scan Line Effect */}
                      {status === "processing" && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-300">{image.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{(image.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>

                      <button
                        onClick={resetImage}
                        disabled={status === "processing"}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {status === "processing" && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing neural signatures...
                      </span>
                      <span className="text-cyan-400">Processing</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full animate-progress w-full"></div>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      SHA-256 Verified
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span>3 Neural Models</span>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!image || status === "processing"}
                    className={`relative group px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                      !image || status === "processing"
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
                          Analyzing...
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "CLIP Vision Analysis",
              "Entropy Detection", 
              "Metadata Forensics",
              "Signature Scanning",
              "Log-Odds Fusion"
            ].map((feature, idx) => (
              <div key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-slate-300 transition-colors cursor-default">
                {feature}
              </div>
            ))}
          </div>

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