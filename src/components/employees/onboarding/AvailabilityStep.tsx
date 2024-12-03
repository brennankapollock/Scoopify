import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Employee } from '../types';

interface AvailabilityStepProps {
  onNext: (data: Partial<Employee>) => void;
  onBack: () => void;
  data: Employee;
}

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    availability: data.availability || {
      monday: { available: true },
      tuesday: { available: true },
      wednesday: { available: true },
      thursday: { available: true },
      friday: { available: true },
      saturday: { available: false },
      sunday: { available: false },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          available: !prev.availability[day].available,
        },
      },
    }));
  };

  return (
    <div>
      <Calendar size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Your Availability
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Let us know which days you're available to work
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day}
              className={`border-2 rounded-lg transition-all ${
                formData.availability[day].available
                  ? 'border-primary-500'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.availability[day].available}
                  onChange={() => toggleDay(day)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  formData.availability[day].available
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {formData.availability[day].available && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-base font-medium capitalize">
                  {day}
                </span>
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityStep;