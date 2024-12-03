import React from 'react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Check, ChevronRight, Calculator } from 'lucide-react';
import Navbar from '../landing/Navbar';

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

const PricingPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Pricing - Scoopify</title>
        <meta 
          name="description" 
          content="Affordable, scalable pricing for pet waste removal businesses. Start free and only pay more as you grow."
        />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative pt-32 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Go-As-You-Grow Pricing 🌱</span>
                <span className="block text-primary-600">Affordable Growth Built for Your Success</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                The only software that gets cheaper (relative to your revenue) as you grow.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
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

        {/* Value Proposition */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Why Costs Get Smaller as You Grow
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                As your business scales, the value increases exponentially, while the cost becomes a smaller percentage of your revenue.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900">Affordable Growth</h3>
                <p className="mt-2 text-gray-500">
                  For every additional 100 customers, you pay just $50/month—only $0.50 per customer.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900">Lower Cost Per Customer</h3>
                <p className="mt-2 text-gray-500">
                  With 100 customers, pay $2.49/customer/month. At 500 customers, that drops to just $1.30/customer/month.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900">Aligned with Success</h3>
                <p className="mt-2 text-gray-500">
                  At 500 customers, you'll pay $499/month to manage $49,500/month in revenue—only 1% of your income.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
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
      </div>
    </HelmetProvider>
  );
};

export default PricingPage;