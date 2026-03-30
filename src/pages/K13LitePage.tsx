import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronDown, Shield, Headphones, BookOpen, AlertCircle,
  Tag, Check, ChevronLeft, ChevronRight, X, ZoomIn, Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─── Images ──────────────────────────────────────────────────────────────────
const WHITE_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_1_9a953385-6db6-491d-84f6-45f45196871d_1220x_crop_center.jpg?v=1758869975',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_m_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/20260105-114947_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_12_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_11_1220x_crop_center.png?v=1772447536',
];
const PINK_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink__1_1220x_crop_center.jpg?v=1758869972',
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink_m_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink__10_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink_12_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink__11_1220x_crop_center.png?v=1772447536',
];

// ─── Bundles ──────────────────────────────────────────────────────────────────
interface Bundle { id: string; label: string; sale: number; original: number; saving: number; }
const BUNDLES: Bundle[] = [
  { id: 'lite',                label: 'K13 Lite',                          sale: 1999,  original: 2999,  saving: 1000 },
  { id: 'lite-oven',           label: 'K13 Lite+Oven',                     sale: 2499,  original: 3598,  saving: 1099 },
  { id: 'lite-oven-heat',      label: 'K13 Lite+Oven+Heat Press',          sale: 2799,  original: 3997,  saving: 1198 },
  { id: 'lite-smokeless',      label: 'K13 Lite+Smokeless Oven',           sale: 2799,  original: 3999,  saving: 1200 },
  { id: 'lite-smokeless-heat', label: 'K13 Lite+Smokeless Oven+Heat Press',sale: 3099,  original: 4398,  saving: 1299 },
];

// below-image package thumbnails
const PKG_ITEMS = [
  { label: 'Printer Supplies - SS62', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_23fa8ae6-6fb0-4ca2-ba3e-a11804db4ecc.png?v=1758969178' },
  { label: 'Panda Heat Oven', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC__2.jpg?v=1756376420' },
];

// ─── Spec / FAQ / Review data ──────────────────────────────────────────────────
const SPECS: [string, string][] = [
  ['Model', 'Procolored K13 (Lite)'],
  ['Printhead', 'LH-500 Single Array'],
  ['Print Accuracy', '1440×1440 DPI (8 Pass)'],
  ['Print Width', '13" (330mm)'],
  ['Applicable System', 'Windows OS'],
  ['Color Config', 'CMYK+W'],
  ['Ink Consumption', 'Letter/A4: 3.75ml'],
  ['Software', 'Procolored Studio Lite'],
  ['Net Weight', '40 lb (18kg)'],
  ['Printer Size', '29.1"×12.6"×9.1"'],
];

const IN_BOX = [
  'K13 DTF Lite Printer (LH-500)',
  'Full Set of Initial Ink (CMYKW 5×250ml)',
  '500g Adhesive Powder',
  '13in × 328ft (33cm × 100m) Roll Film',
  'User Manual + Data Cable + Power Cable',
  'RIP Dongle (Procolored Studio Lite)',
  'Film Stand + Tray with Cutter',
  'Moisturizing Device + Ink Tubes',
];

const FAQS = [
  { q: "What's the main difference between the F13 and K13 Lite?", a: "The K13 Lite prints about 15% slower than the F13 and uses a single LH-500 head. It's designed for entry-level users seeking a great balance of affordability and full DTF capability." },
  { q: "What systems does the K13 Lite support?", a: "Windows OS only. Windows 10+ required. Mac OS is not currently supported." },
  { q: "Does the extended warranty apply to all variants?", a: "Yes. The 12-month warranty and 2 free printhead replacements apply to all K13 Lite bundles." },
  { q: "What materials can this printer use?", a: "Cotton, polyester, blends, denim, canvas and most fabric-based materials using DTF heat transfer film." },
  { q: "How long does delivery take?", a: "14–17 business days standard delivery." },
];

const REVIEWS = [
  { name: 'Vardan Tsarukyan', date: '03/16/2026', rating: 5, text: "Such a good machine and great help from the customer service. The best contact." },
  { name: 'Carlos Garcia', date: '03/14/2026', rating: 5, text: "Amazing technical support via chat with engineers. I've been in the DTF printing game for 6 years and the K13 Lite is a fantastic compact option." },
  { name: 'Wendy Mejia', date: '03/13/2026', rating: 5, text: "They helped me install my new print head step by step. Engineer Oscar was amazing guiding me through every question I had." },
  { name: 'Fatima R.', date: '03/13/2026', rating: 5, text: "Love the printer, it's amazing and fast shipping!" },
  { name: 'Demarious Mitchell', date: '03/13/2026', rating: 5, text: "Excellent product, exactly as described. Very happy with the purchase." },
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
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
      <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><ChevronLeft className="w-6 h-6" /></button>
      <img src={images[idx]} onClick={e => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl" alt="" />
      <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><ChevronRight className="w-6 h-6" /></button>
    </div>
  );
}

// ─── Video helper ─────────────────────────────────────────────────────────────
function AutoVideo({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const v = ref.current; if (!v) return; v.src = src; v.play().catch(() => {}); }, [src]);
  return <video ref={ref} autoPlay muted loop playsInline className={className} />;
}

const VIDEOS = [
  { tab: 'One Click Ink Setup', heading: 'One Click Ink Setup', src: 'https://cdn.shopify.com/videos/c/o/v/770711e338f04a1091203acba9de7a03.mp4', desc: 'One-Tap Ink Extraction automatically draws ink through the lines and removes trapped air with a single press.' },
  { tab: 'Automated Cleaning', heading: 'Hassle-Free Maintenance', src: 'https://cdn.shopify.com/videos/c/o/v/bb0a207264804fd5a154a5381fc95b43.mp4', desc: 'Automated cleaning cycle every 10 hours reduces white ink clogging by up to 85%.' },
  { tab: 'White Ink Circulation', heading: 'White Ink Circulation', src: 'https://cdn.shopify.com/videos/c/o/v/2db0ec5605fc499ebd79c6a0ea448dde.mp4', desc: 'White ink is circulated every 30 minutes to prevent sedimentation and maintain consistent flow.' },
  { tab: 'Printhead SafeGuard', heading: 'Infrared Printhead SafeGuard', src: 'https://cdn.shopify.com/videos/c/o/v/a76a42d6c5494c94b4cc99e039940dbc.mp4', desc: 'Real-time infrared detection of film warping and debris as small as 2mm.' },
  { tab: 'Color Curve', heading: 'Pro Color Precision', src: 'https://cdn.shopify.com/videos/c/o/v/03b79c19928048bbbc55da4faf5fdf4f.mp4', desc: 'Precisely calibrated color curves ensure accurate color reproduction without manual adjustments.' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function K13LitePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [color, setColor] = useState<'White' | 'Pink'>('White');
  const [bundleIdx, setBundleIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeVideoTab, setActiveVideoTab] = useState(0);
  const [boxOpen, setBoxOpen] = useState(false);

  const images = color === 'White' ? WHITE_IMAGES : PINK_IMAGES;
  const bundle = BUNDLES[bundleIdx];
  const DISCOUNT = 5;
  const finalPrice = couponApplied ? Math.round(bundle.sale * (1 - DISCOUNT / 100)) : bundle.sale;
  const couponSaving = couponApplied ? bundle.sale - finalPrice : 0;
  const productName = `Procolored K13 Lite DTF Printer 13" A3 - ${color}${bundle.id !== 'lite' ? ` (${bundle.label.replace('K13 Lite', '').trim()})` : ''}`;

  const handleColorChange = (c: 'White' | 'Pink') => { setColor(c); setActiveImg(0); };
  const handleAddToCart = () => {
    addToCart({ id: `k13-lite-${color}-${bundle.id}`, name: productName, price: `$USD:${finalPrice}`, image: images[0], quantity: qty });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-6 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:underline">Home</a>
            {' / '}Procolored K13 Lite DTF Printer 13&quot; A3
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* ── LEFT: Gallery ── */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="flex gap-3">
                {/* Thumbnails */}
                <div className="flex flex-col gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-400'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 flex flex-col gap-3">
                  <div
                    className="relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden aspect-square group cursor-zoom-in"
                    onClick={() => setLightboxIdx(activeImg)}
                  >
                    <img src={images[activeImg]} alt="K13 Lite" className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                    {/* Prev/Next arrows */}
                    <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p === 0 ? images.length - 1 : p - 1)); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 z-10">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p === images.length - 1 ? 0 : p + 1)); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 z-10">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Packages strip */}
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-700 flex-wrap">
                    <span className="bg-red-500 text-white font-bold px-2 py-0.5 rounded text-xs">K13 Lite A3</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-gray-500" /> Free Shipping</span>
                    <span>0% Interest Rate under $3000</span>
                  </div>

                  {/* Package items (Inkset / Oven mini cards) */}
                  <div className="grid grid-cols-2 gap-2">
                    {PKG_ITEMS.map(p => (
                      <div key={p.label} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-2">
                        <img src={p.img} alt={p.label} className="w-full h-20 object-cover rounded-lg" />
                        <p className="text-xs text-gray-600 text-center font-medium">{p.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Buy Box ── */}
            <div className="w-full lg:w-[55%] flex flex-col gap-4">

              {/* Title + Rating */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-2">
                  Procolored K13 Lite DTF Printer 13&quot; A3 &amp; Oven — {color}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <span className="text-sm text-gray-600">4.96 (252 reviews)</span>
                </div>
              </div>

              {/* Price block */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-extrabold text-gray-900">${finalPrice.toLocaleString()}.00 USD</span>
                  <s className="text-lg text-gray-400">${bundle.original.toLocaleString()}.00 USD</s>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">Save ${bundle.saving.toLocaleString()}.00 USD</span>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                    <Check className="w-4 h-4" /> PROCOLORED5 applied — extra ${couponSaving.toLocaleString()} off
                  </p>
                )}
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 flex-1">
                  <Tag className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <input
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponApplied(false); }}
                    placeholder="PROCOLORED5"
                    className="bg-transparent outline-none flex-1 font-mono uppercase text-sm text-gray-800"
                  />
                </div>
                <button
                  onClick={() => { if (coupon.toUpperCase() === 'PROCOLORED5') setCouponApplied(true); }}
                  className="bg-[#E85A24] hover:bg-[#d44e1e] text-white font-bold text-sm px-4 py-2 rounded-xl transition flex-shrink-0">
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 -mt-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Use code <strong>PROCOLORED5</strong> for 5% off</p>

              {/* Stock warning */}
              <div className="flex items-center gap-2 text-[#E85A24] text-sm font-semibold bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> ⚡ Stock Is Running Low — Order Soon!
              </div>

              {/* Color selector — pill buttons like reference */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Color: <span className="font-normal">{color}</span></p>
                <div className="flex gap-3">
                  {(['White', 'Pink'] as const).map(c => (
                    <button key={c} onClick={() => handleColorChange(c)}
                      className={`px-6 py-2 rounded-full border-2 font-semibold text-sm transition-all ${color === c ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* What's In The Box — collapsible */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setBoxOpen(p => !p)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span>What's In The Box</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${boxOpen ? 'rotate-180' : ''}`} />
                </button>
                {boxOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mt-3 mb-2">K13 DTF Lite Printer (LH-500)</p>
                    <ul className="space-y-1">
                      {IN_BOX.slice(1).map((item, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-orange-500 mt-0.5">•</span>{item}
                        </li>
                      ))}
                    </ul>
                    <button className="text-blue-500 text-xs mt-2 hover:underline">View More ...</button>
                  </div>
                )}
              </div>

              {/* Options — all 5 stacked cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-900">Options</p>
                  <button className="text-blue-500 text-xs hover:underline">Compare &gt;</button>
                </div>
                <div className="flex flex-col gap-2">
                  {BUNDLES.map((b, i) => (
                    <button key={b.id} onClick={() => setBundleIdx(i)}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 text-left transition-all ${bundleIdx === i ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <img src={images[0]} alt="" className="w-11 h-11 object-contain rounded-lg border border-gray-100 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{b.label}</p>
                          <span className="text-red-500 text-xs font-bold">${b.saving.toLocaleString()}.00 Off</span>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-[11px] text-gray-400 line-through">${b.original.toLocaleString()}.00 USD</p>
                        <p className="text-sm font-extrabold text-gray-900">${b.sale.toLocaleString()}.00 USD</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + Buttons */}
              <div className="flex gap-3 items-stretch">
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 text-lg font-bold text-gray-600 hover:bg-gray-100">-</button>
                  <span className="px-4 flex items-center font-bold text-base min-w-[2.5rem] justify-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-4 text-lg font-bold text-gray-600 hover:bg-gray-100">+</button>
                </div>
                <button onClick={handleAddToCart}
                  className="flex-1 bg-[#E85A24] hover:bg-[#d44e1e] text-white font-bold py-3 rounded-xl transition text-base">
                  Add to Cart
                </button>
              </div>
              <button onClick={handleBuyNow}
                className="w-full border-2 border-[#E85A24] text-[#E85A24] hover:bg-[#E85A24] hover:text-white font-bold py-3 rounded-xl transition text-base">
                Buy It Now
              </button>
              <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-700">
                <Truck className="w-4 h-4 text-green-600" /> 14–17 Business Days Delivery
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {[{ icon: Shield, text: '12-Month Warranty' }, { icon: Headphones, text: '24/6 Tech Support' }, { icon: BookOpen, text: 'Free Training' }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                    <Icon className="w-3.5 h-3.5 text-gray-500" /><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — VIDEO TABS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-black mt-12">
        <div className="border-b border-gray-800 sticky top-0 z-10 bg-black">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {VIDEOS.map((v, i) => (
              <button key={i} onClick={() => setActiveVideoTab(i)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeVideoTab === i ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                {v.tab}
              </button>
            ))}
          </div>
        </div>
        {VIDEOS.map((v, i) => (
          <div key={i} className={i === activeVideoTab ? 'block' : 'hidden'}>
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <h2 className="text-3xl font-black text-white mb-3">{v.heading}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
              <div className="flex-1 w-full">
                <AutoVideo src={v.src} className="w-full rounded-2xl" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — SPECS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">Parameter Table</h2>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="lg:w-2/5 flex justify-center">
              <img src={images[0]} alt="K13 Lite" className="max-w-xs w-full object-contain drop-shadow-xl" />
            </div>
            <div className="lg:w-3/5 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {SPECS.map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-200 last:border-0">
                      <td className="py-3 pr-4 font-bold text-gray-900 w-2/5">{label}</td>
                      <td className="py-3 text-blue-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — FAQs
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed border-t border-gray-200">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — Reviews
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Customer Reviews</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-xl font-extrabold text-gray-900">4.96</span>
              <span className="text-gray-500">(252 reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <div className="flex mb-3">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* lightbox */}
      {lightboxIdx !== null && <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}
