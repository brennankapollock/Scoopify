import React, { useState } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { Message } from './messages/types';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Customer Sign Up',
    description: 'Sarah Johnson has signed up for Weekly Cleanup service',
    time: '5 minutes ago',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Training Completed',
    description: 'David Brown completed Equipment Safety certification',
    time: '1 hour ago',
    type: 'success',
    read: false,
  },
  {
    id: '3',
    title: 'Route Optimization Alert',
    description: 'High demand detected in North District - 5 new sign-ups',
    time: '2 hours ago',
    type: 'warning',
    read: true,
  },
  {
    id: '4',
    title: 'Employee Milestone',
    description: 'Lisa Anderson completed 300 yards this month',
    time: '3 hours ago',
    type: 'info',
    read: true,
  },
];

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed sm:absolute right-0 sm:right-0 mt-2 w-screen sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-[80vh] overflow-y-auto sm:mx-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      notification.read ? 'bg-white' : 'bg-primary-50'
                    } hover:bg-gray-50`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900">
                        {notification.title}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 break-words">
                      {notification.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface HeaderProps {
  showFullNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showFullNav = true }) => {
  const { logOut, getBusiness, user } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const isEmployee = user?.role === 'employee';

  React.useEffect(() => {
    const loadBusinessName = async () => {
      if (user?.businessId) {
        const business = await getBusiness(user.businessId);
        if (business) {
          setBusinessName(business.businessName);
        }
      }
    };
    loadBusinessName();
  }, [user, getBusiness]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div className={`flex items-center ${showFullNav ? 'lg:ml-20' : ''} transition-all duration-300`}>
            <div className="max-w-[200px] sm:max-w-[300px] overflow-hidden">
              <h1 className="text-base sm:text-xl font-bold text-primary-600 leading-tight line-clamp-2">
                {businessName || 'Scoopify'}
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {!isEmployee && <NotificationBell />}
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.NotificationBell = NotificationBell;

export default Header;