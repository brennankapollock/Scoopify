# Scoopify Integration Documentation

## Overview
Planned integrations for Scoopify, listed in order of priority. Each integration includes required dependencies, configuration details, and implementation notes (I think).

## 1. Postmark Integration (Waitlist, Customer, and Admin Notifications)
**Priority: High**

### Dependencies
```json
{
  "@postmark/postmark": "^3.10.0"
}
```

### Configuration Required
- Postmark Server Token
- Verified Sender Domain
- Email Templates (Will Already Be Designed):
  - Waitlist Confirmation Email
  - Waitlist Admin Email
  - Customer Sign Up Email
  - Business Owner Email
  - Customer Visit Notification

### Implementation Notes
- Partially implemented in `src/lib/postmark.ts`
- Need to expand functionality for:
  - Waitlist confirmation emails
  - Welcome emails for new customers
  - Visit & notes notification emails on behalf of businesses
  - Business owner notifications
  - Email template management
  
  ### Summary
  - Not sure if it's set up correctly
  - Any change in approach is welcome

### API Endpoints Needed (as far as I know)
```typescript
POST /api/email/waitlist
POST /api/email/customer-signup
POST /api/email/business-notification
```

## 2. Stripe Integration (Platform Payments)
**Priority: High**

### Dependencies
```json
{
  "@stripe/stripe-js": "^2.4.0",
  "@stripe/react-stripe-js": "^2.4.0",
  "stripe": "^14.14.0"
}
```

### Configuration Required
- Stripe Secret Key
- Stripe Publishable Key
- Webhook Secret
- Product & Price IDs for:
  - Free Plan
  - Pro Plan
  - Enterprise Plan (for franchises)

### Implementation Notes
- Implement subscription management
- Handle plan upgrades/downgrades
- Track customer limits
- Implement usage-based billing for customer tiers

### API Endpoints Needed
```typescript
POST /api/subscriptions/create
POST /api/subscriptions/update
POST /api/subscriptions/cancel
POST /api/webhooks/stripe
```

## 3. Stripe Connect Integration (Business Payments)
**Priority: Medium**

### Dependencies
- Same as Platform Payments

### Configuration Required
- Stripe Connect Settings
- OAuth Configuration
- Account Management Webhooks

### Implementation Notes
- Allow businesses to connect their Stripe accounts
- Implement OAuth flow for account connection
- Display payment analytics in dashboard
- Automatic invoice generation
- Payment tracking and reconciliation

### API Endpoints Needed
```typescript
POST /api/connect/account
GET /api/connect/oauth/callback
POST /api/connect/invoices/create
POST /api/webhooks/connect
```

## 4. Twilio Integration (Business Messaging)
**Priority: Medium**

### Dependencies
```json
{
  "twilio": "^4.20.1",
  "@twilio/conversations": "^2.5.0"
}
```

### Configuration Required
- Twilio Account SID
- Twilio Auth Token
- Messaging Service SID
- Subaccount Management Credentials

### Implementation Notes
- Create subaccounts for premium users
- Implement messaging interface
- Handle message threading
- Manage conversation history
- Implement delivery/read receipts

### API Endpoints Needed
```typescript
POST /api/messaging/setup-subaccount
POST /api/messaging/send
GET /api/messaging/conversations
POST /api/webhooks/twilio
```

## 5. SendGrid Subuser Integration (Business Email)
**Priority: Low**

### Dependencies
- Same as SendGrid Integration

### Configuration Required
- SendGrid Parent Account Credentials
- Domain Verification Settings
- Email Authentication Records
- IP Pool Management

### Implementation Notes
- Automate subuser creation
- Handle domain verification
- Manage email templates
- Track email analytics
- Implement email quotas

### API Endpoints Needed
```typescript
POST /api/email/setup-subuser
POST /api/email/verify-domain
GET /api/email/analytics
POST /api/webhooks/sendgrid
```

## Environment Variables Required
```env
# SendGrid
VITE_SENDGRID_API_KEY=
VITE_SENDGRID_TEMPLATE_ID=
VITE_SENDGRID_FROM_EMAIL=

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_STRIPE_SECRET_KEY=
VITE_STRIPE_WEBHOOK_SECRET=
VITE_STRIPE_CONNECT_CLIENT_ID=

# Twilio
VITE_TWILIO_ACCOUNT_SID=
VITE_TWILIO_AUTH_TOKEN=
VITE_TWILIO_MESSAGING_SERVICE_SID=

# General
VITE_API_URL=
VITE_APP_URL=
```

## Firebase Configuration Required
```typescript
// Firestore Collections & Documents
interface Collections {
  businesses: {
    stripe: {
      customerId: string;
      subscriptionId: string;
      priceId: string;
      connectAccountId?: string;
    };
    twilio: {
      subaccountSid?: string;
      phoneNumber?: string;
    };
    sendgrid: {
      subuserId?: string;
      domain?: string;
    };
  };
  subscriptions: {
    status: string;
    plan: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  payments: {
    amount: number;
    status: string;
    customerId: string;
    invoiceId: string;
  };
}
```

## Security Rules Required
```typescript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add rules for payment data
    match /businesses/{businessId}/payments/{paymentId} {
      allow read: if request.auth.uid == businessId;
      allow write: if false; // Only allow writes through Cloud Functions
    }
    
    // Add rules for subscription data
    match /businesses/{businessId}/subscriptions/{subscriptionId} {
      allow read: if request.auth.uid == businessId;
      allow write: if false; // Only allow writes through Cloud Functions
    }
  }
}
```

## Cloud Functions Required
```typescript
// List of Cloud Functions needed
- handleStripeWebhook
- handleTwilioWebhook
- handleSendGridWebhook
- createStripeCustomer
- createTwilioSubaccount
- createSendGridSubuser
- generateInvoice
- processPayment
- updateSubscription
```

## Implementation Order
1. SendGrid Basic Integration
   - Implement waitlist emails
   - Set up dynamic customer notifications from Scoopify
   - Configure email templates

2. Stripe Platform Payments
   - Set up subscription plans
   - Implement payment processing
   - Handle webhooks

3. Stripe Connect
   - Business account connection
   - Payment processing
   - Invoice generation

4. Twilio Integration
   - Subaccount creation
   - Messaging implementation
   - Webhook handling

5. SendGrid Subusers
   - Subuser management
   - Domain verification
   - Email analytics

## Testing Requirements
- Unit tests for all API endpoints
- Integration tests for payment flows
- End-to-end tests for user journeys
- Webhook testing environment
- Error handling scenarios
- Rate limiting tests
- Security testing

## Monitoring Requirements
- Payment success/failure rates
- Email delivery rates
- Message delivery rates
- API response times
- Error rates
- Usage metrics
- Cost tracking

## Documentation Requirements
- API documentation
- Integration setup guides
- Webhook handling documentation
- Error code reference
- Security best practices
- Rate limiting guidelines
- Testing procedures
