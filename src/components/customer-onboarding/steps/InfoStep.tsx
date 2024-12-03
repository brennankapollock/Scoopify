import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { OnboardingData } from '../../onboarding/types';
import { BusinessOnboardingData } from '../../business-onboarding/types';

interface InfoStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  businessData: BusinessOnboardingData;
}

const InfoStep: React.FC<InfoStepProps> = ({ onNext, onBack, data, businessData }) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    address: data.address,
  });

  // Get service days from business data and sort them in order Mon-Sun
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const serviceDays = Object.entries(businessData.businessHours)
    .filter(([_, hours]) => hours.isOpen)
    .map(([day]) => day)
    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

  // Format service days for display with capitalization
  const formatServiceDays = (days: string[]) => {
    const capitalizedDays = days.map(day => 
      day.charAt(0).toUpperCase() + day.slice(1)
    );
    
    if (days.length === 0) return '';
    if (days.length === 1) return capitalizedDays[0];
    if (days.length === 2) return `${capitalizedDays[0]} and ${capitalizedDays[1]}`;
    return `${capitalizedDays.slice(0, -1).join(', ')}, and ${capitalizedDays[capitalizedDays.length - 1]}`;
  };

  // Get city from ZIP code
  const city = businessData.serviceArea.cities.find((_, index) => 
    businessData.serviceArea.zipCodes[index] === data.zipCode
  ) || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div>
      <UserCircle size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Tell us about yourself
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Yay! We're in {city} every {formatServiceDays(serviceDays)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter your full address"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-1/2 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-1/2 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfoStep;