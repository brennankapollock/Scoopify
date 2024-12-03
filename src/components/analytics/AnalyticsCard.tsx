import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AnalyticMetric } from './types';

interface AnalyticsCardProps {
  metric: AnalyticMetric;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ metric }) => {
  const chartHeight = 60;
  const maxValue = Math.max(...metric.chartData);
  const minValue = Math.min(...metric.chartData);
  const range = maxValue - minValue;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-base font-medium text-gray-900">
          {metric.title}
        </h4>
        <div className={`flex items-center ${
          metric.trend === 'up' ? 'text-primary-600' : 'text-red-600'
        }`}>
          {metric.trend === 'up' ? (
            <TrendingUp size={16} className="mr-1" />
          ) : (
            <TrendingDown size={16} className="mr-1" />
          )}
          <span className="text-sm font-medium">{metric.change}</span>
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-4">
        {metric.value}
      </div>

      {/* Sparkline Chart */}
      <div className="h-[60px] flex items-end space-x-1">
        {metric.chartData.map((value, index) => {
          const height = ((value - minValue) / range) * chartHeight;
          return (
            <div
              key={index}
              className="flex-1 bg-primary-200 rounded-t hover:bg-primary-300 transition-all duration-200"
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsCard;