import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );
};

export default ErrorScreen;