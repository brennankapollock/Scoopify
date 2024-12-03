import React, { useState, useRef } from 'react';
import { Upload, X, Calculator } from 'lucide-react';
import { PricingCalculatorData } from './types';

interface PricingFormProps {
  initialData: PricingCalculatorData;
  onGenerate: (data: PricingCalculatorData) => void;
}

const formatCurrency = (value: string) => {
  // Remove any non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  const formatted = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
  
  return formatted ? `$${formatted}` : '';
};

const formatWebsite = (url: string) => {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

const PricingForm: React.FC<PricingFormProps> = ({ initialData, onGenerate }) => {
  const [data, setData] = useState(initialData);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format website URL before submitting
    const formattedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        website: formatWebsite(data.businessInfo.website)
      }
    };
    onGenerate(formattedData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Logo file size must be less than 5MB');
        return;
      }

      setData(prev => ({
        ...prev,
        businessInfo: {
          ...prev.businessInfo,
          logo: file
        }
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        logo: undefined
      }
    }));
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateServicePrice = (serviceId: string, price: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? { ...service, basePrice: parseFloat(price) || 0 }
          : service
      )
    }));
  };

  const updateServiceTime = (serviceId: string, time: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? { ...service, timePerYard: parseInt(time) || 0 }
          : service
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl p-6 shadow-sm">
      {/* Business Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Logo Upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Logo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {previewUrl ? (
                <div className="space-y-1 text-center">
                  <img src={previewUrl} alt="Logo preview" className="mx-auto h-32 w-auto object-contain mb-4" />
                  <div className="flex text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      Remove logo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="logo-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a logo</span>
                      <input
                        id="logo-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              required
              value={data.businessInfo.businessName}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, businessName: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input
              type="text"
              required
              value={data.businessInfo.ownerName}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, ownerName: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={data.businessInfo.address}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, address: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={data.businessInfo.phone}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, phone: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={data.businessInfo.email}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, email: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={data.businessInfo.website}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, website: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="example.com"
            />
          </div>
        </div>
      </div>

      {/* Operating Costs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Operating Costs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Labor Rate (per hour)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={data.operatingCosts.laborRate}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  operatingCosts: { ...prev.operatingCosts, laborRate: parseFloat(e.target.value) || 0 }
                }))}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Cost (per gallon)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={data.operatingCosts.fuelCost}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  operatingCosts: { ...prev.operatingCosts, fuelCost: parseFloat(e.target.value) || 0 }
                }))}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle MPG</label>
            <input
              type="number"
              value={data.operatingCosts.vehicleMileage}
              onChange={(e) => setData(prev => ({
                ...prev,
                operatingCosts: { ...prev.operatingCosts, vehicleMileage: parseFloat(e.target.value) || 0 }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Avg. Distance (miles)</label>
            <input
              type="number"
              value={data.operatingCosts.averageDriveDistance}
              onChange={(e) => setData(prev => ({
                ...prev,
                operatingCosts: { ...prev.operatingCosts, averageDriveDistance: parseFloat(e.target.value) || 0 }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplies (per yard)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={data.operatingCosts.supplies}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  operatingCosts: { ...prev.operatingCosts, supplies: parseFloat(e.target.value) || 0 }
                }))}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance (monthly)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={data.operatingCosts.insurance}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  operatingCosts: { ...prev.operatingCosts, insurance: parseFloat(e.target.value) || 0 }
                }))}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marketing (monthly)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={data.operatingCosts.marketing}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  operatingCosts: { ...prev.operatingCosts, marketing: parseFloat(e.target.value) || 0 }
                }))}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Overhead (monthly)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={data.operatingCosts.overhead}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  operatingCosts: { ...prev.operatingCosts, overhead: parseFloat(e.target.value) || 0 }
                }))}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profit Targets */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profit Targets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Profit (%)</label>
            <input
              type="number"
              value={data.profitTargets.minimumProfit}
              onChange={(e) => setData(prev => ({
                ...prev,
                profitTargets: { ...prev.profitTargets, minimumProfit: parseFloat(e.target.value) || 0 }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Profit (%)</label>
            <input
              type="number"
              value={data.profitTargets.targetProfit}
              onChange={(e) => setData(prev => ({
                ...prev,
                profitTargets: { ...prev.profitTargets, targetProfit: parseFloat(e.target.value) || 0 }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Profit (%)</label>
            <input
              type="number"
              value={data.profitTargets.maximumProfit}
              onChange={(e) => setData(prev => ({
                ...prev,
                profitTargets: { ...prev.profitTargets, maximumProfit: parseFloat(e.target.value) || 0 }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
              max="100"
              required
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
        <div className="space-y-6">
          {data.services.map((service) => (
            <div
              key={service.id}
              className={`p-6 border-2 rounded-lg ${
                service.isAddOn ? 'border-primary-100' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
                {service.isAddOn && (
                  <span className="px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
                    Add-on Service
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={service.basePrice}
                      onChange={(e) => updateServicePrice(service.id, e.target.value)}
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time per Yard (minutes)</label>
                  <input
                    type="number"
                    value={service.timePerYard}
                    onChange={(e) => updateServiceTime(service.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Calculator className="mr-2 h-5 w-5" />
          Calculate Pricing
        </button>
      </div>
    </form>
  );
};

export default PricingForm;