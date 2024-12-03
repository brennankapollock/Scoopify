import React from 'react';
import { Mail, Phone, Calendar, MapPin, Star, Award, Heart, DollarSign } from 'lucide-react';
import { Employee } from './types';
import { format } from 'date-fns';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  // Format date with fallback for invalid/missing dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.fullName}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <Award size={16} className="mr-2" />
              <span className="text-sm">{employee.position}</span>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            employee.status === 'active' ? 'bg-primary-100 text-primary-800' :
            employee.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
            employee.status === 'pending' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {employee.status.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">Started {formatDate(employee.startDate)}</span>
          </div>
          
          {employee.yardsCompleted !== undefined && (
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">{employee.yardsCompleted} yards completed</span>
            </div>
          )}
          
          {employee.rating !== undefined && (
            <div className="flex items-center text-gray-600">
              <Star size={16} className="mr-2 text-yellow-400" />
              <span className="text-sm">{employee.rating.toFixed(1)} rating</span>
            </div>
          )}

          {employee.personalityProfile?.appreciationStyle && (
            <div className="flex items-center text-gray-600">
              <Heart size={16} className="mr-2 text-pink-500" />
              <span className="text-sm">{employee.personalityProfile.appreciationStyle}</span>
            </div>
          )}
        </div>

        {employee.performanceScore !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Performance Score</span>
              <span className={`text-lg font-semibold ${
                employee.performanceScore >= 90 ? 'text-primary-600' :
                employee.performanceScore >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {employee.performanceScore}%
              </span>
            </div>
          </div>
        )}

        {employee.payRate && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pay Rate</span>
              <div className="flex items-center text-gray-900">
                <DollarSign size={16} className="mr-1" />
                <span className="font-semibold">
                  {employee.payRate.toFixed(2)}/{employee.payType === 'hourly' ? 'hr' : 'salary'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default EmployeeCard;