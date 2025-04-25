import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, User, Briefcase, CheckCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user type from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const defaultUserType = queryParams.get('type') === 'trucker' ? 'trucker' : 'business';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'business' | 'trucker'>(defaultUserType as 'business' | 'trucker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const success = await register(name, email, password, userType);
      
      if (!success) {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create Your Account</h1>
          <p className="text-neutral-600">Join the Instruck platform</p>
        </div>
        
        {/* User Type Selector */}
        <div className="flex mb-6 border border-neutral-200 rounded-lg p-1">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md flex justify-center items-center text-sm font-medium transition-colors ${
              userType === 'business'
                ? 'bg-primary-600 text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            onClick={() => setUserType('business')}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Business
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md flex justify-center items-center text-sm font-medium transition-colors ${
              userType === 'trucker'
                ? 'bg-primary-600 text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            onClick={() => setUserType('trucker')}
          >
            <Truck className="w-4 h-4 mr-2" />
            Trucker
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              {userType === 'business' ? 'Business Name' : 'Full Name'}
            </label>
            <input
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={userType === 'business' ? 'Your Business Name' : 'Your Full Name'}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="ml-2 text-sm text-neutral-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full btn-primary py-3"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-neutral-600">Already have an account?</span>{' '}
          <Link 
            to={`/login${userType === 'trucker' ? '?type=trucker' : ''}`} 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {userType === 'business' ? 'Benefits for Businesses' : 'Benefits for Truckers'}
        </h3>
        
        <ul className="space-y-3">
          {userType === 'business' ? (
            <>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Transparent pricing with no hidden fees</span>
              </li>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Digital, RRA-compliant receipts for all shipments</span>
              </li>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Convenient monthly invoicing</span>
              </li>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Verified and reliable truckers</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Access to consistent shipment opportunities</span>
              </li>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Instant payment confirmations</span>
              </li>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Route optimization to reduce empty trips</span>
              </li>
              <li className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                <span className="text-sm text-neutral-700">Easy-to-use mobile interface</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RegisterPage;