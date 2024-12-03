import React from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import EditableSection from './EditableSection';
import EditableContent from './EditableContent';
import { BusinessOnboardingData } from '../../../business-onboarding/types';
import { useAuth } from '../../../../contexts/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

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

const defaultContent = {
  heading: "About Us",
  subtext: "Your trusted partner in maintaining a clean and healthy yard",
  mission: "We understand the importance of maintaining a clean and healthy environment for your family and pets.",
  description: "Our dedicated team of professionals is committed to providing reliable, thorough, and hassle-free pet waste removal services. We take pride in keeping your yard clean and safe, using professional-grade equipment and environmentally friendly practices to ensure the highest quality service.",
  values: {
    value1: "Professional and reliable service",
    value2: "Eco-friendly practices",
    value3: "Trained and background-checked staff",
    value4: "100% satisfaction guarantee"
  }
};

interface AboutSectionProps {
  business: BusinessOnboardingData;
}

const AboutSection: React.FC<AboutSectionProps> = ({ business }) => {
  const [saving, setSaving] = React.useState(false);
  const { user } = useAuth();
  const canEdit = user?.uid === business.ownerId;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(() => {
    const savedImageIndex = heroImages.findIndex(img => img.url === business.branding?.aboutImage);
    return savedImageIndex >= 0 ? savedImageIndex : 0;
  });
  const [savingImage, setSavingImage] = React.useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleImageSelect = async () => {
    if (!user?.businessId || savingImage) return;
    
    try {
      setSavingImage(true);
      console.log('Saving about image:', heroImages[currentImageIndex].url);
      const businessRef = doc(db, 'businesses', user.businessId);
      await updateDoc(businessRef, {
        'branding.aboutImage': heroImages[currentImageIndex].url,
        updatedAt: new Date().toISOString(),
      });
      console.log('About image saved successfully');
    } catch (error) {
      console.error('Error updating about image:', error);
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <div id="about" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <EditableSection 
            business={business} 
            sectionId="about"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                  <EditableContent
                    business={business}
                    sectionId="about"
                    contentId="heading"
                    defaultContent={defaultContent.heading}
                  />
                </h2>
                <p className="text-xl text-gray-500 mb-8">
                  <EditableContent
                    business={business}
                    sectionId="about"
                    contentId="subtext"
                    defaultContent={defaultContent.subtext}
                  />
                </p>
                <div className="prose prose-lg text-gray-600 mb-8">
                  <p className="font-medium mb-4">
                    <EditableContent
                      business={business}
                      sectionId="about"
                      contentId="mission"
                      defaultContent={defaultContent.mission}
                    />
                  </p>
                  <p>
                    <EditableContent
                      business={business}
                      sectionId="about"
                      contentId="description"
                      defaultContent={defaultContent.description}
                    />
                  </p>
                </div>
                <ul className="space-y-4 mx-auto lg:mx-0 max-w-lg">
                  {Object.entries(defaultContent.values).map(([key, defaultValue]) => (
                    <li key={key} className="flex items-start justify-center lg:justify-start">
                      <CheckCircle className="h-6 w-6 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                      <EditableContent
                        business={business}
                        sectionId="about"
                        contentId={key}
                        defaultContent={defaultValue}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <img
                  src={heroImages[currentImageIndex].url}
                  alt="Clean backyard with happy dog"
                  className="rounded-2xl shadow-xl w-full h-[600px] object-cover"
                />
                {canEdit && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-2xl">
                    {/* Image Description */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl">
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
                      disabled={savingImage}
                      className="absolute top-4 left-4 px-4 py-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {savingImage ? 'Saving...' : 'Save Image'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </EditableSection>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;