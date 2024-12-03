import React from 'react';
import { BusinessOnboardingData } from '../../../../types/business';

interface BusinessInfoSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Name</label>
        <input
          type="text"
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Name</label>
        <input
          type="text"
          value={data.contactName}
          onChange={(e) => onChange({ ...data, contactName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};

export default BusinessInfoSection;