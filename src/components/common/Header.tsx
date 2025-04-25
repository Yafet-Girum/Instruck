import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  userType?: 'business' | 'trucker';
}

const Header: React.FC<HeaderProps> = ({ userType }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);  
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeAll}>
              <Truck className="h-8 w-8 text-primary-600" strokeWidth={2} />
              <span className="ml-2 text-xl font-bold text-primary-800">Instruck</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user && user.userType === 'business' && (
              <>
                <Link 
                  to="/business" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/business/shipments/create" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Book Truck
                </Link>
                <Link 
                  to="/business/shipments" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Shipments
                </Link>
                <Link 
                  to="/business/invoices" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Invoices
                </Link>
              </>
            )}

            {user && user.userType === 'trucker' && (
              <>
                <Link 
                  to="/trucker" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/trucker/jobs" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Available Jobs
                </Link>
                <Link 
                  to="/trucker/earnings" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Earnings
                </Link>
              </>
            )}
          </nav>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={toggleNotifications}
                    className="p-1 rounded-full text-neutral-600 hover:text-neutral-800 focus:outline-none"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-600 ring-2 ring-white"></span>
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 border-b border-neutral-200">
                          <h3 className="text-sm font-medium text-neutral-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50">
                            <p className="text-sm text-neutral-800">New price quote available</p>
                            <p className="text-xs text-neutral-500 mt-1">5 minutes ago</p>
                          </div>
                          <div className="px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50">
                            <p className="text-sm text-neutral-800">Shipment status updated</p>
                            <p className="text-xs text-neutral-500 mt-1">1 hour ago</p>
                          </div>
                          <div className="px-4 py-3 hover:bg-neutral-50">
                            <p className="text-sm text-neutral-800">Monthly invoice generated</p>
                            <p className="text-xs text-neutral-500 mt-1">Yesterday</p>
                          </div>
                        </div>
                        <div className="px-4 py-2 border-t border-neutral-200 text-center">
                          <button className="text-xs text-primary-600 hover:text-primary-800">
                            Mark all as read
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button 
                      onClick={toggleProfile}
                      className="flex items-center text-sm rounded-full focus:outline-none"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img 
                        className="h-8 w-8 rounded-full"
                        src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                        alt="User avatar"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-700 hidden sm:block">{user.name}</span>
                      <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                    </button>
                  </div>
                  
                  {profileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link 
                          to={user.userType === 'business' ? '/business' : '/trucker/profile'} 
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          role="menuitem"
                          onClick={closeAll}
                        >
                          Your Profile
                        </Link>
                        <Link 
                          to={user.userType === 'business' ? '/business/settings' : '/trucker/settings'} 
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          role="menuitem"
                          onClick={closeAll}
                        >
                          Settings
                        </Link>
                        <button 
                          onClick={logout} 
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-neutral-700 hover:text-neutral-900"
                  onClick={closeAll}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                  onClick={closeAll}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <button
                className="p-1 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none"
                onClick={toggleNotifications}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
            )}
            
            <button
              className="ml-3 p-1 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && user.userType === 'business' && (
              <>
                <Link 
                  to="/business" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/business/shipments/create" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Book Truck
                </Link>
                <Link 
                  to="/business/shipments" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Shipments
                </Link>
                <Link 
                  to="/business/invoices" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Invoices
                </Link>
              </>
            )}

            {user && user.userType === 'trucker' && (
              <>
                <Link 
                  to="/trucker" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/trucker/jobs" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Available Jobs
                </Link>
                <Link 
                  to="/trucker/earnings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Earnings
                </Link>
              </>
            )}
            
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  onClick={closeAll}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          
          {user && (
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full"
                    src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-neutral-800">{user.name}</div>
                  <div className="text-sm font-medium text-neutral-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link 
                  to={user.userType === 'business' ? '/business' : '/trucker/profile'} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Your Profile
                </Link>
                <Link 
                  to={user.userType === 'business' ? '/business/settings' : '/trucker/settings'} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={closeAll}
                >
                  Settings
                </Link>
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile notifications */}
      {notificationsOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-900">Notifications</h3>
          </div>
          <div className="divide-y divide-neutral-200">
            <div className="px-4 py-3 hover:bg-neutral-50">
              <p className="text-sm text-neutral-800">New price quote available</p>
              <p className="text-xs text-neutral-500 mt-1">5 minutes ago</p>
            </div>
            <div className="px-4 py-3 hover:bg-neutral-50">
              <p className="text-sm text-neutral-800">Shipment status updated</p>
              <p className="text-xs text-neutral-500 mt-1">1 hour ago</p>
            </div>
            <div className="px-4 py-3 hover:bg-neutral-50">
              <p className="text-sm text-neutral-800">Monthly invoice generated</p>
              <p className="text-xs text-neutral-500 mt-1">Yesterday</p>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-neutral-200 text-center">
            <button 
              className="text-xs text-primary-600 hover:text-primary-800"
              onClick={() => setNotificationsOpen(false)}
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;