import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth';
import { CustomerProvider } from './contexts/CustomerContext';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import BusinessDirectory from './components/landing/BusinessDirectory';
import LoginPage from './components/auth/LoginPage';
import BusinessLoginPage from './components/auth/BusinessLoginPage';
import EmployeeDashboard from './components/employee-dashboard/EmployeeDashboard';
import SignUpPage from './components/auth/SignUpPage';
import WaitlistPage from './components/waitlist/WaitlistPage';
import Dashboard from './components/Dashboard';
import CustomerPage from './components/customers/CustomerPage';
import EmployeePage from './components/employees/EmployeePage';
import MessagesPage from './components/messages/MessagesPage';
import InventoryPage from './components/inventory/InventoryPage';
import SchedulePage from './components/schedule/SchedulePage';
import RoutesPage from './components/routes/RoutesPage';
import VehiclesPage from './components/vehicles/VehiclesPage';
import ReportsPage from './components/reports/ReportsPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import SettingsPage from './components/settings/SettingsPage';
import LandingPage from './components/landing/LandingPage';
import AppLandingPage from './components/landing/AppLandingPage';
import BusinessLandingPage from './components/landing/BusinessLandingPage';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import BusinessOnboardingFlow from './components/business-onboarding/BusinessOnboardingFlow';
import CustomerOnboardingFlow from './components/customer-onboarding/CustomerOnboardingFlow';
import EmployeeOnboarding from './components/employees/EmployeeOnboarding';
import CustomerDashboard from './components/customer-dashboard/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import PricingCalculator from './components/tools/pricing-calculator/PricingCalculator';
import PriceIncreaseGenerator from './components/tools/price-increase/PriceIncreaseGenerator';
import ServiceAgreementGenerator from './components/tools/service-agreement/ServiceAgreementGenerator';
import ToolsPage from './components/tools/ToolsPage';
import PricingPage from './components/pricing/PricingPage';
import EmployeeRouteView from './components/employee-dashboard/EmployeeRouteView';
import EmployeeScheduleView from './components/employee-dashboard/EmployeeScheduleView';
import EmployeeSettings from './components/employee-dashboard/EmployeeSettings';
import ActiveRouteView from './components/employee-dashboard/ActiveRouteView';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <CustomerProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<AppLandingPage />} />
              <Route path="/directory" element={<BusinessDirectory />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/businesses/:businessId/login" element={
                <AuthProvider>
                  <BusinessLoginPage />
                </AuthProvider>
              } />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/pricing-calculator" element={<PricingCalculator />} />
              <Route path="/tools/price-increase" element={<PriceIncreaseGenerator />} />
              <Route path="/tools/service-agreement" element={<ServiceAgreementGenerator />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/onboarding" element={<BusinessOnboardingFlow />} />

              {/* Business Landing Pages - Wrapped in AuthProvider */}
              <Route path="/businesses/:businessId" element={
                <AuthProvider>
                  <BusinessLandingPage />
                </AuthProvider>
              } />
              <Route path="/businesses/:businessId/onboard" element={
                <AuthProvider>
                  <CustomerOnboardingFlow />
                </AuthProvider>
              } />
              <Route path="/businesses/:businessId/privacy" element={
                <AuthProvider>
                  <PrivacyPolicy/>
                </AuthProvider>
              } />
              <Route path="/businesses/:businessId/terms" element={
                <AuthProvider>
                  <TermsOfService/>
                </AuthProvider>
              } />
              <Route path="/businesses/:businessId/employees/onboard" element={
                <AuthProvider>
                  <EmployeeOnboarding />
                </AuthProvider>
              } />
              <Route path="/employee/dashboard" element={
                <PrivateRoute>
                  <DashboardLayout>
                    <EmployeeDashboard />
                  </DashboardLayout>
                </PrivateRoute>
              } />
              <Route
                path="/employee/schedule"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <EmployeeScheduleView
                        date={new Date()}
                        appointments={[]}
                        onAppointmentClick={() => {}}
                      />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/routes"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <EmployeeRouteView />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/routes/:routeId"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ActiveRouteView />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/settings"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <EmployeeSettings />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route path="/businesses/:businessId/dashboard" element={
                <AuthProvider>
                  <CustomerDashboard />
                </AuthProvider>
              } />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={['business_owner', 'admin']}>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <PrivateRoute allowedRoles={['business_owner', 'admin']}>
                    <DashboardLayout>
                      <CustomerPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <PrivateRoute allowedRoles={['business_owner', 'admin']}>
                    <DashboardLayout>
                      <EmployeePage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <MessagesPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <InventoryPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <SchedulePage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/routes"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <RoutesPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/vehicles"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <VehiclesPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ReportsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <AnalyticsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </CustomerProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
};

export default App;