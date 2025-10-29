import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">Last Updated: October 26, 2025</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using viralink.pro ("Service"), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>viralink.pro provides AI-powered content creation tools, social media management features, and analytics for content creators and businesses.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p>You must create an account to use certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Social Media Integration</h2>
              <p>By connecting your social media accounts (Instagram, Facebook, TikTok), you grant us permission to access and manage content on your behalf as necessary to provide our services. You can revoke access at any time through your account settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Subscription and Payment</h2>
              <p>Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel at any time, but refunds are not provided for partial periods.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
              <p>You agree not to use the Service for any unlawful purpose, to spam, harass others, or violate any third-party rights including intellectual property rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
              <p>You retain ownership of content you create. We retain ownership of the Service, software, and our proprietary content. AI-generated content suggestions are provided as-is for your use.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>The Service is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Termination</h2>
              <p>We reserve the right to suspend or terminate your account for violations of these Terms or for any reason with notice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact</h2>
              <p>For questions about these Terms, contact us at legal@viralink.pro</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
