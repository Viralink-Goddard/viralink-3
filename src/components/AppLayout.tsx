import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { PricingSection } from './PricingSection';
import { ComparisonTable } from './ComparisonTable';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

const AppLayout: React.FC = () => {
  const handleGetStarted = () => {
    const pricingSection = document.getElementById('pricing');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />
      <div id="features">
        <FeaturesSection />
      </div>
      <HowItWorksSection />
      <div id="pricing">
        <PricingSection />
      </div>
      <ComparisonTable />
      <TestimonialsSection />
      <div id="faq">
        <FAQSection />
      </div>
      <CTASection />
      <Footer />
    </div>
  );
};

export default AppLayout;
