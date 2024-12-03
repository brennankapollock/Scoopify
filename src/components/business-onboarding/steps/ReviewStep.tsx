import React from 'react';
import { Check, ChevronRight, Edit } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface ReviewStepProps {
  data: BusinessOnboardingData;
  onBack: () => void;
  onComplete: () => void;
  loading: boolean;
  onEditSection: (section: string) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  data, 
  onBack, 
  onComplete, 
  loading,
  onEditSection 
}) => {
  const sections = [
    {
      id: 'business-info',
      title: 'Business Information',
      content: [
        ['Business Name', data.businessName],
        ['Contact Name', data.contactName],
        ['Email', data.email],
        ['Phone', data.phone],
        ['Address', data.address],
      ],
    },
    {
      id: 'service-area',
      title: 'Service Area',
      content: [
        ['ZIP Codes', data.serviceArea.zipCodes.join(', ')],
        ['Cities', data.serviceArea.cities.join(', ')],
      ],
    },
    {
      id: 'services',
      title: 'Services',
      content: data.services.offerings.map(service => [
        service.id.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        `$${service.price.toFixed(2)}`,
      ]),
    },
    {
      id: 'scheduling',
      title: 'Service Schedule',
      content: [
        ['Service Days', data.schedulingPreferences.availableDays
          .map(day => day.charAt(0).toUpperCase() + day.slice(1))
          .join(', ')],
      ],
    },
    {
      id: 'billing',
      title: 'Billing Settings',
      content: [
        ['Payment Interval', data.billing.paymentInterval],
        ['Payment Methods', data.billing.paymentMethods.join(', ')],
        ['Auto-Invoicing', data.billing.autoInvoicing ? 'Enabled' : 'Disabled'],
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      content: [
        ['Email Notifications', data.notifications.channels.email ? 'Enabled' : 'Disabled'],
        ['SMS Notifications', data.notifications.channels.sms ? 'Enabled' : 'Disabled'],
        ['Push Notifications', data.notifications.channels.push ? 'Enabled' : 'Disabled'],
      ],
    },
  ];

  return (
    <div>
      <div className="mx-auto mb-6 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
        <Check size={24} className="text-primary-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Review Your Information
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Please review all the information before finalizing your setup
      </p>

      <div className="space-y-6 mb-8">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {section.title}
              </h3>
              <button
                onClick={() => onEditSection(section.id)}
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="p-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.content.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-medium text-gray-500">{label}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={loading}
          className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            'Creating Account...'
          ) : (
            <>
              Complete Setup
              <ChevronRight size={20} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;