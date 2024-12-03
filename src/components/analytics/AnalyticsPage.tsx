import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronRight } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import FilterDialog from './FilterDialog';
import { AnalyticCategory, AnalyticMetric } from './types';

const analyticCategories: AnalyticCategory[] = [
  {
    id: 'revenue',
    title: 'Revenue Analytics',
    metrics: [
      {
        id: 'monthly-revenue',
        title: 'Monthly Revenue',
        value: '$28,650',
        change: '+12.5%',
        trend: 'up',
        chartData: [15000, 17000, 19000, 22000, 24000, 25000, 28650],
      },
      {
        id: 'avg-customer-value',
        title: 'Average Customer Value',
        value: '$89.50',
        change: '+5.2%',
        trend: 'up',
        chartData: [75.20, 78.40, 82.10, 85.30, 87.90, 89.50],
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations Analytics',
    metrics: [
      {
        id: 'route-efficiency',
        title: 'Route Efficiency',
        value: '92%',
        change: '+3.5%',
        trend: 'up',
        chartData: [85, 87, 88, 90, 91, 92],
      },
      {
        id: 'service-completion',
        title: 'Service Completion Rate',
        value: '98.5%',
        change: '+1.2%',
        trend: 'up',
        chartData: [95, 96, 97, 97.5, 98, 98.5],
      },
    ],
  },
  {
    id: 'customers',
    title: 'Customer Analytics',
    metrics: [
      {
        id: 'customer-satisfaction',
        title: 'Customer Satisfaction',
        value: '4.8/5',
        change: '+0.2',
        trend: 'up',
        chartData: [4.4, 4.5, 4.6, 4.7, 4.7, 4.8],
      },
      {
        id: 'retention-rate',
        title: 'Customer Retention',
        value: '95%',
        change: '-0.5%',
        trend: 'down',
        chartData: [96, 96, 95.8, 95.5, 95.2, 95],
      },
    ],
  },
  {
    id: 'fleet',
    title: 'Fleet Analytics',
    metrics: [
      {
        id: 'fleet-utilization',
        title: 'Fleet Utilization',
        value: '87%',
        change: '+5%',
        trend: 'up',
        chartData: [78, 80, 82, 84, 85, 87],
      },
      {
        id: 'maintenance-costs',
        title: 'Monthly Maintenance Costs',
        value: '$2,450',
        change: '-8%',
        trend: 'down',
        chartData: [2800, 2700, 2600, 2550, 2500, 2450],
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory Analytics',
    metrics: [
      {
        id: 'stock-turnover',
        title: 'Stock Turnover Rate',
        value: '4.2x',
        change: '+0.3',
        trend: 'up',
        chartData: [3.7, 3.8, 3.9, 4.0, 4.1, 4.2],
      },
      {
        id: 'supply-costs',
        title: 'Monthly Supply Costs',
        value: '$3,850',
        change: '-3%',
        trend: 'down',
        chartData: [4100, 4050, 4000, 3950, 3900, 3850],
      },
    ],
  },
  {
    id: 'employees',
    title: 'Employee Analytics',
    metrics: [
      {
        id: 'productivity',
        title: 'Average Productivity',
        value: '94%',
        change: '+2%',
        trend: 'up',
        chartData: [89, 90, 91, 92, 93, 94],
      },
      {
        id: 'service-quality',
        title: 'Service Quality Rating',
        value: '4.9/5',
        change: '+0.1',
        trend: 'up',
        chartData: [4.5, 4.6, 4.7, 4.8, 4.8, 4.9],
      },
    ],
  },
];

const AnalyticsPage = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['revenue']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = selectedMetrics.length > 0
    ? analyticCategories.map(category => ({
        ...category,
        metrics: category.metrics.filter(metric => 
          selectedMetrics.includes(metric.id)
        ),
      })).filter(category => category.metrics.length > 0)
    : analyticCategories;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Monitor and analyze your business performance metrics
            </p>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Filter Metrics
          </button>
        </div>
      </div>

      {/* Analytics Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {category.title}
              </h3>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="text-gray-400" size={20} />
              ) : (
                <ChevronRight className="text-gray-400" size={20} />
              )}
            </button>

            {expandedCategories.includes(category.id) && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.metrics.map((metric) => (
                    <AnalyticsCard key={metric.id} metric={metric} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={analyticCategories}
        selectedMetrics={selectedMetrics}
        onMetricsChange={setSelectedMetrics}
      />
    </div>
  );
};

export default AnalyticsPage;