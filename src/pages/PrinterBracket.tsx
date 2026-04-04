import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const VARIANTS = [
  { id: 'printer-bracket-no-winder', name: 'Printer Bracket — Without Winder', shortName: 'Without Winder', price: 499, img: 'https://www.procolored.com/cdn/shop/files/Printer_Bracket_For_Procolored_DTF_Pro_and_Mini_UV_DTF_Printers__1_1220x_crop_center.png?v=1743061512' },
  { id: 'printer-bracket-with-winder', name: 'Printer Bracket — With Winder (UV DTF Only)', shortName: 'With Winder (UV DTF Only)', price: 599, img: 'https://www.procolored.com/cdn/shop/files/Printer_Bracket_For_Procolored_DTF_Pro_and_Mini_UV_DTF_Printers_5_1220x_crop_center.png?v=1743061519' },
];

const REVIEWS = [
  { name: 'Kevin S.', date: '03/25/2026', title: 'No more wobbly setups', text: 'I was using a makeshift table before and the difference with this bracket is night and day. Very solid, the wheels lock firmly and the whole thing doesn\'t budge. Printer sits perfectly level. Assembly was straightforward.', rating: 5 },
  { name: 'Melissa P.', date: '03/12/2026', title: 'Great with the winder attached', text: 'Got the winder version for my UV DTF sticker printer and the film rolls up perfectly. Moving the whole station around the shop is so easy with the universal wheels. Very pleased.', rating: 5 },
  { name: 'Omar J.', date: '02/18/2026', title: 'Solid metal build, easy assembly', text: 'Built from quality sheet metal. Takes about 30 minutes to put together with the instructions. The winder motor runs smooth and the whole bracket feels like it\'ll last years. Worth it.', rating: 5 },
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

export default function PrinterBracket() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [vIdx, setVIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const variant = VARIANTS[vIdx];
  const images = VARIANTS.map(v => v.img);

  const handleAddToCart = () => {
    addToCart({ id: variant.id, name: variant.name, price: `$USD:${variant.price}`, image: variant.img, quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Printer Bracket For Procolored DTF Pro and Mini UV DTF Printers
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setVIdx(i)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${vIdx === i ? 'border-gray-800' : 'border-gray-100 hover:border-gray-300'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
                <div className="order-1 md:order-2 flex-1 relative bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-zoom-in" onClick={() => setLightboxIdx(vIdx)}>
                  <img src={variant.img} alt="Printer Bracket" className="w-full h-auto md:h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full opacity-50 hover:opacity-100 transition shadow-sm">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Printer Bracket For Procolored DTF Pro and Mini UV DTF Printers
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.0 out of 5 — 3 reviews</a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">${variant.price.toLocaleString()}.00 USD</span>
                </div>
              </div>

              {/* Variant Selector */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Choose Option:</p>
                <div className="grid grid-cols-2 gap-3">
                  {VARIANTS.map((v, i) => (
                    <button key={v.id} onClick={() => setVIdx(i)}
                      className={`w-full flex items-center justify-center p-3 rounded-lg border-2 transition-all text-sm font-semibold ${vIdx === i ? 'border-orange-500 text-orange-600' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'}`}>
                      {v.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                A heavy-duty printer stand designed for the VF13 Panda Sticker Printer and F13 Pro Panda Printer. Four universal wheels provide smooth mobility in any direction — no table needed. The optional film winder rapidly rolls up finished UV DTF stickers.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[['Size', '23.07 × 16.53 × 20.79 in (58.6 × 42 × 20.7 cm)'],['Material','Sheet Metal'],['Weight (Bracket)','11 kg'],['Weight (With Motor)','15 kg'],['Compatibility','VF13 Panda, F13 Pro Panda']].map(([k,v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{k}</p>
                    <p className="font-bold text-gray-900 text-sm">{v}</p>
                  </div>
                ))}
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Built for Your Print Station</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔩', title: 'Solid & Durable', desc: 'Heavy-gauge sheet metal construction ensures a stable base that won\'t flex or warp under the weight of your printer.' },
              { icon: '🛞', title: 'Universal Wheels', desc: 'Four omni-directional casters let you roll the entire station in any direction for easy repositioning in any workspace.' },
              { icon: '🌀', title: 'Film Winder (Optional)', desc: 'The motorized winder attachment rapidly rolls up finished UV DTF sticker output — available with the With Winder variant.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-3">
                <span className="text-4xl">{item.icon}</span>
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

      {lightboxIdx !== null && <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
