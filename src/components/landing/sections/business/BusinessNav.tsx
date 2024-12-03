import React, { useState } from 'react';
import { Menu, X, Dog } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BusinessOnboardingData } from '../../../../types/business';
import { useAuth } from '../../../../contexts/auth';

interface BusinessNavProps {
  business: BusinessOnboardingData;
}

const BusinessNav: React.FC<BusinessNavProps> = ({ business }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const canEdit = user?.uid === business.ownerId;
  const showTestimonials = business.showTestimonials !== false || canEdit;

  const LogoSection = () => (
    <>
      {business.branding.logo ? (
        <img 
          src={URL.createObjectURL(business.branding.logo)} 
          alt={business.businessName} 
          className="h-8 w-auto"
        />
      ) : (
        <div className="flex items-center gap-2">
          <Dog className="text-primary-600" />
          <span className="text-xl font-bold text-gray-900">{business.businessName}</span>
        </div>
      )}
    </>
  );

  // Add/remove body scroll lock when mobile menu is open/closed
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    const header = document.querySelector('nav');
    
    if (section && header) {
      const headerHeight = header.getBoundingClientRect().height;
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: sectionTop - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={`/businesses/${business.ownerId}`} className="flex items-center">
              <LogoSection />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="#services"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  scrollToSection('services');
                }}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                to="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                About
              </Link>
              {showTestimonials && (
                <Link
                  to="#testimonials"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('testimonials');
                  }}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Testimonials
                </Link>
              )}
              <Link
                to="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Login & Book Now Buttons */}
              <Link
                to={`/businesses/${business.ownerId}/login`}
                className="hidden md:inline-flex items-center px-4 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to={`/businesses/${business.ownerId}/onboard`}
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Book Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              {business.branding.logo ? (
                <img 
                  src={URL.createObjectURL(business.branding.logo)} 
                  alt={business.businessName}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Dog className="text-primary-600" />
                  <span className="text-lg font-bold text-gray-900">{business.businessName}</span>
                </div>
              )}
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  scrollToSection('services');
                }}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  scrollToSection('about');
                }}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                About
              </Link>
              {showTestimonials && (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setTimeout(() => scrollToSection('testimonials'), 100);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Testimonials
                </Link>
              )}
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => scrollToSection('contact'), 100);
                }}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="space-y-3">
              <Link
                to={`/businesses/${business.ownerId}/login`}
                className="block px-4 py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors font-medium rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to={`/businesses/${business.ownerId}/onboard`}
                className="block px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 transition-colors font-medium rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessNav;