// src/pages/Collections.tsx
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const filters = {
  availability: [
    { id: 'in-stock', label: 'In stock', count: 28 },
    { id: 'out-of-stock', label: 'Out of stock', count: 0 }
  ],
  priceTracker: [
    { id: 'under-1000', label: '$0.00 - $1,000.00', count: 2 },
    { id: '1000-2000', label: '$1,000.00 - $2,000.00', count: 18 },
    { id: '2000-3000', label: '$2,000.00 - $3,000.00', count: 5 },
    { id: '3000-4000', label: '$3,000.00 - $4,000.00', count: 2 },
    { id: 'above-4000', label: '$4,000.00+', count: 1 }
  ],
  collection: [
    { id: 'dtf-printers', label: 'DTF Printers', count: 9 },
    { id: 'uv-dtf-printers', label: 'UV DTF Printers', count: 2 },
    { id: 'uv-printers', label: 'UV Printers', count: 4 },
    { id: 'dtg-printers', label: 'DTG Printers', count: 1 },
    { id: 'equipments', label: 'Equipments', count: 4 },
    { id: 'consumables', label: 'Consumables', count: 5 },
    { id: 'parts', label: 'Parts & Accessory', count: 9 },
    { id: 'tshirt-printers', label: 'Tshirt Printers', count: 0 }
  ],
  printHead: [
    { id: 'l1800', label: 'L1800', count: 3 },
    { id: 'l805', label: 'L805', count: 1 },
    { id: 'xp600', label: 'XP600', count: 7 },
    { id: 'i3200', label: 'i3200', count: 2 },
    { id: 'tx800', label: 'TX800', count: 2 }
  ],
  colorChannels: [
    { id: 'cmyk-w', label: 'CMYK+W', count: 9 },
    { id: 'cmyk-w-v', label: 'CMYK+W+V', count: 6 },
    { id: 'cmyk', label: 'CMYK', count: 1 }
  ]
};

const products = [
  { id: "1", name: "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium - Pink", price: "Rs.798,000.00 PKR", originalPrice: "Rs.1,140,200.00 PKR", image: "/images/product-k13-pink.jpg", badge: "Save Rs.342,200", badgeColor: "bg-red-500" },
  { id: "2", name: "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium - White", price: "Rs.798,000.00 PKR", originalPrice: "Rs.1,140,200.00 PKR", image: "/images/product-k13-white.jpg", badge: "Save Rs.342,200", badgeColor: "bg-red-500" },
  { id: "3", name: "Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven", price: "Rs.855,000.00 PKR", originalPrice: "Rs.997,000.00 PKR", image: "/images/product-f13-panda.jpg", badge: "BEST SELLER", badgeColor: "bg-orange-500", link: "/f13" },
  { id: "4", name: "Procolored P13 DTF Printer 13\" A3 XP600 & Oven", price: "Rs.1,140,100.00 PKR", originalPrice: "Rs.1,311,200.00 PKR", image: "/images/product-p13.jpg", badge: "NEW ARRIVAL", badgeColor: "bg-green-500" },
  { id: "5", name: "Procolored VF13 Pro DTF Printer 13\" A3+", price: "Rs.1,967,000.00 PKR", image: "/images/product-vf13.jpg", badge: "NEW ARRIVAL", badgeColor: "bg-green-500" },
  { id: "6", name: "Procolored K13 Lite DTF Printer 13\" A3 Premium", price: "Rs.570,000.00 PKR", image: "/images/product-k13-lite.jpg" },
  { id: "7", name: "Procolored F13 Pro DTF Printer 13\" A3 Pro", price: "Rs.1,424,000.00 PKR", image: "/images/product-f13-pro.jpg" },
  { id: "8", name: "Procolored L1800 DTF Printer 13\" A3 Premium", price: "Rs.795,000.00 PKR", image: "/images/product-l1800.jpg" },
  { id: "9", name: "Procolored F8 DTF Printer 8\" A4 Starter", price: "Rs.455,000.00 PKR", image: "/images/product-f8.jpg" },
  { id: "10", name: "Oven for DTF Printer A3", price: "Rs.125,000.00 PKR", image: "/images/product-oven.jpg" },
  { id: "11", name: "DTF Transfer Film A3", price: "Rs.25,000.00 PKR", image: "/images/product-film.jpg" },
  { id: "12", name: "DTF Ink Set CMYK+W 500ml", price: "Rs.35,000.00 PKR", image: "/images/product-ink.jpg" }
];

export default function Collections() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb matching reference */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-black hover:underline transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black">All Products</span>
      </div>

      <h1 className="text-3xl font-bold text-black mb-8">All</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="font-bold text-lg mb-4 flex items-center justify-between border-b pb-2">
              Filters <span className="text-sm font-normal text-red-600 cursor-pointer">Clear all</span>
            </h2>

            {/* Availability */}
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3 text-black">Availability</h3>
              <div className="space-y-2">
                {filters.availability.map(f => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-[#E85A24] focus:ring-[#E85A24]" />
                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{f.label} ({f.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Collection */}
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3 text-black">Collection</h3>
              <div className="space-y-2">
                {filters.collection.map(f => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-[#E85A24] focus:ring-[#E85A24]" />
                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{f.label} ({f.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Tracker */}
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3 text-black">Price Tracker</h3>
              <div className="space-y-2">
                {filters.priceTracker.map(f => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-[#E85A24] focus:ring-[#E85A24]" />
                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{f.label} ({f.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Print Head */}
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3 text-black">Print Head</h3>
              <div className="space-y-2">
                {filters.printHead.map(f => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-[#E85A24] focus:ring-[#E85A24]" />
                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{f.label} ({f.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Channels */}
            <div>
              <h3 className="font-medium text-sm mb-3 text-black">Color Channels</h3>
              <div className="space-y-2">
                {filters.colorChannels.map(f => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-[#E85A24] focus:ring-[#E85A24]" />
                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{f.label} ({f.count})</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="flex-1 w-full">
          {/* Header row with sort dropdown */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <span className="text-sm text-gray-600">Showing 1-12 of 28 products</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select className="border-gray-300 rounded text-sm py-1.5 focus:border-[#E85A24] focus:ring focus:ring-[#E85A24] focus:ring-opacity-50">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Simple Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const Wrapper = product.link ? Link : 'div';
              return (
                <Wrapper 
                  to={product.link || '#'} 
                  key={product.id} 
                  className={`group bg-gray-50 rounded-lg p-4 transition-shadow hover:shadow-lg ${product.link ? 'cursor-pointer block' : ''}`}
                >
                  <div className="relative mb-4 aspect-square bg-white rounded-md flex items-center justify-center p-2">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className={`absolute top-2 left-2 ${product.badgeColor} text-white`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 text-black group-hover:text-[#E85A24] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="text-red-600 font-bold text-sm">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-black text-white border border-black' 
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
