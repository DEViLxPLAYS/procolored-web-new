import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─── Constants & Data ────────────────────────────────────────────────────────
const BASE_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/Procolored_T8_Panda_DTG_Printer_8.2_A4_L800_2_1220x_crop_center.png?v=1743065325',
  'https://www.procolored.com/cdn/shop/files/Procolored_T8_Panda_DTG_Printer_8.2_A4_L800_1_1220x_crop_center.png?v=1743065325'
];

interface Variant {
  id: string;
  name: string;
  shortName: string;
  price: number;
  originalPrice?: number;
  img1: string;
}

const VARIANTS: Variant[] = [
  {
    id: 't8-dtg',
    name: 'Procolored T8 Panda DTG Printer 8.2" A4 L800',
    shortName: 'Without jig',
    price: 3599,
    img1: BASE_IMAGES[0]
  },
  {
    id: 't8-dtg-jig',
    name: 'Procolored T8 Panda DTG Printer 8.2" A4 L800 & Clothes Jig',
    shortName: 'With clothes jig',
    price: 3699,
    originalPrice: 3719,
    img1: BASE_IMAGES[1]
  }
];

const REVIEWS = [
  { name: 'Customer', date: '05/07/2024', title: '', text: "Como comprar alguien q me ayude\nAlguien qm ayude como comprar una impresora de sublimación", photos: 0 },
  { name: 'ColonJeffre', date: '01/10/2022', title: 'Reviewed in England on December 2, 2021', text: "This is the first time I've bought something this big from abroad via the internet, it looks ok, it's wrapped in a wooden box, I haven't opened it yet", photos: 1 },
  { name: 'Leslie De La Cruz', date: '01/10/2022', title: 'Reviewed in the United States on November 9, 2021', text: "nice printer, amazing delivery speed, received in less than a week!", photos: 1 },
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

export default function T8PandaProduct() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [vIdx, setVIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const variant = VARIANTS[vIdx];
  const images = BASE_IMAGES;

  useEffect(() => { setActiveImg(0); }, [vIdx]);

  const handleAddToCart = () => {
    addToCart({ id: variant.id, name: variant.name, price: `$USD:${variant.price}`, image: variant.img1, quantity: 1 });
  };

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored T8 Panda DTG Printer 8.2" A4 L800
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left: Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? 'border-gray-800' : 'border-gray-100 hover:border-gray-300'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>

                <div className="order-1 md:order-2 flex-1 relative bg-white rounded-2xl md:border md:border-gray-100 overflow-hidden group cursor-zoom-in"
                  onClick={() => setLightboxIdx(activeImg)}>
                  <img src={images[activeImg]} alt="T8 Panda" className="w-full h-auto md:h-full object-contain p-2 md:p-6 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full opacity-50 hover:opacity-100 transition shadow-sm">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </div>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p === 0 ? images.length - 1 : p - 1)); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 z-10">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p === images.length - 1 ? 0 : p + 1)); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 z-10">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-2 pb-4 border-b border-gray-100">
                <span className="text-sm font-bold bg-black text-white px-4 py-1.5 rounded-full flex items-center gap-1.5"><span className="text-[10px]">📦</span> Packages</span>
                <span className="text-sm font-bold text-gray-500 hover:text-gray-900 cursor-pointer flex items-center gap-1.5"><span className="text-[10px]">▶</span> Videos</span>
                <span className="text-sm font-bold text-gray-500 hover:text-gray-900 cursor-pointer flex items-center gap-1.5"><span className="text-[10px]">🖼</span> Features</span>
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored T8 Panda DTG Printer 8.2" A4 L800
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}<Star className="w-4 h-4 text-yellow-400" style={{clipPath: 'polygon(0 0, 67% 0, 67% 100%, 0 100%)', backgroundColor: '#facc15'}} /></div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">4.67 out of 5 — 3 reviews</a>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">${variant.price.toLocaleString()}.00 USD</span>
                  {variant.originalPrice && (
                    <>
                      <s className="text-xl text-gray-400 font-medium">${variant.originalPrice.toLocaleString()}.00 USD</s>
                      <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded-full">-${(variant.originalPrice - variant.price).toLocaleString()}.00 off</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <span className="font-extrabold text-gray-900 text-base">Choose Jig:</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {VARIANTS.map((v, i) => (
                    <button key={v.id} onClick={() => setVIdx(i)}
                      className={`relative w-full flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        vIdx === i ? 'border-orange-500 text-orange-600 font-bold' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                      }`}>
                      {v.shortName}
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

      {/* Overview / Banner (Skipped banner, straight to features as reference screenshot) */}
      
      {/* Feature 1 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl overflow-hidden">
          <div className="w-full h-full min-h-[300px]">
            <img src="https://www.procolored.com/cdn/shop/files/cooling-system_1280x_crop_center.png?v=1724484188" alt="Cooling System" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cooling System</h2>
            <p className="text-gray-600 leading-relaxed">
              Advanced air-cooling design, also a new thermal design with heat dissipation performance twice as efficient as its previous generation with a lower running sound.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="p-8 lg:p-12 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Adjustable Printing Height</h2>
            <p className="text-gray-600 leading-relaxed">
              Printable height ranges from 0-110mm, with built-in infrared height sensor, providing automatic adjustment and effectively protecting print head.
            </p>
          </div>
          <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-2xl overflow-hidden order-1 md:order-2">
            <img src="https://www.procolored.com/cdn/shop/files/T8-adjust_height_3fd7849a-bf4c-4723-a305-2335b18723c4_1280x_crop_center.png?v=1743069176" alt="Adjustable Height" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="w-full h-full min-h-[300px] border border-red-200 rounded-2xl overflow-hidden">
            <img src="https://www.procolored.com/cdn/shop/files/procolored_White_ink_circulation_1280x_crop_center.jpg?v=1640576893" alt="White Ink Circulation" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">White Ink Automatic Circulation</h2>
            <p className="text-gray-600 leading-relaxed">
              Patented white ink circulation technology, which works continuously and effectively to prevent the nozzle from clogging, extending print head lifetime by 50% compared to traditional printers.
            </p>
          </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Parameters</h2>
          
          <div className="bg-[#FFF4F2] rounded-2xl p-6 lg:p-10 border border-red-100 text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Printhead</span><span className="text-gray-600 text-right">L800</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Configuration</span><span className="text-gray-600 text-right">Single-Array</span></div>
              
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Print Accuracy</span><span className="text-gray-600 text-right">1440*1400 DPI (8 Pass)</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Print Size</span><span className="text-gray-600 text-right">210*297 mm</span></div>
              
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Applicable System</span><span className="text-gray-600 text-right">Windows OS</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Print Speed</span><span className="text-gray-600 text-right">Letter/A4: 23min</span></div>
              
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Prints Per Hour</span><span className="text-gray-600 text-right">3 pcs</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Ink Consumption</span><span className="text-gray-600 text-right">Letter/A4: 1.5ml</span></div>
              
              <div className="py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Software</span><span className="text-gray-600 text-right">Pro RIP</span></div>
              <div className="py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Net Weight</span><span className="text-gray-600 text-right">73.9 lb(33.5 kg)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Printing Steps */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Printing Step</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                <img src="https://www.procolored.com/cdn/shop/files/20241113-161849_690x_crop_center.jpg?v=1731486099" alt="Design" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">① Design Pictures</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                <img src="https://www.procolored.com/cdn/shop/files/20241113-161857_690x_crop_center.jpg?v=1731486099" alt="Heat Press" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center text-sm md:text-base">② Heat Press the Fabric to Remove Wrinkles</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center py-8">
                <img src="https://www.procolored.com/cdn/shop/files/DTG-T8_4_690x_crop_center.png?v=1731404102" alt="Place" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center text-sm md:text-base">③ Place the printed items on the platform</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center py-8">
                <img src="https://www.procolored.com/cdn/shop/files/DTG-T8_5_690x_crop_center.png?v=1731404103" alt="Pre-treatment" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">④ Spray Pre-treatment Liquid</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                <img src="https://www.procolored.com/cdn/shop/files/20241112-181501_690x_crop_center.jpg?v=1731406649" alt="Software" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">⑤ Set software then click print</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG-T8_6_690x_crop_center.png?v=1731404102" alt="Finish" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">⑥ Finish</p></div>
            </div>
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
                {[1,2,3,4].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
                <Star className="w-6 h-6 text-yellow-400" style={{clipPath: 'polygon(0 0, 67% 0, 67% 100%, 0 100%)', backgroundColor: '#facc15'}} />
              </div>
              <span className="text-xl font-extrabold text-gray-900">4.67 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 3 reviews</p>
            </div>
            <div className="md:col-span-1 flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /></div>
                <div className="w-full h-3 bg-gray-200"><div className="bg-yellow-400 h-full" style={{width: '66%'}}></div></div><span>2</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 text-gray-300" /></div>
                <div className="w-full h-3 bg-gray-200"><div className="bg-yellow-400 h-full" style={{width: '33%'}}></div></div><span>1</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 text-gray-300" /><Star className="w-3 h-3 text-gray-300" /></div>
                <div className="w-full h-3 bg-gray-200"></div><span>0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 text-gray-300" /><Star className="w-3 h-3 text-gray-300" /><Star className="w-3 h-3 text-gray-300" /></div>
                <div className="w-full h-3 bg-gray-200"></div><span>0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 text-gray-300" /><Star className="w-3 h-3 text-gray-300" /><Star className="w-3 h-3 text-gray-300" /><Star className="w-3 h-3 text-gray-300" /></div>
                <div className="w-full h-3 bg-gray-200"></div><span>0</span>
              </div>
            </div>
            <div className="md:col-span-1 flex flex-col gap-3 justify-center pl-4">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-sm transition">Write a review</button>
              <button className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold text-sm transition">Ask a question</button>
            </div>
          </div>

          <div className="border-t border-gray-200 py-6">
            <p className="text-sm text-gray-500 font-bold mb-4">Customer photos & videos</p>
            <div className="flex gap-2">
              <div className="w-20 h-20 bg-gray-200 border border-gray-300"><img src="https://www.procolored.com/cdn/shop/files/T8-adjust_height_3fd7849a-bf4c-4723-a305-2335b18723c4_1280x_crop_center.png?v=1743069176" alt="" className="w-full h-full object-cover" /></div>
              <div className="w-20 h-20 bg-gray-200 border border-gray-300"><img src="https://www.procolored.com/cdn/shop/files/procolored_White_ink_circulation_1280x_crop_center.jpg?v=1640576893" alt="" className="w-full h-full object-cover" /></div>
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
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  {r.title && <p className="font-bold text-gray-900 text-sm mb-2">{r.title}</p>}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{r.text}</p>
                  {r.photos > 0 && (
                    <div className="flex gap-2">
                      <div className="w-20 h-20 bg-gray-200 border border-gray-300"><img src="https://www.procolored.com/cdn/shop/files/Procolored_T8_Panda_DTG_Printer_8.2_A4_L800_1_1220x_crop_center.png?v=1743065325" alt="" className="w-full h-full object-cover" /></div>
                    </div>
                  )}
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
