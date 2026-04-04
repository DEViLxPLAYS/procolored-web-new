import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const IMAGES = [
  'https://www.procolored.com/cdn/shop/files/ProcoloredAutoHeatPressMachine_4_1220x_crop_center.png?v=1774683303',
];

const SPECS = [
  ['Machine Type', 'Automatic Swing-Away Heat Press'],
  ['Print Area', '15" × 15" (38 × 38 cm)'],
  ['Temperature Range', '0–300 °C / 32–572 °F'],
  ['Time Range', '0–999 seconds'],
  ['Pressure Adjustment', 'Auto Digital Adjustment'],
  ['Heating Plate', 'Double-sided heating'],
  ['Power', '1800 W'],
  ['Voltage', '110V / 220V optional'],
  ['Weight', '20 kg'],
  ['Certifications', 'CE / FCC Certified'],
];

const FEATURES = [
  ['Auto Swing-Away', 'Plates swing away automatically for safe, easy item placement — reduces operator fatigue.'],
  ['15" × 15" Plate', 'Generous 15×15 inch heat plate handles full-size gang sheets and large garment transfers.'],
  ['Digital Pressure', 'Digitally controlled pressure eliminates guesswork when changing between fabrics.'],
  ['Even Heating', 'Double-sided heating element ensures uniform temperature across the entire plate surface.'],
];

const REVIEWS = [
  { name: 'Tommy B.', date: '03/18/2026', title: 'Perfect for DTF transfers', text: 'Been using this for 3 weeks and the transfers come out clean every time. The auto pressure adjustment means I don\'t have to guess like with my old manual press. Temperature is accurate and stays consistent.', rating: 5 },
  { name: 'CrystalPrint', date: '03/05/2026', title: 'Solid and well built', text: 'Heavy machine but you can tell it\'s built for commercial use. The digital display is clear, the swing-away arm is smooth and the 15x15 plate is generous for gang sheets.', rating: 5 },
  { name: 'HeatherG', date: '02/20/2026', title: 'Great upgrade from my old press', text: 'The auto adjustment is a game changer. I love not having to fiddle with knobs every time I change materials. Even heat distribution — no cold spots at the edges.', rating: 5 },
];

function Lightbox({ images, startIdx, onClose }: { images: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, prev, next]);
  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
        <X className="w-5 h-5" />
      </button>
      <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <img src={images[idx]} onClick={e => e.stopPropagation()} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" alt="" />
      <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default function H15HeatPress() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handleAddToCart = () => {
    addToCart({
      id: 'h15-heat-press',
      name: 'Procolored H15 Auto Heat Press Machine',
      price: '$329.00',
      image: IMAGES[0],
      quantity: 1,
    });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored H15 Auto Heat Press Machine
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div
                className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-zoom-in"
                onClick={() => setLightboxIdx(0)}
              >
                <img
                  src={IMAGES[0]}
                  alt="H15 Auto Heat Press Machine"
                  className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/f3f4f6/9ca3af?text=H15+Heat+Press'; }}
                />
                <div className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full opacity-50 hover:opacity-100 transition shadow-sm">
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <span className="inline-block bg-[#98db51] text-white text-xs font-bold px-2 py-0.5 rounded mb-3 uppercase tracking-wide">
                  New Arrival
                </span>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored H15 Auto Heat Press Machine
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">
                    5.0 out of 5 — 3 reviews
                  </a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">$329.00 USD</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                The H15 features automatic swing-away mechanics and a precision digital pressure adjustment system — no manual guessing. A 15" × 15" even-heating plate ensures consistent DTF transfer quality on every press.
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {FEATURES.map(([title, desc]) => (
                  <div key={title} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="font-bold text-gray-900 mb-1 text-xs">{title}</p>
                    <p className="text-gray-600 text-xs">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span className="text-[15px]">Buy with</span>
                  <span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]">
                <a href="#" className="text-xs text-blue-500 underline hover:text-blue-600 transition">
                  More payment options
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-xs text-gray-600">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Shop with Confidence!</p>
                  <ul className="list-disc pl-4 space-y-1 mb-2">
                    <li>100% Protection Against Shipping Mishaps</li>
                  </ul>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    WORRY-FREE PURCHASE BY <span className="text-blue-500 lowercase font-medium">seel</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Technical Specifications</h2>
          <div className="bg-[#FFF4F2] rounded-2xl p-6 lg:p-10 border border-red-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              {SPECS.map(([label, value], i) => (
                <div key={i} className="border-b border-white py-4 flex items-center justify-between">
                  <span className="font-bold text-gray-900">{label}</span>
                  <span className="text-gray-600 text-right text-sm">{value}</span>
                </div>
              ))}
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
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 3 reviews</p>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {([[5, '100%', 3], [4, '0%', 0], [3, '0%', 0], [2, '0%', 0], [1, '0%', 0]] as [number, string, number][]).map(([stars, pct, count], i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: pct }} />
                  </div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-sm transition rounded">
                Write a review
              </button>
              <button className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold text-sm transition rounded">
                Ask a question
              </button>
            </div>
          </div>
          <div className="flex justify-start mb-6 border-b border-gray-200 pb-2">
            <button className="text-sm text-yellow-500 font-bold flex items-center gap-1">
              Most Recent <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {REVIEWS.map((r, i) => (
              <div key={i} className="py-6 flex flex-col md:flex-row gap-4 md:gap-12">
                <div className="w-full md:w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
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

      {lightboxIdx !== null && (
        <Lightbox images={IMAGES} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </div>
  );
}
