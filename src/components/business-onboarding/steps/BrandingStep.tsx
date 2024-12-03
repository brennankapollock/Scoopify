import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface BrandingStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
}

const defaultTerms = `Terms of Service for Pet Waste Removal Services

1. Service Agreement
- Regular scheduled cleanings as per selected service plan
- Service areas limited to specified ZIP codes
- Weather-related rescheduling may occur
- 24-hour cancellation notice required

2. Customer Responsibilities
- Provide safe access to service areas
- Secure pets during service
- Maintain current payment information
- Notify of any access changes

3. Service Provider Responsibilities
- Professional and thorough cleaning
- Proper waste disposal
- Notification of service completion
- Maintain liability insurance

4. Payment Terms
- Automatic billing as per selected payment schedule
- Late fees may apply to overdue payments
- Price changes require 30-day notice

5. Cancellation Policy
- 24-hour notice for service cancellation
- 30-day notice for service termination
- Refunds per company policy

6. Liability
- Provider maintains comprehensive insurance
- Not responsible for pre-existing conditions
- Property damage coverage as applicable

7. Privacy Policy
- Customer information protection
- Limited data sharing
- Secure payment processing

8. Service Modifications
- Schedule changes with notice
- Service area modifications
- Additional services by request

9. Communication
- Email and text notifications
- Customer service availability
- Emergency contact procedures

10. General Provisions
- Terms modification rights
- Governing law
- Dispute resolution
`;

const BrandingStep: React.FC<BrandingStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    branding: {
      ...data.branding,
      companyTerms: data.branding.companyTerms || defaultTerms,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const resetTerms = () => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        companyTerms: defaultTerms,
      },
    }));
  };

  return (
    <div>
      <Palette size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Branding & Policies
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Customize your brand appearance and business policies
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand Colors */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Brand Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Color</label>
              <div className="flex gap-3 mt-1">
                <input
                  type="color"
                  value={formData.branding.colors.primary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    branding: {
                      ...prev.branding,
                      colors: {
                        ...prev.branding.colors,
                        primary: e.target.value,
                      },
                    },
                  }))}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.branding.colors.primary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    branding: {
                      ...prev.branding,
                      colors: {
                        ...prev.branding.colors,
                        primary: e.target.value,
                      },
                    },
                  }))}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
              <div className="flex gap-3 mt-1">
                <input
                  type="color"
                  value={formData.branding.colors.secondary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    branding: {
                      ...prev.branding,
                      colors: {
                        ...prev.branding.colors,
                        secondary: e.target.value,
                      },
                    },
                  }))}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.branding.colors.secondary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    branding: {
                      ...prev.branding,
                      colors: {
                        ...prev.branding.colors,
                        secondary: e.target.value,
                      },
                    },
                  }))}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms of Service */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Terms of Service
            </h3>
            <button
              type="button"
              onClick={resetTerms}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Reset to Default
            </button>
          </div>
          <textarea
            value={formData.branding.companyTerms}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              branding: {
                ...prev.branding,
                companyTerms: e.target.value,
              },
            }))}
            rows={12}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
            placeholder="Enter your company's terms of service..."
          />
        </div>

        {/* Privacy Policy Agreement */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.branding.privacyPolicy}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                branding: {
                  ...prev.branding,
                  privacyPolicy: e.target.checked,
                },
              }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to collect and handle customer data in accordance with privacy laws
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingStep;