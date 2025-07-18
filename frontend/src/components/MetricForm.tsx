import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Frown,
  Meh,
  Smile,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
} from 'lucide-react';

const MetricForm = () => {
  const initialForm = {
    date: '',
    sleepHours: 6,
    mood: 1,
    energy: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({ date: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['sleepHours', 'mood', 'energy'].includes(name)
        ? Number(value)
        : value,
    }));

    if (name === 'date') {
      setErrors((prev) => ({ ...prev, date: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { date: '' };

    if (!form.date) {
      newErrors.date = 'Date is required.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    console.log('📤 Metric submitted:', form);
    toast.success('Submitted!');
    setForm(initialForm);
  };

  const getAnimationClass = (value: number) => {
    if (value === 0) return 'animate-shrink';
    if (value === 1) return 'animate-wiggle';
    if (value === 2) return 'animate-bounce-once';
    return '';
  };

  const renderMoodIcon = () => {
    const base = 'transition duration-300 ease-in-out w-12 h-12';
    const anim = getAnimationClass(form.mood);

    switch (form.mood) {
      case 0:
        return (
          <Frown
            key={`mood-${form.mood}`}
            className={`${base} text-blue-500 ${anim}`}
          />
        );
      case 1:
        return (
          <Meh
            key={`mood-${form.mood}`}
            className={`${base} text-yellow-500 ${anim}`}
          />
        );
      case 2:
        return (
          <Smile
            key={`mood-${form.mood}`}
            className={`${base} text-green-500 ${anim}`}
          />
        );
    }
  };

  const renderEnergyIcon = () => {
    const base = 'transition duration-300 ease-in-out w-12 h-12';
    const anim = getAnimationClass(form.energy);

    switch (form.energy) {
      case 0:
        return (
          <BatteryLow
            key={`energy-${form.energy}`}
            className={`${base} text-red-500 ${anim}`}
          />
        );
      case 1:
        return (
          <BatteryMedium
            key={`energy-${form.energy}`}
            className={`${base} text-yellow-500 ${anim}`}
          />
        );
      case 2:
        return (
          <BatteryFull
            key={`energy-${form.energy}`}
            className={`${base} text-green-600 ${anim}`}
          />
        );
    }
  };

  return (
    <div className='bg-white rounded-xl p-6 shadow-md w-full max-w-xl'>
      <h2 className='text-2xl font-semibold mb-6'>Submit Daily Metrics</h2>

      <form onSubmit={handleSubmit} className='space-y-6' noValidate>
        {/* Date */}
        <div>
          <label className='block font-medium mb-1'>Date</label>
          <input
            type='date'
            name='date'
            value={form.date}
            onChange={handleChange}
            className={`w-full border ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            } rounded-md px-3 py-2`}
          />
          {errors.date && (
            <p className='text-sm text-red-600 mt-1'>{errors.date}</p>
          )}
        </div>

        {/* Sleep Hours */}
        <div>
          <label className='block font-medium mb-2'>Sleep Hours</label>
          <div className='flex items-center gap-4 py-2'>
            <input
              type='range'
              name='sleepHours'
              min='0'
              max='12'
              value={form.sleepHours}
              onChange={handleChange}
              className='flex-1 accent-blue-600'
            />
            <div className='text-4xl font-bold w-32 text-right'>
              {form.sleepHours}h
            </div>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className='block font-medium mb-2'>Mood</label>
          <div className='flex items-center gap-4 py-2'>
            <input
              type='range'
              name='mood'
              min='0'
              max='2'
              value={form.mood}
              onChange={handleChange}
              className='flex-1 accent-green-600'
            />
            <div className='w-32 flex justify-end items-center'>
              {renderMoodIcon()}
            </div>
          </div>
        </div>

        {/* Energy */}
        <div>
          <label className='block font-medium mb-2'>Energy</label>
          <div className='flex items-center gap-4 py-2'>
            <input
              type='range'
              name='energy'
              min='0'
              max='2'
              value={form.energy}
              onChange={handleChange}
              className='flex-1 accent-yellow-500'
            />
            <div className='w-32 flex justify-end items-center'>
              {renderEnergyIcon()}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className='pt-4'>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MetricForm;
