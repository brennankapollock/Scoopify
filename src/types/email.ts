export enum EmailTemplate {
  WAITLIST_CONFIRMATION = 'waitlist-confirmation',
  NEW_CUSTOMER_NOTIFICATION = 'new-customer-notification',
  SERVICE_REMINDER = 'service-reminder',
  SERVICE_COMPLETE = 'service-complete',
  PAYMENT_CONFIRMATION = 'payment-confirmation',
  BUSINESS_WELCOME = 'business-welcome',
}

export interface EmailData {
  to: string;
  from?: string;
  fromName?: string;
  templateAlias: EmailTemplate;
  templateModel: Record<string, any>;
}

export interface PostmarkConfig {
  serverToken?: string;
  defaultFrom?: string;
}
