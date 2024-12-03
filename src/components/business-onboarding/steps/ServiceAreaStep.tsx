import React, { useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface ServiceAreaStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
}

interface ZipCodeData {
  code: string;
  city?: string;
}

const ServiceAreaStep: React.FC<ServiceAreaStepProps> = ({ onNext, onBack, data }) => {
  const [zipCodes, setZipCodes] = useState<ZipCodeData[]>(
    data.serviceArea.zipCodes.map(code => ({ code }))
  );
  const [newZipCode, setNewZipCode] = useState('');
  const [newCity, setNewCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract unique cities and zip codes
    const uniqueCities = Array.from(
      new Set(zipCodes.map(z => z.city).filter(Boolean))
    );

    onNext({
      serviceArea: {
        zipCodes: zipCodes.map(z => z.code),
        cities: uniqueCities,
        neighborhoods: [], // Keeping for backward compatibility
      },
    });
  };

  const addZipCode = () => {
    if (!newZipCode.trim()) return;
    
    // Validate ZIP code format (5 digits)
    if (!/^\d{5}$/.test(newZipCode)) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    // Check for duplicates
    if (zipCodes.some(z => z.code === newZipCode)) {
      alert('This ZIP code has already been added');
      return;
    }

    setZipCodes([...zipCodes, { 
      code: newZipCode,
      city: newCity.trim() || undefined
    }]);
    setNewZipCode('');
    setNewCity('');
  };

  const removeZipCode = (code: string) => {
    setZipCodes(zipCodes.filter(z => z.code !== code));
  };

  const updateCity = (zipCode: string, city: string) => {
    setZipCodes(zipCodes.map(z => 
      z.code === zipCode ? { ...z, city: city || undefined } : z
    ));
  };

  return (
    <div>
      <MapPin size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Service Area
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Define the ZIP codes where you provide your services
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Service Areas
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">ZIP Code</label>
              <input
                type="text"
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value.slice(0, 5))}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter ZIP code"
                pattern="\d{5}"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">City (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="block flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter city name"
                />
                <button
                  type="button"
                  onClick={addZipCode}
                  disabled={!newZipCode}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Added Service Areas</h3>
            <div className="space-y-3">
              {zipCodes.map((zip) => (
                <div
                  key={zip.code}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{zip.code}</span>
                      <input
                        type="text"
                        value={zip.city || ''}
                        onChange={(e) => updateCity(zip.code, e.target.value)}
                        placeholder="Add city name"
                        className="text-sm border-0 bg-transparent focus:ring-0 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeZipCode(zip.code)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              {zipCodes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No service areas added yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={zipCodes.length === 0}
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceAreaStep;