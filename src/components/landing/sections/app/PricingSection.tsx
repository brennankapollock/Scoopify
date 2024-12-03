import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for new or small businesses',
    features: [
      'Up to 20 Customers',
      'Scoopify Branding',
      'Basic Routing',
      'Free Landing Page',
      'Free Onboarding Flow',
      'Business Dashboard',
      'Basic Customer Dashboard',
      'Invoicing & Payments',
    ],
  },
  {
    name: 'Pro',
    price: 249,
    description: 'Built to scale with your business.',
    features: [
      'Up to 100 Customers (+$50/mo for each additional 100 customers)',
      'Totally Whitelabeled',
      'Local Phone Number',
      'Custom Email',
      'Communication Hub',
      'Unlimited Employees',
      'Invoicing & Payments',
      'Inventory Management',
      'Routes & Vehicles Optimization',
      'Reports for Insights',
      'Business Dashboard',
      'Advanced Customer Dashboard',
      'Employee Dashboard',
    ],
    popular: true,
  },
];

const PricingSection = () => {
  return (
    <div className="bg-white px-8 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Go-As-You-Grow Pricing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Start for free, upgrade when you're ready. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl ${
                plan.popular ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-6">
                  <span className="inline-flex rounded-full bg-primary-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 mt-0.5" />
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to="/waitlist"
                    className={`block w-full py-3 px-6 text-center rounded-md shadow ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
                  >
                    Join Waitlist
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Learn more about our pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;