
export default function Feedback() {
  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-12 pb-24 font-sans text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-[28px] font-bold mb-10 text-[#1a1a1a]">Feedback</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            <button className="w-full text-left px-5 py-3 rounded-md bg-[#ebebeb] text-[#4a4a4a] hover:bg-gray-200 transition-colors font-medium text-[15px]">
              Pre-Sales Consultant &gt;
            </button>
            <button className="w-full text-left px-5 py-3 rounded-md bg-[#ebebeb] text-[#4a4a4a] hover:bg-gray-200 transition-colors font-medium text-[15px]">
              After-Sales Support &gt;
            </button>
            <button className="w-full text-left px-5 py-3 rounded-md bg-[#dd2222] text-white font-medium text-[15px] transition-colors shadow-sm">
              Service Feedback &gt;
            </button>
          </div>

          {/* Right Content */}
          <div className="flex-1 bg-white p-8 md:p-12 rounded-lg shadow-sm">
            <p className="text-[#4a4a4a] text-[15px] mb-8 leading-relaxed">
              Your feedback is invaluable to us. At Procolored, we continuously strive to improve our products and services based on customer experiences. Please share your thoughts with us.
            </p>

            <div className="mb-10">
              <h2 className="text-[#1a1a1a] font-bold text-base mb-3">Contact Info</h2>
              <div className="space-y-2 text-[#4a4a4a] text-[15px]">
                <p><strong className="text-[#1a1a1a]">Feedback Email:</strong> <a href="mailto:support@procollored.com" className="text-[#0066cc] hover:underline">support@procollored.com</a></p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[#1a1a1a] font-bold text-base mb-2">Share Your Experience</h2>
              <p className="text-[#666666] text-sm">
                Tell us about your experience with Procolored products or services. Your feedback helps us serve you better.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-2">First Name *</label>
                  <input type="text" placeholder="First Name" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Last Name *</label>
                  <input type="text" placeholder="Last Name" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Country *</label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-red-500 transition-colors">
                  <option value="">Please select</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="pk">Pakistan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Email *</label>
                <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Rating</label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-red-500 transition-colors">
                  <option value="">Select a rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
                  <option value="4">⭐⭐⭐⭐ — Good</option>
                  <option value="3">⭐⭐⭐ — Average</option>
                  <option value="2">⭐⭐ — Poor</option>
                  <option value="1">⭐ — Very Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Feedback *</label>
                <textarea rows={5} placeholder="Please share your experience with us..." className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors resize-y"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Product(s) Used</label>
                <input type="text" placeholder="Which Procolored product(s) did you use?" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
              </div>

              <div className="pt-2">
                <button type="button" className="bg-black hover:bg-[#E85A24] text-white font-bold text-sm px-10 py-3 rounded-full transition-colors duration-300 shadow-md">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
