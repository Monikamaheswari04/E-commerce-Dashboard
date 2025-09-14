

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h1>
        <p className="text-gray-600 text-center mb-10">
          Have questions or need support? Reach out to us through any of the methods below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <Mail className="w-8 h-8 text-blue-500 mb-2" />
            <p className="font-semibold">Email</p>
            <p className="text-gray-600 text-sm">support@ecommerce.com</p>
          </div>

          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <Phone className="w-8 h-8 text-green-500 mb-2" />
            <p className="font-semibold">Phone</p>
            <p className="text-gray-600 text-sm">+91 98765 43210</p>
          </div>

          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <MapPin className="w-8 h-8 text-red-500 mb-2" />
            <p className="font-semibold">Address</p>
            <p className="text-gray-600 text-sm">123 Dashboard St, Tech City, India</p>
          </div>
        </div>
      </div>
    </main>
  );
}
