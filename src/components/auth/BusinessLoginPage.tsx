import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import BusinessNav from '../landing/sections/business/BusinessNav';

const BusinessLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const { signIn, resetPassword, getBusiness } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const loadBusinessData = async () => {
      if (businessId) {
        try {
          const business = await getBusiness(businessId);
          if (business) {
            setBusinessData(business);
            updateBrandColors(business.branding.colors);
          }
        } catch (error) {
          console.error('Error loading business:', error);
        }
      }
    };

    loadBusinessData();

    // Check for success message from account creation
    const state = location.state as { email?: string; message?: string } | null;
    if (state?.email) {
      setEmail(state.email);
    }
    if (state?.message) {
      setSuccess(state.message);
    }
  }, [businessId, getBusiness, location]);

  const updateBrandColors = (colors: { primary: string; secondary: string }) => {
    const root = document.documentElement;
    const primary = colors.primary;

    // Helper functions
    const hexToRGB = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const adjustColor = (hex: string, factor: number) => {
      const rgb = hexToRGB(hex);
      const adjusted = {
        r: Math.round(rgb.r + (255 - rgb.r) * factor),
        g: Math.round(rgb.g + (255 - rgb.g) * factor),
        b: Math.round(rgb.b + (255 - rgb.b) * factor),
      };
      return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
    };

    const darkenColor = (hex: string, factor: number) => {
      const rgb = hexToRGB(hex);
      const darkened = {
        r: Math.round(rgb.r * (1 - factor)),
        g: Math.round(rgb.g * (1 - factor)),
        b: Math.round(rgb.b * (1 - factor)),
      };
      return `rgb(${darkened.r}, ${darkened.g}, ${darkened.b})`;
    };

    root.style.setProperty('--color-primary-50', adjustColor(primary, 0.95));
    root.style.setProperty('--color-primary-100', adjustColor(primary, 0.9));
    root.style.setProperty('--color-primary-200', adjustColor(primary, 0.8));
    root.style.setProperty('--color-primary-300', adjustColor(primary, 0.6));
    root.style.setProperty('--color-primary-400', adjustColor(primary, 0.4));
    root.style.setProperty('--color-primary-500', primary);
    root.style.setProperty('--color-primary-600', darkenColor(primary, 0.1));
    root.style.setProperty('--color-primary-700', darkenColor(primary, 0.2));
    root.style.setProperty('--color-primary-800', darkenColor(primary, 0.3));
    root.style.setProperty('--color-primary-900', darkenColor(primary, 0.4));
    root.style.setProperty('--color-primary-950', darkenColor(primary, 0.5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const { role } = await signIn(email, password);
      
      // Route based on user role
      if (role === 'customer') {
        navigate(`/businesses/${businessId}/dashboard`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err?.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err?.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err?.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err?.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        console.error('Login error:', err);
        setError('An error occurred during sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      setIsResetting(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <BusinessNav business={businessData} />

      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back to {businessData.businessName}👋
            </h1>
            <p className="text-primary-100">
              Login below
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/95 backdrop-blur-sm py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-white/20">
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-xl flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-xl flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {resetSent && (
              <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-xl">
                <p className="text-sm">
                  Password reset instructions have been sent to your email address.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  {isResetting ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New customer?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/businesses/${businessId}/onboard`}
                  className="w-full flex justify-center py-3 px-4 border-2 border-primary-600 rounded-2xl shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Sign up now
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-primary-100">
              Questions? Contact us:
            </p>
            <div className="mt-2 space-y-1">
              <a 
                href={`tel:${businessData.phone}`}
                className="block text-white hover:text-primary-200 transition-colors"
              >
                {businessData.phone}
              </a>
              <a 
                href={`mailto:${businessData.email}`}
                className="block text-white hover:text-primary-200 transition-colors"
              >
                {businessData.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default BusinessLoginPage;