export interface OnboardingData {
  zipCode: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  service: {
    type: string;
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
  password?: string; // Add password field
  status?: string;
}