export interface BusinessInfo {
  businessName: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  priceChangeType: 'fixed' | 'percentage';
  currentPrice: string;
  newPrice: string;
  percentageIncrease: string;
  effectiveDate: string;
  logo?: File;
}

export interface LetterOptions {
  tone: 'professional' | 'friendly' | 'direct';
  includeThankYou: boolean;
  includeMarketFactors: boolean;
  includeValueProposition: boolean;
  includeEffectiveDate: boolean;
  includeContact: boolean;
}