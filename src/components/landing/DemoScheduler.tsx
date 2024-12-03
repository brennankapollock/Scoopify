import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const DemoScheduler = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Schedule a Service
        </h3>
        <p className="text-sm text-gray-600">
          Try selecting a date and time to see how easy it is to schedule services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 text-sm rounded-lg border ${
                  selectedTime === time
                    ? 'border-primary-500 bg-white text-primary-700'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <Calendar size={16} />
            <span className="font-medium">Service Confirmed!</span>
          </div>
          <div className="space-y-1 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{selectedTime} on {new Date(selectedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>123 Demo Street, Example City</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoScheduler;