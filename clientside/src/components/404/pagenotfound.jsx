import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

const Animated404 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingShape = ({ delay, size, position }) => (
    <div
      className={`absolute ${size} bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-sm animate-pulse`}
      style={{
        left: position.x,
        top: position.y,
        animationDelay: `${delay}s`,
        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
      }}
    />
  );

  const GlowingOrb = ({ size, position, color }) => (
    <div
      className={`absolute ${size} ${color} rounded-full animate-ping`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape delay={0} size="w-32 h-32" position={{ x: '10%', y: '20%' }} />
        <FloatingShape delay={1} size="w-24 h-24" position={{ x: '80%', y: '30%' }} />
        <FloatingShape delay={2} size="w-40 h-40" position={{ x: '70%', y: '70%' }} />
        <FloatingShape delay={1.5} size="w-20 h-20" position={{ x: '20%', y: '80%' }} />
        
        <GlowingOrb size="w-2 h-2" position={{ x: '25%', y: '25%' }} color="bg-blue-400" />
        <GlowingOrb size="w-1 h-1" position={{ x: '75%', y: '15%' }} color="bg-pink-400" />
        <GlowingOrb size="w-3 h-3" position={{ x: '85%', y: '85%' }} color="bg-purple-400" />
        <GlowingOrb size="w-1 h-1" position={{ x: '15%', y: '60%' }} color="bg-cyan-400" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-8">
          <h1 
            className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 select-none animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
            }}
          >
            404
          </h1>
          {/* Glitch layers */}
          <h1 
            className="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-red-500/30 select-none animate-bounce"
            style={{
              transform: `translate(${mousePosition.x * -0.1 + 2}px, ${mousePosition.y * -0.1}px)`,
              animationDuration: '3s'
            }}
          >
            404
          </h1>
          <h1 
            className="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-blue-500/20 select-none animate-bounce"
            style={{
              transform: `translate(${mousePosition.x * 0.15 - 2}px, ${mousePosition.y * 0.15}px)`,
              animationDuration: '2.5s'
            }}
          >
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-fade-in">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-300 animate-fade-in animation-delay-300">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-sm text-gray-400 animate-fade-in animation-delay-500">
            Don't worry, even the best explorers sometimes take a wrong turn in cyberspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-700">
          <button 
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transform hover:rotate-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2">
              <Home size={20} className="group-hover:animate-bounce" />
              Go Home
            </div>
          </button>

          <button className="group px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-full transition-all duration-300 hover:border-purple-400 hover:text-white hover:bg-purple-400/10 hover:scale-105 transform hover:-rotate-1">
            <div className="flex items-center gap-2">
              <ArrowLeft size={20} className="group-hover:animate-pulse" />
              Go Back
            </div>
          </button>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center gap-6 animate-fade-in animation-delay-1000">
          <button className="group p-3 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300 hover:scale-110">
            <Search size={20} className="group-hover:animate-spin" />
          </button>
          <button className="group p-3 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-pink-600/20 transition-all duration-300 hover:scale-110">
            <RefreshCw size={20} className="group-hover:animate-spin" />
          </button>
        </div>

        {/* Animated Dots */}
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Animated404;