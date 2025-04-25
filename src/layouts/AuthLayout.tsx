import React from 'react';
import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';
import Footer from '../components/common/Footer';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header for Auth Pages */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-primary-600" strokeWidth={2} />
            <span className="ml-2 text-xl font-bold text-primary-800">Instruck</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow bg-neutral-50 flex items-center justify-center py-10 px-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;