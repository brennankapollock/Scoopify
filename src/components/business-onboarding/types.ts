export type BusinessOnboardingStep = 
  | 'welcome'
  | 'business-info'
  | 'service-area'
  | 'services'
  | 'employees'
  | 'customers'
  | 'scheduling'
  | 'billing'
  | 'notifications'
  | 'branding'
  | 'review';

export interface ServiceOffering {
  id: string;
  price: number;
  zipCodes: string[];
}

export interface DayZone {
  isActive: boolean;
  zipCodes: string[];
}

export interface BusinessOnboardingData {
  // Business Information
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      open: string;
      close: string;
    };
  };
  timezone: string;

  // Service Area
  serviceArea: {
    neighborhoods: string[];
    zipCodes: string[];
    cities: string[];
  };

  // Services
  services: {
    types: string[];
    offerings: ServiceOffering[];
    additionalFees: {
      name: string;
      amount: number;
      type: 'flat' | 'percentage';
    }[];
  };

  // Employees
  employees: {
    name: string;
    email: string;
    phone: string;
    role: string;
    zones: string[];
  }[];

  // Customer Management
  customerImport?: File;
  customerFields: {
    required: string[];
    optional: string[];
  };

  // Scheduling
  schedulingPreferences: {
    availableDays: string[];
    timeWindows: {
      start: string;
      end: string;
    }[];
    serviceIntervals: {
      min: number;
      max: number;
    };
    dayZones: Record<string, DayZone>;
  };

  // Billing
  billing: {
    paymentInterval: 'weekly' | 'monthly' | 'per-visit';
    paymentMethods: string[];
    autoInvoicing: boolean;
    paymentProcessor?: string;
  };

  // Notifications
  notifications: {
    templates: {
      [key: string]: string;
    };
    channels: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  // Branding
  branding: {
    logo?: File;
    colors: {
      primary: string;
      secondary: string;
    };
    heroImage?: string;
    heroImage?: string | null;
    companyTerms: string;
    privacyPolicy: boolean;
  };
  testimonials?: Array<{
    name: string;
    image: string;
    quote: string;
  }>;
  showTestimonials?: boolean;
}