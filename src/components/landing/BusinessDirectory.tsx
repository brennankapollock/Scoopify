import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BusinessOnboardingData } from '../../types/business';
import Navbar from './Navbar';

const BusinessDirectory = () => {
  const [businesses, setBusinesses] = useState<BusinessOnboardingData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const businessesRef = collection(db, 'businesses');
        const businessesSnapshot = await getDocs(query(businessesRef));
        const loadedBusinesses = businessesSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as BusinessOnboardingData[];
        setBusinesses(loadedBusinesses);
      } catch (err) {
        console.error('Error loading businesses:', err);
        setError('Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  // Get unique cities from all businesses
  const cities = Array.from(new Set(
    businesses.flatMap(business => business.serviceArea.cities)
  )).sort();

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.serviceArea.cities.some(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      business.serviceArea.zipCodes.some(zip => 
        zip.includes(searchQuery)
      );

    const matchesCity = !selectedCity || business.serviceArea.cities.includes(selectedCity);

    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
            Find Professional Pooper Scoopers Near Me
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Connect with trusted pet waste removal services in your area. Our verified professionals keep your yard clean and healthy.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by business name, city, or ZIP code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Business Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No businesses found matching your criteria
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {business.businessName}
                    </h2>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span>Serving: {business.serviceArea.cities.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="flex-shrink-0" />
                        <a href={`tel:${business.phone}`} className="hover:text-primary-600">
                          {business.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="flex-shrink-0" />
                        <a href={`mailto:${business.email}`} className="hover:text-primary-600">
                          {business.email}
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {business.serviceArea.zipCodes.map((zip) => (
                        <span
                          key={zip}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {zip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link
                      to={`/businesses/${business.id}`}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      View Business
                      <ChevronRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDirectory;