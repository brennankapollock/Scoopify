export interface BusinessOnboardingData {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  password?: string;
  address: string;
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      open: string;
      close: string;
    };
  };
  timezone: string;
  serviceArea: {
    neighborhoods: string[];
    zipCodes: string[];
    cities: string[];
  };
  services: {
    types: string[];
    offerings: ServiceOffering[];
    additionalFees: {
      name: string;
      amount: number;
      type: 'flat' | 'percentage';
    }[];
  };
  employees: {
    name: string;
    email: string;
    phone: string;
    role: string;
    zones: string[];
  }[];
  customerFields: {
    required: string[];
    optional: string[];
  };
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
  billing: {
    paymentInterval: 'weekly' | 'monthly' | 'per-visit';
    paymentMethods: string[];
    autoInvoicing: boolean;
    paymentProcessor?: string;
  };
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
  branding: {
    colors: {
      primary: string;
      secondary: string;
    };
    companyTerms: string;
    privacyPolicy: boolean;
    heroImage?: string;
    aboutImage?: string;
  };
  showTestimonials?: boolean;
  testimonials?: Array<{
    name: string;
    image: string;
    quote: string;
  }>;
}

export interface ServiceOffering {
  id: string;
  price: number;
  zipCodes: string[];
}

export interface DayZone {
  isActive: boolean;
  zipCodes: string[];
}