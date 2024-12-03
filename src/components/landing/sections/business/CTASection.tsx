import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import EditableSection from './EditableSection';
import EditableContent from './EditableContent';
import { BusinessOnboardingData } from '../../../business-onboarding/types';

interface CTASectionProps {
  business: BusinessOnboardingData;
}

const defaultContent = {
  heading: "Ready to get started?",
  subtext: "Sign up today and get your first week free!",
};

const CTASection: React.FC<CTASectionProps> = ({ business }) => {
  return (
    <div id="about" className="bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
        {/* Center the text */}
        <EditableSection business={business} sectionId="cta">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">
              <EditableContent
                business={business}
                sectionId="cta"
                contentId="heading"
                defaultContent={defaultContent.heading}
              />
            </span>
            <span className="block text-primary-200">
              <EditableContent
                business={business}
                sectionId="cta"
                contentId="subtext"
                defaultContent={defaultContent.subtext}
              />
            </span>
          </h2>
        </EditableSection>
        {/* Center the button */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link
              to={`/businesses/${business.ownerId}/onboard`}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
            >
              Book Now
              <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;