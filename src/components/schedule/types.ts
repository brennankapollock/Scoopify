export type ServiceType = 'weekly' | 'biweekly' | 'monthly' | 'one-time';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
export type ViewMode = 'month' | 'week' | 'day' | 'route' | 'details';

export interface Route {
  id: string;
  name: string;
  color: string;
  assignedTech?: {
    id: string;
    name: string;
  };
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: ServiceType;
  status: AppointmentStatus;
  date: string;
  timeSlot: string;
  duration: number; // in minutes
  address: string;
  routeId?: string;
  notes?: string;
  recurring?: {
    frequency: ServiceType;
    startDate: string;
    endDate?: string;
  };
}

export interface TimeSlot {
  time: string;
  appointments: Appointment[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'route' | 'appointment';
  routeId?: string;
  appointment?: Appointment;
  color?: string;
  start: Date;
  end: Date;
}