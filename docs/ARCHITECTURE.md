# Scoopify Technical Architecture Documentation

## Overview
Scoopify is a comprehensive business management platform for pet waste removal companies. This document outlines the core data flows, integrations, and architecture decisions.

## Data Model

### Business
- Core entity representing a pet waste removal company
- Contains business settings, branding, service areas, etc
- Manages service offerings and pricing
- Stores operational preferences and schedules

### Customers
- Customer profiles and service preferences
- Pet information and special instructions
- Service history and billing records
- Communication preferences and history

### Routes & Scheduling
- Route definitions and optimization
- Service schedules and time windows
- Employee assignments and availability
- Real-time route tracking and updates

### Employees
- Employee profiles and roles
- Schedule and route assignments
- Performance metrics and ratings
- Access permissions and credentials

### Vehicles
- Fleet management and maintenance records
- Vehicle assignments and status
- Maintenance schedules and history
- Fuel efficiency and cost tracking

### Inventory
- Supply tracking and management
- Reorder thresholds and alerts
- Usage tracking and forecasting
- Cost analysis and reporting

## Data Flow

### Customer Onboarding
1. Customer visits business landing page
2. Completes onboarding flow:
   - ZIP code validation
   - Contact information
   - Service preferences
   - Pet details
3. Quote generation and approval
4. Account creation and welcome email
5. Assignment to service route

### Route Management
1. Customer assignments to routes
2. Route optimization based on:
   - Service frequency
   - Geographic location
   - Time windows (for one time appointments)
   - Vehicle/employee availability
3. Real-time updates and tracking
4. Service completion verification

### Employee Operations
1. Daily route assignments
2. Service completion tracking
3. Customer communication logging
4. Performance metrics collection
5. Schedule management

### Billing & Payments
1. Automated invoice generation
2. Payment processing
3. Revenue tracking
4. Financial reporting

## Firebase Integration

### Authentication
- User authentication and role management
- Multi-tenant access control
- Session management

### Firestore Collections
- businesses/
  - {businessId}/
    - customers/
    - employees/
    - routes/
    - vehicles/
    - inventory/
    - appointments/
    - analytics/

### Storage
- Business logos and assets
- Customer documents
- Service photos and documentation

## External Integrations

### SendGrid
- Customer notifications
- Service reminders
- Marketing communications
- Welcome emails
- Admin alerts

### Maps & Geocoding
- Address validation
- Route visualization
- Distance calculations
- Service area management

## Analytics & Reporting

### Business Metrics
- Revenue tracking
- Customer retention
- Service efficiency
- Employee performance

### Operational Analytics
- Route optimization
- Resource utilization
- Cost analysis
- Growth trends

### Customer Insights
- Satisfaction metrics
- Service preferences
- Communication effectiveness
- Referral tracking

## Security & Privacy

### Data Protection
- Role-based access control
- Data encryption
- Secure communication
- Privacy compliance

### Audit Trail
- User activity logging
- System changes tracking
- Security event monitoring
- Compliance reporting

## Performance Considerations

### Optimization Strategies
- Efficient data querying
- Caching implementation
- Background processing
- Real-time updates

### Scalability
- Multi-tenant architecture
- Resource allocation
- Load balancing
- Data partitioning

## Development Guidelines

### Code Organization
- Feature-based structure
- Shared components
- Utility functions
- Type definitions

### State Management
- Context providers
- Local state
- Form handling
- Data caching

### Component Patterns
- Container/Presenter pattern
- Custom hooks
- Reusable components
- Error boundaries

### Testing Strategy
- Unit tests
- Integration tests
- E2E testing
- Performance testing

## Deployment

### Build Process
- Environment configuration
- Asset optimization
- Code splitting
- Performance monitoring

### Release Strategy
- Version control
- Feature flags
- Rollback procedures
- Monitoring and alerts

## Future Considerations

### Planned Features
- Mobile application
- Advanced analytics
- API integrations
- Payment processing

### Scalability Plans
- Geographic expansion
- Multi-language support
- Enhanced automation
- Advanced reporting

## Troubleshooting

### Common Issues
- Authentication errors
- Data synchronization
- Performance bottlenecks
- Integration failures

### Debug Tools
- Error logging
- Performance monitoring
- User feedback
- System diagnostics

## Firestore Data Structure

### Users Collection
```
users/
  {userId}/
    email: string
    role: 'admin' | 'business_owner' | 'employee' | 'customer'
    businessId: string (for employees/customers)
    createdAt: timestamp
    updatedAt: timestamp
```

### Businesses Collection
```
businesses/
  {businessId}/
    businessName: string
    contactName: string
    phone: string
    email: string
    address: string
    ownerId: string
    businessHours: {
      monday: { isOpen: boolean, open: string, close: string }
      tuesday: { isOpen: boolean, open: string, close: string }
      // ... other days
    }
    timezone: string
    serviceArea: {
      neighborhoods: string[]
      zipCodes: string[]
      cities: string[]
    }
    services: {
      types: string[]
      offerings: [{
        id: string
        price: number
        zipCodes: string[]
      }]
      additionalFees: [{
        name: string
        amount: number
        type: 'flat' | 'percentage'
      }]
    }
    branding: {
      colors: {
        primary: string
        secondary: string
      }
      logoUrl: string
      companyTerms: string
      privacyPolicy: boolean
    }
    createdAt: timestamp
    updatedAt: timestamp
```

### Customers Subcollection
```
businesses/{businessId}/customers/
  {customerId}/
    fullName: string
    email: string
    phone: string
    address: string
    zipCode: string
    service: {
      type: string
      basePrice: number
    }
    dogs: {
      count: number
      details: [{
        name: string
        breed: string
        treats: boolean
      }]
    }
    routeId: string
    previousRouteId: string
    needsRouteOrdering: boolean
    status: 'active' | 'paused' | 'cancelled'
    totalSpent: number
    lastService: timestamp
    nextService: timestamp
    createdAt: timestamp
    updatedAt: timestamp
```

### Employees Subcollection
```
businesses/{businessId}/employees/
  {employeeId}/
    userId: string
    fullName: string
    email: string
    phone: string
    position: string
    status: 'active' | 'inactive' | 'on-leave'
    assignedRoutes: string[]
    availability: {
      monday: { available: boolean }
      // ... other days
    }
    performanceScore: number
    yardsCompleted: number
    rating: number
    documents: {
      w4: boolean
      i9: boolean
      driversLicense: boolean
      directDeposit: boolean
    }
    createdAt: timestamp
    updatedAt: timestamp
```

### Routes Subcollection
```
businesses/{businessId}/routes/
  {routeId}/
    name: string
    color: string
    serviceDay: string
    neighborhoods: string[]
    zipCodes: string[]
    assignedTech: {
      id: string
      name: string
      rating: number
    }
    stops: [{
      id: string
      customerId: string
      customerName: string
      address: string
      position: number
      timeWindow: string
      serviceType: string
    }]
    status: 'active' | 'inactive' | 'completed'
    efficiency: number
    totalStops: number
    estimatedDuration: string
    startPoint: {
      address: string
      zipCode: string
      type: 'start'
    }
    endPoint: {
      address: string
      zipCode: string
      type: 'end'
    }
    createdAt: timestamp
    updatedAt: timestamp
```

### Vehicles Subcollection
```
businesses/{businessId}/vehicles/
  {vehicleId}/
    name: string
    make: string
    model: string
    year: number
    licensePlate: string
    vin: string
    status: 'active' | 'maintenance' | 'inactive'
    assignedTo: string
    fuelType: 'gas' | 'diesel' | 'electric' | 'hybrid'
    fuelEfficiency: number
    currentMileage: number
    insuranceExpiry: timestamp
    registrationExpiry: timestamp
    lastMaintenance: {
      date: timestamp
      type: string
      description: string
      mileage: number
      cost: number
      performedBy: string
    }
    nextMaintenance: {
      type: string
      dueDate: timestamp
      estimatedCost: number
    }
    createdAt: timestamp
    updatedAt: timestamp
```

### Inventory Subcollection
```
businesses/{businessId}/inventory/
  {itemId}/
    name: string
    category: 'consumable' | 'equipment'
    quantity: number
    unit: 'box' | 'piece' | 'bottle'
    minThreshold: number
    lastRestocked: timestamp
    costPerUnit: number
    supplier: string
    location: string
    createdAt: timestamp
    updatedAt: timestamp
```

### Analytics Collection
```
analytics/
  tools/
    usage/
      {usageId}/
        name: string
        email: string
        toolId: string
        userAgent: string
        referrer: string
        createdAt: timestamp
    users/
      {userId}/
        name: string
        email: string
        firstToolUsed: string
        firstUsedAt: timestamp
        lastUsedAt: timestamp
```

### Waitlist Collection
```
waitlist/
  {entryId}/
    fullName: string
    email: string
    businessStage: 'planning' | 'new' | 'established'
    customerCount: string
    desiredFeatures: string[]
    message: string
    status: 'pending' | 'contacted' | 'converted'
    source: string
    createdAt: timestamp
```

## Critical Data Relationships

### User -> Business
- Each business_owner user MUST have exactly one corresponding business document
- Business document MUST have ownerId matching the user's ID
- Employee and customer users MUST have businessId field referencing their business

### Customer -> Route
- Customer document contains routeId referencing their assigned route
- previousRouteId tracks historical route assignments
- needsRouteOrdering flag indicates if customer needs to be ordered within route
- Customer can only be assigned to one route unless service type is 'twice-weekly'

### Employee -> Route
- Employee document contains assignedRoutes array of route IDs
- Route document contains assignedTech object with employee ID and details
- When employee is assigned/unassigned, both documents MUST be updated atomically

### Route -> Stops
- Route stops array contains customer IDs and essential customer data
- Stop positions MUST be sequential starting from 1
- Customer data in stops MUST be kept in sync with customer documents
- Route zipCodes MUST be a subset of business service area zipCodes

### Vehicle -> Employee
- Vehicle can be assigned to one employee via assignedTo field
- Employee document SHOULD track vehicle assignments
- Vehicle maintenance records are tied to vehicle document

### Inventory -> Business
- Inventory items belong to specific business via subcollection
- Inventory thresholds and tracking are business-specific
- Inventory usage is tracked at business level

### Analytics Relationships
- Tool usage tracks individual user interactions
- Tool users collection maintains unique user records
- Waitlist entries are independent but may convert to business accounts

### Maintenance Requirements
1. When updating route assignments:
   - Update both employee and route documents
   - Maintain consistency of stops array
   - Update customer routeId fields

2. When updating customer data:
   - Update customer document
   - Update corresponding route stop data
   - Update any relevant analytics

3. When managing employees:
   - Update employee document
   - Update assigned route documents
   - Update any assigned vehicle documents

4. When deleting data:
   - Remove all references in related documents
   - Update any dependent collections
   - Maintain referential integrity

5. When updating business settings:
   - Validate against existing customer/route data
   - Update affected customer records
   - Update affected route configurations

## Common Workflows

### Customer Lifecycle
1. Acquisition
   - Landing page visit
   - ZIP code validation
   - Service selection
   - Quote generation
   - Account creation

2. Onboarding
   - Welcome email (SendGrid)
   - Route assignment
   - Initial service scheduling
   - Payment setup

3. Service Management
   - Regular service execution
   - Route optimization
   - Communication tracking
   - Billing automation

4. Retention
   - Satisfaction monitoring
   - Rewards program
   - Referral tracking
   - Price increase management

### Route Management Workflow
1. Route Creation
   - Define service area
   - Set schedule/frequency
   - Assign technician
   - Configure start/end points

2. Customer Assignment
   - ZIP code validation
   - Service day matching
   - Position optimization
   - Update customer records

3. Route Execution
   - Daily route loading
   - Real-time updates
   - Service verification
   - Customer notification

### Employee Management
1. Hiring Process
   - Account creation
   - Document verification
   - Training tracking
   - Route assignment

2. Daily Operations
   - Schedule management
   - Route assignments
   - Performance tracking
   - Communication logs

## State Management Patterns

### Context Providers
1. AuthContext
   - User authentication state
   - Role-based access control
   - Business context

2. CustomerContext
   - Customer profile data
   - Service preferences
   - Billing information

3. RouteContext
   - Route assignments
   - Stop ordering
   - Service status

### Data Flow Patterns
1. Real-time Updates
   - Firestore listeners
   - State synchronization
   - UI updates

2. Batch Operations
   - Transaction handling
   - Error recovery
   - State rollback

3. Optimistic Updates
   - Immediate UI feedback
   - Background sync
   - Error handling

## Integration Points

### External Services
1. SendGrid
   - Email templates
   - Trigger points
   - Error handling
   - Subusers for their email

2. Maps Integration
   - Address validation
   - Route visualization
   - Distance calculation

3. Stripe Integration
    - For app billing
    - Subaccounts for business billing
      
4. Twilio
    - SMS Main Account for app
    - Subusers for businesses to text and call

### Internal Services
1. Analytics Engine
   - Event tracking
   - Metric calculation
   - Report generation

2. Notification System
   - Multi-channel delivery
   - Template management
   - Delivery tracking

3. Document Generation
   - PDF creation
   - Template rendering
   - File storage

## Error Handling Strategies

### Client-Side Errors
1. Form Validation
   - Input sanitization
   - Business rule validation
   - User feedback

2. Network Errors
   - Retry logic
   - Offline support
   - Error recovery

3. State Conflicts
   - Conflict resolution
   - Data merging
   - Version control

### Server-Side Errors
1. Database Errors
   - Transaction rollback
   - Data consistency
   - Error logging

2. Integration Errors
   - Fallback options
   - Service degradation
   - Error notification

## Performance Optimization

### Data Loading
1. Lazy Loading
   - Route-based code splitting
   - Dynamic imports
   - Component lazy loading

2. Data Prefetching
   - Route prediction
   - Data preloading
   - Cache management

3. State Management
   - Memoization
   - Selective updates
   - Batch processing

### UI Performance
1. Component Optimization
   - Pure components
   - Memo usage
   - Event delegation

2. Rendering Optimization
   - Virtual scrolling
   - Windowing
   - Skeleton loading

## Testing Strategy

### Unit Testing
1. Component Testing
   - Rendering tests
   - Event handling
   - State management

2. Utility Testing
   - Pure functions
   - Business logic
   - Data transformations

### Integration Testing
1. Feature Testing
   - User workflows
   - Data flow
   - Error scenarios

2. API Testing
   - Endpoint validation
   - Error handling
   - Response formats

## Monitoring & Debugging

### Performance Monitoring
1. Key Metrics
   - Page load time
   - API response time
   - Error rates

2. User Metrics
   - Session duration
   - Feature usage
   - Error encounters

### Debug Tools
1. Development Tools
   - React DevTools
   - Firebase Console
   - Network monitoring

2. Production Tools
   - Error tracking
   - Performance monitoring
   - Usage analytics
