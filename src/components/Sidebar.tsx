import {
  Calendar,
  Car,
  Home,
  Map,
  Menu,
  Package,
  Settings,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isEmployee?: boolean;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  id:
    | 'dashboard'
    | 'customers'
    | 'employees'
    | 'messages'
    | 'inventory'
    | 'schedule'
    | 'routes'
    | 'vehicles'
    | 'reports'
    | 'analytics'
    | 'settings';
}

const allNavItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard', id: 'dashboard' },
  { icon: Users, label: 'Customers', path: '/customers', id: 'customers' },
  { icon: UserCircle, label: 'Employees', path: '/employees', id: 'employees' },
  { icon: Package, label: 'Inventory', path: '/inventory', id: 'inventory' },
  { icon: Calendar, label: 'Schedule', path: '/schedule', id: 'schedule' },
  { icon: Map, label: 'Routes', path: '/routes', id: 'routes' },
  { icon: Car, label: 'Vehicles', path: '/vehicles', id: 'vehicles' },

  { icon: Settings, label: 'Settings', path: '/settings', id: 'settings' },
];

const employeeNavItems: NavItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/employee/dashboard',
    id: 'dashboard',
  },
  {
    icon: Calendar,
    label: 'Schedule',
    path: '/employee/schedule',
    id: 'schedule',
  },
  { icon: Map, label: 'Routes', path: '/employee/routes', id: 'routes' },
  {
    icon: Settings,
    label: 'Settings',
    path: '/employee/settings',
    id: 'settings',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isEmployee }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployeePath = location.pathname.startsWith('/employee');
  const navItems =
    isEmployee || isEmployeePath ? employeeNavItems : allNavItems;
  let expandTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    expandTimeout = setTimeout(() => {
      setIsExpanded(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(expandTimeout);
    setIsExpanded(false);
  };

  const handleNavClick = (item: NavItem) => {
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    const item = navItems.find((item) => item.path === path);
    return item?.id || 'dashboard';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary-600 text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-primary-500/50">
            <div className="flex justify-between items-center">
              <img
                src="https://i.ibb.co/wK1LRfB/scoopify-white-logo.png"
                alt="Scoopify"
                className="h-8 w-auto"
              />
              <button
                className="p-2 rounded-md text-white/80 hover:text-white hover:bg-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center py-3 px-4 text-white transition-all duration-300
                  ${
                    getCurrentPage() === item.id
                      ? 'bg-primary-700'
                      : 'hover:bg-primary-500'
                  }`}
              >
                <item.icon size={24} />
                <span className="ml-4 whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen bg-primary-600 text-white z-50 transition-all duration-300 ease-in-out overflow-y-auto
          hidden lg:block
          ${isExpanded ? 'w-60' : 'w-20'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="mt-4 flex flex-col h-[calc(100vh-5rem)]">
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center justify-center mb-6 px-4">
            <div className="relative h-8 w-full flex items-center justify-center">
              <img
                src="https://i.ibb.co/4NCXpch/scoopify-icon-white.png"
                alt="Logo"
                className={`absolute h-8 w-auto transition-opacity duration-300 ${
                  isExpanded ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img
                src="https://i.ibb.co/wK1LRfB/scoopify-white-logo.png"
                alt="Logo"
                className={`relative h-8 w-auto transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: 'translateX(-30px)' }}
              />
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center py-3 px-7 text-white transition-colors duration-300
                ${
                  getCurrentPage() === item.id
                    ? 'bg-primary-700'
                    : 'hover:bg-primary-500'
                }`}
            >
              <div className="w-6 flex justify-center">
                <item.icon
                  size={24}
                  className={`transition-transform duration-300 hover:scale-110
                    ${
                      getCurrentPage() === item.id
                        ? 'text-white'
                        : 'text-white/80'
                    }`}
                />
              </div>
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${
                  !isExpanded ? 'opacity-0' : 'opacity-100'
                } ${!isExpanded && 'hidden'}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
