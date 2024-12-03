import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Employee } from '../types';

interface DocumentsStepProps {
  onNext: (data: Partial<Employee>) => void;
  onBack: () => void;
  data: Employee;
}

const documents = [
  { id: 'w4', label: 'W-4 Form', description: "Employee's Withholding Certificate" },
  { id: 'i9', label: 'I-9 Form', description: 'Employment Eligibility Verification' },
  { id: 'driversLicense', label: "Driver's License", description: 'Valid state-issued driver\'s license' },
  { id: 'directDeposit', label: 'Direct Deposit Form', description: 'Banking information for payroll' },
];

const DocumentsStep: React.FC<DocumentsStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    documents: data.documents || {
      w4: false,
      i9: false,
      driversLicense: false,
      directDeposit: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const toggleDocument = (docId: keyof typeof formData.documents) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: !prev.documents[docId],
      },
    }));
  };

  return (
    <div>
      <FileText size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Required Documents
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Please acknowledge the following required documents
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`border-2 rounded-lg transition-all ${
                formData.documents[doc.id as keyof typeof formData.documents]
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.documents[doc.id as keyof typeof formData.documents]}
                  onChange={() => toggleDocument(doc.id as keyof typeof formData.documents)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  formData.documents[doc.id as keyof typeof formData.documents]
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {formData.documents[doc.id as keyof typeof formData.documents] && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900">{doc.label}</div>
                  <div className="text-sm text-gray-500">{doc.description}</div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            By checking these boxes, you acknowledge that you will need to provide these documents before your first day of work.
            Our HR team will contact you with instructions on how to submit them securely.
          </p>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentsStep;