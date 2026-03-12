import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Repair() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black hover:underline transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">Repair Appointment</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Schedule a Repair</h1>
          <p className="text-gray-600">
            Experiencing issues with your Procolored equipment? Fill out the form below and our technical team will contact you within 24 hours to arrange diagnostics or an on-site repair appointment.
          </p>
        </div>

        <form className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Order Number (Optional)</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none" placeholder="e.g. PC-12345" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Machine Model <span className="text-red-500">*</span></label>
            <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none bg-white">
              <option value="">Select a model...</option>
              <option value="f13">Procolored F13 Panda DTF Printer 13" A3</option>
              <option value="f13pro">Procolored F13 Pro DTF Printer 13" A3</option>
              <option value="p13">Procolored P13 DTF Printer 13" A3</option>
              <option value="k13lite">Procolored K13 Lite DTF Printer 13" A3</option>
              <option value="f8">Procolored F8 DTF Printer 8" A4</option>
              <option value="other">Other Model</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Problem Description <span className="text-red-500">*</span></label>
            <textarea 
              required 
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none resize-none"
              placeholder="Please describe the issue in detail. Include any error codes displayed on the printer screen."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photos/Videos (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="text-sm text-gray-600">Click to upload files or drag and drop here</span>
              <p className="text-xs text-gray-400 mt-1">Max file size: 20MB</p>
            </div>
          </div>

          <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
            Submit Repair Request
          </button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By submitting this form, you agree to Procolored's <Link to="/warranty" className="underline hover:text-black">Warranty Terms</Link> and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
