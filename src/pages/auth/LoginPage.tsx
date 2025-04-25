import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, User, Briefcase } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user type from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const defaultUserType = queryParams.get('type') === 'trucker' ? 'trucker' : 'business';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'business' | 'trucker'>(defaultUserType as 'business' | 'trucker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const success = await login(email, password, userType);
      
      if (!success) {
        setError('Invalid email or password');
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
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-600">Log in to your Instruck account</p>
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
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>
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
          
          <button
            type="submit"
            className="w-full btn-primary py-3"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-neutral-600">Don't have an account?</span>{' '}
          <Link 
            to={`/register${userType === 'trucker' ? '?type=trucker' : ''}`} 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;