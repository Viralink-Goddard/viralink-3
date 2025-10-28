import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">Last Updated: October 26, 2025</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="mb-2">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Social media account data when you connect platforms</li>
                <li>Content you create and schedule through our Service</li>
                <li>Usage data and analytics about how you use our Service</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="mb-2">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and improve our Service</li>
                <li>Generate AI-powered content suggestions</li>
                <li>Schedule and publish content to your social media accounts</li>
                <li>Provide analytics and insights about your content performance</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important updates and notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Social Media Data</h2>
              <p>When you connect social media accounts, we access only the permissions you grant. We use this access to post content, retrieve analytics, and manage your social media presence as directed by you. You can disconnect accounts at any time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal information. We share data only with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Service providers (hosting, payment processing, AI services)</li>
                <li>Social media platforms you've connected</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
              <p>We retain your data for as long as your account is active or as needed to provide services. You can request deletion of your data by contacting us or deleting your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Cookies</h2>
              <p>We use cookies and similar technologies to maintain sessions, remember preferences, and analyze usage. You can control cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p>Our Service is not intended for users under 13 years of age. We do not knowingly collect information from children.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Privacy Policy</h2>
              <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
              <p>For privacy-related questions or to exercise your rights, contact us at privacy@viralink.pro</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
