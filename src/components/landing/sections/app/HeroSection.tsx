import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl inline-block">
                Poop Scooping Runs on {' '}
                <span className="text-primary-600 inline-block">Scoopify✨</span>
              </h1>
              
              <div className="block lg:hidden mt-8">
                <img
                  src="https://i.ibb.co/mNGSKdK/Scoopify-Assets-2.png"
                  alt="Pet waste removal business management"
                  className="w-full max-w-md mx-auto"
                />
              </div>
              
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl mx-auto lg:mx-0 md:mt-5 md:text-xl">
                The all-in-one CRM made just for scooping dog poop. Manage routes, schedule services, and delight customers - all while saving time and growing your business.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/waitlist"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 w-auto mx-auto sm:mx-0"
                >
                  Join the Waitlist
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 w-auto mx-auto sm:mx-0"
                >
                  View Pricing
                </Link>
              </div>
          </div>
          
          <div className="hidden lg:block w-full lg:w-1/2">
            <img
              src="https://i.ibb.co/s9q6F9S/Scoopify-Assets.png"
              alt="Pet waste removal business management"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;