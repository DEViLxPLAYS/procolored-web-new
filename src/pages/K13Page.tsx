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
];
const PINK_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink__1_1220x_crop_center.jpg?v=1758869972',
];

// ─── Bundles ──────────────────────────────────────────────────────────────────
interface Bundle { id: string; label: string; sale: number; original: number; saving: number; }
const BUNDLES: Bundle[] = [
  { id: 'k13',                 label: 'K13',                              sale: 2299,  original: 3299,  saving: 1000 },
  { id: 'k13-oven',            label: 'K13+Oven',                         sale: 2799,  original: 3898,  saving: 1099 },
  { id: 'k13-oven-heat',       label: 'K13+Oven+Heat Press',              sale: 3099,  original: 4297,  saving: 1198 },
  { id: 'k13-smokeless',       label: 'K13+Smokeless Oven',               sale: 3099,  original: 4299,  saving: 1200 },
  { id: 'k13-smokeless-heat',  label: 'K13+Smokeless Oven+Heat Press',    sale: 3399,  original: 4698,  saving: 1299 },
];



const SPECS: [string, string][] = [
  ['Model', 'Procolored K13'],
  ['Printhead', 'LH-500 Single Array'],
  ['Print Accuracy', '1440×1440 DPI (8 Pass)'],
  ['Print Width', '13" (330mm)'],
  ['Applicable System', 'Windows OS'],
  ['Color Config', 'CMYK+W'],
  ['Ink Consumption', 'Letter/A4: 3.5ml'],
  ['Software', 'Procolored Studio'],
  ['Net Weight', '40 lb (18kg)'],
  ['Printer Size', '29.1"×12.6"×9.1"'],
];

const IN_BOX = [
  'K13 DTF Printer (LH-500)',
  'Full Set of Initial Ink (CMYKW 5×250ml)',
  '500g Adhesive Powder',
  '13in × 328ft (33cm × 100m) Roll Film',
  'User Manual + Data Cable + Power Cable',
  'RIP Dongle (Procolored Studio)',
  'Film Stand + Tray with Cutter',
  'Moisturizing Device + Ink Tubes',
];

const FAQS = [
  { q: "What's the main difference between K13 and K13 Lite?", a: "The K13 is the full standard model with faster print speeds and enhanced features. The K13 Lite is the entry-level version with a slightly slower speed, designed for beginners." },
  { q: "What systems does the K13 support?", a: "Windows OS only. Windows 10+ required. Mac OS is not currently supported." },
  { q: "Does the extended warranty apply to all variants?", a: "Yes. The 12-month warranty and 2 free printhead replacements apply to all K13 bundles." },
  { q: "What materials can this printer use?", a: "Cotton, polyester, blends, denim, canvas and most fabric-based materials using DTF heat transfer film." },
  { q: "How long does delivery take?", a: "14–17 business days standard delivery." },
];

const REVIEWS = [
  { name: 'Marcus T.', date: '03/16/2026', rating: 5, text: "Upgraded from the Lite to the full K13 — the difference in speed is very noticeable. Much happier with the output." },
  { name: 'Priya N.', date: '03/14/2026', rating: 5, text: "The K13 is a powerhouse. Customer support was excellent guiding me through the installation." },
  { name: 'Javier M.', date: '03/13/2026', rating: 5, text: "Excellent build quality and print results. The bundle with the oven made everything seamless." },
  { name: 'Fatima R.', date: '03/13/2026', rating: 5, text: "Love the printer, it's fast and the colors are super vibrant!" },
  { name: 'Anthony B.', date: '03/13/2026', rating: 5, text: "Very solid machine. Easy to maintain, great for my small business." },
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
export default function K13Page() {
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
  const productName = `Procolored K13 DTF Printer 13" A3 - ${color}${bundle.id !== 'k13' ? ` (${bundle.label.replace('K13', '').trim()})` : ''}`;

  const handleColorChange = (c: 'White' | 'Pink') => { setColor(c); setActiveImg(0); };
  const handleAddToCart = () => {
    addToCart({ id: `k13-${color}-${bundle.id}`, name: productName, price: `$USD:${finalPrice}`, image: images[0], quantity: qty });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">

      {/* ══ SECTION 1 — HERO ══ */}
      <section className="pt-6 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:underline">Home</a>
            {' / '}Procolored K13 DTF Printer 13&quot; A3
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
                    <img src={images[activeImg]} alt="K13" className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
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

                  {/* Packages strip */}
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-700 flex-wrap">
                    <span className="bg-red-500 text-white font-bold px-2 py-0.5 rounded text-xs">K13 A3</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-gray-500" /> Free Shipping</span>
                    <span>0% Interest Rate under $3000</span>
                    <span className="flex items-center gap-1 text-green-700 font-semibold">🚚 Delivered in 14–17 Business Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Buy Box ── */}
            <div className="w-full lg:w-[55%] flex flex-col gap-4">

              {/* Title + Rating */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-2">
                  Procolored K13 DTF Printer 13&quot; A3 &amp; Oven — {color}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <span className="text-sm text-gray-600">4.95 (218 reviews)</span>
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

              {/* Model selector */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Model: <span className="font-normal">K13</span></p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/k13-lite')}
                    className="px-6 py-2 rounded-full border-2 font-semibold text-sm transition-all border-gray-300 text-gray-700 hover:border-gray-400">
                    K13 Lite
                  </button>
                  <button
                    className="px-6 py-2 rounded-full border-2 font-semibold text-sm transition-all border-orange-500 bg-orange-50 text-orange-600">
                    K13
                  </button>
                </div>
              </div>

              {/* Color selector */}
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

              {/* What's In The Box */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setBoxOpen(p => !p)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span>What's In The Box</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${boxOpen ? 'rotate-180' : ''}`} />
                </button>
                {boxOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mt-3 mb-2">K13 DTF Printer (LH-500)</p>
                    <ul className="space-y-1">
                      {IN_BOX.slice(1).map((item, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-orange-500 mt-0.5">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Options — bundle cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-900">Options</p>
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
                Buy Now
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { Icon: Shield, label: '12-Month Warranty' },
                  { Icon: Headphones, label: '24/7 Support' },
                  { Icon: BookOpen, label: 'Video Tutorials' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                    <Icon className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-semibold text-gray-700 text-center">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — SPECS ══ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPECS.map(([k, v]) => (
              <div key={k} className="flex gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-36 flex-shrink-0 pt-0.5">{k}</span>
                <span className="text-sm text-gray-800 font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — VIDEO TABS ══ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">See It In Action</h2>
          <div className="flex gap-2 flex-wrap mb-6">
            {VIDEOS.map((v, i) => (
              <button key={i} onClick={() => setActiveVideoTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeVideoTab === i ? 'bg-[#E85A24] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-400'}`}>
                {v.tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg">
              <AutoVideo src={VIDEOS[activeVideoTab].src} className="w-full aspect-video object-cover" />
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{VIDEOS[activeVideoTab].heading}</h3>
              <p className="text-gray-600 leading-relaxed">{VIDEOS[activeVideoTab].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — FAQ ══ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => (
              <div key={i} className={`border border-gray-200 rounded-2xl overflow-hidden ${openFaq === i ? 'shadow-md' : 'hover:bg-gray-50'}`}>
                <button className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-gray-900" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="pr-4">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 border-t border-gray-100' : 'max-h-0'}`}>
                  <p className="px-6 py-4 text-gray-600 leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — REVIEWS ══ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">"{r.text}"</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">{r.name}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </div>
  );
}
