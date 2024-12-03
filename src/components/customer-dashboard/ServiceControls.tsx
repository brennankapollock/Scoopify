import React from 'react';
import { Pause, Play, X, AlertCircle } from 'lucide-react';

const ServiceControls = () => {
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Controls</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
            isPaused
              ? 'border-primary-600 text-primary-600 hover:bg-primary-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isPaused ? (
            <>
              <Play size={16} className="mr-2" />
              Resume Service
            </>
          ) : (
            <>
              <Pause size={16} className="mr-2" />
              Pause Service
            </>
          )}
        </button>

        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex items-center justify-center px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
        >
          <X size={16} className="mr-2" />
          Cancel Service
        </button>
      </div>

      {showCancelConfirm && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-red-600 mt-0.5 mr-3" size={20} />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Are you sure you want to cancel?
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. Your service will continue until the end of your current billing period.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Never mind
                </button>
                <button
                  onClick={() => {
                    // Handle cancellation
                    setShowCancelConfirm(false);
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Yes, cancel service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceControls;