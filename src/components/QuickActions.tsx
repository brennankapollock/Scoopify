import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionsProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  title,
  description,
  icon: Icon,
  color,
}) => {
  return (
    <button className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left w-full">
      <div className={`${color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
        <Icon className="text-white" size={20} />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500">{description}</p>
    </button>
  );
};

export default QuickActions;