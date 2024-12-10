import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Dog,
  Rocket,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import Navbar from '../landing/Navbar';

interface WaitlistData {
  fullName: string;
  email: string;
  businessStage: 'planning' | 'new' | 'established';
  customerCount: string;
  desiredFeatures: string[];
  message: string;
}

const features = [
  'Route Optimization',
  'Customer Management',
  'Employee Management',
  'Scheduling',
  'Billing & Payments',
  'Customer Portal',
  'Mobile App',
  'Analytics & Reports',
  'Inventory Management',
  'Marketing Tools',
  'Communication Hub',
  'Vehicle Management',
];

const WaitlistPage = () => {
  const [formData, setFormData] = useState<WaitlistData>({
    fullName: '',
    email: '',
    businessStage: 'planning',
    customerCount: '',
    desiredFeatures: [],
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add to waitlist collection in Firestore
      const waitlistRef = collection(db, 'waitlist');
      await addDoc(waitlistRef, {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending',
        source: window.location.hostname,
      });

      const htmlBody = `
      <h1>Welcome to Scoopify's Waitlist!</h1>
      <p>Hi ${formData.fullName},</p>
      <p>Thank you for joining our waitlist. We're excited to have you on board!</p>
      <p>Here's what you told us about your business:</p>
      <ul>
        <li>Business Stage: ${formData.businessStage}</li>
        <li>Current Customers: ${formData.customerCount}</li>
        <li>Desired Features: ${formData.desiredFeatures.join(', ')}</li>
      </ul>
      <p>We'll keep you updated on our progress and let you know as soon as we're ready to launch.</p>
      <p>Best regards,<br>The Scoopify Team</p>
    `;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/waitlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: formData.email,
            subject: 'Welcome to Scoopify!',
            htmlBody,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send confirmation email');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting to waitlist:', err);
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      desiredFeatures: prev.desiredFeatures.includes(feature)
        ? prev.desiredFeatures.filter((f) => f !== feature)
        : [...prev.desiredFeatures, feature],
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-16">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              You're on the list! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Thank you for your interest in Scoopify. We're working hard to
              build something amazing, and we'll let you know as soon as we're
              ready to launch!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <Rocket className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Early Access</h3>
                <p className="text-sm text-gray-600">
                  Be among the first to try Scoopify
                </p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Exclusive Updates</h3>
                <p className="text-sm text-gray-600">
                  Get development updates first
                </p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Special Pricing</h3>
                <p className="text-sm text-gray-600">
                  Access to launch pricing
                </p>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Dog className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Join the Waitlist ✨
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-xl">
              Be among the first to experience Scoopify when we launch. Tell us
              about your business and help shape the future of pet waste
              management software.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Where are you in your business journey?
                </label>
                <select
                  required
                  value={formData.businessStage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessStage: e.target
                        .value as WaitlistData['businessStage'],
                    }))
                  }
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                >
                  <option value="planning">Planning to start</option>
                  <option value="new">Just getting started</option>
                  <option value="established">Already established</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  How many customers do you currently have?
                </label>
                <input
                  type="text"
                  placeholder="e.g., 0, 1-10, 50+"
                  value={formData.customerCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerCount: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which features interest you the most?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <label
                    key={feature}
                    className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                      formData.desiredFeatures.includes(feature)
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-white border-2 border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.desiredFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="sr-only"
                    />
                    {formData.desiredFeatures.includes(feature) && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary-600" />
                    )}
                    <span
                      className={`text-sm ${
                        formData.desiredFeatures.includes(feature)
                          ? 'text-primary-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Anything else you'd like us to know?
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                placeholder="Tell us about your specific needs or challenges..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Join Waitlist
                  <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default WaitlistPage;
