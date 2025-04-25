import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const TruckerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="trucker" />
      
      <main className="flex-grow bg-neutral-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TruckerLayout;