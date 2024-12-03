import React from 'react';
import { X, Calendar, Clock, MapPin, Repeat, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from './types';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {appointment.customerName}
          </h2>
          <p className="text-gray-500">
            Appointment Details
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Calendar className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Date & Time</h3>
            <p className="text-gray-600">
              {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
              <br />
              {appointment.timeSlot}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Clock className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Duration</h3>
            <p className="text-gray-600">{appointment.duration} minutes</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Service Location</h3>
            <p className="text-gray-600">{appointment.address}</p>
          </div>
        </div>

        {appointment.recurring && (
          <div className="flex items-start gap-4">
            <Repeat className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Recurring Service</h3>
              <p className="text-gray-600">
                {appointment.recurring.frequency.charAt(0).toUpperCase() + 
                  appointment.recurring.frequency.slice(1)} service
                <br />
                Started {format(new Date(appointment.recurring.startDate), 'MMMM d, yyyy')}
                {appointment.recurring.endDate && (
                  <>
                    <br />
                    Ends {format(new Date(appointment.recurring.endDate), 'MMMM d, yyyy')}
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {appointment.notes && (
          <div className="flex items-start gap-4">
            <FileText className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Notes</h3>
              <p className="text-gray-600">{appointment.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Edit Appointment
        </button>
        <button
          className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails;