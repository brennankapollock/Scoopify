import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTASection = () => {
  return (
    <div className="bg-primary-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to grow your business?</span>
          <span className="block text-primary-200">Join the waitlist today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              to="/waitlist"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
            >
              Join Waitlist
              <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;