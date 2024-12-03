import React, { useState, useEffect } from 'react';
import { Check, X, Pencil } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useAuth } from '../../../../contexts/auth';
import { BusinessOnboardingData } from '../../../business-onboarding/types';

interface EditableContentProps {
  business: BusinessOnboardingData;
  sectionId: string;
  contentId: string;
  defaultContent: string;
}

const EditableContent: React.FC<EditableContentProps> = ({
  business,
  sectionId,
  contentId,
  defaultContent,
}) => {
  const [content, setContent] = useState(defaultContent);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Only allow editing if user is logged in and owns this business
  const canEdit = user?.uid === business.ownerId;

  useEffect(() => {
    const loadCustomContent = async () => {
      try {
        const contentRef = doc(db, 'businesses', business.ownerId, 'landing_content', `${sectionId}_${contentId}`);
        const contentDoc = await getDoc(contentRef);
        
        if (contentDoc.exists() && contentDoc.data().custom) {
          setContent(contentDoc.data().custom);
        }
      } catch (err) {
        console.error('Error loading custom content:', err);
      }
    };

    loadCustomContent();
  }, [business.ownerId, sectionId, contentId]);

  const handleSave = async () => {
    if (!business.ownerId) return;
    
    setLoading(true);
    setError(null);

    try {
      const contentRef = doc(db, 'businesses', business.ownerId, 'landing_content', `${sectionId}_${contentId}`);
      await setDoc(contentRef, {
        default: defaultContent,
        custom: content,
        lastModified: new Date().toISOString(),
      }, { merge: true });

      setIsEditable(false);
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setContent(defaultContent);
    setIsEditable(false);
  };

  if (!canEdit) {
    return content;
  }

  return (
    <span className="relative inline-flex items-center gap-2 group">
      {!isEditable ? (
        <span className="inline-flex items-center gap-2">
          <span>{content}</span>
          {canEdit && (
            <button
              onClick={() => setIsEditable(true)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-primary-600 bg-white rounded-full shadow-sm"
            >
              <Pencil size={14} />
            </button>
          )}
        </span>
      ) : (
        <span className="inline-block w-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] p-3 border border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-y bg-white text-gray-900"
          />
          
          {error && (
            <span className="block text-sm text-red-600">{error}</span>
          )}
          
          <span className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X size={14} className="mr-1.5" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              <Check size={14} className="mr-1.5" />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </span>
        </span>
      )}
    </span>
  );
};

export default EditableContent;