import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const IMAGES = [
  'https://www.procolored.com/cdn/shop/files/13___1_16_1220x_crop_center.png?v=1742957284',
  'https://www.procolored.com/cdn/shop/files/even_heating1.png?v=1747730084&width=550',
  'https://www.procolored.com/cdn/shop/files/oven_Air_filter.png?v=1747728576&width=550',
  'https://www.procolored.com/cdn/shop/files/oven_cleaning.png?v=1747729316&width=550',
  'https://www.procolored.com/cdn/shop/files/power_supply1.png?v=1747730264&width=550',
];

const STEPS = [
  { label: '① Adjust design', time: '15–20 seconds', img: 'https://www.procolored.com/cdn/shop/files/step1_690x_crop_center.png?v=1720124978' },
  { label: '② Print', time: '5–8 mins', img: 'https://www.procolored.com/cdn/shop/files/2_f4ff0220-179d-4450-9f70-b6f1e86ce9b2_690x_crop_center.png?v=1734941514' },
  { label: '③ Spread powder', time: '5 seconds', img: 'https://www.procolored.com/cdn/shop/files/step3_690x_crop_center.png?v=1720124979' },
  { label: '④ Oven dry', time: '3 mins', img: 'https://www.procolored.com/cdn/shop/files/step4_690x_crop_center.png?v=1720124979' },
  { label: '⑤ Heat press', time: '20 seconds', img: 'https://www.procolored.com/cdn/shop/files/step5_690x_crop_center.png?v=1720124979' },
  { label: '⑥ Peel off film', time: '3 seconds', img: 'https://www.procolored.com/cdn/shop/files/step6_690x_crop_center.png?v=1720124979' },
];

const FEATURES = [
  {
    title: 'Even Heating',
    desc: 'The upgraded oven features improved heating technology that ensures even heat distribution, resulting in better printing results.',
    img: 'https://www.procolored.com/cdn/shop/files/even_heating1.png?v=1747730084&width=550',
  },
  {
    title: 'Integrated Exhaust Filter',
    desc: 'The oven comes with an integrated exhaust filter, eliminating the need for users to purchase an additional filter purifier and providing a cleaner printing environment.',
    img: 'https://www.procolored.com/cdn/shop/files/oven_Air_filter.png?v=1747728576&width=550',
  },
  {
    title: 'Convenient Cleaning',
    desc: 'The upgraded internal structure of the oven makes it easier and more convenient for users to clean, saving them time and effort.',
    img: 'https://www.procolored.com/cdn/shop/files/oven_cleaning.png?v=1747729316&width=550',
  },
  {
    title: 'Integrated Power Supply Design',
    desc: 'The Procolored oven features an integrated power supply design that ensures safer use of electricity. Additionally, it allows for easy switching between 110V and 220V power supply environments, making it suitable for users in different regions or countries.',
    img: 'https://www.procolored.com/cdn/shop/files/power_supply1.png?v=1747730264&width=550',
  },
];

const REVIEWS = [
  { name: 'Tyler B.', date: '03/22/2026', title: 'Solid upgrade from my old oven', text: 'The even heating alone makes this worth it. I used to get patchy transfers but now every sheet comes out consistent. The integrated filter is a nice bonus — way less smell than my old setup.', rating: 5 },
  { name: 'Lindsey O.', date: '03/14/2026', title: 'Easy to use, easy to clean', text: 'I love how easy the inside is to wipe down. My old oven was a nightmare to maintain. This one took me 10 minutes to clean after a full day of printing. Great product for the price point.', rating: 5 },
  { name: 'RafaelDTF', date: '02/28/2026', title: 'Handles 13" film perfectly', text: 'Running full gang sheets daily on this. The working area is just right and the temperature is rock solid. Switched from 110V to 220V easily when I moved studios. Top quality.', rating: 5 },
  { name: 'AmyG_Prints', date: '02/15/2026', title: 'Good value for the upgrade', text: 'I bought the previous model and this is a noticeable improvement in both heating speed and air quality. Would have liked a bigger working area but for the price it does exactly what I need.', rating: 4 },
];

function Lightbox({ images, startIdx, onClose }: { images: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, prev, next]);
  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
      <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><ChevronLeft className="w-6 h-6" /></button>
      <img src={images[idx]} onClick={e => e.stopPropagation()} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" alt="" />
      <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><ChevronRight className="w-6 h-6" /></button>
    </div>
  );
}

export default function OvenUpgraded() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handleAddToCart = () => {
    addToCart({ id: 'oven-upgraded', name: 'Procolored Oven For DTF Printer - Upgraded', price: '$USD:599', image: IMAGES[0], quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Hero */}
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored Oven For DTF Printer - Upgraded
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                  {IMAGES.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? 'border-gray-800' : 'border-gray-100 hover:border-gray-300'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
                <div className="order-1 md:order-2 flex-1 relative bg-white rounded-2xl md:border md:border-gray-100 overflow-hidden group cursor-zoom-in"
                  onClick={() => setLightboxIdx(activeImg)}>
                  <img src={IMAGES[activeImg]} alt="Oven Upgraded" className="w-full h-auto md:h-full object-contain p-2 md:p-6 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full opacity-50 hover:opacity-100 transition shadow-sm">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </div>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p === 0 ? IMAGES.length - 1 : p - 1)); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 z-10">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p === IMAGES.length - 1 ? 0 : p + 1)); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 z-10">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored Oven For DTF Printer - Upgraded
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">4.85 out of 5 — 4 reviews</a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">$599.00 USD</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                The Upgraded Procolored DTF Oven combines improved even heating, an integrated exhaust filter, and a switchable 110V/220V power supply — delivering a cleaner, faster, and more consistent curing experience from day one.
              </p>

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">
                  Add to cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span>
                  <span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]">
                <a href="#" className="text-xs text-blue-500 underline hover:text-blue-600 transition">More payment options</a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-xs text-gray-600 mt-2">
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

      {/* Features */}
      {FEATURES.map((feat, i) => (
        <section key={i} className={`py-14 ${i % 2 === 0 ? 'bg-gray-50 border-t border-gray-100' : 'bg-white'}`}>
          <div className={`max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center ${i % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={feat.img} alt={feat.title} className="w-full h-80 object-cover" />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-gray-900">{feat.title}</h2>
              <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        </section>
      ))}

      {/* Printing Steps */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Printing Step</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                  <img src={step.img} alt={step.label} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-3 text-center">
                  <p className="font-bold text-gray-800 text-xs md:text-sm">{step.label}</p>
                  <p className="text-gray-500 text-[11px] mt-1">{step.time}</p>
                </div>
              </div>
            ))}
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
              <span className="text-xl font-extrabold text-gray-900">4.85 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 4 reviews</p>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {[[5,'75%',3],[4,'25%',1],[3,'0%',0],[2,'0%',0],[1,'0%',0]].map(([stars, pct, count], i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= (stars as number) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="bg-yellow-400 h-full rounded-full" style={{width: pct as string}} /></div>
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
            {REVIEWS.map((r, i) => (
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
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
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

      {lightboxIdx !== null && <Lightbox images={IMAGES} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
