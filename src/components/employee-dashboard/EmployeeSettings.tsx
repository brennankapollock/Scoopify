import React, { useState } from 'react';
import { User, Lock, Bell, MapPin, Calendar, Clock, Briefcase, Award, Star } from 'lucide-react';
import SettingSection from '../settings/SettingSection';
import { useAuth } from '../../contexts/auth';
import { format } from 'date-fns';

const EmployeeSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [timeOffRequest, setTimeOffRequest] = useState({
    startDate: '',
    endDate: '',
    type: 'vacation',
    reason: '',
  });
  const [coverageRequest, setCoverageRequest] = useState({
    date: '',
    shift: 'morning',
    reason: '',
  });
  const { user } = useAuth();
  const [employeeProfile, setEmployeeProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    position: 'Yard Technician',
    startDate: '2023-01-15',
    preferredAreas: ['North District', 'East District'],
    certifications: [
      { name: 'Equipment Safety', date: '2023-02-01' },
      { name: 'Customer Service', date: '2023-03-15' },
      { name: 'Route Optimization', date: '2023-04-01' }
    ],
    performanceScore: 95,
    totalStops: 1248,
    rating: 4.8,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-2">
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'timeoff', label: 'Time Off Requests', icon: Calendar },
              { id: 'coverage', label: 'Coverage Requests', icon: Clock },
              { id: 'performance', label: 'Performance', icon: Award },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'location', label: 'Location Services', icon: MapPin },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeSection === 'profile' && (
              <SettingSection
                title="Profile Settings"
                description="Update your personal information"
              >
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={32} className="text-primary-600" />
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      Change Photo
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={employeeProfile.name}
                      onChange={(e) => setEmployeeProfile({ ...employeeProfile, name: e.target.value })}
                      className="mt-1 block w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={employeeProfile.email}
                      onChange={(e) => setEmployeeProfile({ ...employeeProfile, email: e.target.value })}
                      className="mt-1 block w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={employeeProfile.phone}
                      onChange={(e) => setEmployeeProfile({ ...employeeProfile, phone: e.target.value })}
                      className="mt-1 block w-full"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      value={employeeProfile.position}
                      onChange={(e) => setEmployeeProfile({ ...employeeProfile, position: e.target.value })}
                      className="mt-1 block w-full"
                      placeholder="Your position"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Service Areas</label>
                    <select className="mt-1 block w-full">
                      <option>North District</option>
                      <option>South District</option>
                      <option>East District</option>
                      <option>West District</option>
                    </select>
                  </div>
                </div>
              </SettingSection>
            )}
            
            {activeSection === 'timeoff' && (
              <SettingSection
                title="Time Off Requests"
                description="Submit and manage your time off requests"
              >
                <div className="space-y-8">
                  {/* New Request Form */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">New Time Off Request</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            value={timeOffRequest.startDate}
                            onChange={(e) => setTimeOffRequest({ ...timeOffRequest, startDate: e.target.value })}
                            className="mt-1 block w-full"
                            min={format(new Date(), 'yyyy-MM-dd')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="date"
                            value={timeOffRequest.endDate}
                            onChange={(e) => setTimeOffRequest({ ...timeOffRequest, endDate: e.target.value })}
                            className="mt-1 block w-full"
                            min={timeOffRequest.startDate}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          value={timeOffRequest.type}
                          onChange={(e) => setTimeOffRequest({ ...timeOffRequest, type: e.target.value })}
                          className="mt-1 block w-full"
                        >
                          <option value="vacation">Vacation</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea
                          value={timeOffRequest.reason}
                          onChange={(e) => setTimeOffRequest({ ...timeOffRequest, reason: e.target.value })}
                          rows={3}
                          className="mt-1 block w-full"
                          placeholder="Briefly describe your reason for requesting time off..."
                        />
                      </div>
                      <button
                        type="button"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>

                  {/* Pending Requests */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Requests</h3>
                    <div className="space-y-4">
                      {/* Example pending request */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">Vacation</p>
                            <p className="text-sm text-gray-500">Mar 15 - Mar 20, 2024</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}

            {activeSection === 'coverage' && (
              <SettingSection
                title="Coverage Requests"
                description="Request coverage for your shifts"
              >
                <div className="space-y-8">
                  {/* New Coverage Request Form */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">New Coverage Request</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          value={coverageRequest.date}
                          onChange={(e) => setCoverageRequest({ ...coverageRequest, date: e.target.value })}
                          className="mt-1 block w-full"
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Shift</label>
                        <select
                          value={coverageRequest.shift}
                          onChange={(e) => setCoverageRequest({ ...coverageRequest, shift: e.target.value })}
                          className="mt-1 block w-full"
                        >
                          <option value="morning">Morning Route</option>
                          <option value="afternoon">Afternoon Route</option>
                          <option value="full">Full Day</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea
                          value={coverageRequest.reason}
                          onChange={(e) => setCoverageRequest({ ...coverageRequest, reason: e.target.value })}
                          rows={3}
                          className="mt-1 block w-full"
                          placeholder="Briefly describe why you need coverage..."
                        />
                      </div>
                      <button
                        type="button"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Request Coverage
                      </button>
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}

            {activeSection === 'performance' && (
              <SettingSection
                title="Performance & Achievements"
                description="View your performance metrics and achievements"
              >
                <div className="space-y-8">
                  {/* Performance Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-primary-600" size={20} />
                        <h3 className="font-medium text-gray-900">Performance Score</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary-600">{employeeProfile.performanceScore}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="text-primary-600" size={20} />
                        <h3 className="font-medium text-gray-900">Total Stops</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary-600">{employeeProfile.totalStops}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="text-primary-600" size={20} />
                        <h3 className="font-medium text-gray-900">Rating</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary-600">{employeeProfile.rating}★</p>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {employeeProfile.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Award className="text-primary-600" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">{cert.name}</p>
                            <p className="text-sm text-gray-500">Completed {cert.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}

            {activeSection === 'security' && (
              <SettingSection
                title="Security Settings"
                description="Manage your account security"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>
              </SettingSection>
            )}

            {activeSection === 'notifications' && (
              <SettingSection
                title="Notification Preferences"
                description="Choose how you want to receive notifications"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Route Notifications</label>
                    <div className="space-y-2">
                      {[
                        'Route assignments',
                        'Schedule changes',
                        'Customer updates',
                        'Emergency alerts',
                      ].map((item) => (
                        <label key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Notification Methods</label>
                    <div className="space-y-2">
                      {[
                        'Email notifications',
                        'SMS notifications',
                        'Push notifications',
                        'In-app notifications',
                      ].map((item) => (
                        <label key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}

            {activeSection === 'location' && (
              <SettingSection
                title="Location Services"
                description="Manage your location preferences"
              >
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable location tracking during work hours</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location Update Frequency</label>
                    <select className="mt-1 block w-full">
                      <option>Every stop</option>
                      <option>Every 15 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Every hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Navigation App</label>
                    <select className="mt-1 block w-full">
                      <option>Google Maps</option>
                      <option>Apple Maps</option>
                      <option>Waze</option>
                    </select>
                  </div>
                </div>
              </SettingSection>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettings;