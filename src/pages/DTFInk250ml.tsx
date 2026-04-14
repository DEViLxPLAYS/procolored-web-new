import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Capacity = '500ml' | '250ml';

type Variant500ml = 'five-color-500ml' | 'magenta-500ml' | 'yellow-500ml' | 'cyan-500ml' | 'black-500ml' | 'white-500ml';
type Variant250ml = 'five-color-250ml' | 'white-250ml' | 'five-color-250ml-powder';

const VARIANTS_500: { key: Variant500ml; label: string; price: number }[] = [
  { key: 'five-color-500ml',  label: 'Five-color (CMYK+WW) 6×500ml', price: 229 },
  { key: 'magenta-500ml',     label: 'Magenta 500ml',                 price: 59  },
  { key: 'yellow-500ml',      label: 'Yellow 500ml',                  price: 59  },
  { key: 'cyan-500ml',        label: 'Cyan 500ml',                    price: 59  },
  { key: 'black-500ml',       label: 'Black 500ml',                   price: 59  },
  { key: 'white-500ml',       label: 'White 500ml',                   price: 59  },
];

const VARIANTS_250: { key: Variant250ml; label: string; price: number; originalPrice?: number }[] = [
  { key: 'five-color-250ml',        label: 'Five-color 6×250ml',              price: 129 },
  { key: 'white-250ml',             label: 'White 250ml',                      price: 49  },
  { key: 'five-color-250ml-powder', label: 'Five-color 6×250ml & 500g Powder', price: 167, originalPrice: 129 },
];

const IMAGE_500 = 'https://www.procolored.com/cdn/shop/files/CMYKWW_16_1220x_crop_center.png?v=1762338853';
const IMAGE_250 = 'https://www.procolored.com/cdn/shop/files/250ml_cdfd861c-62b6-4d98-9331-934d56bfe03e_1220x_crop_center.png?v=1762339048';

const REVIEWS = [
  { name: 'Derek H.', date: '03/22/2026', title: 'Colors are super vivid', text: "These inks produce incredibly vibrant output on my F13 Pro. I've tried other brands and always come back to Procolored because of the consistency. No clogging whatsoever.", rating: 5 },
  { name: 'Lena_DTF', date: '03/10/2026', title: 'Matched my color profile perfectly', text: 'Out of the box these inks matched my RIP profile very well. Minimal adjustment needed. The white ink coverage is excellent and layering works great for light on dark garments.', rating: 5 },
  { name: 'QuickPrints_ATL', date: '02/28/2026', title: 'No separation issues', text: 'I was having ink separation issues with a generic brand but these have been sitting in my printer for 2 months with zero settling. Prints come out clean and consistent every time.', rating: 5 },
];

export default function DTFInk250ml() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [capacity, setCapacity] = useState<Capacity>('500ml');
  const [variant500Key, setVariant500Key] = useState<Variant500ml>('five-color-500ml');
  const [variant250Key, setVariant250Key] = useState<Variant250ml>('five-color-250ml');

  const currentVariant500 = VARIANTS_500.find(v => v.key === variant500Key)!;
  const currentVariant250 = VARIANTS_250.find(v => v.key === variant250Key)!;
  const activePrice = capacity === '500ml' ? currentVariant500.price : currentVariant250.price;
  const activeLabel = capacity === '500ml' ? currentVariant500.label : currentVariant250.label;
  const activeOriginal = capacity === '250ml' ? currentVariant250.originalPrice : undefined;
  const IMAGE = capacity === '500ml' ? IMAGE_500 : IMAGE_250;

  const handleAddToCart = () => addToCart({
    id: `dtf-ink-${capacity === '500ml' ? variant500Key : variant250Key}`,
    name: `Procolored Direct to Transfer Film Ink ${capacity} — ${activeLabel}`,
    price: `$USD:${activePrice}`,
    image: IMAGE,
    quantity: 1
  });
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>{' > '}Procolored Direct to Transfer Film Ink
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <img src={IMAGE} alt={`DTF Ink ${capacity}`} className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-[55%] flex flex-col gap-5">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored Direct to Transfer Film Ink {capacity}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.0 out of 5 — 3 reviews</a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">${activePrice}.00 USD</span>
                  {activeOriginal && <s className="text-xl text-gray-400 font-medium">${activeOriginal}.00 USD</s>}
                </div>
              </div>

              {/* Ink Capacity Toggle */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Ink Capacity</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['500ml', '250ml'] as Capacity[]).map(cap => (
                    <button key={cap} onClick={() => setCapacity(cap)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${capacity === cap ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Selector */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Options:</p>
                <div className="flex flex-col gap-2">
                  {capacity === '500ml'
                    ? VARIANTS_500.map(v => (
                      <button key={v.key} onClick={() => setVariant500Key(v.key)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 font-semibold transition-all text-sm flex justify-between items-center ${variant500Key === v.key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        <span>{v.label}</span>
                        <span className="font-bold">${v.price}.00</span>
                      </button>
                    ))
                    : VARIANTS_250.map(v => (
                      <button key={v.key} onClick={() => setVariant250Key(v.key)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 font-semibold transition-all text-sm flex justify-between items-center ${variant250Key === v.key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        <span>{v.label}</span>
                        <span className="font-bold">${v.price}.00{v.originalPrice ? <s className="ml-2 text-gray-400 font-normal">${v.originalPrice}</s> : null}</span>
                      </button>
                    ))
                  }
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">Add to cart</button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span><span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]"><a href="#" className="text-xs text-blue-500 underline hover:text-blue-600 transition">More payment options</a></div>

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

      {/* Info Sections */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">PROCOLORED INK</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage Life</h2>
              <p className="text-gray-600 text-sm leading-relaxed">For DTF printing, the inks and materials used are crucial — they need to be compatible with the printer's transfer curve. The inks typically have a limited shelf life, after which performance can start to degrade.</p>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">It's a good practice to check the expiration date on the DTF inks you receive from Procolored. Using expired inks could result in poor print quality, adhesion issues, or other problems. If the inks have expired, Procolored promises to provide a replacement or compensation.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-black text-gray-900 mb-2">12</div>
                <div className="text-lg font-bold text-gray-600">MONTHS</div>
                <div className="text-sm text-gray-500 mt-1">Storage Life</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex items-center justify-center order-last md:order-first">
              <img src={IMAGE_500} alt="Procolored Ink" className="w-48 h-48 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">PROCOLORED INK</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Designated for Procolored Printer</h2>
              <p className="text-gray-600 text-sm leading-relaxed">With specific chemical components, viscosity setting and drying speed, Procolored DTF inks are designed to perfectly fit Procolored films and printers.</p>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">We highly recommend to use original and genuine Procolored DTF inks to guarantee 100% compatibility with your Procolored printers. Applying DTF inks of other brands may cause irreversible harm to ink-contact printer components. Such damages like print head blockage are NOT included in Procolored warranty coverage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 3 reviews</p>
            </div>
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
            {REVIEWS.map((r,i) => (
              <div key={i} className="py-6 flex flex-col md:flex-row gap-4 md:gap-12 w-full">
                <div className="w-full md:w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s<=r.rating?'fill-yellow-400 text-yellow-400':'text-gray-300'}`} />)}</div>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-2">{r.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
