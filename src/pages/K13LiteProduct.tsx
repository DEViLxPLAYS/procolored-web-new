import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, Shield, Headphones, BookOpen, AlertCircle, Tag, Check, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export type K13Variant = {
  color: 'White' | 'Pink';
  bundleType: 'base' | 'oven' | 'oven-premium';
  productName: string;
  slug: string;
  originalPKR: number;
  salePKR: number;
  images: string[];
};

function AutoVideo({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.src = src;
    v.play().catch(() => {});
  }, [src]);
  return <video ref={ref} autoPlay muted loop playsInline className={className} />;
}

// ── Compact Image Strip with Lightbox ──
const STRIP_IMAGES = [
  { src: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC__2.jpg?v=1756376420', alt: 'Lifestyle 1' },
  { src: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_23fa8ae6-6fb0-4ca2-ba3e-a11804db4ecc.png?v=1758969178', alt: 'Accessories' },
];

function ImageStrip() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImg = useCallback(() => setLightbox(i => i !== null ? (i - 1 + STRIP_IMAGES.length) % STRIP_IMAGES.length : null), []);
  const nextImg = useCallback(() => setLightbox(i => i !== null ? (i + 1) % STRIP_IMAGES.length : null), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'ArrowRight') nextImg();
    };
    if (lightbox !== null) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, closeLightbox, prevImg, nextImg]);

  return (
    <>
      <section className="bg-black py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {STRIP_IMAGES.map((img, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 cursor-zoom-in group overflow-hidden rounded-xl"
                style={{ width: 'calc(50% - 6px)', minWidth: '240px' }}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-40 sm:h-52 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
          style={{ animation: 'fadeIn 0.2s ease' }}
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          <button onClick={e => { e.stopPropagation(); prevImg(); }} className="absolute left-3 sm:left-6 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={STRIP_IMAGES[lightbox].src}
            alt={STRIP_IMAGES[lightbox].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
          <button onClick={e => { e.stopPropagation(); nextImg(); }} className="absolute right-3 sm:right-6 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-5 flex gap-2">
            {STRIP_IMAGES.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightbox(i); }} className={`w-2 h-2 rounded-full transition-colors ${i === lightbox ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function fmt(n: number) { return 'Rs. ' + n.toLocaleString('en-PK'); }

const FEATURES = [
  { label: 'Pro Color Precision', sub: 'Accurate & Vivid Output', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC_2.jpg?v=1756537360' },
  { label: 'White Ink Circulation', sub: 'Premium Printing Results', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC_1.jpg?v=1756537360' },
];

const VIDEOS = [
  { heading: 'One Click Ink Setup', desc: 'The One-Tap Ink Extraction feature automatically draws ink through the lines and removes trapped air with a single press. This ensures smooth ink flow, reduces setup time, minimizes the risk of nozzle blockages, and keeps the printer ready for stable, high-quality printing.', src: 'https://cdn.shopify.com/videos/c/o/v/770711e338f04a1091203acba9de7a03.mp4', textLeft: false, tab: 'One Click Ink Setup' },
  { heading: 'Hassle-Free Maintenance', subheading: 'Automated Cleaning System', desc: 'The system operates on a fixed schedule and automatically initiates a cleaning cycle every 10 hours when the device is powered on. This proactive maintenance prevents build up and reduces the risk of white ink clogging by up to 85%.', src: 'https://cdn.shopify.com/videos/c/o/v/bb0a207264804fd5a154a5381fc95b43.mp4', textLeft: true, tab: 'Automated Cleaning System' },
  { heading: 'White Ink Circulation', desc: 'White ink is circulated every 30 minutes to prevent sedimentation and maintain consistent flow — ensuring smoother, more even printing every time.', src: 'https://cdn.shopify.com/videos/c/o/v/2db0ec5605fc499ebd79c6a0ea448dde.mp4', textLeft: false, tab: 'White Ink Circulation' },
  { heading: 'Smarter Protection, Longer Lifespan', subheading: 'Infrared Printhead SafeGuard', desc: 'Our new Infrared Printhead SafeGuard System detects film warping and microscopic debris in real time, identifying foreign objects as small as 2mm.', src: 'https://cdn.shopify.com/videos/c/o/v/a76a42d6c5494c94b4cc99e039940dbc.mp4', textLeft: true, tab: 'Printhead SafeGuard System' },
  { heading: 'Pro Color Precision', subheading: 'Color Curve', desc: 'By using precisely calibrated color curves, users can avoid manual adjustments while achieving accurate color reproduction.', src: 'https://cdn.shopify.com/videos/c/o/v/03b79c19928048bbbc55da4faf5fdf4f.mp4', textLeft: false, tab: 'Color Curve' },
];

const SPECS = [
  ['Model', 'Procolored K13 (Lite)', 'Configuration', 'Single Array'],
  ['Print Accuracy', '1440*1440 DPI', 'Print Width', 'Width: 13"(330mm)'],
  ['Applicable System', 'Windows OS', 'Color Configuration', 'CMYK+W'],
  ['Ink Consumption', 'Letter/A4: 3.75ml', 'Software', 'Procolored Studio Lite'],
  ['Net Weight', '40 lb (18kg)', 'Printer Size', '29.1"x12.6"x9.1"'],
];

const IN_BOX = [
  'Procolored K13 (Lite) × 1', 'Consumables:',
  '1 × 6*250ml ink set (CMYKW + Nozzle Protection Liquid)', '1 × 500g Powder',
  '1 × 13 in × 328 ft (33cm × 100m) Film', 'Accessories List:',
  '1 × User Manual', '1 × Data Cable', '1 × Power Cable', '1 × RIP Dongle',
  '1 × Film Stand with Shaft, Bearings & Mounting Units (2 pcs)', '1 × Tray with Cutter',
  '10 × Cotton Swabs', '4 × Ink Capping (B-Type)', '1 × Ink Extraction Tool Kit',
  '1 × Non-woven Wipe Pack', '1 × Moisturizing Device (5 × Ink Tubes + Ink Bottle)',
  '1 × Transparent Ink Tube', '5 × Funnels', '2 × Fuse Chip Boards',
  '2 × Mainboard Drive Tubes', '1 × Bottom Ink Tank',
  '1 × Tool Kit (Screwdrivers)', '1 × Circular Cutter Blade',
];

const FAQS = [
  { q: "What's the main difference between the F13 and K13 Lite?", a: "The main differences between the F13 and K13 Lite are the printhead configuration and the control board. The K13 Lite prints about 15% slower than the F13, though final print speed may vary depending on the software version. The K13 Lite is designed specifically for entry-level DTF users, offering the perfect balance of affordability, ease of use, and full functionality — making it the ideal choice for beginners or small studios seeking a reliable and professional solution." },
  { q: "How do I pay the final balance?", a: "After placing your order, our team will contact you with payment instructions for the final balance. You can complete the payment securely through our checkout system using any of our accepted payment methods including credit card, Google Pay, Apple Pay, and Amex." },
  { q: "Can I return the K13 Lite after winning the hidden-edition printer?", a: "Returns for the hidden-edition printer are handled on a case-by-case basis. Please contact our support team at support@procolored.com within 7 calendar days of receiving your unit and we will guide you through the process based on the condition of the product and original packaging." },
  { q: "How do I enter the draw for the 30 hidden edition machines?", a: "Every purchase of a K13 Lite automatically enters you into the draw for one of 30 hidden edition machines. No additional steps are required — simply complete your purchase and you will be automatically included in the draw." },
  { q: "When are the draw results announced? When is the hidden edition machine shipped?", a: "Draw results are announced on our official social media channels and via email to all eligible participants. Winners will be contacted directly and their hidden edition machine will be shipped within 5-10 business days of the announcement." },
  { q: "Does the extended warranty and free printhead replacement apply to all models?", a: "The extended warranty and free printhead replacement offer applies to all K13 Lite variants including the base model, Oven bundle, and Smokeless Oven Premium bundle. Please refer to our Warranty page for full terms and conditions." },
  { q: "What systems does the K13 Lite support?", a: "The K13 Lite currently supports Windows OS only. Mac OS support is not available at this time. Please ensure your computer is running Windows 10 or later for optimal performance with Procolored Studio Lite software." },
];

const REVIEWS = [
  { name: 'Vardan Tsarukyan', date: '03/16/2026', rating: 5, text: "Such a good machine and great help from the customer service. The best contact." },
  { name: 'Carlos Garcia', date: '03/14/2026', rating: 5, text: "Amazing customer support/Technical support via chat with engineers. I've been in the DTF printing game for 6 years now, running various setups for orders big and small. Recently, I picked up the Procolored K13 Lite as a compact desktop option to handle catch-up orders, side gigs, and smaller projects — and I'm genuinely impressed." },
  { name: 'Wendy Mejia', date: '03/13/2026', rating: 5, text: "Great Customer Support. They were really great with helping me install my new print head. They answered really fast and guided me through the whole process. Engineer Oscar was amazing at telling me all the steps I needed to complete and answering all the questions I had." },
  { name: 'Fatima R.', date: '03/13/2026', rating: 5, text: "K13 Lite — Love the printer, it's amazing and fast shipping!" },
  { name: 'Demarious Mitchell', date: '03/13/2026', rating: 5, text: "Procolored K13 Lite DTF Printer 13\" A3 - White. Excellent product, exactly as described. Very happy with the purchase." },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 243, total: 252 },
  { stars: 4, count: 8, total: 252 },
  { stars: 3, count: 1, total: 252 },
  { stars: 2, count: 0, total: 252 },
  { stars: 1, count: 0, total: 252 },
];

const VARIANT_OPPOSITES: Record<string, string> = {
  'procolored-k13-lite-dtf-printer-13-a3-white': '/products/procolored-k13-lite-dtf-printer-13-a3-pink',
  'procolored-k13-lite-dtf-printer-13-a3-pink': '/products/procolored-k13-lite-dtf-printer-13-a3-white',
  'procolored-k13-lite-dtf-printer-13-a3-oven-white': '/products/procolored-k13-lite-dtf-printer-13-a3-oven-pink',
  'procolored-k13-lite-dtf-printer-13-a3-oven-pink': '/products/procolored-k13-lite-dtf-printer-13-a3-oven-white',
  'procolored-k13-lite-dtf-printer-13-a3-oven-premium-white': '/products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink',
  'procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink': '/products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-white',
};

export default function K13LiteProduct({ variant }: { variant: K13Variant }) {
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeVideoTab, setActiveVideoTab] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);

  const DISCOUNT = 5;
  const finalPrice = couponApplied ? Math.round(variant.salePKR * (1 - DISCOUNT / 100)) : variant.salePKR;
  const savings = variant.originalPKR - variant.salePKR;
  const couponSaving = couponApplied ? variant.salePKR - finalPrice : 0;
  const oppositeLink = VARIANT_OPPOSITES[variant.slug] ?? '#';
  const pagesOfReviews = [REVIEWS, [], []];

  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden w-full">

      {/* ── SECTION 1: Product Header ── */}
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Gallery */}
            <div className="flex flex-col gap-3 w-full min-w-0">
              <div className="relative overflow-hidden rounded-lg bg-gray-50 w-full aspect-square">
                <img src={variant.images[activeImg]} alt={variant.productName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {variant.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 border-2 rounded overflow-hidden transition-all ${activeImg === i ? 'border-[#E85A24]' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Box */}
            <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{variant.productName}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <span className="text-sm text-gray-600">4.96 (252 reviews)</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">{fmt(finalPrice)}</span>
                  <span className="text-base sm:text-lg text-gray-400 line-through">{fmt(variant.originalPKR)}</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">Save {fmt(savings)}</span>
                </div>
                {couponApplied && <p className="text-green-600 text-sm font-medium flex items-center gap-1"><Check className="w-4 h-4" /> PROCOLORED5 applied — extra {fmt(couponSaving)} off</p>}
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 flex-1 min-w-0">
                  <Tag className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="flex-shrink-0">Code:</span>
                  <input value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponApplied(false); }} placeholder="PROCOLORED5" className="bg-transparent outline-none min-w-0 w-full font-mono uppercase text-sm" />
                </div>
                <button onClick={() => { if (couponCode.toUpperCase() === 'PROCOLORED5') setCouponApplied(true); }} className="bg-[#E85A24] hover:bg-[#d44e1e] text-white font-semibold text-sm px-3 sm:px-4 py-2 rounded-lg transition-colors flex-shrink-0">Apply</button>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Tag className="w-3 h-3" /> Use code <strong>PROCOLORED5</strong> for 5% off</p>
              <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>⚡ Stock Is Running Low — Order Soon!</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-normal">{variant.color}</span></p>
                <div className="flex gap-3">
                  <button onClick={() => variant.color !== 'White' && navigate(oppositeLink)} className={`w-8 h-8 rounded-full border-2 transition-all ${variant.color === 'White' ? 'border-[#E85A24] scale-110' : 'border-gray-300 hover:border-gray-500'}`} style={{ background: '#f5f5f0' }} title="White" />
                  <button onClick={() => variant.color !== 'Pink' && navigate(oppositeLink)} className={`w-8 h-8 rounded-full border-2 transition-all ${variant.color === 'Pink' ? 'border-[#E85A24] scale-110' : 'border-gray-300 hover:border-gray-500'}`} style={{ background: '#f9a8d4' }} title="Pink" />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg hover:bg-gray-100">−</button>
                  <span className="px-4 py-2 text-base font-semibold min-w-[2.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-lg hover:bg-gray-100">+</button>
                </div>
                <button className="flex-1 bg-[#E85A24] hover:bg-[#d44e1e] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">Add to Cart</button>
              </div>
              <button className="w-full border-2 border-[#E85A24] text-[#E85A24] hover:bg-[#E85A24] hover:text-white font-bold py-3 rounded-lg transition-colors text-sm sm:text-base">Buy It Now</button>
              <div className="flex flex-wrap gap-2">
                {[{ icon: Shield, text: '12-Month Warranty' }, { icon: Headphones, text: '24/6 Tech Support' }, { icon: BookOpen, text: 'Free Training' }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                    <Icon className="w-3.5 h-3.5 text-gray-500" /><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Feature Cards ── */}
      <section className="bg-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div key={f.label} className="relative rounded-2xl overflow-hidden group">
                <img src={f.img} alt={f.label} className="w-full h-48 sm:h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-xl font-bold">{f.label}</h3>
                  <p className="text-gray-300 text-sm mt-1">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTIONS 3–7: Video Tabs ── */}
      <section className="bg-black">
        <div className="border-b border-gray-800 sticky top-0 z-10 bg-black">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {VIDEOS.map((v, i) => (
              <button key={i} onClick={() => setActiveVideoTab(i)} className={`flex-shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeVideoTab === i ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>{v.tab}</button>
            ))}
          </div>
        </div>
        {VIDEOS.map((v, i) => (
          <div key={i} className={i === activeVideoTab ? 'block' : 'hidden'}>
            <div className={`max-w-7xl mx-auto px-3 sm:px-4 py-8 md:py-12 ${v.textLeft ? 'flex flex-col md:flex-row gap-6 md:gap-8 items-center' : 'flex flex-col items-center text-center'}`}>
              {v.textLeft ? (
                <>
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">{v.heading}</h2>
                    {(v as any).subheading && <p className="text-[#E85A24] font-semibold mb-3">{(v as any).subheading}</p>}
                    <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                  <div className="flex-1 w-full"><AutoVideo src={v.src} className="w-full rounded-xl sm:rounded-2xl" /></div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">{v.heading}</h2>
                  {(v as any).subheading && <p className="text-[#E85A24] font-semibold mb-3">{(v as any).subheading}</p>}
                  <p className="text-gray-400 text-sm max-w-2xl leading-relaxed mb-6 sm:mb-8">{v.desc}</p>
                  <AutoVideo src={v.src} className="w-full max-w-3xl rounded-xl sm:rounded-2xl" />
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── SECTION 8: G7 Certified ── */}
      <section className="bg-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">G7 Certified Color Accuracy</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">The G7 color certification empowers the K13 Lite with exceptional color accuracy, from screen to fabric. It eliminates color deviation, ensuring that every pattern is perfectly reproduced on the fabric.</p>
          </div>
          <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC_Pro_Color_Precision_02.jpg?v=1756375457" alt="G7 Certified Color Accuracy" className="w-full rounded-xl sm:rounded-2xl" referrerPolicy="no-referrer" />
        </div>
      </section>

      {/* ── SECTION 9: RIP Program ── */}
      <section className="bg-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <div className="w-full md:w-2/5 flex-shrink-0 text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">Professional RIP Program</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Procolored Studio Lite automatically detects image formats, accurately distinguishes between RGB and CMYK color modes, and intelligently matches preset color curves to ensure each hue is accurately translated onto the final print.</p>
          </div>
          <div className="flex-1 w-full"><AutoVideo src="https://cdn.shopify.com/videos/c/o/v/d0bef47aaa5e4e2ea343c6204d96044d.mp4" className="w-full rounded-xl sm:rounded-2xl" /></div>
        </div>
      </section>

      {/* ── SECTION 10: Color Options ── */}
      <section className="bg-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">Precision Color Delivery from Pixel to Fabric</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto text-sm">With 2 color options and switchable pixel themes right on the screen, turn every print into a playful, personal creation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: 'Galaxy Panda', img: 'https://i.postimg.cc/bJn2rZP1/image.png' }, { label: 'Fluffy Panda', img: 'https://i.postimg.cc/mZMQ25Z7/image.png' }].map(c => (
              <div key={c.label} className="rounded-2xl overflow-hidden">
                <img src={c.img} alt={c.label} className="w-full object-cover" referrerPolicy="no-referrer" />
                <p className="text-gray-300 text-sm font-medium mt-3">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 11: Product Support ── */}
      <section className="bg-black py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8">Product Support</h2>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-5 sm:p-8 mb-6 flex flex-col sm:flex-row gap-4 items-start">
            <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/warranty-shield.png?v=1" alt="Shield" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0" />
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">Longer warranty protection</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">To provide better services and business support, we've extended the standard warranty of <span className="text-white font-semibold">[K13 Lite]</span> from 6 months to <span className="text-white font-semibold">12 months</span>. During this period, if your printhead suffers any damage, you're eligible for <span className="text-[#E85A24] font-semibold">2 free replacements</span>.</p>
              <p className="text-[#E85A24] font-semibold text-sm">Only Available from October to December 2025</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ icon: '🏪', label: '20+ Local Support Centers' }, { icon: '📞', label: '24/6 Online Tech Support' }].map(s => (
              <div key={s.label} className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
                <span className="text-4xl">{s.icon}</span>
                <p className="text-white font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 12: Compact Image Strip with Lightbox ── */}
      <ImageStrip />

      {/* ── SECTION 13: Parameter Table ── */}
      <section className="bg-[#f5f5f5] py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-gray-900 mb-2">Parameter Table</h2>
          <p className="text-center text-gray-600 mb-6 font-medium">Procolored K13 (Lite)</p>
          <div className="flex justify-center gap-3 mb-6">
            <button onClick={() => variant.color !== 'White' && navigate(oppositeLink)} className={`w-7 h-7 rounded-full border-2 ${variant.color === 'White' ? 'border-gray-900' : 'border-transparent'}`} style={{ background: '#222' }} title="White" />
            <button onClick={() => variant.color !== 'Pink' && navigate(oppositeLink)} className={`w-7 h-7 rounded-full border-2 ${variant.color === 'Pink' ? 'border-gray-900' : 'border-transparent'}`} style={{ background: '#f9a8d4' }} title="Pink" />
          </div>
          <div className="flex justify-center mb-8">
            <img src={variant.images[0]} alt="K13 Lite" className="h-40 sm:h-56 object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[400px] text-sm">
              <tbody>
                {SPECS.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 ${ci % 2 === 0 ? 'font-semibold text-gray-700 w-1/4' : 'text-blue-600 w-1/4'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 14: What's In the Box ── */}
      <section className="bg-white py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8">What's In the Box</h2>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <img src="https://i.postimg.cc/MK5tqFd8/image.png" alt="What's in the box" className="w-40 sm:w-48 h-auto object-contain rounded-lg border border-gray-100" referrerPolicy="no-referrer" />
            </div>
            <ul className="flex flex-col gap-2 flex-1">
              {IN_BOX.map((item, i) => {
                const isHeader = item.endsWith(':') && !item.startsWith('1 ×') && !item.startsWith('Procolored');
                return (
                  <li key={i} className={isHeader ? 'font-bold text-gray-900 mt-3 text-sm sm:text-base' : 'text-gray-700 text-sm flex items-start gap-2'}>
                    {!isHeader && <span className="text-[#E85A24] mt-0.5 flex-shrink-0">•</span>}
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 15: FAQ ── */}
      <section className="bg-[#f5f5f5] py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8">FAQ</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-4 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <span className="text-gray-900 font-semibold text-sm">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 16: Customer Reviews ── */}
      <section className="bg-white py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8">Customer Reviews</h2>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8 p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px]">
              <p className="text-5xl sm:text-6xl font-black text-gray-900">4.96</p>
              <div className="flex mt-2 mb-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-sm text-gray-500 text-center">Based on 252 reviews</p>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {RATING_BREAKDOWN.map(rb => (
                <div key={rb.stars} className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="w-10 text-gray-600 flex-shrink-0">{rb.stars} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${(rb.count / rb.total) * 100}%` }} />
                  </div>
                  <span className="w-7 text-gray-500 text-right">{rb.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-6 sm:mb-8">
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 sm:px-5 py-2.5 rounded-lg transition-colors">Write a Review</button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 sm:px-5 py-2.5 rounded-lg transition-colors">Ask a Question</button>
          </div>
          <div className="flex flex-col gap-5 sm:gap-6">
            {(pagesOfReviews[reviewPage] ?? []).map((r, i) => (
              <div key={i} className="border-b border-gray-100 pb-5 sm:pb-6">
                <div className="flex mb-1">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                <p className="text-gray-700 text-sm mt-3 leading-relaxed">{r.text}</p>
              </div>
            ))}
            {(pagesOfReviews[reviewPage] ?? []).length === 0 && <p className="text-gray-400 text-center py-8">No reviews on this page.</p>}
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            <button onClick={() => setReviewPage(p => Math.max(0, p - 1))} disabled={reviewPage === 0} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            {[0, 1, 2].map(p => (
              <button key={p} onClick={() => setReviewPage(p)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${reviewPage === p ? 'bg-[#E85A24] text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>{p + 1}</button>
            ))}
            <button onClick={() => setReviewPage(p => Math.min(2, p + 1))} disabled={reviewPage === 2} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
