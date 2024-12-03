export interface OnboardingData {
  zipCode: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  service: {
    type: 'weekly' | 'biweekly' | 'monthly';
    basePrice: number;
  };
  addOns: string[];
  dogs: {
    count: number;
    details: {
      name: string;
      breed: string;
      treats: boolean;
    }[];
  };
}

export type OnboardingStep = 
  | 'zip'
  | 'info'
  | 'service'
  | 'dogs'
  | 'quote'
  | 'thanks';