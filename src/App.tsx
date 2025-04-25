import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthLayout from './layouts/AuthLayout';
import BusinessLayout from './layouts/BusinessLayout';
import TruckerLayout from './layouts/TruckerLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Business pages
const BusinessDashboard = lazy(() => import('./pages/business/Dashboard'));
const CreateShipment = lazy(() => import('./pages/business/CreateShipment'));
const ShipmentHistory = lazy(() => import('./pages/business/ShipmentHistory'));
const ShipmentDetails = lazy(() => import('./pages/business/ShipmentDetails'));
const Invoices = lazy(() => import('./pages/business/Invoices'));
const InvoiceDetails = lazy(() => import('./pages/business/InvoiceDetails'));

// Trucker pages
const TruckerDashboard = lazy(() => import('./pages/trucker/Dashboard'));
const AvailableJobs = lazy(() => import('./pages/trucker/AvailableJobs'));
const JobDetails = lazy(() => import('./pages/trucker/JobDetails'));
const EarningsPage = lazy(() => import('./pages/trucker/EarningsPage'));
const TruckerProfile = lazy(() => import('./pages/trucker/TruckerProfile'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            
            {/* Business routes */}
            <Route 
              path="/business" 
              element={
                <ProtectedRoute userType="business">
                  <BusinessLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<BusinessDashboard />} />
              <Route path="shipments/create" element={<CreateShipment />} />
              <Route path="shipments" element={<ShipmentHistory />} />
              <Route path="shipments/:id" element={<ShipmentDetails />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
            </Route>
            
            {/* Trucker routes */}
            <Route 
              path="/trucker" 
              element={
                <ProtectedRoute userType="trucker">
                  <TruckerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TruckerDashboard />} />
              <Route path="jobs" element={<AvailableJobs />} />
              <Route path="jobs/:id" element={<JobDetails />} />
              <Route path="earnings" element={<EarningsPage />} />
              <Route path="profile" element={<TruckerProfile />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;