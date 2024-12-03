import React from 'react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import {
  Calculator,
  FileText,
  FileSignature,
  Coins,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../landing/Navbar';

const tools = [
  {
    id: 'pricing-calculator',
    title: 'Service Pricing Calculator',
    description: 'Calculate optimal pricing for your services based on costs and profit targets.',
    icon: Coins,
    color: 'bg-emerald-500',
    keywords: ['pricing', 'calculator', 'profit margins', 'service rates'],
  },
  {
    id: 'price-increase',
    title: 'Price Increase Letter Generator',
    description: 'Create professional price increase letters for your customers.',
    icon: FileText,
    color: 'bg-blue-500',
    keywords: ['price increase', 'letter', 'communication', 'rates'],
  },
  {
    id: 'service-agreement',
    title: 'Service Agreement Generator',
    description: 'Generate customized service agreements and contracts.',
    icon: FileSignature,
    color: 'bg-purple-500',
    keywords: ['agreement', 'contract', 'terms', 'legal'],
  },
];

const ToolsPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Free Business Tools | Scoopify</title>
        <meta 
          name="description" 
          content="Free tools to help grow and manage your pet waste removal business. Calculate pricing, generate professional documents, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Free Tools for Your</span>
                    <span className="block text-primary-600">Business Success✨</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    A collection of free tools designed specifically for pet waste removal businesses. Calculate pricing, generate professional documents, and more.
                  </p>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Business tools and calculator"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tools to Help You Succeed
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Everything you need to run your business more efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-200`}>
                    <tool.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-primary-600 font-medium">
                    Try it now
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to grow your business?</span>
              <span className="block text-primary-200">Try our full platform for free.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                >
                  Get started
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Scoopify. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default ToolsPage;