import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface SchedulingStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
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

const SchedulingStep: React.FC<SchedulingStepProps> = ({ onNext, onBack, data }) => {
  // Initialize dayZones with ZIP codes and their associated cities
  const [formData, setFormData] = useState({
    schedulingPreferences: {
      ...data.schedulingPreferences,
      dayZones: days.reduce((acc, day) => ({
        ...acc,
        [day]: {
          isActive: data.schedulingPreferences.availableDays.includes(day),
          zipCodes: [],
        },
      }), {}),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      schedulingPreferences: {
        ...formData.schedulingPreferences,
        availableDays: Object.entries(formData.schedulingPreferences.dayZones)
          .filter(([_, value]) => value.isActive)
          .map(([day]) => day),
      },
    });
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedulingPreferences: {
        ...prev.schedulingPreferences,
        dayZones: {
          ...prev.schedulingPreferences.dayZones,
          [day]: {
            ...prev.schedulingPreferences.dayZones[day],
            isActive: !prev.schedulingPreferences.dayZones[day].isActive,
          },
        },
      },
    }));
  };

  const toggleZipCode = (day: string, zipCode: string) => {
    setFormData(prev => ({
      ...prev,
      schedulingPreferences: {
        ...prev.schedulingPreferences,
        dayZones: {
          ...prev.schedulingPreferences.dayZones,
          [day]: {
            ...prev.schedulingPreferences.dayZones[day],
            zipCodes: prev.schedulingPreferences.dayZones[day].zipCodes.includes(zipCode)
              ? prev.schedulingPreferences.dayZones[day].zipCodes.filter(z => z !== zipCode)
              : [...prev.schedulingPreferences.dayZones[day].zipCodes, zipCode],
          },
        },
      },
    }));
  };

  // Get city name for a ZIP code
  const getCityForZip = (zipCode: string) => {
    const cityIndex = data.serviceArea.zipCodes.indexOf(zipCode);
    return cityIndex >= 0 && data.serviceArea.cities[cityIndex] 
      ? data.serviceArea.cities[cityIndex] 
      : null;
  };

  return (
    <div>
      <Calendar size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Service Schedule
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Set your service days and areas
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day}
              className={`border-2 rounded-lg transition-all ${
                formData.schedulingPreferences.dayZones[day].isActive
                  ? 'border-primary-500'
                  : 'border-gray-200'
              }`}
            >
              <div className="p-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.schedulingPreferences.dayZones[day].isActive}
                    onChange={() => toggleDay(day)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-base font-medium capitalize">
                    {day}
                  </span>
                </label>

                {formData.schedulingPreferences.dayZones[day].isActive && (
                  <div className="mt-4 ml-7">
                    <p className="text-sm font-medium text-gray-700 mb-2">Select service areas for {day}:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.serviceArea.zipCodes.map((zipCode) => {
                        const city = getCityForZip(zipCode);
                        const isSelected = formData.schedulingPreferences.dayZones[day].zipCodes.includes(zipCode);
                        
                        return (
                          <label
                            key={zipCode}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleZipCode(day, zipCode)}
                              className="sr-only"
                            />
                            <MapPin size={14} className="mr-1" />
                            <span>{zipCode}</span>
                            {city && (
                              <span className="ml-1 text-xs opacity-75">
                                ({city})
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    {formData.schedulingPreferences.dayZones[day].zipCodes.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No areas selected for this day
                      </p>
                    )}
                  </div>
                )}
              </div>
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

export default SchedulingStep;