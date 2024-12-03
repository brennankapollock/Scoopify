import React from 'react';
import { Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';

interface ReportProps {
  report: {
    id: string;
    title: string;
    description: string;
    format: 'pdf' | 'csv' | 'excel';
    frequency?: string;
  };
}

const ReportCard: React.FC<ReportProps> = ({ report }) => {
  const getFormatIcon = () => {
    switch (report.format) {
      case 'pdf':
        return <FileText size={16} />;
      case 'csv':
        return <FileDown size={16} />;
      case 'excel':
        return <FileSpreadsheet size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getFormatColor = () => {
    switch (report.format) {
      case 'pdf':
        return 'text-red-600 bg-red-50';
      case 'csv':
        return 'text-blue-600 bg-blue-50';
      case 'excel':
        return 'text-primary-600 bg-primary-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-base font-medium text-gray-900">
          {report.title}
        </h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase flex items-center gap-1 ${getFormatColor()}`}>
          {getFormatIcon()}
          {report.format}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {report.description}
      </p>
      
      <div className="flex items-center justify-between">
        {report.frequency && (
          <span className="text-xs text-gray-500">
            Generated {report.frequency}
          </span>
        )}
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
        >
          <Download size={16} className="mr-1.5" />
          Generate
        </button>
      </div>
    </div>
  );
};

export default ReportCard;