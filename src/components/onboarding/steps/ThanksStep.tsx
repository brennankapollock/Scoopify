import React from 'react';
import { PartyPopper } from 'lucide-react';
import { OnboardingData } from '../types';

interface ThanksStepProps {
  data: OnboardingData;
}

const ThanksStep: React.FC<ThanksStepProps> = ({ data }) => {
  return (
    <div className="text-center">
      <PartyPopper size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to the Family!
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Thank you for choosing our service. We're excited to keep your yard clean and fresh!
      </p>

      <div className="bg-primary-50 rounded-lg p-6 mb-8">
        <h3 className="font-medium text-gray-900 mb-2">
          What's Next?
        </h3>
        <ul className="text-left space-y-2 text-gray-600">
          <li>• You'll receive a confirmation email shortly</li>
          <li>• Our team will contact you to schedule your first service</li>
          <li>• We'll provide you with access to your customer dashboard</li>
        </ul>
      </div>

      <button
        className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
        onClick={() => {
          // This would typically navigate to the customer dashboard
          alert('This would navigate to the customer dashboard');
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default ThanksStep;