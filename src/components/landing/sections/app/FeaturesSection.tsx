import React from 'react';
import { 
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Smartphone
} from 'lucide-react';

const features = [
  {
    name: 'Smart Dashboard',
    description: 'Get a bird\'s eye view of your business with real-time metrics and insights.',
    icon: LayoutDashboard,
  },
  {
    name: 'Customer Management',
    description: 'Manage customer relationships, preferences, and service history in one place.',
    icon: Users,
  },
  {
    name: 'Route Optimization',
    description: 'Optimize service routes automatically to save time and fuel costs.',
    icon: MapPin,
  },
  {
    name: 'Scheduling',
    description: 'Effortlessly manage appointments and recurring services.',
    icon: Calendar,
  },
  {
    name: 'Billing & Payments',
    description: 'Automated invoicing and seamless payment processing.',
    icon: DollarSign,
  },
  {
    name: 'Business Analytics',
    description: 'Track growth, revenue, and customer satisfaction metrics.',
    icon: TrendingUp,
  },
  {
    name: 'Customer Portal',
    description: 'Give customers self-service access to their account and services.',
    icon: Smartphone,
  },
  {
    name: 'Communication Tools',
    description: 'Send automated notifications and stay in touch with customers.',
    icon: MessageSquare,
  },
];

const FeaturesSection = () => {
  return (
    <div className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Powerful tools designed specifically for pet waste removal businesses
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative text-center sm:text-left">
                <div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </div>
                <div className="mt-2 text-base text-gray-500">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;