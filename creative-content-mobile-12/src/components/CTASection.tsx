import React from 'react';

interface CTASectionProps {
  onOpenSignup?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenSignup }) => {
  const handleGetStarted = () => {
    if (onOpenSignup) {
      onOpenSignup();
    }
  };

  const handleViewPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Content Creation?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of creators who never run out of ideas. Start free today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Free - No Credit Card Required
          </button>
          <button
            onClick={handleViewPricing}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg hover:bg-white/20 border-2 border-white transition-all duration-200"
          >
            View Pricing
          </button>
        </div>
        <p className="text-white/80 mt-6 text-sm">
          Free forever • No credit card required • Upgrade anytime
        </p>
      </div>
    </section>
  );
};
