import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useState, useRef } from 'react';

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

const fullMockData = [
  { date: '2025-06-19', sleep: 6.3, mood: 2, energy: 2 },
  { date: '2025-06-20', sleep: 6.1, mood: 1, energy: 1 },
  { date: '2025-06-21', sleep: 7.3, mood: 2, energy: 2 },
  { date: '2025-06-22', sleep: 8.0, mood: 3, energy: 3 },
  { date: '2025-06-23', sleep: 6.9, mood: 2, energy: 2 },
  { date: '2025-06-24', sleep: 5.5, mood: 1, energy: 1 },
  { date: '2025-06-25', sleep: 6.7, mood: 2, energy: 2 },
  { date: '2025-06-26', sleep: 7.0, mood: 3, energy: 3 },
  { date: '2025-06-27', sleep: 7.8, mood: 3, energy: 3 },
  { date: '2025-06-28', sleep: 6.5, mood: 2, energy: 2 },
  { date: '2025-06-29', sleep: 5.9, mood: 1, energy: 1 },
  { date: '2025-06-30', sleep: 6.0, mood: 2, energy: 2 },
  { date: '2025-07-01', sleep: 7.1, mood: 3, energy: 3 },
  { date: '2025-07-02', sleep: 6.2, mood: 2, energy: 2 },
  { date: '2025-07-03', sleep: 7.3, mood: 3, energy: 3 },
  { date: '2025-07-04', sleep: 6.6, mood: 2, energy: 2 },
  { date: '2025-07-05', sleep: 5.5, mood: 1, energy: 1 },
  { date: '2025-07-06', sleep: 6.8, mood: 2, energy: 2 },
  { date: '2025-07-07', sleep: 7.5, mood: 3, energy: 3 },
  { date: '2025-07-08', sleep: 7.0, mood: 3, energy: 3 },
  { date: '2025-07-09', sleep: 6.2, mood: 2, energy: 2 },
  { date: '2025-07-10', sleep: 5.8, mood: 1, energy: 1 },
  { date: '2025-07-11', sleep: 6.3, mood: 2, energy: 2 },
  { date: '2025-07-12', sleep: 6.0, mood: 2, energy: 2 },
  { date: '2025-07-13', sleep: 6.9, mood: 3, energy: 3 },
  { date: '2025-07-14', sleep: 7.0, mood: 3, energy: 3 },
  { date: '2025-07-15', sleep: 6.4, mood: 2, energy: 2 },
  { date: '2025-07-16', sleep: 8.0, mood: 3, energy: 3 },
  { date: '2025-07-17', sleep: 7.3, mood: 2, energy: 2 },
  { date: '2025-07-18', sleep: 6.8, mood: 1, energy: 2 },
];

const baseOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { intersect: false, mode: 'index' },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
} as const;

type ChartType = 'sleep' | 'mood' | 'energy' | null;

const TrendCharts = () => {
  const [activeChart, setActiveChart] = useState<ChartType>(null);
  const [range, setRange] = useState(7);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredData = fullMockData.slice(-range);
  const labels = filteredData.map((d) => d.date);

  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Sleep (hrs)',
        data: filteredData.map((d) => d.sleep),
        borderColor: '#60a5fa',
        backgroundColor: '#bfdbfe',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const moodData = {
    labels,
    datasets: [
      {
        label: 'Mood',
        data: filteredData.map((d) => d.mood),
        backgroundColor: filteredData.map((d) =>
          d.mood === 1 ? '#f87171' : d.mood === 2 ? '#facc15' : '#4ade80'
        ),
      },
    ],
  };

  const energyData = {
    labels,
    datasets: [
      {
        label: 'Energy',
        data: filteredData.map((d) => d.energy),
        borderColor: '#34d399',
        borderDash: [5, 5],
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setActiveChart(null);
    }
  };

  const renderChart = (type: ChartType, large = false) => {
    const title =
      type === 'sleep'
        ? 'Sleep Trend'
        : type === 'mood'
        ? 'Mood Trend'
        : 'Energy Trend';

    const chart =
      type === 'sleep' ? (
        <Line data={sleepData} options={baseOptions} />
      ) : type === 'mood' ? (
        <Bar data={moodData} options={baseOptions} />
      ) : (
        <Line data={energyData} options={baseOptions} />
      );

    const wrapperStyles = large
      ? 'max-w-5xl w-full scale-100 animate-fade-in-up'
      : 'hover:scale-[1.02] transition-transform duration-200';

    return (
      <div
        className={`bg-white border border-gray-200 shadow-sm rounded-xl p-4 cursor-pointer ${wrapperStyles}`}
        onClick={() => !large && setActiveChart(type)}
      >
        <h2 className='text-xl font-semibold mb-4 text-gray-900'>{title}</h2>
        {chart}
      </div>
    );
  };

  return (
    <section className='py-6'>
      <div className='mb-6 flex justify-center gap-4'>
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            onClick={() => setRange(days)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              range === days
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            } transition`}
          >
            Last {days} Days
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {renderChart('sleep')}
        {renderChart('mood')}
        {renderChart('energy')}
      </div>

      {activeChart && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'
          onClick={handleClickOutside}
        >
          <div
            ref={modalRef}
            className='relative bg-white p-6 rounded-xl shadow-lg max-w-6xl w-full mx-4 animate-fade-in-up'
          >
            <button
              className='absolute top-4 right-4 text-gray-600 hover:text-black text-xl'
              onClick={() => setActiveChart(null)}
              aria-label='Close'
            >
              ×
            </button>
            {renderChart(activeChart, true)}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendCharts;
