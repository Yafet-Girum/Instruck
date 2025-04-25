import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-primary-600 border-r-transparent border-b-primary-400 border-l-transparent animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600 font-semibold">
          Instruck
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;