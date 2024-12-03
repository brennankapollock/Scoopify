import React, { useState, useRef, useEffect } from 'react';
import { BusinessInfo, LetterOptions } from './types';
import { Upload, X } from 'lucide-react';

interface LetterFormProps {
  initialBusinessInfo: BusinessInfo;
  initialLetterOptions: LetterOptions;
  onGenerate: (info: BusinessInfo, options: LetterOptions) => void;
}

const formatPrice = (value: string) => {
  // Remove any non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  const formatted = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
  
  return formatted ? `$${formatted}` : '';
};

const formatPercentage = (value: string) => {
  // Remove any non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  const formatted = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
  
  return formatted ? `${formatted}%` : '';
};

const formatWebsite = (url: string) => {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

const LetterForm: React.FC<LetterFormProps> = ({
  initialBusinessInfo,
  initialLetterOptions,
  onGenerate,
}) => {
  const [businessInfo, setBusinessInfo] = useState(initialBusinessInfo);
  const [letterOptions, setLetterOptions] = useState(initialLetterOptions);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate new price when percentage changes
  useEffect(() => {
    if (businessInfo.priceChangeType === 'percentage' && businessInfo.currentPrice && businessInfo.percentageIncrease) {
      const currentValue = parseFloat(businessInfo.currentPrice.replace(/[^0-9.]/g, ''));
      const percentageValue = parseFloat(businessInfo.percentageIncrease.replace(/[^0-9.]/g, ''));
      
      if (!isNaN(currentValue) && !isNaN(percentageValue)) {
        const increase = currentValue * (percentageValue / 100);
        const newValue = currentValue + increase;
        setBusinessInfo(prev => ({
          ...prev,
          newPrice: formatPrice(newValue.toFixed(2))
        }));
      }
    }
  }, [businessInfo.currentPrice, businessInfo.percentageIncrease, businessInfo.priceChangeType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format website URL before submitting
    const formattedInfo = {
      ...businessInfo,
      website: formatWebsite(businessInfo.website)
    };
    onGenerate(formattedInfo, letterOptions);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Logo file size must be less than 5MB');
        return;
      }

      setBusinessInfo(prev => ({
        ...prev,
        logo: file
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
    setBusinessInfo(prev => ({
      ...prev,
      logo: undefined
    }));
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = name === 'percentageIncrease' ? formatPercentage(value) : formatPrice(value);
    setBusinessInfo(prev => ({
      ...prev,
      [name]: formatted
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
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input
              type="text"
              required
              value={businessInfo.ownerName}
              onChange={(e) => setBusinessInfo({ ...businessInfo, ownerName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={businessInfo.website}
              onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
              placeholder="example.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Change Type</label>
            <select
              value={businessInfo.priceChangeType}
              onChange={(e) => setBusinessInfo({ 
                ...businessInfo, 
                priceChangeType: e.target.value as 'fixed' | 'percentage',
                percentageIncrease: '',
                newPrice: ''
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage Increase</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Price</label>
            <input
              type="text"
              name="currentPrice"
              value={businessInfo.currentPrice}
              onChange={handlePriceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              placeholder="$0.00"
            />
          </div>
          {businessInfo.priceChangeType === 'fixed' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">New Price</label>
              <input
                type="text"
                name="newPrice"
                value={businessInfo.newPrice}
                onChange={handlePriceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
                placeholder="$0.00"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Percentage Increase</label>
              <input
                type="text"
                name="percentageIncrease"
                value={businessInfo.percentageIncrease}
                onChange={handlePriceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
                placeholder="0%"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Effective Date</label>
            <input
              type="date"
              value={businessInfo.effectiveDate}
              onChange={(e) => setBusinessInfo({ ...businessInfo, effectiveDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Letter Options */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Letter Options</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <div className="grid grid-cols-3 gap-4">
              {(['professional', 'friendly', 'direct'] as const).map((tone) => (
                <label
                  key={tone}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    letterOptions.tone === tone
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={tone}
                    checked={letterOptions.tone === tone}
                    onChange={(e) => setLetterOptions({ ...letterOptions, tone: e.target.value as typeof letterOptions.tone })}
                    className="sr-only"
                  />
                  <span className="capitalize">{tone}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'includeThankYou', label: 'Include thank you message' },
              { key: 'includeMarketFactors', label: 'Include market factors' },
              { key: 'includeValueProposition', label: 'Include value proposition' },
              { key: 'includeEffectiveDate', label: 'Include effective date' },
              { key: 'includeContact', label: 'Include contact information' },
            ].map((option) => (
              <label key={option.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={letterOptions[option.key as keyof LetterOptions]}
                  onChange={(e) => setLetterOptions({ ...letterOptions, [option.key]: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
      >
        Generate Letter
      </button>
    </form>
  );
};

export default LetterForm;