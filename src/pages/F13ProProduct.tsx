import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { Star, ChevronLeft, ChevronRight, ChevronDown, Check, Headphones, BookOpen, Video, Truck, Shield, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STATIC_GALLERY, VARIANTS, MGMT_VIDEOS, RIP_VIDEOS, STEPS, CAROUSEL_ITEMS, SPEC_ROWS, FAQS, REVIEWS } from './F13ProData';

// ─── HLS Video Player ────────────────────────────────────────────────────────
function HlsVideo({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(src); hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => v.play().catch(() => {}));
        return () => hls.destroy();
      } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = src; v.play().catch(() => {});
      }
    } else { v.src = src; v.play().catch(() => {}); }
  }, [src]);
  return <video ref={ref} autoPlay muted loop playsInline className={className} />;
}

// ─── Accordion Item ──────────────────────────────────────────────────────────
function Accordion({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className={`border border-gray-200 rounded-2xl overflow-hidden ${open ? 'shadow-md' : 'hover:bg-gray-50'}`}>
      <button className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-gray-900" onClick={onClick}>
        <span className="pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-orange-500' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 border-t border-gray-100' : 'max-h-0'}`}>
        <p className="px-6 py-4 text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function F13ProProduct() {
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVar, setSelectedVar] = useState(0);
  const [boxOpen, setBoxOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSpecTab, setActiveSpecTab] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const variant = VARIANTS[selectedVar];
  const galleryImgs = [variant.img, ...STATIC_GALLERY];

  // When variant changes, reset to first image
  useEffect(() => { setActiveImg(0); }, [selectedVar]);

  const finalPrice = variant.sale;

  return (
    <div className="bg-white font-sans overflow-hidden">
      <style>{`
        @keyframes scroll-left { from{transform:translateX(0)} to{transform:translateX(-100%)} }
        .infinite-scroll { animation: scroll-left 40s linear infinite; }
        .group:hover .infinite-scroll { animation-play-state: paused; }
      `}</style>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
        <a href="/" className="hover:underline">Home</a> / Procolored F13 Pro Panda DTF Printer 13&quot; A3 Dual XP600
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — PRODUCT HERO
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left — Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm aspect-square group" style={{background:'#f9f9f9'}}>
              <img
                src={galleryImgs[activeImg]}
                alt="F13 Pro"
                className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                style={{background:'#f9f9f9'}}
              />
              <button onClick={() => setActiveImg(p => (p === 0 ? galleryImgs.length - 1 : p - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setActiveImg(p => (p === galleryImgs.length - 1 ? 0 : p + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 flex-wrap">
              {galleryImgs.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all bg-white ${
                    activeImg === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-400'
                  }`}>
                  <img src={img} className="w-full h-full object-contain p-1" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Buy Box */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Procolored F13 Pro Panda DTF Printer 13&quot; A3 Dual XP600 &amp; Complete Bundle Premium
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-orange-400 text-orange-400" />)}
              <span className="text-sm text-orange-500 font-medium">No reviews</span>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-red-600">${finalPrice.toLocaleString()}.00 USD</span>
                <s className="text-lg text-gray-400">${variant.original.toLocaleString()}.00 USD</s>
              </div>
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <Zap className="w-4 h-4" /> F13 Pro Spring Sale (-${variant.saving}.00 USD)
              </p>
            </div>

            {/* Extra Member Deal banner */}
            <div className="rounded-xl border-2 border-pink-500 p-3 flex items-center justify-between gap-3 bg-white">
              <span className="text-pink-600 font-extrabold text-xl">$400 OFF</span>
              <div className="text-xs text-gray-600 text-right">
                <strong>Extra Member Deal</strong> — <a href="#" className="text-red-500 underline">Log in</a><br />
                Log in to unlock up to $400 Off (Extra deal apply at checkout)
              </div>
            </div>

            {/* Siphon Circulation */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2"><span className="text-green-600">New</span> Procolored Siphon Circulation</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>50% Less Clogging</strong> – Smoother, uninterrupted printing.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>50% Less Maintenance</strong> – Less time on upkeep, more time creating.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Boost Productivity</strong> – Focus on success with hassle-free performance.</span></li>
              </ul>
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-900">Options</p>
              </div>
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                {VARIANTS.map((v, i) => (
                  <button key={i} onClick={() => setSelectedVar(i)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedVar === i ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <span className={`absolute -top-0 right-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-xl rounded-tr-lg ${v.badgeClass}`}>{v.badge}</span>
                    <img src={v.img} alt={v.name} className="w-14 h-14 object-contain rounded-lg border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 flex justify-between items-center min-w-0">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-0.5">${v.saving} Off</span>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs"><s className="text-gray-400">${v.original.toLocaleString()}.00 USD</s></p>
                        <p className="text-sm font-extrabold text-gray-900">${v.sale.toLocaleString()}.00 USD</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stand Toggle */}
            <div className="mb-2">
              <p className="font-bold text-gray-900 mb-2">Option</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all border-orange-500 text-orange-600 bg-orange-50 cursor-default">
                  Without Stand
                </button>
                <button onClick={() => navigate('/products/f13-pro-stand')}
                  className="py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all border-gray-200 text-gray-700 hover:border-gray-300">
                  Stand
                </button>
              </div>
            </div>

            {/* What's In The Box accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setBoxOpen(o => !o)} className="w-full flex justify-between items-center px-5 py-4 font-semibold text-gray-800 hover:bg-gray-50">
                What's In The Box <ChevronDown className={`w-5 h-5 transition-transform ${boxOpen ? 'rotate-180' : ''}`} />
              </button>
              {boxOpen && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mt-2">
                    {['F13 Pro Panda DTF Printer', 'Powder Shaking And Drying All-In-One Machine', 'Panda Heat Press Machine For DTF Printer', 'Full Set of Initial Ink (CMYKW 5×500ml)', 'Adhesive Powder 500g', 'Printhead Moisturizing Device', 'Nozzle Protection Fluid 2×250ml', 'PET Roll Film (100m)', 'Procolored RIP Software (Windows OS only, C drive ≥50GB, RAM ≥8GB)', 'USB Dongle', 'Power Cable/USB to Ethernet Adapter', 'Ink Tube/Dust Free Cloth/Syringe'].map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Overview accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOverviewOpen(o => !o)} className="w-full flex justify-between items-center px-5 py-4 font-semibold text-gray-800 hover:bg-gray-50">
                Overview <ChevronDown className={`w-5 h-5 transition-transform ${overviewOpen ? 'rotate-180' : ''}`} />
              </button>
              {overviewOpen && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">The Procolored F13 Pro is an advanced, user-friendly DTF printer with dual print heads. It produces professional-quality prints at incredible speed. A DTF printing/direct-to-film printer prints on film first, then transfers the pattern onto the fabric. This printer can print on almost any fabric without restricting the image composition, overcoming common deficiencies of both DTG and sublimation printing. A3 DTF printers are the perfect printer for small custom t-shirt businesses.</p>
                </div>
              )}
            </div>

            {/* Features accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setFeaturesOpen(o => !o)} className="w-full flex justify-between items-center px-5 py-4 font-semibold text-gray-800 hover:bg-gray-50">
                Features <ChevronDown className={`w-5 h-5 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>
              {featuresOpen && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mt-2">
                    {['Sleek, Modern Design', 'Auto-Cleaning Printhead – cleans every 10 hours, 1ml/day', 'Dual Print Heads – increases efficiency', 'Superior Print Quality – high-resolution, minimal color distortion', 'User Friendly – no pretreatment needed'].map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 pt-1">
              <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-green-600" />Free Shipping</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-600" />6-month Printhead Warranty</span>
              <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-orange-500" />14–17 Business Days Delivery</span>
            </div>

            {/* Quantity + CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="flex border border-gray-300 rounded-xl h-14 overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-5 font-bold text-gray-700 hover:bg-gray-100">-</button>
                <span className="px-5 flex items-center font-bold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-5 font-bold text-gray-700 hover:bg-gray-100">+</button>
              </div>
              <button onClick={() => addToCart({ id: variant.id, name: `${variant.name}`, price: `$USD:${finalPrice}`, image: variant.img, quantity: qty })}
                className="flex-1 border-2 border-orange-500 text-orange-500 font-bold rounded-xl h-14 hover:bg-orange-50 transition text-base">
                Add to cart
              </button>
              <button onClick={() => {
                addToCart({ id: variant.id, name: `${variant.name}`, price: `$USD:${finalPrice}`, image: variant.img, quantity: qty });
                window.location.href = '/checkout';
              }} className="flex-1 bg-indigo-700 text-white font-bold rounded-xl h-14 hover:bg-indigo-800 transition text-base">
                Buy it now
              </button>
            </div>
            <a href="/checkout" className="text-center text-sm text-gray-500 underline hover:text-gray-700">More payment options</a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — FULL-WIDTH BANNER
      ═══════════════════════════════════════════════════════ */}
      <div className="w-full">
        <img src="https://www.procolored.com/cdn/shop/files/YI_1.jpg?v=1773474331&width=1100" alt="F13 Pro Banner" className="w-full h-auto object-cover" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — INTEGRATED PRINTHEAD MANAGEMENT
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3 flex flex-col justify-center">
            <div className="w-12 h-1 bg-orange-500 mb-6 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">Integrated Printhead Management System</h2>
            <p className="text-gray-400 text-lg leading-relaxed">Dual print heads paired with intelligent Siphon circulation and protection systems deliver faster output with reliable quality.</p>
          </div>
          <div className="lg:w-2/3 flex flex-col gap-6">
            {MGMT_VIDEOS.map((vid, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-5 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden flex-shrink-0">
                  <HlsVideo src={vid.src} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-3 text-white">{vid.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{vid.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — RIP SOFTWARE + COLOR REPRODUCTION
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {RIP_VIDEOS.map((vid, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
              <div className="w-full md:w-1/2">
                <div className="w-12 h-1 bg-orange-500 mb-5 rounded-full" />
                <h2 className="text-3xl font-extrabold text-gray-900 mb-5">{vid.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{vid.desc}</p>
              </div>
              <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-xl bg-black aspect-video">
                <HlsVideo src={vid.src} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — SIGNIFICANT ADVANTAGES
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Significant Advantages</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">The F13 Pro Printer Gen 2 is a massive upgrade to the F13. Higher throughput, faster speeds, and superior color output built for serious business owners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { model: 'Procolored F13 Pro', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/image_503_1.png?v=1766559840&width=500', profit: '$1,319.55', heads: 'Dual Heads XP600', speed: 'Faster – 5 mins for 12"×16"', quality: 'Better – 720×1440 DPI [16 Pass]', highlight: true },
              { model: 'Procolored F13', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/image_504_1.png?v=1766559841&width=500', profit: '$493.85', heads: 'Single Head L1800', speed: 'Normal – 11 mins for 12"×16"', quality: 'Good – 1440×1440 DPI [8 Pass]', highlight: false },
            ].map((c, i) => (
              <div key={i} className={`rounded-3xl overflow-hidden border-2 ${c.highlight ? 'border-orange-500' : 'border-gray-200'} bg-black text-white`}>
                <div className={`text-center py-4 font-bold text-lg ${c.highlight ? 'bg-orange-500' : 'bg-gray-700'}`}>{c.model}</div>
                <div className="flex justify-center py-8">
                  <img src={c.img} alt={c.model} className="h-44 object-contain" />
                </div>
                <div className="px-8 pb-8 space-y-3">
                  {[
                    ['Profit Per 5-Hour Day', c.profit],
                    ['Printhead', c.heads],
                    ['Printing Speed', c.speed],
                    ['Print Quality', c.quality],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="text-gray-400 text-sm">{label}</span>
                      <span className={`font-bold text-sm ${c.highlight ? 'text-orange-400' : 'text-gray-300'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — PRINTING STEPS
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-16">Printing Steps</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20">
            {STEPS.map((s) => (
              <div key={s.num} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img src={s.img} alt={s.title} className="w-full h-44 object-cover" />
                  <span className="absolute top-3 left-3 w-9 h-9 bg-orange-500 text-white font-extrabold text-lg rounded-full flex items-center justify-center shadow">
                    {s.num}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900">Simple Printing Steps, Made Business Easy</h3>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl bg-black aspect-video">
            <HlsVideo src="https://www.procolored.com/cdn/shop/videos/c/vp/963e20c65186449bb01b0440d41b81d9/963e20c65186449bb01b0440d41b81d9.m3u8?v=0" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — VERSATILE PRINTING INFINITE CAROUSEL
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Versatile Printing. Professional Results.</h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">Procolored DTF technology adapts to daily fabric — light or dark, soft or textured. F13 Pro DTF printer gives you freedom to create beyond boundaries.</p>
        </div>
        <div className="relative w-full overflow-hidden group">
          <div className="flex flex-nowrap w-max">
            <div className="flex flex-shrink-0 infinite-scroll gap-4 pr-4">
              {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((c, i) => (
                <div key={i} className="w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <img src={c.img} alt={c.item} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <p className="font-bold text-gray-900 mb-3">{c.item}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600"><span>Retail Price</span><span className="font-semibold">${c.retail.toFixed(2)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>Material Cost</span><span className="font-semibold">${c.cost.toFixed(2)}</span></div>
                      <div className="flex justify-between text-green-600 font-bold"><span>Profit</span><span>${c.profit.toFixed(2)}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-shrink-0 infinite-scroll gap-4 pr-4" aria-hidden="true">
              {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((c, i) => (
                <div key={`dup-${i}`} className="w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <img src={c.img} alt={c.item} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <p className="font-bold text-gray-900 mb-3">{c.item}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600"><span>Retail Price</span><span className="font-semibold">${c.retail.toFixed(2)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>Material Cost</span><span className="font-semibold">${c.cost.toFixed(2)}</span></div>
                      <div className="flex justify-between text-green-600 font-bold"><span>Profit</span><span>${c.profit.toFixed(2)}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — WHAT'S IN THE BOX
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">What's in the Box</h2>
          <div className="rounded-2xl overflow-hidden shadow border border-gray-100">
            <img src="https://www.procolored.com/cdn/shop/files/F13_pro_list_of_litem_1.jpg?v=1768382025&width=1100" alt="Box Contents" className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — PERFORMANCE & SPECIFICATIONS
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-10">Performance &amp; Specifications</h2>
          {/* Tab Switcher */}
          <div className="flex flex-wrap justify-center gap-1 p-1 bg-white rounded-full shadow border border-gray-100 mx-auto max-w-fit mb-12">
            {['Printer Specifications', 'Print Speed', 'Printer Comparison', 'Oven Comparison'].map((tab, i) => (
              <button key={i} onClick={() => setActiveSpecTab(i)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeSpecTab === i ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 0 — Printer Specs */}
          {activeSpecTab === 0 && (
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-2/5 flex justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/pro_left.png?v=1766560772&width=800" alt="F13 Pro Printer" className="max-w-xs w-full drop-shadow-xl" />
              </div>
              <div className="lg:w-3/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      {SPEC_ROWS.map(([label, value]) => (
                        <tr key={label} className="border-b border-gray-200 last:border-0">
                          <td className="py-3 pr-4 font-bold text-gray-900 w-2/5">{label}</td>
                          <td className="py-3 text-gray-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-gray-700">
                  <strong>Standard Supplies:</strong> DTF Ink Set (5×500ml: CCMMYK+WWWWWW) · Nozzle Protection Fluid (2×250ml) · Adhesive Powder 500g · PET Roll Film 13in×328ft
                </div>
              </div>
            </div>
          )}

          {/* Tab 1 — Print Speed */}
          {activeSpecTab === 1 && (
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { model: 'F13 Pro', printhead: 'Dual XP600', speed: '4.5 min/A4', daily: '13 pcs/hr', color: '#E85A24' },
                  { model: 'F13', printhead: 'Single L1800', speed: '7 min/A4', daily: '6 pcs/hr', color: '#374151' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl border-2 p-8 text-center shadow-sm" style={{ borderColor: item.color }}>
                    <h3 className="text-2xl font-extrabold mb-2" style={{ color: item.color }}>{item.model}</h3>
                    <div className="text-4xl font-black text-gray-900 mb-2">{item.speed}</div>
                    <p className="text-sm text-gray-500 mb-1">Printhead: {item.printhead}</p>
                    <p className="text-sm text-gray-600">{item.daily} capacity</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <p className="text-gray-700">💡 The F13 Pro's dual XP600 setup prints <strong>2.4×faster</strong> than the F13, enabling dramatically higher daily output and profit potential.</p>
              </div>
            </div>
          )}

          {/* Tab 2 — Printer Comparison */}
          {activeSpecTab === 2 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-4 px-6 text-left">Spec</th>
                    <th className="py-4 px-6 text-center bg-orange-500">F13 Pro ⭐</th>
                    <th className="py-4 px-6 text-center">F13</th>
                    <th className="py-4 px-6 text-center">K13 Lite</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Printhead', 'Dual XP600', 'L1800', 'LH-500'],
                    ['Print Speed', '4.5min/A4', '7min/A4', '4.5min/A4'],
                    ['Resolution', '720×1440', '1440×1440', '720×1440'],
                    ['Prints/Hour', '13pcs', '6pcs', '13pcs'],
                    ['Ink Config', 'CCMMYK+WWWWWW', 'CMYK+WW', 'CMYK+W'],
                    ['Weight', '86lb (39kg)', '44lb (20kg)', '40lb (18kg)'],
                  ].map(([spec, pro, f13, k13], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-6 font-semibold text-gray-800">{spec}</td>
                      <td className="py-3 px-6 text-center text-orange-600 font-bold">{pro}</td>
                      <td className="py-3 px-6 text-center text-gray-600">{f13}</td>
                      <td className="py-3 px-6 text-center text-gray-600">{k13}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3 — Oven Comparison */}
          {activeSpecTab === 3 && (
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Standard DTF Oven', badge: 'Included in Bundle', badgeBg: 'bg-gray-700', features: ['Compatible with F13 Pro', 'Even adhesive powder curing', 'Temperature control panel', 'Basic ventilation'] },
                { name: 'Smokeless DTF Oven', badge: 'Best for Indoors', badgeBg: 'bg-orange-500', features: ['Built-in air filtration', 'Reduces powder smoke & odors', 'Safer for enclosed workspaces', 'Better for indoor environments'] },
              ].map((oven, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${oven.badgeBg} mb-3 inline-block`}>{oven.badge}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{oven.name}</h3>
                  <ul className="space-y-2">
                    {oven.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-gray-700 text-sm">
                        <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 10 — RELIABLE SUPPORT
      ═══════════════════════════════════════════════════════ */}
      <div className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-14">Reliable Support, Wherever You Are</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Headphones, label: 'Customer Support', desc: '24/7 availability with expert reps ready to resolve any issue.' },
              { Icon: BookOpen, label: 'Engineer Support', desc: 'Direct line to certified print engineers for technical assistance.' },
              { Icon: Video, label: 'Video Tutorials', desc: 'Step-by-step video guides for setup, operation, and maintenance.' },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col items-center group hover:shadow-md transition">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm group-hover:-translate-y-2 transition-transform">
                  <Icon className="w-10 h-10 text-orange-500" />
                </div>
                <p className="font-bold text-lg text-gray-900 mb-2">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 11 — YOUR INVESTMENT, YOUR GROWTH
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/1_1_1.png?v=1766195088&width=700" alt="Growth" className="w-full drop-shadow-xl" />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl font-extrabold text-gray-900">Your Investment, Your Growth</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Executive Size Prints [8.5"×14"] · 450+ Shirts/week</p>
              <div className="space-y-3">
                {[
                  ['Retail Price per Shirt', '$25.90'],
                  ['Material Cost', '$5.00'],
                  ['Print Cost (DTF)', '$1.35'],
                  ['Equipment Cost (per shirt)', '$0.20'],
                  ['Waste (15%)', '$0.99'],
                  ['Output per Hour', '13 units/hr'],
                  ['Profit per 5-Hour Day', '$1,319.55'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600 text-sm">{label}</span>
                    <span className="font-bold text-gray-900 text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 12 — FAQs
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <Accordion key={i} q={faq.q} a={faq.a} open={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 13 — CUSTOMER REVIEWS
      ═══════════════════════════════════════════════════════ */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Customer Reviews</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-7 h-7 fill-orange-400 text-orange-400" />)}
              </div>
              <span className="text-2xl font-extrabold text-gray-900">4.9 / 5</span>
              <span className="text-gray-500">({REVIEWS.length} reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
