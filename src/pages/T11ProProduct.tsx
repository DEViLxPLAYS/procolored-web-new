import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─── Constants & Data ────────────────────────────────────────────────────────
const BASE_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/Procolored_T11_Pro_DTG_Printer_11.8_A3_Dual_TX800_1220x_crop_center.png?v=1743065082',
  'https://www.procolored.com/cdn/shop/products/A3-Pro-Dual-1_f4b4d4da-0eab-43e7-9674-578a05b678a8_1220x_crop_center.jpg?v=1743065082',
  'https://www.procolored.com/cdn/shop/products/DSC03639_17ee372d-a407-4638-b140-20c6f77e0fa2_1220x_crop_center.jpg?v=1743065082'
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
    id: 't11-base',
    name: 'Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800',
    shortName: 'Without jig',
    price: 5999,
    img1: BASE_IMAGES[0]
  },
  {
    id: 't11-clothes-jig',
    name: 'Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800 With clothes jig',
    shortName: 'With clothes jig',
    price: 6099,
    originalPrice: 6149,
    img1: BASE_IMAGES[1]
  },
  {
    id: 't11-500ml-jig',
    name: 'Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800 5*500ml With clothes jig',
    shortName: '5*500ml With clothes jig',
    price: 6299,
    originalPrice: 6349,
    img1: BASE_IMAGES[2]
  }
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

export default function T11ProProduct() {
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
            {' > '}Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800
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
                  <img src={images[activeImg]} alt="T11 Pro DTG" className="w-full h-auto md:h-full object-contain p-2 md:p-6 transition-transform duration-300 group-hover:scale-105" />
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
                  Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-gray-300" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">No reviews</a>
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

      {/* Feature 1 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl overflow-hidden">
          <div className="w-full h-full min-h-[300px]">
            <img src="https://www.procolored.com/cdn/shop/files/visable_windows_of_A3pro_dtg_printer_direct_to_garment_dtg_printing_2720x_crop_center.png?v=1639549155" alt="Visible Windows" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visible Windows</h2>
            <p className="text-gray-600 leading-relaxed">
              Visible printer working situations ; convenient for printer maintenance, assembly and disassembly.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="p-8 lg:p-12 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Filtration System</h2>
            <p className="text-gray-600 leading-relaxed">
              Filtering the dust in the air to make the surface of printed products smooth and blemish-free.
            </p>
          </div>
          <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-2xl overflow-hidden order-1 md:order-2">
            <img src="https://www.procolored.com/cdn/shop/files/filtering_system_of_A3Pro_dtg_printer_direct_to_garment_UV_printer_2878x_crop_center.png?v=1639548682" alt="Filtration System" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="w-full h-full min-h-[300px] border border-red-200 rounded-2xl overflow-hidden">
            <img src="https://www.procolored.com/cdn/shop/files/procolored_White_ink_circulation_1280x_crop_center.jpg?v=1640576893" alt="Ink Circulation" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ink Circulation, Prevent Nozzle Clogging</h2>
            <p className="text-gray-600 leading-relaxed">
              Theink circulation system is our patent technology, the continuous circulation system effectively prevent the nozzle from clogging, thus extend print head lifetime 50% compared to traditional printers.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 4 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="p-8 lg:p-12 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">High-Definition Printing Resolution</h2>
            <p className="text-gray-600 leading-relaxed">
              Using micro-voltage and intelligent inkdrop technology, color transition more smoothly, with printing accuracy less than 1mm, the image output shows rich details, color seamless transitions, almost achieve 100% restored effect.
            </p>
          </div>
          <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-2xl overflow-hidden order-1 md:order-2">
            <img src="https://www.procolored.com/cdn/shop/files/HD_Printing_dtf_printer_uv_printer_gtg_printer_1882x_crop_center.png?v=1639552525" alt="High-Definition Printing Resolution" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Parameters</h2>
          
          <div className="bg-[#FFF4F2] rounded-2xl p-6 lg:p-10 border border-red-100 text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Printhead</span><span className="text-gray-600 text-right">TX800</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Configuration</span><span className="text-gray-600 text-right">Dual-Array</span></div>
              
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Print Accuracy</span><span className="text-gray-600 text-right">720*1440 DPI (16 Pass)</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Print Size</span><span className="text-gray-600 text-right">Width: 11.7"(297mm)</span></div>
              
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Applicable System</span><span className="text-gray-600 text-right">Windows OS</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Print Speed</span><span className="text-gray-600 text-right">Letter/A4: 7.5min</span></div>
              
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Prints Per Hour</span><span className="text-gray-600 text-right">8 pcs</span></div>
              <div className="border-b border-white py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Ink Consumption</span><span className="text-gray-600 text-right">Letter/A4: 1.5ml</span></div>
              
              <div className="py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Software</span><span className="text-gray-600 text-right">Pro RIP</span></div>
              <div className="py-4 flex items-center justify-between"><span className="font-bold text-gray-900">Net Weight</span><span className="text-gray-600 text-right">154.3 lbs (70kg)</span></div>
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
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG_A3_Pro_Step_1_690x_crop_center.png?v=1708512769" alt="Design" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">① Design Pictures</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG_A3_Pro_Step_2_690x_crop_center.png?v=1708512787" alt="Spray Pre-treatment Liquid" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">② Spray Pre-treatment Liquid</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG_A3_Pro_Step_3_690x_crop_center.png?v=1708512803" alt="Heat Press" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">③ Heat Press</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG_A3_Pro_Step_4_690x_crop_center.png?v=1708512823" alt="Printing" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">④ Printing</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG_A3_Pro_Step_5_690x_crop_center.png?v=1708512840" alt="Heat Press" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-white"><p className="font-bold text-gray-800 text-center">⑤ Heat Press</p></div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img src="https://www.procolored.com/cdn/shop/files/DTG_A3_Pro_Step_6_690x_crop_center.png?v=1708512852" alt="Finish" className="w-full h-full object-cover" />
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
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 text-gray-300" />)}
              </div>
              <p className="text-gray-600 mt-2">Be the first to write a review</p>
            </div>
            <div className="w-px h-16 bg-gray-200 hidden md:block"></div>
            <div className="flex flex-col gap-3 justify-center w-full max-w-[250px]">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-sm transition rounded">Write a review</button>
              <button className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold text-sm transition rounded">Ask a question</button>
            </div>
          </div>
        </div>
      </section>

      {lightboxIdx !== null && <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
