export interface Employee {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  teamSince: string;
  yardsCompleted?: number;
  rating?: number;
  status: 'active' | 'on-leave' | 'inactive' | 'pending';
  assignedRoutes?: string[];
  performanceScore?: number;
  certifications: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  address?: string;
  dateOfBirth?: string;
  startDate: string;
  payRate?: number;
  payType?: 'hourly' | 'salary';
  documents?: {
    w4?: boolean;
    i9?: boolean;
    driversLicense?: boolean;
    directDeposit?: boolean;
  };
  availability?: {
    [key: string]: {
      available: boolean;
      startTime?: string;
      endTime?: string;
    };
  };
  personalityProfile?: {
    favoriteFood: string;
    appreciationStyle: string;
    workStyle: string;
    hobbies: string;
  };
}