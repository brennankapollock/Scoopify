import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../../../contexts/auth';
import EditableSection from './EditableSection';
import EditableContent from './EditableContent';
import { BusinessOnboardingData } from '../../../business-onboarding/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface HeroSectionProps {
  business: BusinessOnboardingData;
}

const defaultContent = {
  heading: "Never Scoop Dog Poop Again✨",
  subtext: "Keep your yard clean and healthy with our reliable, professional pet waste removal service. We handle the mess so you don't have to!",
};

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    description: "Happy dog in clean yard"
  },
  {
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2324&q=80",
    description: "Golden retriever in grass"
  },
  {
    url: "https://images.unsplash.com/photo-1594739393338-9e1c2b786154?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    description: "Dog playing in backyard"
  },
  {
    url: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    description: "Clean garden with dog"
  },
  {
    url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    description: "Professional yard care"
  }
];

const HeroSection: React.FC<HeroSectionProps> = ({ business }) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(() => {
    const savedImageIndex = heroImages.findIndex(img => img.url === business.branding?.heroImage);
    return savedImageIndex >= 0 ? savedImageIndex : 0;
  });
  const [saving, setSaving] = React.useState(false);
  const canEdit = user?.uid === business.ownerId;

  const handleImageSelect = async () => {
    if (!user?.businessId || saving) return;
    
    try {
      setSaving(true);
      const businessRef = doc(db, 'businesses', user.businessId);
      await updateDoc(businessRef, {
        'branding.heroImage': heroImages[currentImageIndex].url,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating hero image:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <main className="mt-16 sm:mt-20 mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto">
              <EditableSection business={business} sectionId="hero">
                <span className="block text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <EditableContent
                    business={business}
                    sectionId="hero"
                    contentId="heading"
                    defaultContent={defaultContent.heading}
                  />
                </span>
                <span className="block mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  <EditableContent
                    business={business}
                    sectionId="hero"
                    contentId="subtext"
                    defaultContent={defaultContent.subtext}
                  />
                </span>
              </EditableSection>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row justify-center lg:flex-row justify-center gap-3">
                <Link
                  to={`/businesses/${business.ownerId}/onboard`}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                >
                  Book Now
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
                <a
                  href="#services"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </a>
              </div>
            </div>
          </main>
          <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9]">
              <div className="relative h-full">
                <img
                  className="h-full w-full object-cover rounded-2xl shadow-xl"
                  src={heroImages[currentImageIndex].url}
                  alt={heroImages[currentImageIndex].description}
                />
                {canEdit && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    {/* Image Description */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-center p-4">
                        {heroImages[currentImageIndex].description}
                      </p>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight size={24} className="text-gray-600" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {heroImages.length}
                    </div>
                    
                    {/* Save Button */}
                    <button
                      onClick={handleImageSelect}
                      disabled={saving}
                      className="absolute top-4 left-4 px-4 py-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Image'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;