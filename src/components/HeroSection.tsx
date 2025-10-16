import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onLearnMore }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68dce3ed939da98291717f4c_1759306959122_9c0e263d.webp" 
          alt="AI Background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Content Ideas<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              That Actually Convert
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Generate compelling subjects, hooks, and context for your content in seconds. 
            Start free with 1 daily entry or go unlimited for just $10/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              {user ? 'Go to Dashboard' : 'Start Free Today'}
            </button>
            <button
              onClick={onLearnMore}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg hover:bg-white/20 border border-white/30 transition-all duration-200"
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
