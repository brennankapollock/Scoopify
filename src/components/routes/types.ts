export interface RouteStop {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  position: number;
  timeWindow: string;
  serviceType: 'weekly' | 'biweekly' | 'monthly' | 'one-time';
}

export interface AssignedTech {
  id: string;
  name: string;
  rating: number;
}

export interface RouteEndpoint {
  address: string;
  zipCode: string;
  type: 'start' | 'end';
}

export interface Route {
  id: string;
  name: string;
  color: string;
  neighborhoods: string[];
  zipCodes: string[];
  assignedTech?: AssignedTech;
  stops: RouteStop[];
  status: 'active' | 'inactive' | 'completed';
  efficiency: number;
  totalStops: number;
  estimatedDuration: string;
  serviceDay: string;
  startPoint?: RouteEndpoint;
  endPoint?: RouteEndpoint;
}