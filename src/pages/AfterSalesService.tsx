
export default function AfterSalesService() {
  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-12 pb-24 font-sans text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-[28px] font-bold mb-10 text-[#1a1a1a]">After Sales &amp; Service</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            <button className="w-full text-left px-5 py-3 rounded-md bg-[#ebebeb] text-[#4a4a4a] hover:bg-gray-200 transition-colors font-medium text-[15px]">
              Pre-Sales Consultant &gt;
            </button>
            <button className="w-full text-left px-5 py-3 rounded-md bg-[#dd2222] text-white font-medium text-[15px] transition-colors shadow-sm">
              After-Sales Support &gt;
            </button>
            <button className="w-full text-left px-5 py-3 rounded-md bg-[#ebebeb] text-[#4a4a4a] hover:bg-gray-200 transition-colors font-medium text-[15px]">
              Service Feedback &gt;
            </button>
          </div>

          {/* Right Content */}
          <div className="flex-1 bg-white p-8 md:p-12 rounded-lg shadow-sm">
            <p className="text-[#4a4a4a] text-[15px] mb-8 leading-relaxed">
              Procolored is committed to providing excellent after-sales support. Our dedicated team is available to assist you with technical issues, maintenance questions, and post-purchase concerns.
            </p>

            <div className="mb-10">
              <h2 className="text-[#1a1a1a] font-bold text-base mb-3">Contact Info</h2>
              <div className="space-y-2 text-[#4a4a4a] text-[15px]">
                <p><strong className="text-[#1a1a1a]">After-sales Email:</strong> <a href="mailto:support@procollored.com" className="text-[#0066cc] hover:underline">support@procollored.com</a></p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[#1a1a1a] font-bold text-base mb-2">Submit an After-Sales Request</h2>
              <p className="text-[#666666] text-sm">
                Leave a message about your after-sales concern and our team will get back to you within 24–48 business hours.
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
                  <option value="au">Australia</option>
                  <option value="de">Germany</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Email *</label>
                <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Order Number</label>
                <input type="text" placeholder="Your order number (if available)" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Message *</label>
                <textarea rows={5} placeholder="Please describe your after-sales issue or concern." className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors resize-y"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Product Purchased</label>
                <input type="text" placeholder="Which Procolored product did you purchase?" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
              </div>

              <div className="pt-2">
                <button type="button" className="bg-black hover:bg-[#E85A24] text-white font-bold text-sm px-10 py-3 rounded-full transition-colors duration-300 shadow-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
