import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatDate } from '../utils/xpUtils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const moodPointColor = (score) => {
  if (score >= 8) return '#2D6A4F'
  if (score >= 6) return '#52A07A'
  if (score >= 4) return '#D97706'
  if (score >= 2) return '#F97316'
  return '#EF4444'
}

export default function MoodChart({ moods }) {
  if (!moods || moods.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center h-52 gap-2">
        <span className="text-3xl">📊</span>
        <p className="text-ink-muted text-sm">No mood data yet — log your first mood!</p>
      </div>
    )
  }

  const sorted = [...moods].reverse()

  const data = {
    labels: sorted.map(m => formatDate(m.createdAt)),
    datasets: [{
      data: sorted.map(m => m.moodScore),
      borderColor: '#2D6A4F',
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
        gradient.addColorStop(0, 'rgba(45,106,79,0.18)')
        gradient.addColorStop(1, 'rgba(45,106,79,0.01)')
        return gradient
      },
      borderWidth: 2,
      pointBackgroundColor: sorted.map(m => moodPointColor(m.moodScore)),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4,
      fill: true,
    }],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1C1917',
        titleColor: '#F5F5F0',
        bodyColor: '#A8A29E',
        padding: 12,
        cornerRadius: 10,
        titleFont: { family: 'Fraunces', size: 14 },
        bodyFont: { family: 'Geist', size: 12 },
        callbacks: {
          title: (items) => `Mood: ${items[0].raw}/10`,
          label: (item) => sorted[item.dataIndex]?.text ? `"${sorted[item.dataIndex].text.slice(0, 40)}…"` : '',
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 10,
        grid: { color: 'rgba(168,162,158,0.12)' },
        ticks: { color: '#A8A29E', stepSize: 2, font: { family: 'Geist', size: 11 } },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#A8A29E', font: { family: 'Geist', size: 11 } },
        border: { display: false },
      },
    },
  }

  return (
    <div className="card animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-[var(--ink)] text-lg">Mood Trend</h3>
        <span className="badge badge-forest">Last {sorted.length} entries</span>
      </div>
      <Line data={data} options={options} />
    </div>
  )
}
