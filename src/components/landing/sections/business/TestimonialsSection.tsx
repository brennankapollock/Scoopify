import React from 'react';
import { Star, Pencil, Plus, X, Check, Dog } from 'lucide-react';
import { BusinessOnboardingData } from '../../../../types/business';
import EditableSection from './EditableSection';
import EditableContent from './EditableContent';
import { useAuth } from '../../../../contexts/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface TestimonialsSectionProps {
  business: BusinessOnboardingData;
}

const defaultContent = {
  heading: "Customer Testimonials",
  subtext: "See what our customers have to say",
};

interface Testimonial {
  name: string;
  image: string;
  quote: string;
  isEditing?: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ business }) => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(
    (business.testimonials || []).map(t => ({ ...t, isEditing: false }))
  );
  const [showTestimonials, setShowTestimonials] = React.useState(business.showTestimonials !== false);
  const [saving, setSaving] = React.useState(false);
  const canEdit = user?.uid === business.ownerId;

  const saveTestimonials = async (updatedTestimonials: Testimonial[]) => {
    if (!user?.businessId || saving) return;
     
    try {
      setSaving(true);
      // Create a clean version without isEditing for storage
      const cleanedTestimonials = updatedTestimonials.map(({ isEditing, ...rest }) => rest);
      
      const businessRef = doc(db, 'businesses', user.businessId);
      await updateDoc(businessRef, {
        testimonials: cleanedTestimonials,
        updatedAt: new Date().toISOString(),
      });
      
      // Update local state with all cards in non-editing mode
      setTestimonials(prev => prev.map(t => ({ ...t, isEditing: false })));
    } catch (error) {
      console.error('Error saving testimonials:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        name: 'New Customer',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        quote: 'Enter testimonial text...',
        isEditing: true
      }
    ]);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(newTestimonials);
    saveTestimonials(newTestimonials);
  };

  const toggleEditing = async (index: number) => {
    const testimonial = testimonials[index];
    if (testimonial.isEditing) {
      // Create a copy of testimonials with this card's editing state set to false
      const updatedTestimonials = testimonials.map((t, i) => 
        i === index ? { ...t, isEditing: false } : t
      );
      
      // Save changes and update editing state
      await saveTestimonials(updatedTestimonials);
    } else {
      // Just toggle editing mode on without saving
      setTestimonials(prev => prev.map((t, i) => 
        i === index ? { ...t, isEditing: true } : t
      ));
    }
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    setTestimonials(testimonials.map((t, i) => 
      i === index ? { ...t, [field]: value } : t
    ));
  };

  const toggleSection = async () => {
    if (!user?.businessId) return;
    
    try {
      setSaving(true);
      const businessRef = doc(db, 'businesses', user.businessId);
      const newValue = !showTestimonials;
      await updateDoc(businessRef, { 
        showTestimonials: newValue,
        updatedAt: new Date().toISOString(),
      });
      setShowTestimonials(newValue);
    } catch (error) {
      console.error('Error toggling section:', error);
    } finally {
      setSaving(false);
    }
  };

  // Hide section if explicitly set to false and user can't edit
  if (!showTestimonials && !canEdit) {
    return null;
  }

  return (
    <div id="testimonials" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Toggle Switch */}
        {canEdit && business && (
          <div className="flex justify-center mb-12">
            <button
              onClick={toggleSection}
              disabled={saving}
              className="inline-flex items-center"
            >
              <div className={`flex items-center w-14 h-7 p-1 rounded-full transition-colors duration-300 ${
                showTestimonials ? 'bg-primary-600' : 'bg-gray-200'
              }`}>
                <div className={`flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                  showTestimonials ? 'translate-x-7' : 'translate-x-0'
                }`}>
                  <Star 
                    size={12} 
                    className={`transition-colors duration-300 ${
                      showTestimonials ? 'text-primary-600' : 'text-gray-400'
                    }`}
                    fill={showTestimonials ? 'currentColor' : 'none'}
                  />
                </div>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Testimonials
              </span>
            </button>
          </div>
        )}

        {showTestimonials && (
          <>
            <EditableSection business={business} sectionId="testimonials">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  <EditableContent
                    business={business}
                    sectionId="testimonials"
                    contentId="heading"
                    defaultContent={defaultContent.heading}
                  />
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  <EditableContent
                    business={business}
                    sectionId="testimonials"
                    contentId="subtext"
                    defaultContent={defaultContent.subtext}
                  />
                </p>
              </div>
            </EditableSection>
            <div className="mt-16 grid grid-cols-1 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden relative">
              {canEdit && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => toggleEditing(index)}
                    className="p-1 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200"
                  >
                    {testimonial.isEditing ? <Check size={16} /> : <Pencil size={16} />}
                  </button>
                  <button
                    onClick={() => removeTestimonial(index)}
                    className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="p-6 w-full">
                <div className="flex items-start">
                  <Dog className="h-12 w-12 text-primary-600" />
                  <div className="ml-4 flex flex-col items-start">
                    {testimonial.isEditing ? (
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        className="w-full text-sm rounded-md border-gray-300"
                        placeholder="Customer Name"
                      />
                    ) : (
                      <div className="text-base font-medium text-gray-900 leading-tight">{testimonial.name}</div>
                    )}
                    <span className="text-sm text-gray-500">Dog Parent</span>
                  </div>
                </div>
                {testimonial.isEditing ? (
                  <div className="text-left">
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                      className="w-full mt-4 text-sm rounded-md border-gray-300 min-h-[100px] resize-y"
                      rows={3}
                      placeholder="Enter testimonial..."
                    />
                  </div>
                ) : (
                  <div className="mt-4 text-left">
                    <p className="text-gray-600 whitespace-pre-wrap">{testimonial.quote}</p>
                  </div>
                )}
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
          {canEdit && (
            <button
              onClick={addTestimonial}
              className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <Plus size={24} className="text-gray-400" />
              <span className="mt-2 text-sm font-medium text-gray-900">Add Testimonial</span>
            </button>
          )}
        </div>
        
        {canEdit && (
          <div className="mt-8 flex justify-center gap-4" />
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;