import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-xl sm:text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`mt-2 sm:mt-0 p-2 sm:p-3 rounded-full ${
          trend === 'up' ? 'bg-primary-50' : 'bg-red-50'
        }`}>
          <Icon
            className={trend === 'up' ? 'text-primary-600' : 'text-red-600'}
            size={20}
          />
        </div>
      </div>
      <div className="mt-3 sm:mt-4">
        <span className={`text-xs sm:text-sm font-medium ${
          trend === 'up' ? 'text-primary-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;