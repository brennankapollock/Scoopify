export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: 'active' | 'maintenance' | 'inactive';
  assignedTo?: string;
  fuelType: 'gas' | 'diesel' | 'electric' | 'hybrid';
  fuelEfficiency: number;
  currentMileage: number;
  insuranceExpiry: string;
  registrationExpiry: string;
  notes?: string;
  tags: string[];
  lastMaintenance?: MaintenanceRecord;
  nextMaintenance?: {
    type: string;
    dueDate: string;
    estimatedCost: number;
  };
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  mileage: number;
  cost: number;
  performedBy: string;
  notes?: string;
}