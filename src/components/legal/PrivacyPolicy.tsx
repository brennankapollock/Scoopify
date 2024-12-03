import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/auth';
import BusinessNav from '../landing/sections/business/BusinessNav';
import BusinessFooter from '../landing/sections/business/BusinessFooter';
import { BusinessOnboardingData } from '../../types/business';

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: {lastUpdated}</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2>Introduction</h2>
            <p>
              {business.businessName} ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our pet waste removal services.
            </p>
          </section>

        <section className="mb-8">
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Name and contact information</li>
            <li>Billing and payment information</li>
            <li>Service address and access instructions</li>
            <li>Pet information</li>
            <li>Service preferences and history</li>
            <li>Communication records</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Service usage data</li>
            <li>Cookies and tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>How We Use Your Information</h2>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process payments and billing</li>
            <li>Communicate with you about services</li>
            <li>Send service notifications and updates</li>
            <li>Analyze and improve our operations</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers and contractors</li>
            <li>Payment processors</li>
            <li>Legal authorities when required</li>
            <li>Business partners with your consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>California Privacy Rights (CCPA)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal information:
          </p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to delete personal information</li>
            <li>Right to opt-out of the sale of personal information</li>
            <li>Right to non-discrimination for exercising CCPA rights</li>
          </ul>
          <p>
            To exercise these rights, contact us at {business.email} or {business.phone}.
          </p>
        </section>

        <section className="mb-8">
          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2>Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the updated policy on our website.
          </p>
        </section>

        <section className="mb-8">
          <h2>Contact Information</h2>
          <p>
            For questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;