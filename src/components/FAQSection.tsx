import React from 'react';
import { FAQItem } from './FAQItem';

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What's the difference between Free and Pro?",
      answer: "The Free plan allows 1 content entry per day, perfect for casual creators. Pro gives you unlimited entries for $10/month, ideal for serious content creators who need constant inspiration."
    },
    {
      question: "Can I upgrade from Free to Pro anytime?",
      answer: "Yes! You can upgrade to Pro at any time. Your account will immediately unlock unlimited entries and all Pro features."
    },
    {
      question: "What happens if I hit my daily limit on the Free plan?",
      answer: "You'll need to wait until the next day (resets at midnight UTC) or upgrade to Pro for unlimited access. We'll send you a reminder when your limit resets."
    },
    {
      question: "What kind of content can I generate ideas for?",
      answer: "Our AI works for all content types: YouTube videos, blog posts, social media posts, podcasts, newsletters, and more. Just describe your topic and audience."
    },
    {
      question: "Can I cancel my Pro subscription?",
      answer: "Absolutely. Cancel anytime with no penalties. You'll keep Pro access until the end of your billing period, then automatically revert to the Free plan."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee. If you're not satisfied with Pro within the first week, contact support for a full refund."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
