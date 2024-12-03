import React from 'react';
import { Calendar, Shovel, Clock } from 'lucide-react';

const StatisticsCards = () => {
  const isNewCustomer = true; // You can update this based on service history

  const stats = isNewCustomer ? [
    {
      title: 'Service Status',
      value: 'Pending',
      icon: Calendar,
      description: 'First visit coming soon',
    },
    {
      title: 'Service Type',
      value: 'New',
      icon: Shovel,
      description: 'Customer onboarding',
    },
    {
      title: 'Next Step',
      value: 'Setup',
      icon: Clock,
      description: 'Awaiting confirmation',
    },
  ] : [
    {
      title: 'Total Visits',
      value: '48',
      icon: Calendar,
      description: 'Completed service visits',
    },
    {
      title: 'Piles Scooped',
      value: '1,248',
      icon: Shovel,
      description: 'Total waste removed',
    },
    {
      title: 'Time Saved',
      value: '24h',
      icon: Clock,
      description: 'Hours you saved',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary-50 rounded-xl">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {stat.title}
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-primary-600">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;