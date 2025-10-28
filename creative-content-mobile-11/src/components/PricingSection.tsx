import React from 'react';
import { PricingCard } from './PricingCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PricingSectionProps {
  onOpenSignup?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenSignup }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFreePlan = () => {
    if (user) {
      navigate('/dashboard');
    } else if (onOpenSignup) {
      onOpenSignup();
    } else {
      alert('Please sign up to get started');
    }
  };

  const handleProPlan = () => {
    if (user) {
      navigate('/profile');
    } else if (onOpenSignup) {
      onOpenSignup();
    } else {
      alert('Please sign up to upgrade to Pro');
    }
  };

  return (
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need unlimited power
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            price="$0"
            period="/month"
            description="Perfect for trying out our AI-powered content generation"
            features={[
              '1 content entry per day',
              'AI-generated subjects',
              'AI-generated hooks',
              'AI-generated context',
              'Basic templates',
              'Email support'
            ]}
            buttonText={user ? "Go to Dashboard" : "Get Started Free"}
            buttonVariant="secondary"
            onButtonClick={handleFreePlan}
          />
          <PricingCard
            title="Pro"
            price="$10"
            period="/month"
            description="Unlimited content creation for serious creators"
            features={[
              'Unlimited daily entries',
              'Advanced AI models',
              'Priority generation',
              'Premium templates',
              'Export to multiple formats',
              'Priority support',
              'Analytics dashboard'
            ]}
            buttonText={user ? "Upgrade to Pro" : "Sign Up for Pro"}
            buttonVariant="primary"
            popular={true}
            onButtonClick={handleProPlan}
          />
        </div>
      </div>
    </section>
  );
};
