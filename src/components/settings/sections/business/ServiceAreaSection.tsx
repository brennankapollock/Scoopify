import React from 'react';
import { BusinessOnboardingData } from '../../../../types/business';

interface ServiceAreaSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const ServiceAreaSection: React.FC<ServiceAreaSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ZIP Codes</label>
        <textarea
          value={data.serviceArea.zipCodes.join(', ')}
          onChange={(e) => onChange({
            ...data,
            serviceArea: {
              ...data.serviceArea,
              zipCodes: e.target.value.split(',').map(zip => zip.trim()).filter(Boolean)
            }
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter ZIP codes separated by commas"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cities</label>
        <textarea
          value={data.serviceArea.cities.join(', ')}
          onChange={(e) => onChange({
            ...data,
            serviceArea: {
              ...data.serviceArea,
              cities: e.target.value.split(',').map(city => city.trim()).filter(Boolean)
            }
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter cities separated by commas"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Neighborhoods</label>
        <textarea
          value={data.serviceArea.neighborhoods.join(', ')}
          onChange={(e) => onChange({
            ...data,
            serviceArea: {
              ...data.serviceArea,
              neighborhoods: e.target.value.split(',').map(n => n.trim()).filter(Boolean)
            }
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter neighborhoods separated by commas"
        />
      </div>
    </div>
  );
};

export default ServiceAreaSection;