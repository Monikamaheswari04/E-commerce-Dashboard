

import { Users, Activity } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Our Dashboard</h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            Empowering store owners with analytics, order management, and a seamless e-commerce experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
            <Users className="w-10 h-10 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h2>
              <p className="text-gray-700">
                To provide a user-friendly platform that makes managing products, orders, and analytics easy and efficient.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
            <Activity className="w-10 h-10 text-green-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h2>
              <p className="text-gray-700">
                To become the most intuitive and powerful dashboard for e-commerce professionals worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}