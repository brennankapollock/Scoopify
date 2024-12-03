import { BusinessInfo } from '../price-increase/types';

export interface Service {
  id: string;
  name: string;
  description: string;
  frequency: 'weekly' | 'twice-weekly' | 'bi-weekly' | 'monthly' | 'one-time' | 'add-on';
  basePrice: number;
  timePerYard: number; // in minutes
  isAddOn?: boolean;
}

export interface PricingCalculatorData {
  businessInfo: BusinessInfo;
  services: Service[];
  operatingCosts: {
    laborRate: number; // per hour
    fuelCost: number; // per gallon
    vehicleMileage: number; // miles per gallon
    averageDriveDistance: number; // miles between yards
    supplies: number; // cost per yard
    insurance: number; // monthly cost
    marketing: number; // monthly cost
    overhead: number; // monthly cost
  };
  profitTargets: {
    minimumProfit: number; // percentage
    targetProfit: number; // percentage
    maximumProfit: number; // percentage
  };
}