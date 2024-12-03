import React from 'react';
import { UserPlus } from 'lucide-react';
import { Employee } from '../types';
import { BusinessOnboardingData } from '../../../types/business';

interface WelcomeStepProps {
  onNext: (data: Partial<Employee>) => void;
  businessData: BusinessOnboardingData;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, businessData }) => {
  return (
    <div className="text-center">
      <UserPlus size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to {businessData.businessName}!
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        We're excited to have you join our team. Let's get your account set up.
      </p>

      <div className="bg-primary-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-medium text-gray-900 mb-4">
          What you'll need:
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Basic personal information
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Emergency contact details
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Availability preferences
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            A few fun facts about yourself
          </li>
        </ul>
      </div>

      <button
        onClick={() => onNext({})}
        className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
      >
        Let's Get Started
      </button>
    </div>
  );
};

export default WelcomeStep;