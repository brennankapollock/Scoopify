import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dog, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { BusinessOnboardingData } from '../../../business-onboarding/types';

interface BusinessFooterProps {
  business: BusinessOnboardingData;
}

const BusinessFooter: React.FC<BusinessFooterProps> = ({ business }) => {
  const [showAllZips, setShowAllZips] = useState(false);
  const navigate = useNavigate();
  const zipCodesToShow = showAllZips ? business.serviceArea.zipCodes : business.serviceArea.zipCodes.slice(0, 8);

  return (
    <footer id="contact" className="bg-gray-900 text-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {business.branding.logo ? (
                <img 
                  src={URL.createObjectURL(business.branding.logo)} 
                  alt={business.businessName} 
                  className="h-8 w-auto"
                />
              ) : (
                <>
                  <Dog className="text-primary-500" />
                  <span className="text-lg font-bold">{business.businessName}</span>
                </>
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <Phone size={14} />
                {business.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} />
                {business.email}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} />
                {business.address}
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {business.services.offerings.map((service) => (
                <li key={service.id}>
                  {service.id.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')} Service
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div className="col-span-2">
            <h3 className="text-sm font-semibold mb-3">Service Areas</h3>
            <div className="columns-2 sm:columns-3 md:columns-4 gap-4 text-sm space-y-1">
              {zipCodesToShow.map((zipCode) => (
                <div key={zipCode} className="text-gray-400 break-inside-avoid">
                  {zipCode}
                </div>
              ))}
            </div>
            {business.serviceArea.zipCodes.length > 8 && (
              <button
                onClick={() => setShowAllZips(!showAllZips)}
                className="mt-4 text-sm text-primary-400 hover:text-primary-300 flex items-center"
              >
                {showAllZips ? (
                  <>Show Less <ChevronUp size={14} className="ml-1" /></>
                ) : (
                  <>Show All {business.serviceArea.zipCodes.length} ZIP Codes <ChevronDown size={14} className="ml-1" /></>
                )}
              </button>
            )}
            {business.serviceArea.cities.length > 0 && (
              <p className="mt-4 text-sm text-gray-400">
                Serving: {business.serviceArea.cities.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {business.businessName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link 
                to={`/businesses/${business.ownerId}/privacy`} 
                className="text-sm text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link 
                to={`/businesses/${business.ownerId}/terms`}
                className="text-sm text-gray-400 hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BusinessFooter;