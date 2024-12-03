import React, { useState } from 'react';
import { Wallet, CreditCard, Banknote } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface BillingStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
}

const paymentMethods = [
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
  { id: 'cash', label: 'Cash', icon: Banknote },
];

const BillingStep: React.FC<BillingStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    billing: data.billing,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const togglePaymentMethod = (methodId: string) => {
    setFormData(prev => ({
      ...prev,
      billing: {
        ...prev.billing,
        paymentMethods: prev.billing.paymentMethods.includes(methodId)
          ? prev.billing.paymentMethods.filter(id => id !== methodId)
          : [...prev.billing.paymentMethods, methodId],
      },
    }));
  };

  return (
    <div>
      <Wallet size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Billing Settings
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Set up your payment and billing preferences
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment Interval */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment Interval
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['weekly', 'monthly', 'per-visit'] as const).map((interval) => (
              <label
                key={interval}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.billing.paymentInterval === interval
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentInterval"
                  checked={formData.billing.paymentInterval === interval}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    billing: {
                      ...prev.billing,
                      paymentInterval: interval,
                    },
                  }))}
                  className="sr-only"
                />
                <span className={`capitalize text-sm ${
                  formData.billing.paymentInterval === interval
                    ? 'text-primary-700'
                    : 'text-gray-700'
                }`}>
                  {interval.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Accepted Payment Methods
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.billing.paymentMethods.includes(method.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.billing.paymentMethods.includes(method.id)}
                    onChange={() => togglePaymentMethod(method.id)}
                    className="sr-only"
                  />
                  <Icon size={20} className={
                    formData.billing.paymentMethods.includes(method.id)
                      ? 'text-primary-600'
                      : 'text-gray-400'
                  } />
                  <span className={`ml-3 text-sm font-medium ${
                    formData.billing.paymentMethods.includes(method.id)
                      ? 'text-primary-700'
                      : 'text-gray-700'
                  }`}>
                    {method.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Auto-Invoicing */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.billing.autoInvoicing}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                billing: {
                  ...prev.billing,
                  autoInvoicing: e.target.checked,
                },
              }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Enable automatic invoicing for recurring services
            </span>
          </label>
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
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingStep;