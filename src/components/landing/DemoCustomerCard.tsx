import React, { useState } from 'react';
import { Mail, Phone, MapPin, Dog, Bell, CheckCircle2 } from 'lucide-react';

const DemoCustomerCard = () => {
  const [notified, setNotified] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customer Management
        </h3>
        <p className="text-sm text-gray-600">
          Explore how easy it is to manage customer information and communications
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sarah Johnson
              </h3>
              <p className="text-sm text-gray-500">Premium Customer</p>
            </div>
            <button
              onClick={handleNotify}
              disabled={notified}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                notified
                  ? 'bg-white border border-green-200 text-green-700'
                  : 'bg-white border border-primary-200 text-primary-600 hover:border-primary-300'
              } transition-colors`}
            >
              <div className="flex items-center gap-2">
                {notified ? (
                  <>
                    <CheckCircle2 size={16} />
                    Notified
                  </>
                ) : (
                  <>
                    <Bell size={16} />
                    Send Reminder
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">sarah.johnson@example.com</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">(555) 123-4567</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">123 Example Street, Demo City</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Dog size={16} className="mr-2" />
              <span className="text-sm">2 dogs (Max & Bella)</span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700"
          >
            {expanded ? 'Show Less' : 'Show More Details'}
          </button>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Service History
                </h4>
                <div className="space-y-2">
                  {[
                    { date: '2024-03-15', status: 'Completed' },
                    { date: '2024-03-08', status: 'Completed' },
                    { date: '2024-03-01', status: 'Completed' },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">
                        {new Date(service.date).toLocaleDateString()}
                      </span>
                      <span className="text-green-600">{service.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </h4>
                <p className="text-sm text-gray-600">
                  Gate code: 1234. Please make sure to close the gate after service.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoCustomerCard;