import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { BusinessOnboardingData } from '../../types/business';

interface BusinessHeaderProps {
  business: BusinessOnboardingData;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center">
          {business.branding.logoUrl ? (
            <img 
              src={business.branding.logoUrl} 
              alt={business.businessName} 
              className="h-16 w-auto mb-4"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {business.businessName}
            </h1>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a 
              href={`tel:${business.phone}`}
              className="flex items-center hover:text-primary-600"
            >
              <Phone size={16} className="mr-1" />
              {business.phone}
            </a>
            <a 
              href={`mailto:${business.email}`}
              className="flex items-center hover:text-primary-600"
            >
              <Mail size={16} className="mr-1" />
              {business.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;