import React from 'react';
import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import { Appointment } from '../types';

interface EmployeeScheduleViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const EmployeeScheduleView: React.FC<EmployeeScheduleViewProps> = ({
  date,
  appointments,
  onAppointmentClick,
}) => {
  const sortedAppointments = [...appointments].sort((a, b) => 
    a.timeSlot.localeCompare(b.timeSlot)
  );

  return (
    <div className="divide-y divide-gray-200">
      {/* Schedule Header */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Your Schedule
          </h3>
          <div className="text-sm text-gray-500">
            {format(date, 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="divide-y divide-gray-100">
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment) => (
            <button
              key={appointment.id}
              onClick={() => onAppointmentClick(appointment)}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {appointment.timeSlot}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mt-1">
                    {appointment.customerName}
                  </h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  appointment.serviceType === 'weekly'
                    ? 'bg-blue-100 text-blue-800'
                    : appointment.serviceType === 'biweekly'
                    ? 'bg-purple-100 text-purple-800'
                    : appointment.serviceType === 'monthly'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.serviceType}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} className="flex-shrink-0" />
                <span>{appointment.address}</span>
              </div>

              {appointment.notes && (
                <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                  {appointment.notes}
                </div>
              )}
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No appointments scheduled for today
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeScheduleView;