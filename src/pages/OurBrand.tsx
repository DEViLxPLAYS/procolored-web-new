
export default function OurBrand() {
  return (
    <div className="w-full bg-[#f9f9f9] text-[#1a1a1a] font-sans pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=2000" 
          alt="Our Brand Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Our Brand</h1>
          <p className="text-lg md:text-xl text-gray-200">
            Dedicated to bringing color and innovation to the world of printing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 border border-gray-300">
               <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000" alt="Brand Story" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-sm font-bold text-[#E85A24] uppercase tracking-wider">Our Story</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Innovating the Print Industry</h3>
            <p className="text-[#4a4a4a] leading-relaxed text-lg">
              Procolored was founded with a single mission: to provide high-quality, reliable, and innovative printing solutions to creators and businesses around the world. We believe that technology should empower creativity, not hinder it.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed text-lg">
              Through years of dedicated research and development, we have created a line of printers that push the boundaries of what is possible, offering unmatched precision, vibrant colors, and user-friendly features.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#fff2ed] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💡</span>
            </div>
            <h4 className="text-xl font-bold mb-4">Innovation</h4>
            <p className="text-[#666666] leading-relaxed">
              Continuously pushing the limits of print technology to deliver smarter, faster, and more efficient solutions.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#fff2ed] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⭐</span>
            </div>
            <h4 className="text-xl font-bold mb-4">Quality</h4>
            <p className="text-[#666666] leading-relaxed">
              Uncompromising commitment to build quality and print precision in every product we release.
            </p>
          </div>

          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#fff2ed] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🤝</span>
            </div>
            <h4 className="text-xl font-bold mb-4">Customer First</h4>
            <p className="text-[#666666] leading-relaxed">
              Dedicated support and service to ensure our users achieve their goals without friction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
