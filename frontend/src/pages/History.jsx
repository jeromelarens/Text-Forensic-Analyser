import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHistory } from "../api/analysisApi";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();

        const formatted = data.map(item => ({
          id: item._id,
          type: item.contentType,
          verdict: item.label,
          confidence: item.score, // ✅ keep 0–100 scale
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
      return { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", icon: "⚠️" };
    }
    if (v.includes("authentic") || v.includes("low")) {
      return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: "✓" };
    }
    return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: "◐" };
  };

  const stats = {
    total: history.length,
    highRisk: history.filter(h => h.confidence > 75).length,
    mediumRisk: history.filter(h => h.confidence > 50 && h.confidence <= 75).length,
    lowRisk: history.filter(h => h.confidence <= 50).length
  };

  return (
    <section className="w-full min-h-screen bg-slate-50 text-slate-800 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">

        <h1 className="text-3xl font-bold mb-6">Analysis History</h1>

        {/* Stats */}
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="High Risk" value={stats.highRisk} />
            <StatCard label="Moderate Risk" value={stats.mediumRisk} />
            <StatCard label="Low Risk" value={stats.lowRisk} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-slate-500">
            Loading history...
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="text-center py-12">
            <p className="mb-4 text-slate-500">No history found</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Start Analysis
            </button>
          </div>
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <div className="bg-white border rounded-xl divide-y">
            {history.map((item, idx) => {
              const verdictStyle = getVerdictStyle(item.verdict);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    localStorage.setItem(
                      "result",
                      JSON.stringify({
                        verdict: item.verdict,
                        confidence: item.confidence, // ✅ 0–100
                        signals: {},
                        type: item.type
                      })
                    );
                    navigate("/result");
                  }}
                  className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition"
                >
                  <div className="flex justify-between items-center">

                    <div>
                      <div className="font-semibold">{item.type}</div>
                      <div className="text-sm text-slate-500">{item.timestamp}</div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-medium ${verdictStyle.color}`}>
                        {verdictStyle.icon} {item.verdict}
                      </div>

                      <div className="text-sm font-semibold mt-1">
                        {Math.round(item.confidence)}%
                      </div>

                      <div className="w-32 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${
                            item.confidence > 75
                              ? "bg-rose-500"
                              : item.confidence > 50
                              ? "bg-amber-400"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

/* Simple Stat Card */
function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 text-center">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}