import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type VariantKey = string;
const VARIANTS_V4 = [
  { key: 'soft-v4-5set', label: 'Five-color 5×500ml', price: 189 },
  { key: 'soft-v4-cyan', label: 'Cyan', price: 59 },
  { key: 'soft-v4-magenta', label: 'Magenta', price: 59 },
  { key: 'soft-v4-yellow', label: 'Yellow', price: 59 },
  { key: 'soft-v4-black', label: 'Black', price: 59 },
  { key: 'soft-v4-white', label: 'White', price: 59 },
];

const VARIANTS_V11PRO = [
  { key: 'soft-v11pro-5set', label: 'Five-color 5×500ml', price: 189 },
  { key: 'soft-v11pro-cyan', label: 'Cyan', price: 59 },
  { key: 'soft-v11pro-magenta', label: 'Magenta', price: 59 },
  { key: 'soft-v11pro-yellow', label: 'Yellow', price: 59 },
  { key: 'soft-v11pro-black', label: 'Black', price: 59 },
  { key: 'soft-v11pro-white', label: 'White', price: 59 },
];

const IMAGE = 'https://www.procolored.com/cdn/shop/files/TW_RM_500_V11Pro_V13_Pro_V23_Max_1_0ff91e1f-571e-4dea-8c90-ff00a1e5d52d_1220x_crop_center.png?v=1749625616';

export default function UVPrinterInk500ml() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [variantKey, setVariantKey] = useState<VariantKey>('soft-v4-5set');

  const variant = [...VARIANTS_V4, ...VARIANTS_V11PRO].find(v => v.key === variantKey)!;
  const isV4Group = VARIANTS_V4.some(v => v.key === variantKey);

  const handleAddToCart = () => {
    const groupName = isV4Group ? 'Soft Ink — Fit for V4/V6/V11' : 'Soft Ink — Fit for V11 Pro/V13 Pro/V23 Max';
    addToCart({ id: `uv-printer-ink-500ml-${variantKey}`, name: `Procolored Ink for UV Printer 500ml — ${groupName} — ${variant.label}`, price: `$USD:${variant.price}`, image: IMAGE, quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>{' > '}Procolored Ink for UV Printer 500ml
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <img src={IMAGE} alt="Procolored Ink for UV Printer 500ml" className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">Procolored Ink for UV Printer 500ml</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.0 — 3 reviews</a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">${variant.price}.00 USD</span>
                </div>
              </div>

              {/* Variants Split Groups */}
              <div>
                <p className="font-extrabold text-gray-900 text-[15px] mb-3">Soft Ink — Fit for V4/V6/V11</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {VARIANTS_V4.map(v => (
                    <button key={v.key} onClick={() => setVariantKey(v.key)}
                      className={`text-left px-3 py-2.5 rounded-lg border-2 font-semibold transition-all text-sm flex flex-col justify-between items-start gap-1 ${variantKey === v.key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      <span className="leading-tight text-[13px]">{v.label}</span>
                      <span className="font-bold text-[13px]">${v.price}</span>
                    </button>
                  ))}
                </div>

                <p className="font-extrabold text-gray-900 text-[15px] mb-3">Soft Ink — Fit for V11 Pro/V13 Pro/V23 Max</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VARIANTS_V11PRO.map(v => (
                    <button key={v.key} onClick={() => setVariantKey(v.key)}
                      className={`text-left px-3 py-2.5 rounded-lg border-2 font-semibold transition-all text-sm flex flex-col justify-between items-start gap-1 ${variantKey === v.key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      <span className="leading-tight text-[13px]">{v.label}</span>
                      <span className="font-bold text-[13px]">${v.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                Note: We've recently updated the ink packaging. The old or new packaging will be shipped out randomly.
              </p>

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">Add to cart</button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span><span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]"><a href="#" className="text-xs text-blue-500 underline hover:text-blue-600">More payment options</a></div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-xs text-gray-600">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Shop with Confidence!</p>
                  <ul className="list-disc pl-4 space-y-1 mb-2"><li>100% Protection Against Shipping Mishaps</li></ul>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WORRY-FREE PURCHASE® BY <span className="text-blue-500 lowercase font-medium">seel</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Info Table */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Information</h2>
          <div className="space-y-0 border border-gray-200 rounded-2xl overflow-hidden bg-white">
            <div className="flex gap-0 border-b border-gray-100">
              <div className="w-48 flex-shrink-0 bg-gray-50 px-6 py-4 font-bold text-gray-900 text-sm border-r border-gray-100">Outlined</div>
              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">Product name: UV cured ink (soft/hard ink)</div>
            </div>
            <div className="flex gap-0 border-b border-gray-100">
              <div className="w-48 flex-shrink-0 bg-gray-50 px-6 py-4 font-bold text-gray-900 text-sm border-r border-gray-100">Description</div>
              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">Feature: quickly dried, less ink consumption, complete color gamuts, excellent color reproduction, high fluency, durable quality
              Applicable to: flat or curved surfaces of which high drop is within 2mm, including phone case, ceramic, metal, plastic, wood, paper, glass, etc (extra jigs needed for curved objects)</div>
            </div>
            <div className="flex gap-0 border-b border-gray-100">
              <div className="w-48 flex-shrink-0 bg-gray-50 px-6 py-4 font-bold text-gray-900 text-sm border-r border-gray-100">Compatibility</div>
              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">Apply to UV printers, including V4, V6, V11, V11 Pro, V13 Pro, V23 Max Printer.</div>
            </div>
            <div className="flex gap-0 border-b border-gray-100 border-none">
              <div className="w-48 flex-shrink-0 bg-gray-50 px-6 py-4 font-bold text-gray-900 text-sm border-r border-gray-100">Technical specification</div>
              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">Volume: 500ml
              Shelf life: 12 months
              Storage: Keep in a dry place and away from direct sunlight</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 3 reviews</p>
            </div>
            {/* Reviews break down... keeping clean placeholder */}
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {[[5,'100%',3],[4,'0%',0],[3,'0%',0],[2,'0%',0],[1,'0%',0]].map(([stars,pct,count],i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s<=(stars as number)?'fill-yellow-400 text-yellow-400':'text-gray-300'}`} />)}</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="bg-yellow-400 h-full rounded-full" style={{width:pct as string}} /></div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-sm transition rounded">Write a review</button>
              <button className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold text-sm transition rounded">Ask a question</button>
            </div>
          </div>
          <div className="flex justify-start mb-6 border-b border-gray-200 pb-2">
            <button className="text-sm text-yellow-500 font-bold flex items-center gap-1">Most Recent <ChevronDown className="w-4 h-4" /></button>
          </div>
          <div className="divide-y divide-gray-100">
              <div className="py-6 flex flex-col md:flex-row gap-4 md:gap-12 w-full">
                <div className="w-full md:w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">Alex R.</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 fill-yellow-400 text-yellow-400`} />)}</div>
                    <p className="text-xs text-gray-400">03/15/2026</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-2">Exactly as described</p>
                  <p className="text-gray-600 text-sm leading-relaxed">Great product, does exactly what it says. Arrived quickly and in perfect condition. Will order again.</p>
                </div>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}
