import React from 'react';
import { X } from 'lucide-react';
import { AnalyticCategory } from './types';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AnalyticCategory[];
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  categories,
  selectedMetrics,
  onMetricsChange,
}) => {
  if (!isOpen) return null;

  const toggleMetric = (metricId: string) => {
    onMetricsChange(
      selectedMetrics.includes(metricId)
        ? selectedMetrics.filter(id => id !== metricId)
        : [...selectedMetrics, metricId]
    );
  };

  const selectAllInCategory = (category: AnalyticCategory) => {
    const categoryMetricIds = category.metrics.map(m => m.id);
    const newSelection = new Set([...selectedMetrics]);
    
    const allSelected = categoryMetricIds.every(id => selectedMetrics.includes(id));
    
    if (allSelected) {
      categoryMetricIds.forEach(id => newSelection.delete(id));
    } else {
      categoryMetricIds.forEach(id => newSelection.add(id));
    }
    
    onMetricsChange(Array.from(newSelection));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Filter Analytics
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    {category.title}
                  </h4>
                  <button
                    onClick={() => selectAllInCategory(category)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    {category.metrics.every(m => selectedMetrics.includes(m.id))
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>
                <div className="space-y-2">
                  {category.metrics.map((metric) => (
                    <label
                      key={metric.id}
                      className="flex items-center p-2 rounded-md hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => toggleMetric(metric.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {metric.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => onMetricsChange([])}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDialog;