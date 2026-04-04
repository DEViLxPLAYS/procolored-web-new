import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type SizeKey = 'A3' | 'A4';
type JigKey = 'Jigs Set' | 'Cylindrical Jig' | 'Golf Jig' | 'Pen Jig' | 'Phone Case Jig';

interface JigVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  available: boolean;
  comingSoon?: boolean;
}

const VARIANTS: Record<SizeKey, Record<JigKey, JigVariant>> = {
  A3: {
    'Jigs Set': { id: 'jigs-a3-set', name: 'A3 Jigs Set', price: 799, originalPrice: 849, available: true },
    'Cylindrical Jig': { id: 'jigs-a3-cyl', name: 'A3 Cylindrical Jig', price: 219, available: false, comingSoon: true },
    'Golf Jig': { id: 'jigs-a3-golf', name: 'A3 Golf Jig', price: 219, available: false, comingSoon: true },
    'Pen Jig': { id: 'jigs-a3-pen', name: 'A3 Pen Jig', price: 219, available: false, comingSoon: true },
    'Phone Case Jig': { id: 'jigs-a3-phone', name: 'A3 Phone Case Jig', price: 59, available: false, comingSoon: true },
  },
  A4: {
    'Jigs Set': { id: 'jigs-a4-set', name: 'A4 Jigs Set (Phone Case, Cylindrical, Golf, Pen)', price: 699, available: true },
    'Cylindrical Jig': { id: 'jigs-a4-cyl', name: 'A4 Cylindrical Jig', price: 219, available: true },
    'Golf Jig': { id: 'jigs-a4-golf', name: 'A4 Golf Jig', price: 219, available: true },
    'Pen Jig': { id: 'jigs-a4-pen', name: 'A4 Pen Jig', price: 219, available: true },
    'Phone Case Jig': { id: 'jigs-a4-phone', name: 'A4 Phone Case Jig', price: 59, available: true },
  },
};

const COMPATIBILITY_TABLE = [
  { size: 'A3', jig: 'Phone Case Jig', printers: 'V4, V6, V11, V11 Pro, V13 Pro, V23 Max' },
  { size: 'A3', jig: 'Cylindrical Jig', printers: 'V11, V11 Pro, V13 Pro' },
  { size: 'A3', jig: 'Golf Jig', printers: 'V11, V11 Pro, V13 Pro, V23 Max' },
  { size: 'A3', jig: 'Pen Jig', printers: 'V11, V11 Pro, V13 Pro, V23 Max' },
  { size: 'A3', jig: 'Mug Jig', printers: 'V11, V11 Pro, V13 Pro, V23 Max' },
  { size: 'A4', jig: 'Phone Case Jig', printers: 'V4, V6, V11, V11 Pro, V13 Pro, V23 Max' },
  { size: 'A4', jig: 'Cylindrical Jig', printers: 'V6' },
  { size: 'A4', jig: 'Golf Jig', printers: 'V6' },
  { size: 'A4', jig: 'Pen Jig', printers: 'V6' },
];

const MAIN_IMAGE = 'https://www.procolored.com/cdn/shop/files/UV_Jigs_Set_3_1220x_crop_center.png?v=1752464535';
const JIG_ICONS: Record<JigKey, string> = {
  'Jigs Set': 'Set',
  'Cylindrical Jig': 'Cyl',
  'Golf Jig': 'Golf',
  'Pen Jig': 'Pen',
  'Phone Case Jig': 'Phone',
};

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

export default function UVPrinterJigs() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [size, setSize] = useState<SizeKey>('A4');
  const [jigKey, setJigKey] = useState<JigKey>('Jigs Set');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const variant = VARIANTS[size][jigKey];

  const handleAddToCart = () => {
    if (!variant.available) return;
    addToCart({ id: variant.id, name: variant.name, price: `$USD:${variant.price}`, image: MAIN_IMAGE, quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  const jigKeys = Object.keys(VARIANTS[size]) as JigKey[];

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored Jigs For UV Printer
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-zoom-in" onClick={() => setLightboxIdx(0)}>
                <img src={MAIN_IMAGE} alt="UV Printer Jigs" className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full opacity-50 hover:opacity-100 transition shadow-sm">
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored Jigs For UV Printer
                </h1>
                <p className="text-sm text-gray-500 mb-4 font-medium">Solid & Stable · Precision Printing · Universal Compatibility</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">${variant.price.toLocaleString()}.00 USD</span>
                  {variant.originalPrice && (
                    <>
                      <s className="text-xl text-gray-400 font-medium">${variant.originalPrice.toLocaleString()}.00 USD</s>
                      <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded-full">-${(variant.originalPrice - variant.price)} off</span>
                    </>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Printer Size:</p>
                <div className="flex gap-3 mb-4">
                  {(['A4', 'A3'] as SizeKey[]).map(s => (
                    <button key={s} onClick={() => { setSize(s); setJigKey('Jigs Set'); }}
                      className={`px-6 py-2.5 rounded-lg border-2 font-bold transition-all text-sm ${size === s ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jig Type Selector */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Jig Type:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {jigKeys.map(key => {
                    const v = VARIANTS[size][key];
                    return (
                      <button key={key} onClick={() => setJigKey(key)}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all text-sm font-semibold gap-1 ${
                          jigKey === key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        } ${v.comingSoon ? 'opacity-60' : ''}`}>
                        <span className="text-xl">{JIG_ICONS[key]}</span>
                        <span className="text-xs text-center leading-tight">{key}</span>
                        <span className="text-xs font-bold text-gray-500">${v.price}</span>
                        {v.comingSoon && <span className="absolute top-1 right-1 text-[9px] bg-gray-200 text-gray-600 px-1 rounded-sm font-bold">SOON</span>}
                      </button>
                    );
                  })}
                </div>
                {size === 'A3' && jigKey !== 'Jigs Set' && (
                  <p className="text-xs text-gray-500 mt-2 font-medium">Note: For A3, only the Jigs Set is currently available. Individual jigs are coming soon.</p>
                )}
              </div>

              {variant.available ? (
                <div className="flex gap-4">
                  <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">
                    Add to cart
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                    <span className="text-[15px]">Buy with</span>
                    <span className="font-serif italic font-bold">shop</span>
                  </button>
                </div>
              ) : (
                <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3.5 rounded-lg cursor-not-allowed text-[15px]">
                  Coming Soon
                </button>
              )}
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

      {/* Overview */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Precision Jigs for Every Material</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                5 specialized jigs designed to hold and stabilize cylindrical materials, mugs, golf balls, phone cases, and pens during UV printing. Engineered for Procolored UV printers, these A3/A4 jigs combine high-temp resistant silicone with a reinforced metal frame to securely hold irregularly shaped objects. Eliminates shifting on curved, cylindrical, or delicate surfaces for flawless, high-resolution output.
              </p>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  'Universal Versatility — 5 Specialized Jigs: Phone Case, Cylindrical, Golf, Pen, and Mug',
                  'A4 Jigs Set contains 4 jig types; A3 Jigs Set contains all 5 (including Mug Jig)',
                  'Precision Engineered — rigid frame prevents warping; silicone conforms without scratching',
                  'Laser-Aligned Accuracy — works with auto-height sensors to eliminate ink misting',
                  'Full Printer Compatibility with Procolored UV printers',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['Phone Case Jig', 'Cylindrical Jig', 'Golf Jig', 'Pen Jig'] as JigKey[]).map(key => (
                <div key={key} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{key}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How to Print on Cylindrical Items with a Jig</h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.youtube.com/embed/_bHgErHECAs"
              title="How to Print on Cylindrical Items with a Jig"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Compatibility Table */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Printer Compatibility</h2>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900">Size</th>
                  <th className="py-4 px-6 font-bold text-gray-900">UV Jig</th>
                  <th className="py-4 px-6 font-bold text-gray-900">Printer Supported</th>
                </tr>
              </thead>
              <tbody>
                {COMPATIBILITY_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 font-semibold text-gray-700">{row.size}</td>
                    <td className="py-3 px-6 text-gray-700">{row.jig}</td>
                    <td className="py-3 px-6 text-gray-600">{row.printers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {lightboxIdx !== null && <Lightbox images={[MAIN_IMAGE]} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
