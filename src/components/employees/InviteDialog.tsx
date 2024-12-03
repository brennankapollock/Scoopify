import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (invite: { email: string; firstName: string; position: string }) => void;
}

const InviteDialog: React.FC<InviteDialogProps> = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    position: 'Yard Technician',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Invite New Team Member
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Send an invitation to join your team
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Yard Technician">Yard Technician</option>
                <option value="Senior Technician">Senior Technician</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Route Manager">Route Manager</option>
                <option value="Operations Manager">Operations Manager</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                <Send size={16} className="mr-2" />
                Send Invite
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteDialog;