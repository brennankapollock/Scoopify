import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/auth';
import BusinessNav from '../landing/sections/business/BusinessNav';
import BusinessFooter from '../landing/sections/business/BusinessFooter';
import { BusinessOnboardingData } from '../../types/business';

const TermsOfService: React.FC = () => {
  const { businessId } = useParams();
  const { getBusiness } = useAuth();
  const [business, setBusiness] = useState<BusinessOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastUpdated = format(new Date(), 'MMMM d, yyyy');

  useEffect(() => {
    const loadBusinessData = async () => {
      if (!businessId) {
        setError('Business ID is required');
        setLoading(false);
        return;
      }

      try {
        const data = await getBusiness(businessId);
        if (!data) {
          setError('Business not found');
        } else {
          setBusiness(data);
        }
      } catch (err) {
        console.error('Error loading business:', err);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId, getBusiness]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Business data not available'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BusinessNav business={business} />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: {lastUpdated}</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the services provided by {business.businessName} ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.
            </p>
          </section>

        <section className="mb-8">
          <h2>2. Service Description</h2>
          <p>
            We provide professional pet waste removal services for residential and commercial properties. Our services include:
          </p>
          <ul>
            <li>Regular scheduled cleanings</li>
            <li>One-time cleanup services</li>
            <li>Special event cleanup</li>
            <li>Deodorizing treatments (where available)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. Customer Responsibilities</h2>
          <ul>
            <li>Provide accurate service location information</li>
            <li>Ensure safe access to service areas</li>
            <li>Secure pets during service visits</li>
            <li>Maintain current payment information</li>
            <li>Notify us of any access changes or special instructions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Service Schedule and Access</h2>
          <p>
            Services will be performed according to the agreed-upon schedule. We require:
          </p>
          <ul>
            <li>24-hour notice for schedule changes</li>
            <li>Safe access to service areas</li>
            <li>Clear communication about access instructions</li>
            <li>Notification of any access restrictions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>5. Payment Terms</h2>
          <ul>
            <li>Payment is required according to the agreed payment schedule</li>
            <li>Late payments may result in service suspension</li>
            <li>Price changes require 30-day advance notice</li>
            <li>Refunds are handled according to our refund policy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>6. Cancellation Policy</h2>
          <ul>
            <li>24-hour notice required for service cancellation</li>
            <li>Late cancellations may be charged full service fee</li>
            <li>30-day notice required for service termination</li>
            <li>Refunds for prepaid services will be prorated</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>7. Liability and Insurance</h2>
          <p>
            We maintain comprehensive business insurance coverage. However:
          </p>
          <ul>
            <li>We are not responsible for pre-existing property conditions</li>
            <li>Property damage claims must be reported within 24 hours</li>
            <li>We are not responsible for pet behavior or injuries</li>
            <li>Customer assumes responsibility for secured pets</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>8. Service Guarantee</h2>
          <p>
            We strive to provide high-quality service and customer satisfaction. If you are not satisfied with our service, please contact us within 24 hours and we will address your concerns.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective upon posting to our website. Continued use of our services constitutes acceptance of modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
          </p>
          <div className="mt-4">
            <p>{business.businessName}</p>
            <p>{business.address}</p>
            <p>Email: {business.email}</p>
            <p>Phone: {business.phone}</p>
          </div>
        </section>
        </div>
      </div>
      
      <BusinessFooter business={business} />
    </div>
  );
};

export default TermsOfService;