import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/auth';

const CustomerHeader = () => {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Hi, {firstName}👋</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${firstName}&background=6366f1&color=fff`}
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;