import { BusinessInfo } from '../price-increase/types';

export interface ServiceDetails {
  serviceFrequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  customFrequency?: string;
  servicePrice: string;
  paymentSchedule: 'monthly' | 'per-visit' | 'prepaid';
  includedServices: string[];
  customServices: string[];
}

export interface CancellationPolicy {
  noticePeriod: '24hours' | '48hours' | '7days' | 'custom';
  customNoticePeriod?: string;
  refundPolicy: 'full' | 'partial' | 'none';
  cancellationFee: string;
}

export interface LiabilityTerms {
  insuranceCoverage: string;
  propertyDamage: boolean;
  petInjury: boolean;
  customTerms: string;
}

export interface ServiceAgreement {
  businessInfo: BusinessInfo;
  serviceDetails: ServiceDetails;
  cancellationPolicy: CancellationPolicy;
  liabilityTerms: LiabilityTerms;
  useDefaultTerms: boolean;
  state: string;
  effectiveDate: string;
}

export const DEFAULT_INCLUDED_SERVICES = [
  'Pet waste removal',
  'Yard inspection',
  'Gate/door security check',
  'Service completion notification',
  'Deodorizer application',
];

export const DEFAULT_LIABILITY_TERMS = `
1. Insurance Coverage
- Business maintains comprehensive liability insurance
- Coverage up to $1,000,000 per incident
- Proof of insurance available upon request

2. Property Access & Damage
- Customer grants permission to access property
- Business will exercise reasonable care
- Any property damage will be reported immediately
- Business is responsible for damages caused by negligence

3. Pet Safety & Injury
- Business assumes no responsibility for pet behavior
- Pets should be secured during service
- Business will report any observed pet health issues
- Not responsible for pre-existing conditions

4. Service Conditions
- Weather-related rescheduling may occur
- Service area must be accessible and safe
- Business reserves right to refuse service
- Photos may be taken for documentation
`;

export const DEFAULT_CANCELLATION_TERMS = `
1. Service Cancellation
- 24-hour notice required for service cancellation
- Late cancellations subject to full service charge
- Emergency situations handled case-by-case

2. Contract Termination
- 7-day written notice required for service termination
- Prepaid services will be refunded pro-rata
- Outstanding balances due immediately

3. Business Termination Rights
- May terminate for non-payment
- May terminate for unsafe conditions
- May terminate for repeated late cancellations
`;