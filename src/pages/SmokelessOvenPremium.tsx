import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const IMAGES = [
  'https://www.procolored.com/cdn/shop/files/smoke-free_oven_1_1220x_crop_center.png?v=1756950087',
  'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/Activated_Carbon.jpg?v=1756539328',
  'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/High-Power_Fans.jpg?v=1756539667',
];

const FAQS = [
  {
    q: 'What is the Procolored Smokeless Oven?',
    a: 'The Procolored Smokeless Oven is the industry\'s first curing oven designed for small studios and limited spaces. It features an activated carbon filter system and sealed construction that removes up to 98% of odors and fine particles, greatly improving air quality while working.'
  },
  {
    q: 'How does it maintain even heating?',
    a: 'The dual high-power fan design works in tandem with precision temperature control to distribute heat evenly across the entire working area. From the initial heat-up phase to the final transfer stage, the internal temperature stays consistent for reliable, repeatable results every time.'
  },
  {
    q: 'Is it safe to use?',
    a: 'Yes. The oven features an overheat protection system that activates after 50 minutes of continuous use. The activated carbon filtration removes 98% of odors and fine particles, making it safe for home studios and small spaces. It also supports both 110V and 220V for global safety compliance.'
  },
  {
    q: 'Is cleaning and maintenance easy?',
    a: 'Absolutely. The oven\'s internal structure is designed for straightforward access so users can easily replace the activated carbon filter and wipe down internal surfaces. Regular maintenance takes just a few minutes and keeps the unit performing at peak efficiency.'
  },
  {
    q: 'What power does it support?',
    a: 'The Procolored Smokeless Oven supports AC 110–220V, drawing 820W at 220V and 650W at 110V, making it compatible with power standards across North America, Europe, and Asia.'
  },
  {
    q: 'What advantages does it have compared with other DTF ovens?',
    a: 'Unlike conventional DTF ovens, this model features the industry\'s first integrated activated carbon air-purification system, a dual-fan balanced heating design for zero hot spots, overheat protection, sleep mode, and a sealed casing that prevents odors from escaping into your workspace. It\'s purpose-built for indoor and small-space environments.'
  },
];

const REVIEWS = [
  { name: 'Marcus T.', date: '03/18/2026', title: 'Finally an oven I can run inside!', text: 'I\'ve been looking for a DTF oven I could use in my home studio for over a year. The smokeless design is absolutely legit — I ran it for 3 hours and my wife didn\'t even notice. Even heating is spot on, transfers come out perfect every time.', rating: 5 },
  { name: 'Priya M.', date: '03/10/2026', title: 'Great build quality and smart features', text: 'The sleep mode and overheat protection give me real peace of mind. The activated carbon filter is easy to swap out. I was skeptical about the "smokeless" claim but it really does eliminate almost all odors. Premium product for the price.', rating: 5 },
  { name: 'Jason K.', date: '02/28/2026', title: 'Consistent results every batch', text: 'Running gang sheets daily with this oven and the temperature stability is impressive. No hot or cold spots that I\'ve found. The working area fits our 13" film perfectly. Support team was great when I had setup questions.', rating: 5 },
  { name: 'Sarah L.', date: '02/20/2026', title: 'Upgrade from my old oven — worth it', text: 'Switched from a basic DTF oven and the difference in air quality alone makes it worth it. The dual fans also heat up much faster. My prints are crisper and transfer times are more consistent.', rating: 4 },
  { name: 'DavidPrint', date: '02/05/2026', title: 'Good machine, takes a day to dial in', text: 'First couple batches I was tweaking temps but once I found my sweet spot at 130°C the transfers come out flawless. Build quality feels solid. Would definitely buy again.', rating: 4 },
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

export default function SmokelessOvenPremium() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleAddToCart = () => {
    addToCart({ id: 'smokeless-oven-premium', name: 'Procolored Smokeless Oven for DTF Printer - Premium', price: '$USD:999', image: IMAGES[0], quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  const specs = [
    ['Heating Temperature', '0–140 °C (32°F–284°F)'],
    ['Overheat Protection', 'Yes (>50 min)'],
    ['Voltage', 'AC 110–220V'],
    ['Power', '820W (220V) / 650W (110V)'],
    ['Oven Size', '23.6″ × 15.7″ × 6.7″'],
    ['Working Area', '13.0″ × 16.5″'],
    ['Package Size', '33.5″ × 22.4″ × 13.4″'],
    ['Timer', 'Yes'],
    ['Sleep Mode', 'Yes'],
    ['Air Purifier', 'Yes'],
    ['Net Weight', '21.4 KG'],
    ['Gross Weight', '28.5 KG'],
  ];

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Hero / Product Section */}
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored Smokeless Oven for DTF Printer - Premium
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
                  <img src={IMAGES[activeImg]} alt="Smokeless Oven Premium" className="w-full h-auto md:h-full object-contain p-2 md:p-6 transition-transform duration-300 group-hover:scale-105" />
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
                  Procolored Smokeless Oven for DTF Printer - Premium
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">4.8 out of 5 — 5 reviews</a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">$999.00 USD</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                The apparel printing industry's first smokeless oven — engineered for home studios and small spaces. Activated carbon filtration, dual high-power fans, and superior sealing remove virtually all odors and ensure fresh air quality throughout every print run.
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
                  <ul className="list-disc pl-4 space-y-1 mb-2">
                    <li>100% Protection Against Shipping Mishaps</li>
                  </ul>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WORRY-FREE PURCHASE® BY <span className="text-blue-500 lowercase font-medium">seel</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1 — Even Heating + Video */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Improved Even Heating</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">From initial heat-up to the final transfer stage, every step is designed for stable, efficient, and outstanding results.</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <video
              src="https://cdn.shopify.com/videos/c/o/v/f10c570d071e46b1be46594d2e9c86aa.mp4"
              autoPlay muted loop playsInline
              className="w-full max-h-[520px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature 2 — Filtration System */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Enhanced Filtration System</h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The apparel printing industry's first smokeless oven, designed for home studios and small spaces, utilizes activated carbon filtration, powerful dual fans, and superior sealing to remove virtually all odors and ensure fresh air quality.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/Activated_Carbon.jpg?v=1756539328" alt="Activated Carbon" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Activated Carbon</h3>
              <p className="text-gray-600 leading-relaxed text-sm">Activated Carbon Filter Cotton effectively absorbs 98% of odors generated during baking and filters out fine particles.</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/High-Power_Fans.jpg?v=1756539667" alt="High Power Fans" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">High-Power Fans</h3>
              <p className="text-gray-600 leading-relaxed text-sm">The powerful dual-fan design not only speeds up odor filtration at the source, but also balances the internal temperature of the oven.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 — DTF Workflow Video */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">DTF Transfer Workflow</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">A smoother printing experience with a simplified workflow, turning every idea into reality with ease.</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <video
              src="https://cdn.shopify.com/videos/c/o/v/d0cfb4bd1ce94b45a96cd1e22461cf41.mp4"
              autoPlay muted loop playsInline
              className="w-full max-h-[520px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Smokeless Oven Parameters</h2>
          <div className="bg-[#FFF4F2] rounded-2xl p-6 lg:p-10 border border-red-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              {specs.map(([label, value], i) => (
                <div key={i} className="border-b border-white py-4 flex items-center justify-between last:border-none">
                  <span className="font-bold text-gray-900">{label}</span>
                  <span className="text-gray-600 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden transition-all ${openFaq === i ? 'border-gray-300 shadow-md bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <button className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-gray-900" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-48 border-t border-gray-100' : 'max-h-0'}`}>
                  <div className="px-6 py-5 text-gray-600 leading-relaxed">{faq.a}</div>
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
            <div className="text-center md:col-span-1">
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-xl font-extrabold text-gray-900">4.8 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 5 reviews</p>
            </div>
            <div className="md:col-span-1 flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {[[5,'80%',4],[4,'20%',1],[3,'0%',0],[2,'0%',0],[1,'0%',0]].map(([stars, pct, count], i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= (stars as number) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="bg-yellow-400 h-full rounded-full" style={{width: pct as string}} /></div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <div className="md:col-span-1 flex flex-col gap-3 justify-center">
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
