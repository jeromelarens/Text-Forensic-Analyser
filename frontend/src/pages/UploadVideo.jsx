import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeVideo } from "../api/analysisApi";

export default function UploadVideo() {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!video) return;

    try {
      setStatus("processing");

      // 🔥 PASS FILE DIRECTLY
      const data = await analyzeVideo(video);

      const result = {
        verdict: data.label,
        confidence: data.score / 100,
        type: "video",
        timestamp: new Date().toLocaleString(),
      };

      localStorage.setItem("result", JSON.stringify(result));

      navigate("/result");

    } catch (err) {
      console.error(err);
      alert("Video analysis failed");
      setStatus("idle");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get video duration (mock for UI)
  const getDuration = () => {
    return "Auto-detect";
  };

  return (
    <section className="w-full bg-slate-50 text-slate-800 mt-7 relative min-h-screen">
      {/* Background ambient effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-200/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-red-200/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 px-4 sm:px-6 pb-12">
        {/* Header Section */}
        <div className="mb-10 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Video Analysis Module</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs text-slate-500">Multimodal AI Active</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900 tracking-tight">
            Video Intelligence
            <span className="text-rose-600"> Inspection</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Comprehensive video analysis examining visual frames, audio synchronization, 
            transcript semantics, and temporal inconsistencies to detect deepfakes, 
            manipulations, and deceptive editing techniques.
          </p>
        </div>

        {/* Analysis Capabilities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "🎬", label: "Frame Analysis", desc: "Per-frame forensic inspection" },
            { icon: "🎵", label: "Audio Sync", desc: "Lip-sync & audio alignment" },
            { icon: "🤖", label: "Deepfake Detect", desc: "AI-generated content flags" },
            { icon: "📜", label: "Transcript NLP", desc: "Speech-to-text analysis" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-rose-300 hover:shadow-md hover:shadow-rose-100 transition-all group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-rose-50 transition-colors">
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 mb-1">{item.label}</div>
              <div className="text-xs text-slate-500 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Main Upload Card */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
          {/* Card Header */}
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700">Video Upload</span>
            </div>
            {video && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium text-emerald-700">{video.name}</span>
              </div>
            )}
          </div>

          {/* Upload/Preview Area */}
          <div className="p-8">
            {!preview ? (
              <div className="relative">
                <label className="group cursor-pointer flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed border-slate-300 hover:border-rose-400 hover:bg-rose-50/30 transition-all duration-300 bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-200/50">
                      <svg className="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mb-2 text-lg font-semibold text-slate-700">Drop your video here</p>
                    <p className="text-sm text-slate-500 mb-4">or click to browse from your device</p>
                    <span className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm group-hover:border-rose-300 group-hover:text-rose-600 transition-colors">
                      Select Video
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </label>
                
                {/* Supported formats hint */}
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <p className="text-xs text-slate-400">Supports: MP4, MOV, AVI, WebM • Max 100MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Video Preview Container */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                  <video
                    src={preview}
                    controls
                    className="w-full max-h-[400px] object-contain mx-auto"
                  />
                  
                  {/* Video overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm truncate max-w-[200px] sm:max-w-md">{video.name}</p>
                          <p className="text-xs text-white/70 flex items-center gap-2">
                            <span>{formatFileSize(video.size)}</span>
                            <span>•</span>
                            <span>{getDuration()}</span>
                            <span>•</span>
                            <span className="uppercase">{video.type.split('/')[1]}</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setVideo(null);
                          setPreview(null);
                        }}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Analysis Pipeline Visualization */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Analysis Pipeline
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { step: "1", label: "Frame Extraction", icon: "🎞️" },
                      { step: "2", label: "Audio Separation", icon: "🔊" },
                      { step: "3", label: "Transcription", icon: "📝" },
                      { step: "4", label: "Cross-Analysis", icon: "⚡" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200 hover:border-rose-300 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mb-2">
                          <span className="text-sm">{item.icon}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-600 text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Processing State */}
            {status === "processing" && (
              <div className="mt-6 flex items-center gap-4 p-5 rounded-xl bg-rose-50 border border-rose-200">
                <div className="relative">
                  <div className="w-10 h-10 border-3 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-rose-800">Processing video...</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                  <div className="text-xs text-rose-600">Extracting frames, analyzing audio sync, and running deepfake detection...</div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-rose-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs">🔒</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs">🛡️</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Secure:</span> Video processed in-memory, never stored
                </span>
              </div>

              <div className="flex items-center gap-3">
                {preview && (
                  <button
                    onClick={() => {
                      setVideo(null);
                      setPreview(null);
                    }}
                    disabled={status === "processing"}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Change Video
                  </button>
                )}
                
                <button
                  onClick={handleAnalyze}
                  disabled={!video || status === "processing"}
                  className={`
                    group relative px-8 py-3.5 rounded-xl font-semibold text-sm
                    transition-all duration-300 overflow-hidden flex items-center gap-2
                    ${!video || status === "processing" 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                      : "bg-rose-600 text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 hover:bg-rose-700"
                    }
                  `}
                >
                  {status === "processing" ? (
                    <>
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <span>Run Video Analysis</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 mb-1">Optimal Length</div>
              <div className="text-xs text-slate-500">Videos under 5 minutes process fastest. Longer videos are sampled for analysis.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 mb-1">Privacy First</div>
              <div className="text-xs text-slate-500">Videos are streamed for analysis only. No files are ever saved to our servers.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 mb-1">Multimodal AI</div>
              <div className="text-xs text-slate-500">Combines computer vision, audio analysis, and NLP for comprehensive detection.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}