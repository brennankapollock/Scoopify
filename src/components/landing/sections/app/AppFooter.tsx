import React from 'react';
import { Link } from 'react-router-dom';
import { Dog } from 'lucide-react';

const AppFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Dog className="text-primary-500" />
              <span className="text-xl font-bold">Scoopify</span>
            </div>
            <p className="text-gray-400">
              The all-in-one platform for pet waste removal businesses.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/integrations">Integrations</Link></li>
              <li><Link to="/updates">Updates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/guides">Guides</Link></li>
              <li><Link to="/api">API Reference</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Scoopify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;