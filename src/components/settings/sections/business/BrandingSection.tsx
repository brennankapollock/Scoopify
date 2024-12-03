import React, { useRef, useState } from 'react';
import { BusinessOnboardingData } from '../../../../types/business';
import { Upload, X } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../../lib/firebase';
import { useAuth } from '../../../../contexts/auth';

interface BrandingSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const BrandingSection: React.FC<BrandingSectionProps> = ({ data, onChange }) => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!user?.businessId) {
      setError('User not authenticated');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo file size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setError(null);
      setUploadProgress(0);

      // Delete old logo if it exists
      if (data.branding.logoUrl) {
        try {
          const oldLogoRef = ref(storage, data.branding.logoUrl);
          await deleteObject(oldLogoRef);
        } catch (err) {
          console.error('Error deleting old logo:', err);
        }
      }

      // Create a reference to the new logo file
      const logoRef = ref(storage, `businesses/${user.businessId}/logo-${Date.now()}`);

      // Create upload task
      const uploadTask = uploadBytesResumable(logoRef, file);

      // Listen for state changes
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload logo. Please try again.');
          setUploadProgress(null);
        },
        async () => {
          try {
            // Get the download URL
            const downloadURL = await getDownloadURL(logoRef);
            
            // Update the business data with the logo URL
            onChange({
              ...data,
              branding: {
                ...data.branding,
                logoUrl: downloadURL,
              }
            });

            // Clear progress after a short delay
            setTimeout(() => setUploadProgress(null), 1000);
          } catch (err) {
            console.error('Error getting download URL:', err);
            setError('Failed to get logo URL. Please try again.');
            setUploadProgress(null);
          }
        }
      );
    } catch (err) {
      console.error('Error handling file:', err);
      setError('Failed to process logo. Please try again.');
      setUploadProgress(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeLogo = async () => {
    if (!user?.businessId || !data.branding.logoUrl) return;

    try {
      setError(null);
      const logoRef = ref(storage, data.branding.logoUrl);
      await deleteObject(logoRef);

      onChange({
        ...data,
        branding: {
          ...data.branding,
          logoUrl: undefined,
        }
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error removing logo:', err);
      setError('Failed to remove logo. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo
        </label>
        <div
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          } border-dashed rounded-lg relative`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {data.branding.logoUrl ? (
            <div className="space-y-1 text-center">
              <img
                src={data.branding.logoUrl}
                alt="Logo preview"
                className="mx-auto h-32 w-auto object-contain mb-4"
              />
              <div className="flex text-sm text-gray-600">
                <button
                  type="button"
                  onClick={removeLogo}
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  Remove logo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="logo-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload a logo</span>
                  <input
                    id="logo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Brand Colors */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Brand Colors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Color</label>
            <div className="flex gap-3 mt-1">
              <input
                type="color"
                value={data.branding.colors.primary}
                onChange={(e) => onChange({
                  ...data,
                  branding: {
                    ...data.branding,
                    colors: {
                      ...data.branding.colors,
                      primary: e.target.value
                    }
                  }
                })}
                className="h-10 w-20 rounded border border-gray-300"
              />
              <input
                type="text"
                value={data.branding.colors.primary}
                onChange={(e) => onChange({
                  ...data,
                  branding: {
                    ...data.branding,
                    colors: {
                      ...data.branding.colors,
                      primary: e.target.value
                    }
                  }
                })}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
            <div className="flex gap-3 mt-1">
              <input
                type="color"
                value={data.branding.colors.secondary}
                onChange={(e) => onChange({
                  ...data,
                  branding: {
                    ...data.branding,
                    colors: {
                      ...data.branding.colors,
                      secondary: e.target.value
                    }
                  }
                })}
                className="h-10 w-20 rounded border border-gray-300"
              />
              <input
                type="text"
                value={data.branding.colors.secondary}
                onChange={(e) => onChange({
                  ...data,
                  branding: {
                    ...data.branding,
                    colors: {
                      ...data.branding.colors,
                      secondary: e.target.value
                    }
                  }
                })}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Terms of Service
        </label>
        <textarea
          value={data.branding.companyTerms}
          onChange={(e) => onChange({
            ...data,
            branding: {
              ...data.branding,
              companyTerms: e.target.value
            }
          })}
          rows={8}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter your company's terms of service..."
        />
      </div>

      {/* Privacy Policy Agreement */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.branding.privacyPolicy}
            onChange={(e) => onChange({
              ...data,
              branding: {
                ...data.branding,
                privacyPolicy: e.target.checked
              }
            })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            I agree to collect and handle customer data in accordance with privacy laws
          </span>
        </label>
      </div>
    </div>
  );
};

export default BrandingSection;