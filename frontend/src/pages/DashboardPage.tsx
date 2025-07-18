import { useState } from 'react';
import MetricForm from '../components/MetricForm';
import TrendCharts from '../components/TrendCharts';

const DashboardPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className='max-w-5xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className='px-5 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition'
        >
          {showForm ? 'Hide Metric Form' : '➕ Add Metric'}
        </button>
      </div>

      <section
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showForm ? 'max-h-[1000px] opacity-100 mb-10' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-6'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900'>
            Add New Metric
          </h2>
          <MetricForm />
        </div>
      </section>

      <section className='mt-6'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-900'>
          Trends Overview
        </h2>
        <TrendCharts />
      </section>
    </main>
  );
};

export default DashboardPage;
