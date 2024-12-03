export interface Customer {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  serviceSelected: string;
  numberOfDogs: number;
  totalSpent: number;
  lastService?: string;
  nextService?: string;
  service?: {
    type: string;
    basePrice: number;
  };
  addOns?: string[];
  dogs?: {
    count: number;
    details: {
      name: string;
      breed: string;
      treats: boolean;
    }[];
  };
  routeId?: string | null;
  previousRouteId?: string | null;
  needsRouteOrdering?: boolean;
  zipCode?: string;
}