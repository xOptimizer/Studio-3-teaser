import { useState, useEffect } from 'react';
import { appleImg } from '../utils';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a bit before hiding to show 100%
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 300);
          return 100;
        }
        // Faster progress at start, slower near end
        const increment = prev < 70 ? 3 : prev < 90 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src={appleImg} 
          alt="Apple" 
          className="w-16 h-auto sm:w-20 md:w-24"
        />
      </div>

      {/* Loading Bar Container */}
      <div className="w-64 sm:w-80 md:w-96 h-1 bg-gray-300/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gray-300 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-gray text-sm sm:text-base mt-4 font-light">
        {progress}%
      </p>
    </div>
  );
};

export default LoadingScreen;

