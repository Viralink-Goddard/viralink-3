import React from 'react';

export const ComparisonTable: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Feature Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Feature</th>
                <th className="px-6 py-4 text-center">Free</th>
                <th className="px-6 py-4 text-center">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium">Daily Entries</td>
                <td className="px-6 py-4 text-center">1 per day</td>
                <td className="px-6 py-4 text-center text-green-600 font-semibold">Unlimited</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium">AI Subject Generation</td>
                <td className="px-6 py-4 text-center">✓</td>
                <td className="px-6 py-4 text-center">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">AI Hook Generation</td>
                <td className="px-6 py-4 text-center">✓</td>
                <td className="px-6 py-4 text-center">✓</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium">Context & Angles</td>
                <td className="px-6 py-4 text-center">✓</td>
                <td className="px-6 py-4 text-center">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Advanced AI Models</td>
                <td className="px-6 py-4 text-center">✗</td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium">Priority Generation</td>
                <td className="px-6 py-4 text-center">✗</td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Export Options</td>
                <td className="px-6 py-4 text-center">✗</td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium">Analytics Dashboard</td>
                <td className="px-6 py-4 text-center">✗</td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
