import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Star, ChevronLeft, ChevronRight, ChevronDown, Headphones, BookOpen, Video, HelpCircle, Check, Tag, AlertCircle, Gift, Truck, Shield, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─────────────────────────────────────────────────────────────────────────────
// HlsVideo – auto-plays HLS or MP4, fully muted and looping
// ─────────────────────────────────────────────────────────────────────────────
function HlsVideo({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.play().catch(() => {});
      }
    } else {
      video.src = src;
      video.play().catch(() => {});
    }
  }, [src]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      className={className}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function F13Product() {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState(0);

  const DISCOUNT_PERCENT = 5;

  const options = [
    {
      label: 'F13+Oven',
      badge: 'Most Popular Choice',
      originalUSD: 3_499,
      saleUSD: 2_999,
      savingUSD: 500,
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      label: 'F13+Oven+Heat Press',
      badge: 'Complete Printing Bundle',
      originalUSD: 3_799,
      saleUSD: 3_299,
      savingUSD: 500,
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      label: 'F13+Smokeless Oven',
      badge: 'Extra $200 OFF for Member',
      originalUSD: 3_999,
      saleUSD: 3_499,
      savingUSD: 500,
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
    {
      label: 'F13+Smokeless Oven+Heat Press',
      badge: 'Extra $200 OFF for Member',
      originalUSD: 4_399,
      saleUSD: 3_799,
      savingUSD: 600,
      img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800',
    },
  ];

  const currentOption = options[selectedOption];
  const finalPrice = couponApplied
    ? Math.round(currentOption.saleUSD * (1 - DISCOUNT_PERCENT / 100))
    : currentOption.saleUSD;
  const couponSaving = couponApplied ? currentOption.saleUSD - finalPrice : 0;

  function applyCoupon() {
    if (couponCode.trim().toLowerCase() === 'procolored5') {
      setCouponApplied(true);
    }
  }

  const galleryImages = [
    'https://www.procolored.com/cdn/shop/files/Procolored_F13_DTF_Printer_Fan_Appreciation_Sale__2_1220x_crop_center.jpg?v=1770806196',
    'https://www.procolored.com/cdn/shop/files/F13_3_1220x_crop_center.png?v=1770806196',
    'https://www.procolored.com/cdn/shop/files/F13-DTF-Printer_1_1220x_crop_center.png?v=1770806196',
    'https://www.procolored.com/cdn/shop/files/F13_6_1220x_crop_center.png?v=1770806196',
    'https://www.procolored.com/cdn/shop/files/F13_7_1220x_crop_center.png?v=1770806196',
  ];

  const coreFeatures = [
    {
      title: 'White Ink Circulation',
      description:
        'The newly designed system combines stirring, circulation, and filtration for improved performance. This upgrade ensures better ink flow, reduces the risk of printhead clogging, and extends the lifespan of your DTF printer, keeping your prints sharp and consistent over time.',
      src: 'https://www.procolored.com/cdn/shop/videos/c/vp/3ab6aa606e2647319d815147d4801e4f/3ab6aa606e2647319d815147d4801e4f.m3u8?v=0',
    },
    {
      title: 'Smooth & Buckling-Free Printing',
      description:
        'The printing bed of F13 features fine holes that generate stable and consistent suction, keeping the film flat and preventing it from lifting or buckling during the printing work, result in smooth and high-quality transfers.',
      src: 'https://www.procolored.com/cdn/shop/videos/c/vp/5386aa9d19d64cacbea9ab011de6c45f/5386aa9d19d64cacbea9ab011de6c45f.m3u8?v=0',
    },
    {
      title: 'Printhead Auto-Cleaning',
      description:
        'When printer is left on, it will automatically clean the printhead every 10 hours. If you are on vacation, please keep the printer powered on for regular self-cleaning (Consuming about 1ml ink per day.). And it is best to replace the ink cartridges with moisture-retaining cartridges.',
      src: 'https://www.procolored.com/cdn/shop/videos/c/vp/39fcc429780f4922bde662d61a80926d/39fcc429780f4922bde662d61a80926d.m3u8?v=0',
    },
  ];

  const allFeatures = [
    {
      title: 'Ideal for Medium-Sized Shirt Businesses',
      description:
        'This printer delivers over 50 prints daily, offering a cost-effective solution for medium-sized shirt businesses looking to scale without heavy investment.',
      src: 'https://www.procolored.com/cdn/shop/videos/c/vp/a594a692718648b582b3650c6a63a52d/a594a692718648b582b3650c6a63a52d.HD-1080p-7.2Mbps-65819963.mp4?v=0',
    },
    {
      title: 'Convenient Protective Film Cutter',
      description:
        "The printer comes with a protective cutter, allowing for simple and safe slicing of the printed film. It's a must-have to make the printing workflow more streamlined and efficient.",
      src: 'https://www.procolored.com/cdn/shop/videos/c/vp/79b0f80481d6482cbcaa540e2e92851b/79b0f80481d6482cbcaa540e2e92851b.HD-1080p-7.2Mbps-40155037.mp4?v=0',
    },
    {
      title: 'Stable Print Speed',
      description:
        'F13 delivers reliable performance with a steady printing rhythm suited for small to medium workflows. With its optimized print engine, it consistently produces around 20–50 transfers per day, maintaining stable quality across each job.',
      src: 'https://www.procolored.com/cdn/shop/videos/c/vp/06852540a78245f7bceaec01db00fc43/06852540a78245f7bceaec01db00fc43.HD-1080p-7.2Mbps-65763741.mp4?v=0',
    },
    ...coreFeatures,
  ];

  const steps = [
    { num: '1', title: 'Design\nArrangement', image: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/1_0504a3ac-adfc-4fec-a94d-2c92149a8502.png?v=1765162454' },
    { num: '2', title: 'Printing', image: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/2_73b1b73f-33d0-444f-b7c6-9a34ddae0f56.png?v=1765162453' },
    { num: '3', title: 'Powdering', image: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_e7a0e187-b973-401c-a8d6-f1ab360b5739.png?v=1765162453' },
    { num: '4', title: 'Curing', image: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/4_e214e5d5-ba72-4c61-be67-ba65313a54d5.png?v=1765162454' },
    { num: '5', title: 'Heat Transfer', image: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/5_feeac855-3f47-45da-a168-b287ec0e59e7.png?v=1765162453' },
    { num: '6', title: 'Peeling', image: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/6_352a7d16-ab35-4c7c-b79a-56235510dfad.png?v=1765162453' },
  ];

  const faqs = [
    { q: 'What are the differences between F13 and F13 Pro?', a: 'F13 Pro has 2 print heads, while F13 only has one, so F13 Pro prints at 2× the speed of F13.' },
    { q: 'Does the RIP software run on a MacBook?', a: 'No, the RIP software is designed exclusively for Windows OS. MacBook users must use virtualization software like Parallels or BootCamp.' },
    { q: 'Do I need to pay for the RIP software? Can I edit my design with it?', a: 'The Pro RIP software is included completely free with your printer purchase. It allows for basic image editing and layout, but for heavy design work we recommend Photoshop, Illustrator, or CorelDraw.' },
    { q: 'What is your after-sales warranty policy, and where can I get tech support?', a: 'We provide a 12-month warranty on non-ink-contacting parts and a 6-month warranty on the printhead. Reach us anytime at support@procollored.com.' },
    { q: 'What is the printing cost per print?', a: 'It generally costs less than $0.50–$1.00 per A4/Letter size print, enabling high profit margins.' },
    { q: 'Can I pay with two cards? Do you have a financing option?', a: 'Yes! We support split payments and offer financing via Klarna, Shop Pay Installments, or Affirm.' },
    { q: 'What is the maximum length it can print with roll film?', a: 'With roll film the printing length is unlimited, constrained only by roll length (typically 328 ft / 100 m).' },
    { q: 'How fast can it print?', a: 'Approximately 6 Letter/A4 prints per hour — around 20–50 quality transfers per dedicated workday.' },
    { q: 'Is the maintenance process complicated?', a: 'Not at all. The F13 auto-cleans every 10 hours when powered on. Basic daily maintenance takes just minutes.' },
  ];

  const specRows = [
    ['Model', 'F13', 'Printhead Type', 'L1800'],
    ['Printhead Config', 'Single Array', 'Film Feed', 'Roll-fed'],
    ['Film Cutter', 'Yes', 'Prints per Hour', '6pcs (Letter/A4 Size)'],
    ['Print Width', '13"(330mm)', 'Print Speed', 'Letter/A4: 7min'],
    ['Ink Consumption', 'Letter/A4: 3.75ml', 'Product Weight(N)', '44 lb (20 kg)'],
    ['Max Resolution', '1440*1440 DPI (8 PASS)', 'Color Configuration', 'CMYK+WW'],
    ['Software', 'Pro RIP', 'Applicable System', 'Windows OS'],
    ['Product Size', '33"*15"*11.8" (84*38*30cm)', 'Standard Supplies', 'DTF Ink Set(5×250ml:CMYKW)\nNozzle Protection Fluid(1×250ml)\nAdhesive Powder (500g)\nPET Roll Film (13in × 328ft / 33cm×100m)'],
  ];

  const marqueeRow1 = [
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_537.png?v=1766386278&width=550", w: "w-[300px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_541.png?v=1766386282&width=550", w: "w-[400px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_541.png?v=1766386282&width=550", w: "w-[280px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_536.png?v=1766386281&width=550", w: "w-[340px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_2375.png?v=1766386279&width=550", w: "w-[260px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_2377.png?v=1766386278&width=550", w: "w-[360px]" },
  ];

  const marqueeRow2 = [
    { img: "https://www.procolored.com/cdn/shop/files/printing_materials_3.png?v=1766386229&width=550", w: "w-[320px]" },
    { img: "https://www.procolored.com/cdn/shop/files/printing_materials_7.png?v=1766386228&width=550", w: "w-[260px]" },
    { img: "https://www.procolored.com/cdn/shop/files/printing_materials_4.png?v=1766386228&width=550", w: "w-[420px]" },
    { img: "https://www.procolored.com/cdn/shop/files/printing_materials_6.png?v=1766386228&width=550", w: "w-[240px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_2374.png?v=1766386273&width=550", w: "w-[360px]" },
  ];

  const marqueeRow3 = [
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_538.png?v=1766386259&width=550", w: "w-[380px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_529.png?v=1766386282&width=550", w: "w-[280px]" },
    { img: "https://www.procolored.com/cdn/shop/files/printing_materials_5.png?v=1766386229&width=550", w: "w-[320px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_2371.png?v=1766386274&width=550", w: "w-[260px]" },
    { img: "https://www.procolored.com/cdn/shop/files/Rectangle_543.png?v=1766386280&width=550", w: "w-[340px]" },
  ];

  const { addToCart } = useCart();

  return (
    <div className="bg-white font-sans overflow-hidden">
      <style>{`
        @keyframes marquee-left  { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        @keyframes marquee-right { from { transform:translateX(-50%) } to { transform:translateX(0) } }
        .marquee-l { animation: marquee-left  60s linear infinite; }
        .marquee-r { animation: marquee-right 60s linear infinite; }
        .marquee-wrap:hover .marquee-l,
        .marquee-wrap:hover .marquee-r { animation-play-state:paused; }
        .fade-in { opacity:0; transform:translateY(20px); transition:opacity .6s ease,transform .6s ease; }
        .fade-in.visible { opacity:1; transform:none; }
      `}</style>

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
        <a href="/" className="hover:underline">Home</a> / Procolored F13 Panda DTF Printer
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — Product Gallery + Buy Box
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Left — Gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square mb-3">
              <img src={galleryImages[activeImage]} alt="F13" className="w-full h-full object-contain p-4" />
              <button onClick={() => setActiveImage(p => (p === 0 ? galleryImages.length - 1 : p - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setActiveImage(p => (p === galleryImages.length - 1 ? 0 : p + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl border-2 overflow-hidden transition-all ${activeImage === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-400'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Buy Box */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Procolored F13 Panda DTF Printer 13&quot; A3 L1800 &amp; Oven
            </h1>
            <title>Procolored F13 Panda DTF Printer — Procolored US</title>

            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-orange-400 text-orange-400" />)}
              <span className="text-sm text-[#E07000] font-medium">496 reviews</span>
            </div>

            {/* Price row */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-bold">${finalPrice.toLocaleString()}.00 USD</span>
                    <span className="text-lg text-gray-400 line-through">${options[selectedOption].originalUSD.toLocaleString()}.00 USD</span>
              </div>
              <p className="text-sm text-[#E07000] flex items-center gap-1 mt-1">
                <Zap className="w-4 h-4" /> ${options[selectedOption].savingUSD} Off — Fan Appreciation Sale
              </p>
            </div>

            {/* $200 OFF card */}
            <div className="rounded-xl border-2 border-[#E07000] bg-orange-50 p-4 flex items-start justify-between gap-3">
              <div className="bg-[#E07000] text-white font-extrabold text-lg px-3 py-1 rounded-lg whitespace-nowrap">
                5% OFF
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">New Member Exclusive</p>
                <p className="text-sm text-gray-600">Use code <span className="font-bold text-[#E07000]">PROCOLORED5</span> to get 5% off your order</p>
              </div>
            </div>

            {/* Stock card */}
            <div className="rounded-xl border-2 border-[#E85A24] bg-red-50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-red-700">
                <AlertCircle className="w-5 h-5" /> Stock is running low. Don't Miss!
              </div>
              <span className="bg-[#E85A24] text-white text-sm font-bold px-3 py-1 rounded-full">🔥 Only 17 pcs left!</span>
            </div>

            {/* Coupon row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value); setCouponApplied(false); }}
                  placeholder="Enter coupon code  (try PROCOLORED5)"
                  className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <button onClick={applyCoupon} className="px-5 py-3 bg-[#E07000] text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition">Apply</button>
            </div>
            {couponApplied && (
              <p className="text-green-600 text-sm font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Coupon applied! You save ${couponSaving.toLocaleString()}.00 USD
              </p>
            )}

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900">Options</p>
                <span className="text-[#E07000] text-sm underline cursor-pointer">Compare &gt;</span>
              </div>
              <div className="flex flex-col gap-3">
                {options.map((opt, i) => (
                  <button key={i} onClick={() => setSelectedOption(i)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedOption === i ? 'border-[#E07000] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <img src={opt.img} alt={opt.label} className="w-14 h-14 object-contain rounded-lg border border-gray-100" />
                    <div className="flex-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${i === 0 ? 'bg-[#E07000] text-white' : 'bg-orange-100 text-[#E07000]'}`}>{opt.badge}</span>
                      <p className="font-bold text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-400 line-through">${opt.originalUSD.toLocaleString()}.00 USD</p>
                      <p className="text-sm text-[#E07000] font-bold">${opt.savingUSD} Off → ${(couponApplied && selectedOption === i ? finalPrice : opt.saleUSD).toLocaleString()}.00 USD</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* What's in the box */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2">What's In The Box</p>
              <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
                <li>F13 Panda DTF Printer(L1800)</li>
                <li>Oven For DTF Printer</li>
                <li>Full Set of Initial Ink (CMYKW 5*250ml)</li>
                <li>Adhesive Powder 500g</li>
                <li>Printhead Moisturizing Device</li>
                <li>Nozzle Protection Fluid 1*250ml</li>
                <li>PET Roll Film(100m)</li>
                <li>Procolored RIP Software(Windows OS only, C drive ≥ 50GB, RAM ≥ 8GB)</li>
                <li>USB Dongle</li>
                <li>Power Cable/USB Interface Cable</li>
              </ul>
            </div>

            {/* Badge row */}
            <div className="flex items-center gap-4 flex-wrap text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-green-600" /> Free Shipping</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-600" /> 1 Year Printhead Warranty</span>
              <span className="flex items-center gap-1"><Gift className="w-4 h-4 text-orange-500" /> 14–17 Business Days Delivery</span>
            </div>

            {/* Quantity + cart */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex border border-gray-300 rounded-xl h-14 overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-5 font-bold text-gray-700 hover:bg-gray-100 transition">-</button>
                <span className="px-6 flex items-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-5 font-bold text-gray-700 hover:bg-gray-100 transition">+</button>
              </div>
              <button onClick={() => addToCart({ id: 'f13-' + selectedOption, name: currentOption.label, price: `$USD:${finalPrice}`, image: currentOption.img, quantity })} className="flex-1 border-2 border-[#E07000] text-[#E07000] font-bold rounded-xl h-14 hover:bg-orange-50 transition text-lg">Add to cart</button>
              <button 
                onClick={() => {
                  addToCart({ id: 'f13-' + selectedOption, name: currentOption.label, price: `$USD:${finalPrice}`, image: currentOption.img, quantity });
                  window.location.href = '/checkout';
                }} 
                className="flex-1 bg-indigo-700 text-white font-bold rounded-xl h-14 hover:bg-indigo-800 transition text-lg"
              >
                Buy with Shop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — Hero Banner
      ══════════════════════════════════════════════════════════════ */}
      <div className="w-full">
        <img src="https://www.procolored.com/cdn/shop/files/F13_pro_model_pc3.png?v=1766746260&width=1500" alt="Lifestyle Banner" className="w-full h-auto object-cover" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2.5 — A3 Print Size Customization
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            A3 Print Size for More Versatile Customization
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            The A3 print size is perfect for a variety of items, from shirts to tote bags, flags, and caps. Offer more customization options and attract a broader range of customers.
          </p>
        </div>

        <div className="w-full relative flex flex-col gap-2 sm:gap-3">
          {/* Row 1 */}
          <div className="flex w-max" style={{ animation: 'marquee-left 45s linear infinite' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-2 sm:gap-3 px-1 sm:px-1.5 shrink-0">
                {marqueeRow1.map((item, idx) => (
                  <img key={idx} src={item.img} className={`${item.w} h-[180px] sm:h-[240px] rounded-2xl object-cover flex-shrink-0 bg-gray-50`} alt="" loading="lazy" />
                ))}
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex w-max" style={{ animation: 'marquee-left 60s linear infinite' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-2 sm:gap-3 px-1 sm:px-1.5 shrink-0">
                {marqueeRow2.map((item, idx) => (
                  <img key={idx} src={item.img} className={`${item.w} h-[180px] sm:h-[240px] rounded-2xl object-cover flex-shrink-0 bg-gray-50`} alt="" loading="lazy" />
                ))}
              </div>
            ))}
          </div>
          {/* Row 3 */}
          <div className="flex w-max" style={{ animation: 'marquee-left 50s linear infinite' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-2 sm:gap-3 px-1 sm:px-1.5 shrink-0">
                {marqueeRow3.map((item, idx) => (
                  <img key={idx} src={item.img} className={`${item.w} h-[180px] sm:h-[240px] rounded-2xl object-cover flex-shrink-0 bg-gray-50`} alt="" loading="lazy" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — Profitable Printing Solutions
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/1_1_1.png?v=1766195088&width=700" alt="Growth Chart" className="w-full h-auto object-contain drop-shadow-lg" />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl font-extrabold text-gray-900">Profitable Printing Solutions</h2>
              <h3 className="text-2xl font-bold text-gray-700">High-Profit Potential, Rapid ROI</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                The Procolored F13 DTF printer equips you with everything you need to skyrocket your apparel decoration business. The remarkably low running cost allows for incredible margin growth on every shirt printed. Experience stable operations, continuous ink feeding, and durable transfer films. Create stunning full-color designs for less than a dollar, selling premium customized items at maximum retail value.
              </p>
              <ul className="space-y-3 text-gray-700 font-medium">
                {['Low ink consumption per print', 'Fast production turnover rate', 'Vast blank apparel compatibility'].map(t => (
                  <li key={t} className="flex items-center gap-3"><span className="w-2 h-2 bg-[#E07000] rounded-full shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — 1440×1440 DPI
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">1440×1440 DPI High Resolution</h2>
          <p className="text-gray-500 text-lg mb-16 max-w-3xl mx-auto">Experience exceptional print clarity and vibrant color reproduction. The L1800 printhead captures the finest details of your intricate designs.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              'https://www.procolored.com/cdn/shop/files/Rectangle_1_2adef20d-a242-45f2-af5d-a47f074ce76f.png?v=1765185979&width=550',
              'https://www.procolored.com/cdn/shop/files/Rectangle_3257_2.png?v=1765185998&width=550',
              'https://www.procolored.com/cdn/shop/files/Rectangle_3257_3.png?v=1765186014&width=550',
            ].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <img src={src} alt={`DPI ${i + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — Core Technology (3-row bento — HLS only)
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          {coreFeatures.map((f, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100`}>
              <div className="w-full md:w-3/5 bg-black overflow-hidden" style={{ minHeight: 280 }}>
                <HlsVideo src={f.src} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-2/5 flex flex-col justify-center p-10">
                <div className="w-10 h-1 bg-[#E85A24] mb-5 rounded-full" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6b — Extra 3 Feature Videos (MP4 alternating layout)
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-28">
          {allFeatures.slice(0, 3).map((f, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <div className="w-12 h-1 bg-[#E85A24] mb-6 rounded-full" />
                <h3 className="text-3xl font-bold text-gray-900 mb-5">{f.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{f.description}</p>
              </div>
              <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-xl bg-black aspect-video">
                <HlsVideo src={f.src} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7 — Dual Feeding System
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Dual Feeding System — Adapt to Every Project</h2>
            <p className="text-gray-500 text-xl">Flatbed and roll feeding in one printer — designed for versatile creators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Roll Film Feeding', feats: ['Support A3/A4 Roll Film', 'Suitable for continuous production', 'Automatic tension control'], src: 'https://www.procolored.com/cdn/shop/videos/c/vp/9567f2f666f843d29aacfd4eb56e6e6d/9567f2f666f843d29aacfd4eb56e6e6d.m3u8?v=0' },
              { title: 'Sheet Film Feeding', feats: ['Support A3/A4 Sheet Film', 'Suitable for Sample Making', 'Ideal for small-batch production'], src: 'https://www.procolored.com/cdn/shop/videos/c/vp/6056d352d0d144688f0e3cdd8808a056/6056d352d0d144688f0e3cdd8808a056.m3u8?v=0' },
            ].map((card, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col">
                <div className="aspect-[4/3] bg-black overflow-hidden">
                  <HlsVideo src={card.src} className="w-full h-full object-cover" />
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-5">{card.title}</h3>
                  <ul className="space-y-3 text-gray-700">
                    {card.feats.map(f => (
                      <li key={f} className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-900 shrink-0 stroke-[2.5]" />{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 8 — Printing Steps
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-black text-white py-24">
        {/* Steps row */}
        <div className="max-w-7xl mx-auto px-6 border-b border-gray-800 pb-20 mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-wide">Printing Steps</h2>
          <div className="flex overflow-x-auto md:overflow-visible hide-scrollbar items-start relative gap-8 md:gap-0 md:justify-between px-4 pb-6" style={{WebkitOverflowScrolling:'touch'}}>
            <div className="hidden md:block absolute top-[52px] left-[60px] right-[60px] border-t border-dashed border-gray-600" />
            {steps.map((s, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center text-center relative z-10 w-[120px]">
                <div className="w-[106px] h-[106px] rounded-full border-4 border-black bg-white overflow-hidden shadow-xl mb-4">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-[14px] text-gray-200 leading-tight whitespace-pre-line max-w-[100px]">{s.num}.{s.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description + video */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">From design to print in just simple steps. No complexity, only creativity.</h3>
            <ul className="space-y-4 text-gray-300">
              {['From Image Setup to Final Transfer', 'Pro Tips and Key Operating Guidelines', 'Troubleshooting and Quality Control Essentials', 'Print Results Across Materials and Applications'].map(t => (
                <li key={t} className="flex items-center gap-3"><Check className="w-5 h-5 text-white shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            <HlsVideo
              src="https://www.procolored.com/cdn/shop/videos/c/vp/a2c6843b25f2496fae2b003bdec04983/a2c6843b25f2496fae2b003bdec04983.m3u8?v=0"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════
          Specifications
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8">Explore detailed specifications and see how F13 outperforms the rest</h2>
          <div className="flex flex-wrap justify-center gap-1 p-1 bg-white rounded-full shadow border border-gray-100 mx-auto max-w-fit mb-10">
            {['Printer Specifications', 'Printer Comparison', 'Print Speed', 'Oven Comparison'].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveSpecTab(i)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeSpecTab === i ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >{tab}</button>
            ))}
          </div>

          {/* Tab 0 — Printer Specifications */}
          {activeSpecTab === 0 && (
            <>
              <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-14">Here you'll find the key F13 specs that actually matter—print size, resolution, ink setup, and system details—so you can quickly see whether this printer fits your workspace and production needs.</p>
              <div className="flex justify-center mb-14">
                <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/L1800-left_1_ff3bd565-f8d6-4779-8b9a-d709a2d77ae3.png?v=1766389693&width=800" alt="F13 Printer" className="max-w-[460px] w-full drop-shadow-xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                <div>
                  {specRows.map(([lab, val], i) => (
                    <div key={i} className="flex py-4 border-b border-gray-200 last:border-0">
                      <span className="font-bold text-gray-900 w-1/2 text-sm">{lab}</span>
                      <span className="text-gray-600 w-1/2 text-sm whitespace-pre-line">{val}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {specRows.map(([, , lab, val], i) => (
                    <div key={i} className="flex py-4 border-b border-gray-200 last:border-0">
                      <span className="font-bold text-gray-900 w-1/2 text-sm">{lab}</span>
                      <span className="text-gray-600 w-1/2 text-sm whitespace-pre-line">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tab 1 — Printer Comparison */}
          {activeSpecTab === 1 && (
            <div className="overflow-x-auto">
              <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-10">Compare how the F13 stacks up against the P13 and K13 Lite across key specifications.</p>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-4 px-6 text-left font-bold">Spec</th>
                    <th className="py-4 px-6 text-center font-bold bg-[#E85A24]">F13 ⭐</th>
                    <th className="py-4 px-6 text-center font-bold">P13</th>
                    <th className="py-4 px-6 text-center font-bold">K13 Lite</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Printhead', 'L1800', 'XP600', 'LH-500'],
                    ['Print Speed', '7min/A4', '4.5min/A4', '4.5min/A4'],
                    ['Resolution', '1440×1440', '720×1440', '720×1440'],
                    ['Film Feed', 'Roll-fed', 'Roll-fed', 'Roll-fed'],
                    ['Film Cutter', 'Yes', 'Yes', 'Yes'],
                    ['Print Width', '13" (330mm)', '13" (330mm)', '13" (330mm)'],
                    ['Ink Config', 'CMYK+WW', 'CMYK+WW', 'CMYK+W'],
                    ['Software', 'Pro RIP', 'Pro RIP', 'Studio Lite'],
                    ['OS Support', 'Windows', 'Windows', 'Windows'],
                    ['Weight', '44lb (20kg)', '44lb (20kg)', '40lb (18kg)'],
                  ].map(([spec, f13, p13, k13], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-6 font-semibold text-gray-800">{spec}</td>
                      <td className="py-3 px-6 text-center text-[#E85A24] font-bold">{f13}</td>
                      <td className="py-3 px-6 text-center text-gray-600">{p13}</td>
                      <td className="py-3 px-6 text-center text-gray-600">{k13}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2 — Print Speed */}
          {activeSpecTab === 2 && (
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-gray-500 text-lg mb-12">See how the F13 compares in print speed side by side with the P13 and K13 Lite.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { model: 'F13', speed: '7 min/A4', printhead: 'L1800', color: '#E85A24', note: 'Steady & reliable for daily production' },
                  { model: 'P13', speed: '4.5 min/A4', printhead: 'XP600', color: '#1a1a1a', note: 'Faster XP600 head, higher throughput' },
                  { model: 'K13 Lite', speed: '4.5 min/A4', printhead: 'LH-500', color: '#1a1a1a', note: 'Entry-level speed, great for hobbyists' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl border-2 p-6 text-center shadow-sm" style={{ borderColor: item.color }}>
                    <h3 className="text-2xl font-extrabold mb-2" style={{ color: item.color }}>{item.model}</h3>
                    <div className="text-4xl font-black text-gray-900 mb-2">{item.speed}</div>
                    <div className="text-sm text-gray-500 mb-4">Printhead: {item.printhead}</div>
                    <p className="text-sm text-gray-600">{item.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <p className="text-gray-700 font-medium">💡 While F13's L1800 printhead prints slightly slower per page, it produces exceptional <strong>1440×1440 DPI</strong> resolution — ideal for high-quality, detailed transfers that command premium pricing.</p>
              </div>
            </div>
          )}

          {/* Tab 3 — Oven Comparison */}
          {activeSpecTab === 3 && (
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-gray-500 text-lg mb-12">Choose the right oven to complete your F13 DTF setup for maximum efficiency and print quality.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Standard DTF Oven', features: ['Compatible with F13', 'Cures adhesive powder evenly', 'Temperature control', 'Basic ventilation'], badge: 'Included in Bundle', badgeColor: 'bg-gray-700' },
                  { name: 'Smokeless DTF Oven', features: ['Compatible with F13', 'Built-in air filtration system', 'Reduces powder smoke & odors', 'Better for indoor environments', 'Safer for enclosed workspaces'], badge: 'Best for Indoors', badgeColor: 'bg-[#E85A24]' },
                ].map((oven, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${oven.badgeColor} mb-3 inline-block`}>{oven.badge}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{oven.name}</h3>
                    <ul className="space-y-2">
                      {oven.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-2 h-2 bg-[#E85A24] rounded-full shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 9 — What's in the Box
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">What's in the Box</h2>
          <div className="rounded-2xl overflow-hidden shadow border border-gray-100">
            <img src="https://www.procolored.com/cdn/shop/files/F13_list_of_items_158c2a3b-89ef-488d-a8b5-c55572763413.jpg?v=1768358213&width=1500" alt="Box Contents" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 10 — Support Pillars
      ══════════════════════════════════════════════════════════════ */}
      <div className="py-20 bg-[#F7F7F7] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-14">Reliable Support, Wherever You Are</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Headphones, label: 'Customer Support' },
              { icon: BookOpen, label: 'Engineer Support' },
              { icon: Video, label: 'Video Tutorials' },
              { icon: HelpCircle, label: 'FAQs' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center group hover:shadow-md transition">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 group-hover:-translate-y-2 transition-transform shadow-sm">
                  <Icon className="w-10 h-10 text-[#E85A24]" />
                </div>
                <p className="font-bold text-lg text-gray-900">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 11 — FAQ Accordion
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'shadow-lg' : 'hover:bg-gray-50'}`}>
              <button className="w-full text-left px-8 py-5 flex justify-between items-center font-bold text-gray-900 text-[17px]" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#E85A24]' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 border-t border-gray-100' : 'max-h-0'}`}>
                <p className="px-8 py-5 text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
