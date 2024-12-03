import React from 'react';
import SettingSection from '../SettingSection';
import { CreditCard, Package } from 'lucide-react';

const BillingSettings = () => {
  return (
    <SettingSection title="Billing Settings" description="Manage your subscription and payment methods">
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
              <p className="text-sm text-gray-500 mt-1">Professional Plan</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-500">
                <li>• Unlimited customers</li>
                <li>• Route optimization</li>
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">$49</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-primary-600 bg-white rounded-md border border-primary-600 hover:bg-primary-50"
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="text-gray-400" size={24} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/24</p>
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {[
              { date: 'Mar 1, 2024', amount: '$49.00', status: 'Paid' },
              { date: 'Feb 1, 2024', amount: '$49.00', status: 'Paid' },
              { date: 'Jan 1, 2024', amount: '$49.00', status: 'Paid' },
            ].map((invoice, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invoice.date}</p>
                  <p className="text-sm text-gray-500">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    {invoice.status}
                  </span>
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingSection>
  );
};

export default BillingSettings;