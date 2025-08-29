import React, { useEffect, useState } from 'react';
import { CheckIcon, PackageIcon, TruckIcon, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccessAnimation = () => {
  const [animate, setAnimate] = useState(false);
  const [confetti, setConfetti] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    setAnimate(true);
    
    // Trigger confetti effect after a delay
    const confettiTimer = setTimeout(() => {
      setConfetti(true);
    }, 600);
    
    return () => clearTimeout(confettiTimer);
  }, []);

  // Confetti animation elements
  const renderConfetti = () => {
    const pieces = [];
    const colors = ['bg-blue-500', 'bg-green-400', 'bg-yellow-400', 'bg-pink-500', 'bg-purple-500'];
    
    for (let i = 0; i < 50; i++) {
      const left = `${Math.random() * 100}%`;
      const size = `${Math.random() * 0.5 + 0.5}rem`;
      const delay = `${Math.random() * 0.5}s`;
      const duration = `${Math.random() * 2 + 1}s`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      pieces.push(
        <div 
          key={i}
          className={`absolute ${color} opacity-0 rounded-sm`}
          style={{
            left,
            top: '-20px',
            width: size,
            height: size,
            animation: confetti ? `fall ${duration} ease-in ${delay} forwards, spin ${duration} linear ${delay} infinite` : 'none',
          }}
        />
      );
    }
    
    return pieces;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
      
      <div className="relative w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
        {/* Confetti container */}
        <div className="absolute inset-0 overflow-hidden">
          {renderConfetti()}
        </div>
        
        <div className="relative flex justify-center mb-6">
          {/* Outer circle with scaling animation */}
          <div className={`relative flex items-center justify-center w-20 h-20 transition-all duration-500 transform 
            ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className="absolute w-20 h-20 bg-green-500 rounded-full animate-pulse" 
              style={{animation: animate ? 'pulse 2s infinite' : 'none'}} />
            
            {/* Checkmark with delayed appearance and bounce */}
            <CheckIcon 
              className={`relative z-10 w-10 h-10 text-white transition-all duration-300 delay-700 transform 
                ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} 
              style={{
                animation: animate ? 'bounce 0.5s ease 0.7s' : 'none'
              }}
            />
          </div>
        </div>
        
        {/* Success text with fade-in animation */}
        <h2 
          className={`mb-2 text-xl font-bold text-center text-gray-800 transition-all duration-500 delay-1000 
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          Order Successful!
        </h2>
        
        <p 
          className={`mb-6 text-center text-gray-600 transition-all duration-500 delay-1200 
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          Thank you for your purchase. Your order has been received.
        </p>
        
        {/* Order details with staggered fade-in animation */}
        <div 
          className={`p-4 mt-6 bg-gray-50 rounded-md transition-all duration-500 delay-1500 
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          <div className={`flex items-center justify-between mb-4 transition-all duration-300 delay-1600
            ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="flex items-center">
              <div className="p-2 mr-3 text-white bg-blue-500 rounded-full">
                <PackageIcon className="w-4 h-4" />
              </div>
              <span className="text-gray-600">Order Number:</span>
            </div>
            <span className="font-medium text-gray-800">#ORD-2458</span>
          </div>
          
          <div className={`flex items-center justify-between mb-4 transition-all duration-300 delay-1800
            ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="flex items-center">
              <div className="p-2 mr-3 text-white bg-green-500 rounded-full">
                <TruckIcon className="w-4 h-4" />
              </div>
              <span className="text-gray-600">Shipping:</span>
            </div>
            <span className="font-medium text-gray-800">Express Delivery</span>
          </div>
          
          <div className={`flex items-center justify-between transition-all duration-300 delay-2000
            ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="flex items-center">
              <div className="p-2 mr-3 text-white bg-purple-500 rounded-full">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="text-gray-600">Estimated Delivery:</span>
            </div>
            <span className="font-medium text-gray-800">
              {new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
            </span>
          </div>
        </div>
        
        {/* Animated progress bar */}
        <div className={`h-2 mt-6 overflow-hidden bg-gray-200 rounded-full transition-all duration-500 delay-2200
          ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-green-400 bg-[length:200%_100%]"
            style={{
              width: animate ? '100%' : '0%',
              transition: 'width 1.5s ease-in-out',
              animation: animate ? 'shimmer 2s infinite linear' : 'none',
            }}
          />
        </div>
        
        {/* Continue shopping button with delayed appearance and hover effect */}
        <Link to={"/"}>
        <button 
          className={`w-full py-3 mt-6 font-medium text-white transition-all duration-500 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 delay-2400 
            ${animate ? 'opacity-100 translate-y-0 hover:shadow-lg hover:-translate-y-1' : 'opacity-0 translate-y-4'}`}
          style={{transition: 'all 0.3s ease'}}>
          Continue Shopping
        </button>
        </Link>
        
        {/* Track order link with delayed appearance */}
        <div className={`mt-4 text-center transition-all duration-500 delay-2600
          ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link to={"/orderpage"}>
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
            Track your order
          </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessAnimation;