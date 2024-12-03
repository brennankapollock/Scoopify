import React from 'react';
import { BusinessOnboardingData } from '../../../../types/business';

interface BusinessHoursSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const BusinessHoursSection: React.FC<BusinessHoursSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {Object.entries(data.businessHours).map(([day, hours]) => (
        <div key={day} className="flex items-center gap-4">
          <label className="flex items-center min-w-[120px]">
            <input
              type="checkbox"
              checked={hours.isOpen}
              onChange={(e) => onChange({
                ...data,
                businessHours: {
                  ...data.businessHours,
                  [day]: {
                    ...data.businessHours[day],
                    isOpen: e.target.checked
                  }
                }
              })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
          </label>
          {hours.isOpen && (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={hours.open}
                onChange={(e) => onChange({
                  ...data,
                  businessHours: {
                    ...data.businessHours,
                    [day]: {
                      ...data.businessHours[day],
                      open: e.target.value
                    }
                  }
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={hours.close}
                onChange={(e) => onChange({
                  ...data,
                  businessHours: {
                    ...data.businessHours,
                    [day]: {
                      ...data.businessHours[day],
                      close: e.target.value
                    }
                  }
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BusinessHoursSection;