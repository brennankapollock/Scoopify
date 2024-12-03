import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Download, FileText } from 'lucide-react';
import ReportCard from './ReportCard';

interface ReportCategory {
  id: string;
  title: string;
  description: string;
  reports: Report[];
}

interface Report {
  id: string;
  title: string;
  description: string;
  format: 'pdf' | 'csv' | 'excel';
  frequency?: string;
}

const reportCategories: ReportCategory[] = [
  {
    id: 'financial',
    title: 'Financial Reports',
    description: 'Revenue, expenses, and financial performance metrics',
    reports: [
      {
        id: 'revenue',
        title: 'Revenue Analysis',
        description: 'Detailed breakdown of revenue by service type, customer, and region',
        format: 'excel',
        frequency: 'Monthly'
      },
      {
        id: 'customer-spend',
        title: 'Customer Spending Report',
        description: 'Analysis of customer spending patterns and service preferences',
        format: 'excel',
        frequency: 'Quarterly'
      }
    ]
  },
  {
    id: 'operations',
    title: 'Operations Reports',
    description: 'Service delivery, route efficiency, and workforce metrics',
    reports: [
      {
        id: 'route-efficiency',
        title: 'Route Efficiency Analysis',
        description: 'Metrics on route optimization, time per stop, and fuel consumption',
        format: 'pdf',
        frequency: 'Weekly'
      },
      {
        id: 'service-completion',
        title: 'Service Completion Report',
        description: 'Overview of completed services, cancellations, and reschedules',
        format: 'csv',
        frequency: 'Daily'
      }
    ]
  },
  {
    id: 'fleet',
    title: 'Fleet Management',
    description: 'Vehicle maintenance, usage, and performance tracking',
    reports: [
      {
        id: 'maintenance-history',
        title: 'Maintenance History',
        description: 'Complete maintenance records and upcoming service requirements',
        format: 'pdf',
        frequency: 'Monthly'
      },
      {
        id: 'vehicle-utilization',
        title: 'Vehicle Utilization',
        description: 'Analysis of vehicle usage, mileage, and fuel efficiency',
        format: 'excel',
        frequency: 'Weekly'
      }
    ]
  },
  {
    id: 'customer',
    title: 'Customer Insights',
    description: 'Customer satisfaction, retention, and service history',
    reports: [
      {
        id: 'satisfaction-metrics',
        title: 'Customer Satisfaction Metrics',
        description: 'Analysis of customer feedback, ratings, and satisfaction trends',
        format: 'pdf',
        frequency: 'Monthly'
      },
      {
        id: 'retention-analysis',
        title: 'Customer Retention Analysis',
        description: 'Metrics on customer lifecycle, churn rate, and retention strategies',
        format: 'excel',
        frequency: 'Quarterly'
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'Stock levels, usage patterns, and procurement needs',
    reports: [
      {
        id: 'stock-levels',
        title: 'Current Stock Levels',
        description: 'Detailed inventory counts and reorder recommendations',
        format: 'csv',
        frequency: 'Weekly'
      },
      {
        id: 'consumption-trends',
        title: 'Consumption Trends',
        description: 'Analysis of supply usage patterns and cost trends',
        format: 'excel',
        frequency: 'Monthly'
      }
    ]
  },
  {
    id: 'employee',
    title: 'Employee Performance',
    description: 'Staff productivity, efficiency, and service quality metrics',
    reports: [
      {
        id: 'productivity-metrics',
        title: 'Productivity Metrics',
        description: 'Individual and team performance analytics',
        format: 'pdf',
        frequency: 'Monthly'
      },
      {
        id: 'service-quality',
        title: 'Service Quality Metrics',
        description: 'Analysis of service ratings and customer feedback by employee',
        format: 'excel',
        frequency: 'Weekly'
      }
    ]
  }
];

const ReportsPage = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Reports
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Generate and download reports to analyze your business performance
        </p>
      </div>

      {/* Report Categories */}
      <div className="space-y-4">
        {reportCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-primary-600" size={24} />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
              </div>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="text-gray-400" size={20} />
              ) : (
                <ChevronRight className="text-gray-400" size={20} />
              )}
            </button>

            {expandedCategories.includes(category.id) && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;