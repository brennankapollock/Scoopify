import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const DemoRouteMap = () => {
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-primary-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Route Optimization
        </h3>
        <p className="text-sm text-gray-600">
          See how our AI optimizes your service routes for maximum efficiency
        </p>
      </div>

      <div className="relative bg-gray-100 rounded-lg h-64 mb-4">
        {/* Simulated Map */}
        <div className="absolute inset-0 p-4">
          {/* Route Points */}
          {[
            { top: '20%', left: '30%' },
            { top: '40%', left: '50%' },
            { top: '60%', left: '25%' },
            { top: '30%', left: '70%' },
            { top: '70%', left: '60%' },
          ].map((position, index) => (
            <div
              key={index}
              className={`absolute ${
                optimized ? 'text-primary-600' : 'text-gray-400'
              } transition-colors duration-500`}
              style={position}
            >
              <MapPin
                size={24}
                className={optimized ? 'animate-bounce' : ''}
              />
            </div>
          ))}

          {/* Route Lines */}
          {optimized && (
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: -1 }}
            >
              <path
                d="M120 80 L200 160 L100 240 L280 120 L240 280"
                className="stroke-primary-400"
                fill="none"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </svg>
          )}
        </div>
      </div>

      <button
        onClick={handleOptimize}
        disabled={optimizing}
        className={`w-full py-3 rounded-lg font-medium ${
          optimized
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        } transition-colors`}
      >
        <div className="flex items-center justify-center gap-2">
          <Navigation size={20} />
          {optimizing ? 'Optimizing...' : 
           optimized ? 'Route Optimized! Saved 45 minutes' : 
           'Optimize Route'}
        </div>
      </button>
    </div>
  );
};

export default DemoRouteMap;