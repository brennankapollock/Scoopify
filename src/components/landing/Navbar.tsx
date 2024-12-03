import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Calculator, FileText, FileSignature } from 'lucide-react';

const tools = [
  {
    name: 'Pricing Calculator',
    description: 'Calculate optimal pricing for your services',
    icon: Calculator,
    path: '/tools/pricing-calculator'
  },
  {
    name: 'Price Increase Letter',
    description: 'Generate professional price increase letters',
    icon: FileText,
    path: '/tools/price-increase'
  },
  {
    name: 'Service Agreement',
    description: 'Create customized service agreements',
    icon: FileSignature,
    path: '/tools/service-agreement'
  }
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const toolsButtonRef = React.useRef<HTMLButtonElement>(null);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="https://i.ibb.co/rwKqG9f/scoopify-purple-logo.png"
                alt="Scoopify"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Pricing
              </Link>
              <div className="relative">
                <button
                  ref={toolsButtonRef}
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="flex items-center text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Free Tools
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Desktop Tools Popover */}
                {isToolsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsToolsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="p-4 grid gap-4">
                        {tools.map((tool) => (
                          <Link
                            key={tool.path}
                            to={tool.path}
                            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setIsToolsOpen(false)}
                          >
                            <tool.icon className="h-5 w-5 text-primary-600 mt-0.5" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                              <p className="text-xs text-gray-500">{tool.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Login Button */}
              <Link
                to="/waitlist"
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Join Waitlist
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-300 z-40 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <img
                src="https://i.ibb.co/QJz29JF/scoopify-purple-icon.png"
                alt="Scoopify"
                className="h-8 w-auto"
              />
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              
              {/* Mobile Tools Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="flex items-center w-full py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Free Tools
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform duration-200 ${isMobileToolsOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-200 ${
                  isMobileToolsOpen ? 'max-h-96' : 'max-h-0'
                }`}>
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="flex items-center pl-4 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <tool.icon className="h-4 w-4 mr-2" />
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="space-y-3">
              <Link
                to="/waitlist"
                className="block px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 transition-colors font-medium rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;