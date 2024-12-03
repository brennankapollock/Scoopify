import React from 'react';
import { Calendar } from 'lucide-react';

const ServiceActivity = () => {
  // Mock data for the activity chart
  const activityData = Array.from({ length: 12 }, () => 
    Math.floor(Math.random() * 40) + 60
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Service Activity</h2>
          <p className="text-sm text-gray-500">Last 12 weeks of service</p>
        </div>
        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full">
          <Calendar size={16} className="mr-1.5" />
          Last 3 months
        </button>
      </div>

      <div className="h-48 flex items-end space-x-2">
        {activityData.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-primary-100 hover:bg-primary-200 transition-colors rounded-t"
            style={{ height: `${value}%` }}
          >
            <div
              className="w-full bg-primary-500 rounded-t transition-all"
              style={{ height: `${value * 0.7}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-500">
        {Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (11 - i) * 7);
          return (
            <span key={i}>
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceActivity;