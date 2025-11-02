import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/lib/supabase';

interface HeroSectionProps {
  onOpenSignup: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSignup }) => {
  const navigate = useNavigate();
  const { user, demoLogin } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onOpenSignup();
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    navigate('/dashboard');
  };

  const onLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-800 text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {isDemoMode && (
            <div className="mb-6 inline-block bg-yellow-500/20 border border-yellow-400 text-yellow-100 px-4 py-2 rounded-lg text-sm">
              ⚠️ Demo Mode - Click "Try Demo" to explore all features
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Go Viral on <span className="text-yellow-300">Every Platform</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
            AI-powered content creation and scheduling for TikTok, Instagram, and YouTube. 
            Create viral content in seconds, schedule posts across all platforms, and track your growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-yellow-400 text-purple-900 text-lg font-bold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
            </button>
            {isDemoMode && !user && (
              <button
                onClick={handleDemoLogin}
                className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-400 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                🚀 Try Demo (No Signup)
              </button>
            )}
            <button
              onClick={onLearnMore}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg hover:bg-white/20 border border-white/30 transition-all duration-200"
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
