import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Skull,
  Frown,
  Meh,
  Smile,
  Laugh,
  PlugZap,
  BatteryLow,
  BatteryMedium,
  Zap,
  BatteryFull,
} from 'lucide-react';

const moodIcons = {
  0: { icon: Skull, color: 'text-red-500' },
  0.25: { icon: Frown, color: 'text-orange-500' },
  0.5: { icon: Meh, color: 'text-yellow-500' },
  0.75: { icon: Smile, color: 'text-lime-500' },
  1: { icon: Laugh, color: 'text-green-500' },
};

const energyIcons = {
  0: { icon: PlugZap, color: 'text-red-500' },
  0.25: { icon: BatteryLow, color: 'text-orange-500' },
  0.5: { icon: BatteryMedium, color: 'text-yellow-500' },
  0.75: { icon: Zap, color: 'text-lime-500' },
  1: { icon: BatteryFull, color: 'text-green-500' },
};

const MetricForm = () => {
  const initialForm = {
    date: '',
    sleepHours: 6,
    mood: 0.5,
    energy: 0.5,
  };

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    const numericFields = ['sleepHours', 'mood', 'energy'];
    const parsedValue =
      typeof value === 'string' && numericFields.includes(field)
        ? parseFloat(value)
        : value;

    setForm((prev) => ({
      ...prev,
      [field]: parsedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.date) return;

    toast.success('Metrics submitted!');
    setForm(initialForm);
    setSubmitted(false);
  };

  const getMoodIcon = (value: number) => {
    const { icon: Icon, color } = moodIcons[value as keyof typeof moodIcons];
    return (
      <Icon key={value} className={`w-12 h-12 ${color} animate-fade-in-up`} />
    );
  };

  const getEnergyIcon = (value: number) => {
    const { icon: Icon, color } =
      energyIcons[value as keyof typeof energyIcons];
    return (
      <Icon key={value} className={`w-12 h-12 ${color} animate-fade-in-up`} />
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-3xl mx-auto text-gray-900'
    >
      {/* Date */}
      <div className='flex flex-col'>
        <label htmlFor='date' className='font-medium mb-1'>
          Date
        </label>
        <input
          type='date'
          id='date'
          name='date'
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`border rounded px-3 py-2 ${
            submitted && !form.date ? 'border-red-500' : 'border-gray-300'
          }`}
          // no required — validate manually!
        />
        {submitted && !form.date && (
          <span className='text-sm text-red-500 mt-1'>Date is required</span>
        )}
      </div>

      {/* Mood + Energy */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Mood */}
        <div>
          <label htmlFor='mood' className='block font-medium mb-1'>
            Mood
          </label>
          <div className='flex items-center justify-between gap-4'>
            <div className='text-center'>{getMoodIcon(form.mood)}</div>
            <input
              type='range'
              id='mood'
              name='mood'
              min={0}
              max={1}
              step={0.25}
              value={form.mood}
              onChange={(e) => handleChange('mood', e.target.value)}
              className='flex-grow'
            />
            <div className='w-10 text-sm text-center'>
              {Math.round(form.mood * 100)}%
            </div>
          </div>
        </div>

        {/* Energy */}
        <div>
          <label htmlFor='energy' className='block font-medium mb-1'>
            Energy
          </label>
          <div className='flex items-center justify-between gap-4'>
            <div className='text-center'>{getEnergyIcon(form.energy)}</div>
            <input
              type='range'
              id='energy'
              name='energy'
              min={0}
              max={1}
              step={0.25}
              value={form.energy}
              onChange={(e) => handleChange('energy', e.target.value)}
              className='flex-grow'
            />
            <div className='w-10 text-sm text-center'>
              {Math.round(form.energy * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Hours */}
      <div>
        <label htmlFor='sleepHours' className='block font-medium mb-1'>
          Sleep Hours
        </label>
        <input
          type='range'
          id='sleepHours'
          name='sleepHours'
          min={0}
          max={12}
          step={0.5}
          value={form.sleepHours}
          onChange={(e) => handleChange('sleepHours', Number(e.target.value))}
          className='w-full'
        />
        <div
          key={form.sleepHours}
          className='mt-4 text-center animate-fade-in-up'
        >
          <div className='text-5xl font-bold text-gray-900 leading-tight'>
            {form.sleepHours.toFixed(1)}
          </div>
          <div className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
            hrs
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className='pt-2'>
        <button
          type='submit'
          className='w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded transition'
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MetricForm;
