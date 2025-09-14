

import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-6">
          <ShieldCheck className="w-10 h-10 text-purple-500" />
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <p className="text-gray-700 mb-4">
          We value your privacy and are committed to protecting your personal information.
        </p>
        <p className="text-gray-700 mb-4">
          We collect only the necessary data to provide a seamless dashboard experience. Your information will never be sold or shared without consent.
        </p>
        <p className="text-gray-700 mb-4">
          By using our platform, you agree to our terms and privacy practices.
        </p>

        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}