import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { RouteStop } from '../routes/types';

export interface RouteStopCardProps {
  stop: RouteStop;
  onComplete: (stopId: string) => void;
  onAlert: (stopId: string, issue: string) => void;
  onLocation: (stopId: string) => void;
  onIssue: (stopId: string) => void;
}

const RouteStopCard: React.FC<RouteStopCardProps> = ({
  stop,
  onComplete,
  onAlert,
  onLocation,
  onIssue,
}) => {
  const [completed, setCompleted] = useState(false);
  const [points, setPoints] = useState(10); // Base points per stop

  const handleComplete = () => {
    setCompleted(true);
    setPoints(prev => prev + 5); // Bonus points for quick completion
    onComplete(stop.id);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-4 transition-all duration-300 ${
      completed ? 'bg-green-50 border-2 border-green-200' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{stop.customerName}</h3>
          <div className="text-sm text-gray-500">
            {stop.serviceType} • {stop.dogs || 2} dogs
            {stop.addOns?.length > 0 && (
              <span className="ml-2">• {stop.addOns.join(', ')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            +{points} pts
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
            Stop {stop.position}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          {stop.timeWindow}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAlert(stop.id, 'Customer attention needed')}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
            title="Alert Customer"
          >
            <AlertTriangle size={20} />
          </button>
          <button
            onClick={() => onLocation(stop.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Get Directions"
          >
            <MapPin size={20} />
          </button>
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`p-2 rounded-full transition-colors ${
              completed 
                ? 'text-green-300 cursor-not-allowed'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title="Mark Complete"
          >
            <CheckCircle size={20} />
          </button>
          <button
            onClick={() => onIssue(stop.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Report Issue"
          >
            <AlertCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteStopCard;