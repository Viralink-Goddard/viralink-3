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
import { SignupModal } from './auth/SignupModal';
import { LoginModal } from './auth/LoginModal';

const AppLayout: React.FC = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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
      <Navbar onOpenSignup={() => setSignupOpen(true)} onOpenLogin={() => setLoginOpen(true)} />
      <HeroSection onOpenSignup={() => setSignupOpen(true)} />

      <div id="features">
        <FeaturesSection />
      </div>
      <HowItWorksSection />
      <div id="pricing">
        <PricingSection onOpenSignup={() => setSignupOpen(true)} />
      </div>
      <ComparisonTable />
      <TestimonialsSection />
      <div id="faq">
        <FAQSection />
      </div>
      <CTASection onOpenSignup={() => setSignupOpen(true)} />

      <Footer />
      
      <SignupModal 
        open={signupOpen} 
        onOpenChange={setSignupOpen} 
        onSwitchToLogin={() => { setSignupOpen(false); setLoginOpen(true); }} 
      />
      <LoginModal 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
        onSwitchToSignup={() => { setLoginOpen(false); setSignupOpen(true); }} 
        onSwitchToReset={() => {}} 
      />
    </div>
  );
};

export default AppLayout;
