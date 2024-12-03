import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Appointment } from '../types';

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, appointments, onAppointmentClick }) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i, 0), 'HH:mm')
  );

  const getSlotAppointments = (time: string) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date) && 
      appointment.timeSlot === time
    );
  };

  return (
    <div className="divide-y divide-gray-200">
      {timeSlots.map((time) => {
        const slotAppointments = getSlotAppointments(time);
        
        if (slotAppointments.length === 0) return null;

        return (
          <div key={time} className="p-4">
            <div className="text-lg font-medium text-gray-900 mb-4">
              {time}
            </div>
            <div className="space-y-3">
              {slotAppointments.map((appointment) => (
                <button
                  key={appointment.id}
                  onClick={() => onAppointmentClick(appointment)}
                  className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-900">
                        {appointment.customerName}
                      </span>
                      <span className="mx-2 text-gray-400">·</span>
                      <span className="text-gray-600">
                        {appointment.duration} minutes
                      </span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
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
                  <p className="text-sm text-gray-500">
                    {appointment.address}
                  </p>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500 mt-2">
                      Note: {appointment.notes}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayView;