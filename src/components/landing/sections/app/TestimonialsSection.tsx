import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Owner, Clean Yards Co.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    quote: 'Scoopify has transformed how we run our business. We\'ve doubled our customer base while working fewer hours.',
  },
  {
    name: 'Mike Wilson',
    role: 'Owner, Pet Waste Pros',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    quote: 'The route optimization alone saves us thousands in fuel costs. Best investment we\'ve made for our business.',
  },
  {
    name: 'Emily Davis',
    role: 'Owner, Poop Patrol LLC',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    quote: 'Our customers love the automated notifications and online portal. It\'s made us look so much more professional.',
  },
];

const TestimonialsSection = () => {
  return (
    <div className="bg-gray-50 px-8 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Pet Waste Removal Businesses
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Join hundreds of successful businesses using Scoopify
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center">
                  <img className="h-12 w-12 rounded-full" src={testimonial.image} alt="" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">{testimonial.quote}</p>
                </div>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;