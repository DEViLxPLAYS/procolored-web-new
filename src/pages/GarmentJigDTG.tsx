import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type SizeKey = 'A4' | 'A3';

const IMAGES: Record<SizeKey, string> = {
  A4: 'https://www.procolored.com/cdn/shop/files/10__1_16_1220x_crop_center.png?v=1743067592',
  A3: 'https://www.procolored.com/cdn/shop/files/10__1_16_1220x_crop_center.png?v=1743067592',
};

const PRICES: Record<SizeKey, number> = { A4: 129, A3: 139 };

const REVIEWS = [
  { name: 'Marcus T.', date: '03/20/2026', title: 'Perfect fit for my T8 Panda', text: 'This jig holds garments firmly while printing. The A4 size is just right for most t-shirts. Setup was easy and the results are clean and precise with no shifting during the print cycle.', rating: 5 },
  { name: 'SarahDTG', date: '03/08/2026', title: 'Great build quality', text: 'Solid construction, the locking mechanism keeps the garment taut throughout printing. I\'ve run hundreds of shirts with this and no wobble or misalignment at all. Highly recommend.', rating: 5 },
  { name: 'PrintProNJ', date: '02/14/2026', title: 'Worth every penny', text: 'Upgraded from a generic pallet and the difference is noticeable. The garment stays flat and the ink sits exactly where it should. My print rejection rate dropped significantly after switching to this jig.', rating: 5 },
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
      <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><ChevronLeft className="w-6 h-6" /></button>
      <img src={images[idx]} onClick={e => e.stopPropagation()} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" alt="" />
      <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><ChevronRight className="w-6 h-6" /></button>
    </div>
  );
}

export default function GarmentJigDTG() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [size, setSize] = useState<SizeKey>('A4');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handleAddToCart = () => {
    addToCart({ id: `garment-jig-dtg-${size.toLowerCase()}`, name: `Procolored ${size} Garment Jig For DTG Printer`, price: `$USD:${PRICES[size]}`, image: IMAGES[size], quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored A3/A4 Garment Jig For DTG Printer
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-zoom-in" onClick={() => setLightboxIdx(0)}>
                <img src={IMAGES[size]} alt="Garment Jig DTG" className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full opacity-50 hover:opacity-100 transition shadow-sm">
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored A3/A4 Garment Jig For DTG Printer
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.0 out of 5 — 3 reviews</a>
                </div>
                <div className="text-[2rem] font-extrabold text-red-600">${PRICES[size]}.00 USD</div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                A precision garment pallet designed for Procolored DTG printers. Holds fabric flat and taut for accurate, consistent ink placement across every print. Available in A3 and A4 sizes.
              </p>

              {/* Size Selector */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Print Size:</p>
                <div className="flex gap-3">
                  {(['A4', 'A3'] as SizeKey[]).map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`px-8 py-2.5 rounded-lg border-2 font-bold transition-all text-sm ${size === s ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {s} — ${PRICES[s]}.00
                    </button>
                  ))}
                </div>
              </div>

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

      {/* Features */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Built for Precision DTG Printing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Firm Garment Hold', desc: 'Keeps fabric flat and taut throughout the print cycle, preventing shifting and ensuring consistent ink placement.' },
              { title: 'A3 & A4 Sizes', desc: 'A4 for standard-size shirts and garments; A3 for larger format prints and oversized pieces.' },
              { title: 'Compatible with Procolored DTG Printers', desc: 'Designed specifically for Procolored T8 Panda and T11 Pro DTG printers — drop-in fit, no modification needed.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
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
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 3 reviews</p>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {[[5,'100%',3],[4,'0%',0],[3,'0%',0],[2,'0%',0],[1,'0%',0]].map(([stars, pct, count], i) => (
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

      {lightboxIdx !== null && <Lightbox images={[IMAGES[size]]} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
