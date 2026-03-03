import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatDate, getMoodColor } from '../utils/xpUtils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function MoodChart({ moods }) {
  if (!moods || moods.length === 0) {
    return (
      <div className="card flex items-center justify-center h-48">
        <p className="text-textSecondary">No mood data yet. Log your first mood!</p>
      </div>
    )
  }

  const sorted = [...moods].reverse()

  const data = {
    labels: sorted.map((m) => formatDate(m.createdAt)),
    datasets: [
      {
        data: sorted.map((m) => m.moodScore),
        borderColor: '#5B6CFF',
        backgroundColor: 'rgba(91,108,255,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: sorted.map((m) => getMoodColor(m.moodScore)),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: { color: 'rgba(100,116,139,0.08)' },
        ticks: { color: '#64748B', stepSize: 2, font: { family: 'DM Sans' } },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { family: 'DM Sans' } },
        border: { display: false },
      },
    },
  }

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-4">Mood Trend</h3>
      <Line data={data} options={options} />
    </div>
  )
}