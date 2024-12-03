import React from 'react';
import { Clock, MapPin, Shield, Star } from 'lucide-react';
import EditableSection from './EditableSection';
import EditableContent from './EditableContent';
import { BusinessOnboardingData } from '../../../business-onboarding/types';

interface ServicesSectionProps {
  business: BusinessOnboardingData;
}

const defaultContent = {
  heading: "Our Services",
  subtext: "Professional pet waste removal services for a cleaner, healthier yard",
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ business }) => {
  return (
    <div id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <EditableSection business={business} sectionId="services">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <EditableContent
                business={business}
                sectionId="services"
                contentId="heading"
                defaultContent={defaultContent.heading}
              />
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              <EditableContent
                business={business}
                sectionId="services"
                contentId="subtext"
                defaultContent={defaultContent.subtext}
              />
            </p>
          </EditableSection>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {business.services.offerings.map((service) => (
              <div key={service.id} className="w-full pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <Clock className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight text-center">
                      {service.id.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} Service
                    </h3>
                    <p className="mt-5 text-base text-gray-500 text-center">
                      Starting at ${service.price}/month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Why Choose {business.businessName}?
            </h3>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            {[
              {
                icon: Clock,
                title: 'Reliable Service',
                description: 'Consistent, on-time service you can count on',
              },
              {
                icon: MapPin,
                title: 'Service Area',
                description: `Serving ${business.serviceArea.cities.join(', ')}`,
              },
              {
                icon: Shield,
                title: 'Satisfaction Guaranteed',
                description: '100% satisfaction guarantee on all services',
              },
            ].map((feature) => (
              <div key={feature.title} className="w-full max-w-sm bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="mt-4 text-gray-500 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;