import React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Appointment } from '../types';

interface WeekViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ date, appointments, onAppointmentClick }) => {
  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i, 0), 'HH:mm')
  );

  const getSlotAppointments = (day: Date, time: string) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day) && 
      appointment.timeSlot === time
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 text-sm font-medium text-gray-500">
            Time
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-4 text-center">
              <div className="font-medium text-gray-900">
                {format(day, 'EEEE')}
              </div>
              <div className="text-sm text-gray-500">
                {format(day, 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-4 text-sm text-gray-500">
              {time}
            </div>
            {weekDays.map((day, index) => {
              const slotAppointments = getSlotAppointments(day, time);
              
              return (
                <div key={index} className="p-2 border-l border-gray-100">
                  {slotAppointments.map((appointment) => (
                    <button
                      key={appointment.id}
                      onClick={() => onAppointmentClick(appointment)}
                      className="w-full text-left p-2 rounded bg-primary-50 hover:bg-primary-100 transition-colors mb-1"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.serviceType}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;