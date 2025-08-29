import React, { useState, useEffect } from 'react';

const OrderLoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Processing your order...');

  useEffect(() => {
    // Simulate different stages of order processing
    const timeline = [
      { time: 1000, progress: 15, status: 'Validating your cart...' },
      { time: 2500, progress: 35, status: 'Checking inventory...' },
      { time: 4000, progress: 60, status: 'Processing payment...' },
      { time: 5500, progress: 85, status: 'Finalizing your order...' },
      { time: 7000, progress: 100, status: 'Order complete!' }
    ];
    
    timeline.forEach(stage => {
      setTimeout(() => {
        setProgress(stage.progress);
        setStatus(stage.status);
      }, stage.time);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-64 px-4 py-6 bg-white rounded-lg shadow-lg">
      {/* Logo animation */}
      <div className="mb-6">
        <div className="relative w-16 h-16">
          <div className="absolute w-16 h-16 rounded-full border-4 border-gray-200"></div>
          <div 
            className="absolute w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
            style={{ animationDuration: '1s' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Status text */}
      <div className="mb-4 text-lg font-medium text-gray-700">{status}</div>
      
      {/* Progress bar */}
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Progress percentage */}
      <div className="mt-2 text-sm text-gray-500">{progress}% complete</div>
      
      {/* Loading dots */}
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default OrderLoadingScreen;