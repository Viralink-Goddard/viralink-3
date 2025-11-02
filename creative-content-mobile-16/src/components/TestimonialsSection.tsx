import React from 'react';
import { TestimonialCard } from './TestimonialCard';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Content Creators
          </h2>
          <p className="text-xl text-gray-600">
            See what our users are saying about unlimited content generation
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Upgrading to Pro was the best decision. I can now generate unlimited ideas whenever inspiration strikes. My content output has tripled!"
            author="Sarah Johnson"
            role="YouTube Creator"
            imageUrl="https://d64gsuwffb70l.cloudfront.net/68dce3ed939da98291717f4c_1759306960176_5815e168.webp"
          />
          <TestimonialCard
            quote="The free version was great to test, but unlimited entries changed everything. I can brainstorm entire content calendars in one sitting."
            author="Mike Chen"
            role="Instagram Influencer"
            imageUrl="https://d64gsuwffb70l.cloudfront.net/68dce3ed939da98291717f4c_1759306963002_1d233345.webp"
          />
          <TestimonialCard
            quote="As a full-time creator, the $10/month is nothing compared to the time I save. The AI hooks are consistently better than what I'd come up with alone."
            author="Emily Rodriguez"
            role="Content Creator"
            imageUrl="https://d64gsuwffb70l.cloudfront.net/68dce3ed939da98291717f4c_1759306967458_2f021d2e.webp"
          />
        </div>
      </div>
    </section>
  );
};
