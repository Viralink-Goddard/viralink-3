import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to amazing content ideas
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
              1
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Describe Your Topic</h3>
            <p className="text-gray-600">
              Tell us what you want to create content about - your niche, audience, or general theme
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
              2
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Generates Ideas</h3>
            <p className="text-gray-600">
              Our advanced AI analyzes trends and creates compelling subjects, hooks, and context
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
              3
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Create & Publish</h3>
            <p className="text-gray-600">
              Use the AI-generated ideas to create content that resonates with your audience
            </p>
          </div>
        </div>
        <div className="mt-16">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68dce3ed939da98291717f4c_1759306968316_7e2689d1.webp" 
            alt="Dashboard Preview" 
            className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full"
          />
        </div>
      </div>
    </section>
  );
};
