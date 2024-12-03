import React, { useState, useRef } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { ServiceAgreement, DEFAULT_INCLUDED_SERVICES } from './types';

interface AgreementFormProps {
  initialAgreement: ServiceAgreement;
  onGenerate: (agreement: ServiceAgreement) => void;
}

const formatPrice = (value: string) => {
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

const AgreementForm: React.FC<AgreementFormProps> = ({ initialAgreement, onGenerate }) => {
  const [agreement, setAgreement] = useState(initialAgreement);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format website URL before submitting
    const formattedAgreement = {
      ...agreement,
      businessInfo: {
        ...agreement.businessInfo,
        website: formatWebsite(agreement.businessInfo.website)
      }
    };
    onGenerate(formattedAgreement);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Logo file size must be less than 5MB');
        return;
      }

      setAgreement(prev => ({
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
    setAgreement(prev => ({
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = formatPrice(value);
    setAgreement(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        [name]: formatted
      }
    }));
  };

  const toggleIncludedService = (service: string) => {
    setAgreement(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        includedServices: prev.serviceDetails.includedServices.includes(service)
          ? prev.serviceDetails.includedServices.filter(s => s !== service)
          : [...prev.serviceDetails.includedServices, service]
      }
    }));
  };

  const addCustomService = (service: string) => {
    if (!service.trim()) return;
    setAgreement(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        customServices: [...prev.serviceDetails.customServices, service.trim()]
      }
    }));
  };

  const removeCustomService = (service: string) => {
    setAgreement(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        customServices: prev.serviceDetails.customServices.filter(s => s !== service)
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl p-6 shadow-sm">
      {/* Business Information Section */}
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

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              required
              value={agreement.businessInfo.businessName}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, businessName: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input
              type="text"
              required
              value={agreement.businessInfo.ownerName}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, ownerName: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={agreement.businessInfo.phone}
              onChange={(e) => setAgreement(prev => ({
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
              value={agreement.businessInfo.email}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, email: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Business Address</label>
            <textarea
              value={agreement.businessInfo.address}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, address: e.target.value }
              }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={agreement.businessInfo.website}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, website: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="example.com"
            />
          </div>
        </div>
      </div>

      {/* Service Details Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
        <div className="space-y-4">
          {/* Service Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Frequency</label>
            <select
              value={agreement.serviceDetails.serviceFrequency}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                serviceDetails: {
                  ...prev.serviceDetails,
                  serviceFrequency: e.target.value as ServiceAgreement['serviceDetails']['serviceFrequency']
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom Frequency */}
          {agreement.serviceDetails.serviceFrequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Custom Frequency</label>
              <input
                type="text"
                value={agreement.serviceDetails.customFrequency}
                onChange={(e) => setAgreement(prev => ({
                  ...prev,
                  serviceDetails: {
                    ...prev.serviceDetails,
                    customFrequency: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., Every 10 days"
                required
              />
            </div>
          )}

          {/* Service Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Price</label>
            <input
              type="text"
              name="servicePrice"
              value={agreement.serviceDetails.servicePrice}
              onChange={handlePriceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="$0.00"
              required
            />
          </div>

          {/* Payment Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Schedule</label>
            <select
              value={agreement.serviceDetails.paymentSchedule}
              onChange={(e) => setAgreement(prev => ({
                ...prev,
                serviceDetails: {
                  ...prev.serviceDetails,
                  paymentSchedule: e.target.value as ServiceAgreement['serviceDetails']['paymentSchedule']
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="monthly">Monthly</option>
              <option value="per-visit">Per Visit</option>
              <option value="prepaid">Prepaid</option>
            </select>
          </div>

          {/* Included Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Included Services</label>
            <div className="space-y-2">
              {DEFAULT_INCLUDED_SERVICES.map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreement.serviceDetails.includedServices.includes(service)}
                    onChange={() => toggleIncludedService(service)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
            <div className="space-y-2">
              {agreement.serviceDetails.customServices.map((service) => (
                <div key={service} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <span className="text-sm text-gray-700">{service}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomService(service)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom service"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomService((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add custom service"]') as HTMLInputElement;
                    addCustomService(input.value);
                    input.value = '';
                  }}
                  className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Generate Agreement
        </button>
      </div>
    </form>
  );
};

export default AgreementForm;