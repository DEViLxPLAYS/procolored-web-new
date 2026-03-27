import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn, Truck, HelpCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─── Constants & Data ────────────────────────────────────────────────────────
const BASE_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/F8A4_01_1220x_crop_center.jpg?v=1766052998',
  'https://www.procolored.com/cdn/shop/files/Procolored_F8_Panda_DTF_Printer_8_5_1220x_crop_center.png?v=1766052998',
  'https://www.procolored.com/cdn/shop/files/Procolored_F8_Panda_DTF_Printer_8_6_1220x_crop_center.png?v=1766052998',
  'https://www.procolored.com/cdn/shop/files/Procolored_F8_Panda_DTF_Printer_8_4_1220x_crop_center.png?v=1766052998'
];

interface Variant {
  id: string;
  name: string;
  shortName: string;
  suffix: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  img1: string;
}

const VARIANTS: Variant[] = [
  {
    id: 'f8-base',
    name: 'Procolored F8 Panda DTF Printer 8.2" A4 L800',
    shortName: 'F8',
    suffix: '',
    price: 1899,
    img1: 'https://www.procolored.com/cdn/shop/files/F8A4_01_1220x_crop_center.jpg?v=1766052998'
  },
  {
    id: 'f8-oven',
    name: 'Procolored F8 Panda DTF Printer 8.2" A4 L800 & Oven',
    shortName: 'F8+Oven',
    suffix: '& Oven',
    price: 2399,
    badge: '🔥 Most Popular Choice',
    img1: 'https://www.procolored.com/cdn/shop/files/F8A4_03_1220x_crop_center.jpg?v=1759916273'
  },
  {
    id: 'f8-bundle',
    name: 'Procolored F8 Panda DTF Printer 8.2" A4 L800 & Complete Bundle',
    shortName: 'F8+Oven+Heat Press',
    suffix: '& Complete Bundle',
    price: 2699,
    originalPrice: 2749,
    img1: 'https://www.procolored.com/cdn/shop/files/Procolored_F8_Panda_DTF_Printer_8.2_A4_L800_Complete_Bundle_2_1220x_crop_center.png?v=1763607567'
  }
];

const PACKAGES = [
  { label: 'Printer Supplies ~$562', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_23fa8ae6-6fb0-4ca2-ba3e-a11804db4ecc.png?v=1758969178' },
  { label: 'Panda Heat Oven', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC__2.jpg?v=1756376420' },
  { label: 'Panda Heat Press', img: 'https://www.procolored.com/cdn/shop/files/1_ca318f76-eb86-455b-bf42-a892b152ea31_1220x_crop_center.jpg?v=1733221975' }
];

const FAQS = [
  {
    q: "What materials can I print on with the F8 DTF Printer?",
    a: "The Procolored F8 DTF printer is designed for direct-to-film printing and can transfer vibrant prints to a wide range of fabrics including cotton, polyester, blends, denim, canvas, and most fabric-based materials using the DTF heat transfer process."
  },
  {
    q: "Do I need special software to use the F8 DTF Printer?",
    a: "Yes, the F8 comes with Procolored RIP Software (Windows OS only). This professional PDF-engine software handles image splitting, grid algorithms, seamless copying, and ICC profile support. Minimum requirements: C drive ≥50GB, RAM ≥8GB."
  },
  {
    q: "How does the DTF printing process work?",
    a: "DTF (Direct-to-Film) printing involves 6 steps: design your artwork in RIP software → print onto PET film → shake adhesive powder onto wet ink → cure in oven → heat press transfer onto garment → peel off film. The entire process takes under 15 minutes per batch."
  },
  {
    q: "What size prints can the F8 handle?",
    a: "The F8 supports a maximum print width of 8.2\" (210mm) with roll-fed film, allowing continuous printing for longer designs. Ideal for A4/Letter-sized transfers at 1440×1440 DPI."
  },
  {
    q: "Can I use third-party inks or materials?",
    a: "Procolored strongly recommends using official Procolored DTF inks and PET films to ensure optimal print quality, prevent printhead clogging, and maintain your warranty. Third-party consumables may cause inconsistent results and void coverage."
  },
  {
    q: "What maintenance does the F8 printer require?",
    a: "The F8 features an Auto-Cleaning Printhead that runs automatically twice daily when powered on, using ~1ml of ink per cycle. Keep the printer powered on when idle. Regular nozzle checks and weekly cleaning cycles are recommended for peak performance."
  },
  {
    q: "Can beginners use the F8 DTF Printer?",
    a: "Absolutely. The F8 is designed with beginners in mind — no pretreatment required, straightforward 6-step process, comprehensive video tutorials, and full support from Procolored's customer and engineer teams. It's one of the most beginner-friendly DTF printers available."
  },
  {
    q: "What's the difference between F8 Gen-2 vs. F8 Gen-1?",
    a: "The F8 Gen-2 features an optimized chipset for smoother software-hardware communication, an upgraded roll film system supporting continuous printing, an improved Siphon® circulation system for better white ink flow, and a reinforced Printhead Safeguard System with photoelectric film detection — all while maintaining the same compact 10kg footprint."
  }
];

const REVIEWS = [
  { name: 'Anonymous', date: '11/21/2025', title: 'Incredible Quality and Amazing Support', text: "I recently got my hands on a pro-colored DTF printer, and I have to say it's been a game changer for my printing business. The print quality is fantastic, and the ease of use is just top-notch. Plus, their customer service is incredibly helpful — every question I had was answered quickly and thoroughly. I'd highly recommend it to anyone looking to step up their printing game, and I'll definitely be buying more from this company in the future." },
  { name: 'ROSARIO', date: '07/30/2024', title: 'It looks great!', text: "It looks great!", photos: 1 },
  { name: 'Mike', date: '07/18/2024', title: 'Game changer', text: "Very suitable DTF printer model for startups", photos: 1 },
  { name: 'Catherine', date: '07/18/2024', title: 'the best technical support!', text: "Very good friend thank you!", photos: 1 },
  { name: 'Esther', date: '07/18/2024', title: 'great product!', text: "I am so thankful! Thank you so much for such great product and even better costumer service!", photos: 2 },
  { name: 'James', date: '07/18/2024', title: 'Perfect for my small business', text: "The F8 fits perfectly on my desk and the print quality blew me away. Setup was easier than I expected." }
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function F8PandaProduct() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [vIdx, setVIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [boxOpen, setBoxOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [podTab, setPodTab] = useState(0);
  const [specTab, setSpecTab] = useState(0);

  const variant = VARIANTS[vIdx];
  const images = [variant.img1, ...BASE_IMAGES.slice(1)];

  // Reset active image if variant changes
  useEffect(() => { setActiveImg(0); }, [vIdx]);

  const handleAddToCart = () => {
    addToCart({ id: variant.id, name: variant.name, price: `$USD:${variant.price}`, image: variant.img1, quantity: 1 });
  };

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored F8 Panda DTF Printer 8.2" A4 L800 {variant.suffix}
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left: Gallery */}
            <div className="w-full lg:w-[45%] flex-shrink-0 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnails */}
                <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? 'border-gray-800' : 'border-gray-100 hover:border-gray-300'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="order-1 md:order-2 flex-1 relative bg-white rounded-2xl md:border md:border-gray-100 overflow-hidden group cursor-zoom-in"
                  onClick={() => setLightboxIdx(activeImg)}>
                  <img src={images[activeImg]} alt="F8 Panda" className="w-full h-auto md:h-full object-contain p-2 md:p-6 transition-transform duration-300 group-hover:scale-105" />
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

              {/* Strip */}
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 mt-2">
                <span className="bg-red-500 text-white font-bold px-3 py-1 rounded text-sm shadow-sm">F8 A4</span>
                <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Free Shipping</span>
                <span>0% Interest Rate under $3000</span>
              </div>

              {/* Package cards */}
              <div className="grid grid-cols-3 gap-3 hidden md:grid">
                {PACKAGES.map(p => (
                  <div key={p.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-gray-100 transition">
                    <img src={p.img} alt={p.label} className="w-full h-24 object-contain" />
                    <p className="text-xs text-gray-600 text-center font-medium">{p.label}</p>
                  </div>
                ))}
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
                  Procolored F8 Panda DTF Printer 8.2" A4 L800 {variant.suffix}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.00 out of 5 — 6 reviews</a>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-[#E85A24]">${variant.price.toLocaleString()}.00 USD</span>
                  {variant.originalPrice && (
                    <>
                      <s className="text-xl text-gray-400 font-medium">${variant.originalPrice.toLocaleString()}.00 USD</s>
                      <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded-full">-${(variant.originalPrice - variant.price).toLocaleString()}.00</span>
                    </>
                  )}
                </div>
              </div>

              {/* What's in the box accordion */}
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                <button onClick={() => setBoxOpen(p => !p)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span>What's In The Box</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${boxOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${boxOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                  <div className="p-4 border-t border-gray-100 text-sm text-gray-600 space-y-1">
                    <p className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-400 rounded-full"></span> F8 Panda DTF Printer</p>
                    <p className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-400 rounded-full"></span> Oven For DTF Printer <a href="#" className="text-blue-500 hover:underline">Learn More</a></p>
                    <button className="text-gray-400 hover:text-gray-600 font-medium text-xs mt-2 flex items-center gap-1">View More <ChevronDown className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-gray-900 text-base">Options</span>
                  <a href="#" className="text-blue-600 text-sm hover:underline font-medium">Compare &gt;</a>
                </div>

                <div className="flex flex-col gap-3">
                  {VARIANTS.map((v, i) => (
                    <button key={v.id} onClick={() => setVIdx(i)}
                      className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        vIdx === i ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-lg border border-gray-100 p-1 flex-shrink-0">
                          <img src={v.img1} className="w-full h-full object-contain" alt="" />
                        </div>
                        <span className="font-semibold text-gray-900 text-[15px]">{v.shortName}</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        {v.badge && <span className="absolute -top-3 right-4 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">⚡ Most Popular Choice</span>}
                        {v.originalPrice && <span className="text-xs text-gray-400 line-through font-medium">${v.originalPrice.toLocaleString()}.00 USD</span>}
                        <span className="font-extrabold text-gray-900 text-[15px]">${v.price.toLocaleString()}.00 USD</span>
                        {v.originalPrice && <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded mt-0.5">${(v.originalPrice - v.price).toLocaleString()}.00 Off</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 mt-2">
                <button onClick={handleAddToCart} className="w-full border-2 border-[#E85A24] text-[#E85A24] hover:bg-orange-50 font-bold py-4 rounded-full transition text-[15px]">
                  Add to cart
                </button>
                <button onClick={handleBuyNow} className="w-full bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-4 rounded-full transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span>
                  <span className="font-serif italic font-bold">shop</span>
                </button>
                <div className="text-center">
                  <a href="#" className="text-xs text-gray-500 underline hover:text-gray-800 transition">More payment options</a>
                </div>
              </div>

              {/* SEEL badge */}
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

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="w-full">
        <img src="https://www.procolored.com/cdn/shop/files/L800-pc.jpg?v=1733209922&width=2000" alt="F8 Banner" className="w-full object-cover block" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — FEATURE BOXES
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-3xl p-10 flex flex-col justify-center">
            <h3 className="text-[22px] font-black text-gray-900 mb-3">Optimized Chipset</h3>
            <p className="text-gray-600 text-sm leading-relaxed">The improved communication between the software and chip core ensures a smoother, more stable workflow.</p>
          </div>
          <div className="rounded-3xl overflow-hidden bg-black flex items-center justify-center">
            <img src="https://www.procolored.com/cdn/shop/files/f8-new-pc-4.png?v=1724740588&width=550" className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-700" alt="" />
          </div>

          <div className="rounded-3xl overflow-hidden bg-black flex items-center justify-center">
            <img src="https://www.procolored.com/cdn/shop/files/f8-new-pc-3.png?v=1724740587&width=550" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt="" />
          </div>
          <div className="bg-gray-50 rounded-3xl p-10 flex flex-col justify-center">
            <h3 className="text-[22px] font-black text-gray-900 mb-3">Fast and Efficient</h3>
            <p className="text-gray-600 text-sm leading-relaxed">The advanced printhead assembly allows you to print a full A4 sheet within 7 minutes.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-10 flex flex-col justify-center">
            <h3 className="text-[22px] font-black text-gray-900 mb-3">Printhead Safeguard System</h3>
            <p className="text-gray-600 text-sm leading-relaxed">The photoelectric detection system effectively minimizes any risk of damage to the print head caused by film bending.</p>
          </div>
          <div className="rounded-3xl overflow-hidden bg-black flex items-center justify-center">
            <img src="https://www.procolored.com/cdn/shop/files/f8-new-pc-1.png?v=1724740587&width=550" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt="" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 & 5 — PRINT ON DEMAND TABS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-[2rem] font-bold text-gray-900 mb-4 tracking-tight">Print-on-Demand Made Easy</h2>
          <p className="text-gray-500 text-[15px] max-w-3xl mx-auto leading-relaxed">
            {podTab === 0 ? "Fits on your Desk – At only 10kg and measuring 21.3×11×6.7 inches, it is perfect for the coziest of printing studios." :
             podTab === 1 ? "With our comprehensive video guides and intuitive RIP software, starting your T-shirt printing business will be easier than you think — it's perfect for beginners." :
             "With a 8.2\"(210mm) printable width and the ability to print continuously, this printer allows for longer, more flexible graphic designs with fewer limitations."}
          </p>
        </div>

        <div className="flex justify-center border-b border-gray-200 mb-10 overflow-x-auto hide-scrollbar">
          {['Compact Size', 'Easy Print-on-Demand', 'New Roll Film Upgrade'].map((tab, i) => (
            <button key={i} onClick={() => setPodTab(i)}
              className={`px-6 py-3 text-sm transition-all whitespace-nowrap -mb-px border-b-2 font-bold ${podTab === i ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-3xl overflow-hidden shadow-sm bg-[#f9eee1]">
          {podTab === 0 && <img src="https://www.procolored.com/cdn/shop/files/20260107-101342.jpg?v=1767752075&width=1100" alt="" className="w-full h-auto block" />}
          {podTab === 1 && <img src="https://www.procolored.com/cdn/shop/files/f8_lad_3.png?v=1767692615&width=1100" alt="" className="w-full h-auto block" />}
          {podTab === 2 && <img src="https://www.procolored.com/cdn/shop/files/f8_lad_4.png?v=1767692615&width=1100" alt="" className="w-full h-auto block" />}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — SIPHON + AUTO-CLEANING
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-black py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-blue-400 mb-6 leading-tight">Procolored Siphon®<br/>Circulation</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">Equipped with six-color inks (CMYK + WW) and a built-in mini siphon circulation system, this printer ensures that every print is smooth, consistent, and high-quality.</p>
            <img src="https://www.procolored.com/cdn/shop/files/f8_lad_2.png?v=1767692616&width=550" alt="" className="w-full rounded-2xl" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-[2rem] p-8 lg:p-12">
              <img src="https://www.procolored.com/cdn/shop/files/f8_lad_1.png?v=1767692615&width=550" alt="10" className="w-full mb-8" />
              <h3 className="text-[22px] font-bold text-green-400 mb-4">Auto-Cleaning Printhead</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">Even if you're out of the studio, the printer will automatically clean the printhead twice a day, consuming about 1ml of ink to prevent clogging; for the best result, consider replacing the ink cartridges with moisture-retaining ones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — PRINTING STEPS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-black py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Printing Steps</h2>
          
          <div className="hidden md:flex justify-between items-start relative mb-16">
            <div className="absolute top-[35px] left-[5%] right-[5%] h-px border-t border-dashed border-gray-600"></div>
            {[
              { i:'1', l:'Adjust Design', img:'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/1_0504a3ac-adfc-4fec-a94d-2c92149a8502.png?v=1765162454' },
              { i:'2', l:'Printing', img:'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/Ellipse_201.png?v=1767688547' },
              { i:'3', l:'Shake Powder', img:'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_e7a0e187-b973-401c-a8d6-f1ab360b5739.png?v=1765162453' },
              { i:'4', l:'Oven Dry', img:'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/4_e214e5d5-ba72-4c61-be67-ba65313a54d5.png?v=1765162454' },
              { i:'5', l:'Heat Transfer', img:'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/5_feeac855-3f47-45da-a168-b287ec0e59e7.png?v=1765162453' },
              { i:'6', l:'Peel Off Film', img:'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/6_352a7d16-ab35-4c7c-b79a-56235510dfad.png?v=1765162453' }
            ].map(s => (
              <div key={s.i} className="flex flex-col items-center relative z-10 w-24">
                <div className="w-[70px] h-[70px] bg-white rounded-full overflow-hidden border-2 border-black flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-3">
                  <img src={s.img} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="text-white text-[10px] font-bold text-center whitespace-nowrap">{s.i}.{s.l}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative">
            <video autoPlay muted loop playsInline src="https://www.procolored.com/cdn/shop/videos/c/vp/b56194171c664e52a31166a2eada0859/b56194171c664e52a31166a2eada0859.HD-1080p-7.2Mbps-66442031.mp4?v=0" className="w-full h-auto block" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8 — WHAT'S IN THE BOX full image
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 pt-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What's in the Box</h2>
        </div>
        <img src="https://www.procolored.com/cdn/shop/files/F8_List_of_item_1.png?v=1768382010&width=1100" alt="" className="w-full block" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 9 — SPECS & COMPARISON
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">F8 Print Performance & Specifications</h2>
          
          <div className="flex justify-center items-center gap-2 mb-10 overflow-x-auto hide-scrollbar pb-2">
            {['Printer Specifications', 'Print Speed', 'Printer Comparison'].map((tab, i) => (
              <button key={i} onClick={() => setSpecTab(i)}
                className={`px-5 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${specTab === i ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'}`}>
                {tab}
              </button>
            ))}
          </div>

          {specTab === 0 && (
            <div className="animate-in fade-in duration-500">
              <p className="text-center text-sm text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">With three models to choose from, we have the perfect printer for every scale of operation. Choose the right model for your needs and start creating stunning custom designs today!</p>
              <div className="flex justify-center mb-8">
                <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/img_v3_02i7_720fbf8e-8d0c-4f66-b2d1-aae197d9ce6g.png?v=1767750409&width=800" alt="" className="w-full max-w-md drop-shadow-lg" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-[13px]">
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Model</span><span className="w-2/3 text-gray-500">F8</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Printhead Type</span><span className="w-2/3 text-gray-500">L800</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Printhead Config</span><span className="w-2/3 text-gray-500">Single-Array</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Film Feed</span><span className="w-2/3 text-gray-500">Roll-fed</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Film Cutter</span><span className="w-2/3 text-gray-500">Yes</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Prints per Hour</span><span className="w-2/3 text-gray-500">8pcs (Letter/A4 Size)</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Print Width</span><span className="w-2/3 text-gray-500">8.2"(210mm)</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Print Speed</span><span className="w-2/3 text-gray-500">Letter/A4: 7min</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Ink Consumption</span><span className="w-2/3 text-gray-500">Letter/A4: 3.75ml</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Product Weight(N)</span><span className="w-2/3 text-gray-500">22 lb (10 kg)</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Max Resolution</span><span className="w-2/3 text-gray-500">1440×1440 DPI (8 PASS)</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Color Configuration</span><span className="w-2/3 text-gray-500">CMYK+WW</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Software</span><span className="w-2/3 text-gray-500">Pro RIP</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Applicable System</span><span className="w-2/3 text-gray-500">Windows OS</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Product Size</span><span className="w-2/3 text-gray-500">21.3"×11"×6.7" (54×28×17cm)</span></div>
                <div className="border-b border-gray-100 py-3 flex items-start"><span className="w-1/3 font-bold text-gray-800">Standard Supplies</span><span className="w-2/3 text-gray-500">DTF Ink / Protection Fluid / Powder / Film</span></div>
              </div>
            </div>
          )}

          {specTab === 1 && (
            <div className="animate-in fade-in duration-500 bg-gray-50 rounded-2xl p-8 mb-4">
              <h3 className="text-xl font-bold mb-6 text-center">Print Speed Comparison</h3>
              <div className="space-y-6 max-w-lg mx-auto">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1"><span>F8</span><span>7 min / A4</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div className="bg-[#E85A24] h-3 rounded-full" style={{width: '70%'}}></div></div>
                  <p className="text-xs text-gray-500 text-right mt-1">8 pcs/hour</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1"><span>F8 + Oven Bundle</span><span>7 min / A4</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div className="bg-[#E85A24] h-3 rounded-full" style={{width: '70%'}}></div></div>
                  <p className="text-xs text-gray-500 text-right mt-1">Simultaneous Curing</p>
                </div>
              </div>
            </div>
          )}

          {specTab === 2 && (
            <div className="animate-in fade-in duration-500 bg-white border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-4 text-left border-r border-gray-200">Feature</th>
                    <th className="py-4 px-4 font-bold border-r border-gray-200">F8</th>
                    <th className="py-4 px-4 font-bold border-r border-gray-200 text-orange-600">F8+Oven</th>
                    <th className="py-4 px-4 font-bold">F8+Complete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-left border-r border-gray-200">Printhead</td>
                    <td className="py-3 px-4 border-r border-gray-200">L800</td><td className="py-3 px-4 border-r border-gray-200">L800</td><td className="py-3 px-4">L800</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-left border-r border-gray-200">Speed</td>
                    <td className="py-3 px-4 border-r border-gray-200">7min/A4</td><td className="py-3 px-4 border-r border-gray-200">7min/A4</td><td className="py-3 px-4">7min/A4</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-left border-r border-gray-200">Oven Included</td>
                    <td className="py-3 px-4 border-r border-gray-200">✗</td><td className="py-3 px-4 text-green-500 font-bold border-r border-gray-200">✓</td><td className="py-3 px-4 text-green-500 font-bold">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-left border-r border-gray-200">Heat Press</td>
                    <td className="py-3 px-4 border-r border-gray-200">✗</td><td className="py-3 px-4 border-r border-gray-200">✗</td><td className="py-3 px-4 text-green-500 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-left border-r border-gray-200">Price</td>
                    <td className="py-3 px-4 border-r border-gray-200">$1,899</td><td className="py-3 px-4 text-orange-600 font-bold border-r border-gray-200">$2,399</td><td className="py-3 px-4">$2,699</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 10 — RELIABLE SUPPORT
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Reliable Support, Wherever You Are</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8f9fa] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎧</span>
              </div>
              <p className="font-bold text-sm">Customer Support</p>
            </div>
            <div className="bg-[#f8f9fa] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <p className="font-bold text-sm">Engineer Support</p>
            </div>
            <div className="bg-[#f8f9fa] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">▶</span>
              </div>
              <p className="font-bold text-sm">Video Tutorial</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 11 — INVESTMENT
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Your Investment, Your Growth</h2>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/1_1_1.png?v=1766195088&width=700" alt="ROI" className="w-full drop-shadow-xl" />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-sm">
                <h3 className="text-xl font-bold bg-[#E85A24] text-white px-4 py-2 inline-block rounded mb-6">T-Shirts</h3>
                <p className="font-bold text-gray-800 mb-4">[M] Executive Size Prints [7"×10.5"]</p>
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex justify-between border-b border-gray-100 pb-2"><span>Suitable Business Size</span><span className="font-semibold text-gray-900">200+ Shirts/week</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-2"><span>Retail Sell Price</span><span className="font-semibold text-gray-900">$15.90</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-2"><span>Total Cost per Unit</span><span className="font-semibold text-gray-900">$3 Blank / $0.4 Ink / $0.45 Film / $0.05 Pwd</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-2"><span>Equipment Cost</span><span className="font-semibold text-gray-900">Printer $13.90/day / Head $1.76/day</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-2"><span>Average Waste</span><span className="font-semibold text-gray-900">15%</span></div>
                  <div className="flex justify-between pb-2"><span>Unit per Hour</span><span className="font-semibold text-gray-900">8</span></div>
                </div>
                <div className="bg-[#FFF4F0] rounded-2xl p-6 text-center border-2 border-orange-100">
                  <p className="text-gray-600 font-bold mb-1 uppercase tracking-wider text-xs">Profit per Day (5-Hour Work Day)</p>
                  <p className="text-4xl font-black text-[#E85A24]">$440.94</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 12 — FAQs
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center font-bold text-gray-900 text-[15px]">
                  <span className="pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${faqOpen === i ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${faqOpen === i ? 'max-h-[300px]' : 'max-h-0'}`}>
                  <div className="px-6 pb-5 text-gray-600 text-[14px] leading-relaxed border-t border-transparent pt-1">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 13 — REVIEWS
      ══════════════════════════════════════════════════════════ */}
      <section id="reviews" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-start gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}</div>
                  <span className="text-xl font-extrabold text-gray-900">5.00 out of 5</span>
                </div>
                <p className="text-sm text-gray-500">Based on 6 reviews</p>
              </div>
              <div className="hidden sm:flex gap-1 items-end pt-1">
                <div className="flex flex-col gap-1 text-[11px] text-gray-400">
                  <div className="flex items-center gap-2"><span>5★</span><div className="w-24 h-1.5 bg-yellow-400 rounded-full"></div><span>6</span></div>
                  <div className="flex items-center gap-2"><span>4★</span><div className="w-24 h-1.5 bg-gray-100 rounded-full"></div><span>0</span></div>
                  <div className="flex items-center gap-2"><span>3★</span><div className="w-24 h-1.5 bg-gray-100 rounded-full"></div><span>0</span></div>
                  <div className="flex items-center gap-2"><span>2★</span><div className="w-24 h-1.5 bg-gray-100 rounded-full"></div><span>0</span></div>
                  <div className="flex items-center gap-2"><span>1★</span><div className="w-24 h-1.5 bg-gray-100 rounded-full"></div><span>0</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 border-2 border-[#E85A24] text-[#E85A24] font-bold rounded-full text-sm hover:bg-orange-50 transition">Write a review</button>
              <button className="px-6 py-2 border-2 border-gray-300 text-gray-600 font-bold rounded-full text-sm hover:bg-gray-50 transition">Ask a question</button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 mb-8 relative">
            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Customer Photos & Videos</p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 animate-pulse flex items-center justify-center text-gray-300 text-xs font-bold">Photo {i}</div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button className="text-sm text-gray-600 font-medium flex items-center gap-1">Most Recent <ChevronDown className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xs">{r.name.charAt(0)}</div>
                    <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  </div>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <div className="flex mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="font-bold text-gray-900 text-sm mb-2">{r.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{r.text}</p>
                {r.photos && (
                  <div className="flex gap-2 mt-auto">
                    {Array.from({length: r.photos}).map((_, j) => (
                      <div key={j} className="w-12 h-12 bg-gray-200 rounded text-[9px] text-gray-400 flex items-center justify-center border border-gray-300">Photo</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 gap-1 text-sm font-bold text-gray-600">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">2</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">&gt;</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">»</button>
          </div>
        </div>
      </section>

      {lightboxIdx !== null && <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
