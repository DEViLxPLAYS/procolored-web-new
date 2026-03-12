import { ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const videos = [
  { id: 1, title: "Procolored Panda F13 Print Quality Test", duration: "10:24", image: "/images/product-f13-panda.jpg" },
  { id: 2, title: "UV DTF Setup Guide & Tips", duration: "15:30", image: "/images/cat-uv-dtf.jpg" },
  { id: 3, title: "Maintenance Walkthrough - L1800", duration: "08:45", image: "/images/product-l1800.jpg" }
];

const customerStories = [
  { id: 1, name: "Crafty Creations HQ", type: "Small Business", image: "/images/slide-1.webp" },
  { id: 2, name: "Tee Time Customs", type: "Apparel Shop", image: "/images/slide-2.webp" },
  { id: 3, name: "Maker's Space NYC", type: "Creative Studio", image: "/images/slide-3.webp" },
  { id: 4, name: "Print Perfect 365", type: "Commercial Printer", image: "/images/slide-4.webp" }
];

export default function Showroom() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black hover:underline transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">Showroom</span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="w-full bg-gray-900 text-white relative">
        <img 
          src="/images/slide-4.webp" 
          alt="Showroom Banner" 
          className="w-full h-[300px] md:h-[400px] object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Procolored Showroom</h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-200">
            Discover the capabilities of our printers in action. See real results, tutorials, and customer success stories.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Featured Content / Videos Row */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-black">Featured Demonstrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map(video => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden aspect-video mb-3 bg-gray-100">
                  <img src={video.image} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-red-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Stories Grid */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-black">Customer Spotlight</h2>
            <button className="text-sm font-medium text-red-600 hover:text-red-700">View All Stories →</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerStories.map(story => (
              <div key={story.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white border border-t-0 border-gray-100 rounded-b-xl">
                  <div className="text-xs text-red-600 font-bold tracking-wide uppercase mb-1">{story.type}</div>
                  <h3 className="font-bold text-gray-900">{story.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Info Block */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 text-center max-w-4xl mx-auto border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-black">Want to see Procolored locally?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We are constantly expanding our physical showroom network. If you're a distributor or have a space suitable for showcasing Procolored equipment, we'd love to hear from you.
          </p>
          <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Contact Sales Team
          </button>
        </div>

      </div>
    </div>
  );
}
