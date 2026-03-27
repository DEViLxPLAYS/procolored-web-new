import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─────────────────────────────────────────────────────────────────────────────
// P-Series Product Page Template (Top Section Only)
// ─────────────────────────────────────────────────────────────────────────────
export default function PSeriesProduct() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedPrinter, setSelectedPrinter] = useState(0);
  const [selectedStand, setSelectedStand] = useState(0);

  const { addToCart } = useCart();

  // Placeholder images for the gallery
  const galleryImages = [
    'https://www.procolored.com/cdn/shop/files/Procolored_F13_DTF_Printer_Fan_Appreciation_Sale__2_1220x_crop_center.jpg?v=1770806196',
    'https://www.procolored.com/cdn/shop/files/F13_3_1220x_crop_center.png?v=1770806196',
    'https://www.procolored.com/cdn/shop/files/F13-DTF-Printer_1_1220x_crop_center.png?v=1770806196',
  ];

  // The printer main options based on the references
  const printerOptions = [
    {
      id: 'f13-pro',
      name: 'P-Series Pro', // Replaced F13 with P-Series to show context
      original: 5199,
      sale: 4799,
      saving: '400.00',
      badge: 'P-Series Spring Sale',
      badgeBg: 'bg-[#FCA311]', // Orange-ish or standard
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      id: 'f13-pro-oven',
      name: 'P-Series Pro+Oven',
      original: 5699,
      sale: 5199,
      saving: '500.00',
      badge: '⭐ Recommended',
      badgeBg: 'bg-[#FCA311]',
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      id: 'f13-pro-oven-heat',
      name: 'P-Series Pro+Oven+Heat Press',
      original: 6049,
      sale: 5399,
      saving: '650.00',
      badge: '🏆 Startup First Choice',
      badgeBg: 'bg-[#FCA311]',
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      id: 'f13-pro-smokeless',
      name: 'P-Series Pro+Smokeless Oven',
      original: 6199,
      sale: 5699,
      saving: '500.00',
      badge: '🔥 Best Seller',
      badgeBg: 'bg-[#FCA311]',
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      id: 'f13-pro-smokeless-heat',
      name: 'P-Series Pro+Smokeless Oven+Heat Press',
      original: 6499,
      sale: 5899,
      saving: '600.00',
      badge: 'P-Series Spring Sale',
      badgeBg: 'bg-[#FCA311]',
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      id: 'f13-pro-shaker',
      name: 'P-Series Pro+Shaker',
      original: 6899,
      sale: 6399,
      saving: '500.00',
      badge: 'P-Series Spring Sale',
      badgeBg: 'bg-[#FCA311]',
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      id: 'f13-pro-shaker-heat',
      name: 'P-Series Pro+Shaker+Heat Press',
      original: 7249,
      sale: 6599,
      saving: '650.00',
      badge: '⭐ Best Combination',
      badgeBg: 'bg-[#FCA311]',
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
  ];

  // The extra Option (e.g. Stand, Without Stand)
  const standOptions = [
    { label: 'Without Stand', priceChange: 0 },
    { label: 'Stand', priceChange: 200 }, // Example add-on
  ];

  const currentPrinter = printerOptions[selectedPrinter];
  const currentStand = standOptions[selectedStand];
  const finalPrice = currentPrinter.sale + currentStand.priceChange;

  const handleAddToCart = () => {
    addToCart({
      id: `${currentPrinter.id}-${selectedStand}`,
      name: `${currentPrinter.name} (${currentStand.label})`,
      price: `$USD:${finalPrice}`,
      image: currentPrinter.img,
      quantity: 1,
    });
  };

  return (
    <div className="bg-white font-sans overflow-hidden py-10">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* ── Left Side: Gallery Thumbnail ───────── */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square mb-3 group">
              <img src={galleryImages[activeImage]} alt="Series Printer" className="w-full h-full object-contain p-4 transition-transform duration-300" />
              
              <button 
                onClick={() => setActiveImage(p => (p === 0 ? galleryImages.length - 1 : p - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setActiveImage(p => (p === galleryImages.length - 1 ? 0 : p + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl border-2 overflow-hidden transition-all ${activeImage === i ? 'border-[#E07000]' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right Side: Buy Box Options ───────── */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Procolored P-Series DTF Printer &amp; Bundle
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 fill-current">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-sm text-gray-500 font-medium">No reviews</span>
            </div>

            {/* Top Price Row */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">${finalPrice.toLocaleString()}.00 USD</span>
                <span className="text-lg text-gray-400 line-through">${currentPrinter.original.toLocaleString()}.00 USD</span>
              </div>
              <p className="text-sm text-red-500 font-medium flex items-center gap-1 mt-1">
                ⏱️ P-Series Spring Sale (-${currentPrinter.saving} USD)
              </p>
            </div>

            {/* Extra Member Offer Banner (Static Display) */}
            <div className="rounded-xl border-2 border-pink-500 p-4 relative overflow-hidden bg-white shadow-sm my-2">
              <div className="flex justify-between items-center">
                <div className="font-bold text-pink-500 text-xl flex items-center gap-2">
                   $400 OFF 
                   <span className="text-xs border-l border-pink-200 pl-2 text-gray-800 leading-tight">Extra Member Deal</span>
                </div>
                <div className="text-xs text-right text-gray-600">
                  <a href="#" className="underline text-red-500">Log in</a><br/>
                  Log in to unlock up to <b>$400</b> Off <br/>
                  (Extra deal apply at checkout)
                </div>
              </div>
            </div>

            {/* Select Options Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-900 text-lg">Options</p>
                <button className="text-[#3b82f6] text-sm hover:underline">Compare &gt;</button>
              </div>

              {/* Scrollable list of options */}
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {printerOptions.map((opt, i) => {
                  const isSelected = selectedPrinter === i;
                  return (
                    <button 
                      key={i} 
                      onClick={() => setSelectedPrinter(i)}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left bg-white
                        ${isSelected ? 'border-[#E85A24]' : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      {/* Badge in top right */}
                      <span className={`absolute top-0 right-0 ${opt.badgeBg} text-white font-bold text-[10px] px-3 py-1 rounded-bl-xl rounded-tr-lg`}>
                        {opt.badge}
                      </span>

                      {/* Left: Thumbnail Image */}
                      <img src={opt.img} alt={opt.name} className="w-16 h-16 object-contain" />
                      
                      {/* Right: Info */}
                      <div className="flex-1 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-gray-900 text-sm">{opt.name}</p>
                          <span className="bg-red-50 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-sm w-fit">
                            ${opt.saving} Off
                          </span>
                        </div>
                        
                        {/* Prices aligned right */}
                        <div className="text-right flex flex-col items-end">
                          <p className="text-xs text-gray-400 line-through">${opt.original.toLocaleString()}.00 USD</p>
                          <p className="text-sm text-gray-900 font-extrabold">${opt.sale.toLocaleString()}.00 USD</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Second Add-on Option (Stand) */}
            <div className="mt-4">
              <p className="font-bold text-gray-900 mb-3 text-lg">Option</p>
              <div className="grid grid-cols-2 gap-3">
                {standOptions.map((stand, i) => {
                  const isSelected = selectedStand === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedStand(i)}
                      className={`p-3 rounded-xl border-2 text-center font-semibold transition-all text-sm
                        ${isSelected ? 'border-[#E85A24] text-[#E85A24]' : 'border-gray-200 text-gray-700 hover:border-gray-300'}
                      `}
                    >
                      {stand.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cart Buttons */}
            <div className="flex gap-4 mt-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 border-2 border-[#E85A24] text-[#E85A24] font-bold py-4 rounded-xl hover:bg-orange-50 transition"
              >
                Add to cart
              </button>
              <button 
                className="flex-[1.5] bg-[#5a31f4] text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition"
                onClick={() => {
                  handleAddToCart();
                  window.location.href = '/checkout';
                }}
              >
                Buy it now
              </button>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
