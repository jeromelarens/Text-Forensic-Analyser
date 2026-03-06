import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ScoreBreakdown({ scores }) {
  // Handle empty or invalid data
  if (!scores || typeof scores !== 'object') {
    return (
      <div className="mt-6 p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">No score data available</p>
      </div>
    );
  }

  // Safe value extraction with defaults
  const safeValue = (val) => typeof val === 'number' && !isNaN(val) ? val : 0;

  const data = {
    labels: ["Text Analysis", "Image Analysis", "Video Analysis"],
    datasets: [
      {
        label: "Deception Score",
        data: [
          safeValue(scores.text),
          safeValue(scores.image),
          safeValue(scores.video),
        ],
        backgroundColor: [
          "rgba(37, 99, 235, 0.8)",   // Blue - Text
          "rgba(22, 163, 74, 0.8)",   // Green - Image
          "rgba(147, 51, 234, 0.8)",  // Purple - Video
        ],
        borderColor: [
          "rgb(37, 99, 235)",
          "rgb(22, 163, 74)",
          "rgb(147, 51, 234)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const percentage = Math.round(value * 100);
            let risk = 'Low';
            if (value > 0.7) risk = 'High';
            else if (value > 0.4) risk = 'Moderate';
            return [`Score: ${percentage}%`, `Risk Level: ${risk}`];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#64748b',
          callback: function(value) {
            return (value * 100) + '%';
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            weight: '500',
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  // Calculate statistics
  const values = [safeValue(scores.text), safeValue(scores.image), safeValue(scores.video)];
  const maxScore = Math.max(...values);
  const avgScore = values.reduce((a, b) => a + b, 0) / values.length;

  const getHighestRiskType = () => {
    if (maxScore === 0) return 'None';
    if (safeValue(scores.text) === maxScore) return 'Text';
    if (safeValue(scores.image) === maxScore) return 'Image';
    return 'Video';
  };

  return (
    <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-slate-900">
            Score Breakdown
          </h3>
          <p className="text-sm text-slate-500">Deception analysis by content type</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-xl bg-blue-50">
          <p className="text-xs text-blue-600 uppercase tracking-wider font-medium">Text</p>
          <p className="text-xl font-bold text-blue-700">{Math.round(safeValue(scores.text) * 100)}%</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-green-50">
          <p className="text-xs text-green-600 uppercase tracking-wider font-medium">Image</p>
          <p className="text-xl font-bold text-green-700">{Math.round(safeValue(scores.image) * 100)}%</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-purple-50">
          <p className="text-xs text-purple-600 uppercase tracking-wider font-medium">Video</p>
          <p className="text-xl font-bold text-purple-700">{Math.round(safeValue(scores.video) * 100)}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>

      {/* Footer insight */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            maxScore > 0.7 ? 'bg-rose-100 text-rose-600' :
            maxScore > 0.4 ? 'bg-amber-100 text-amber-600' :
            'bg-emerald-100 text-emerald-600'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              Highest Risk: <span className="font-bold">{getHighestRiskType()}</span> ({Math.round(maxScore * 100)}%)
            </p>
            <p className="text-xs text-slate-500">
              Average across all types: {Math.round(avgScore * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// PropTypes
ScoreBreakdown.propTypes = {
  scores: PropTypes.shape({
    text: PropTypes.number,
    image: PropTypes.number,
    video: PropTypes.number,
  })
};

ScoreBreakdown.defaultProps = {
  scores: null
};