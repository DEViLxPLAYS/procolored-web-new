import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Star, ChevronLeft, ChevronRight, ChevronDown, Truck, Maximize2, Facebook, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─── HLS Video ───────────────────────────────────────────────────────────────
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

// ─── Data ────────────────────────────────────────────────────────────────────
const SHARED_IMGS = [
  'https://www.procolored.com/cdn/shop/files/P13-Clothing-Printer-2_1220x_crop_center.jpg?v=1773828985',
  'https://www.procolored.com/cdn/shop/files/P13-Clothing-Printer-1_1220x_crop_center.jpg?v=1773828985',
  'https://www.procolored.com/cdn/shop/files/Procolored_P13_DTF_Printer_10_1220x_crop_center.jpg?v=1773828985',
  'https://www.procolored.com/cdn/shop/files/P13_01_1220x_crop_center.jpg?v=1773828984',
];

const VARIANTS = [
  {
    id: 'p13', name: 'P13',
    sale: 3685, original: 4401, saving: 716,
    img: 'https://www.procolored.com/cdn/shop/files/4_0509d835-8dd9-4112-a045-524b6aab6293_1220x_crop_center.jpg?v=1773828984'
  },
  {
    id: 'p13-oven', name: 'P13+Oven',
    sale: 4093, original: 4708, saving: 615,
    img: 'https://www.procolored.com/cdn/shop/files/2_ec290ef0-a323-43bd-bf38-23001d95002f_1220x_crop_center.jpg?v=1773828985'
  },
  {
    id: 'p13-shaker', name: 'P13+Shaker',
    sale: 5323, original: 5835, saving: 512,
    img: 'https://www.procolored.com/cdn/shop/files/4_0509d835-8dd9-4112-a045-524b6aab6293_1220x_crop_center.jpg?v=1773828984'
  },
  {
    id: 'p13-oven-premium', name: 'P13+Smokeless Oven',
    sale: 4401, original: 5118, saving: 717,
    img: 'https://www.procolored.com/cdn/shop/files/6_4fbf9e9f-1f1e-457f-9892-3f9e05764db8_1220x_crop_center.jpg?v=1773828985'
  },
];

const TESTIMONIALS = [
  {
    name: 'Ann Folk',
    title: 'Impressed with the Reliability and Quality of Procolored\'s Printer',
    body: 'I\'ve had this printer for 42 days, and I\'m impressed. Despite hearing of DTF issues, this printer works flawlessly, with no error even without daily use. The print quality is amazing, and it\'s reliable. Though not the fastest, it\'s worth it. Procolored, thank you for an excellent printer. My small business appreciates it!'
  },
  {
    name: 'Geneva Swagg (Lowded Siren)',
    title: 'Procolored\'s Excellent Support: Back to Printing with Great Results',
    body: 'Procolored got me back up and running with great prints and colors after repairs. The tech team, especially Yi Yu and Gary, are dedicated and patient. I recommend Procolored for beginners in DTF. Go Procolored, keep up the great work!'
  },
  {
    name: 'MK SuperRitz',
    title: 'Exceptional Support and Impressive Results with the DTF Procolored Machine',
    body: 'I discovered the DTF Procolored machine a few months ago and I\'m delighted with the results. The exceptional customer service team resolved it remotely and reconfigured everything for optimal print quality. Highly satisfied 😊❤️'
  },
];

const PRINT_SIZES = [
  { type: 'Adult', size: '8.5"×11"', speed: '8 pcs/h' },
  { type: 'Kid', size: '8.5"×8.5"', speed: '11 pcs/h' },
  { type: 'Puppy', size: '5.5"×5.5"', speed: '24 pcs/h' },
  { type: 'Heart', size: '4.5"×4.5"', speed: '38 pcs/h' },
  { type: 'Sleeve', size: '2"×11.5"', speed: '34 pcs/h' },
  { type: 'Leg', size: '2.5"×14"', speed: '22 pcs/h' },
  { type: 'Cap', size: '5"×3"', speed: '52 pcs/h' },
  { type: 'Visor', size: '4.75"×2"', speed: '82 pcs/h' },
];

const WORKFLOW_STEPS = [
  { num: '①', label: 'RIP Process (Win/Mac)', desc: 'Arrange images in the RIP program', img: 'https://www.procolored.com/cdn/shop/files/bcc364c9c6a0e68a9370a321f733ee5f_690x_crop_center.png?v=1742871597' },
  { num: '②', label: 'Printing', desc: 'Print designs on the film', img: 'https://www.procolored.com/cdn/shop/files/0_0946b67f-94d7-4e58-bc6f-5fda5b234794_690x_crop_center.png?v=1742871634' },
  { num: '③', label: 'Powdering', desc: 'Apply adhesive powder on the prints', img: 'https://www.procolored.com/cdn/shop/files/1_a848ac2b-66d9-4d09-8a57-0fbf5f1ebf01_690x_crop_center.png?v=1742871680' },
  { num: '④', label: 'Curing', desc: 'Bake the prints in the oven', img: 'https://www.procolored.com/cdn/shop/files/2_9be46e68-7bc3-42d5-a088-a9ab0d250b5b_690x_crop_center.png?v=1742871710' },
  { num: '⑤', label: 'Heat Transfer', desc: 'Transfer the prints onto fabric', img: 'https://www.procolored.com/cdn/shop/files/5_9227791a-f462-4f25-847d-aa5882e42b38_690x_crop_center.png?v=1742871751' },
  { num: '⑥', label: 'Peeling', desc: 'After cooling, peel off the transfer film', img: 'https://www.procolored.com/cdn/shop/files/6_284fc01f-41b5-4d64-a5d0-2f0acd441585_690x_crop_center.png?v=1742871774' },
];

const REVIEWS = [
  { name: 'Brenda Degollado', rating: 5, date: '02/27/2026', title: 'exelente', body: '' },
  { name: 'Vette', rating: 5, date: '01/14/2026', title: 'P13 printer', body: 'I had an issue with colors printing & tech support successfully resolved the problem. My prints are perfect now.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function P13Product() {
  const [selectedVar, setSelectedVar] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [boxOpen, setBoxOpen] = useState(false);
  const [osTab, setOsTab] = useState<'MacOS' | 'Windows'>('Windows');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { addToCart } = useCart();

  const variant = VARIANTS[selectedVar];
  const galleryImgs = [variant.img, ...SHARED_IMGS];

  useEffect(() => { setActiveImg(0); }, [selectedVar]);

  const handleAddToCart = () => {
    addToCart({ id: variant.id, name: `Procolored P13 DTF Printer — ${variant.name}`, price: `$USD:${variant.sale}`, image: variant.img, quantity: 1 });
  };
  const handleBuyNow = () => {
    addToCart({ id: variant.id, name: `Procolored P13 DTF Printer — ${variant.name}`, price: `$USD:${variant.sale}`, image: variant.img, quantity: 1 });
    window.location.href = '/checkout';
  };

  return (
    <div className="bg-white font-sans">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 text-sm text-gray-500">
        <a href="/" className="hover:underline text-gray-800">Home</a>
        {' > '}Procolored P13 DTF Printer 13&quot; A3 XP600
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pt-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* LEFT — Gallery */}
          <div className="w-full lg:w-[48%] flex-shrink-0 flex flex-col gap-3">

            {/* Main image + side badges */}
            {/* Main image + right-side vertical promotional badges */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Side: Image + Strip + Packages + Thumbnails + Tabs */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Main image */}
                <div className="relative rounded-2xl overflow-hidden bg-white group w-full" style={{ aspectRatio: '1.2' }}>
                  <img src={galleryImgs[activeImg]} alt="P13 DTF Printer"
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]" />
                  <button onClick={() => setActiveImg(p => (p === 0 ? galleryImgs.length - 1 : p - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/10">
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button onClick={() => setActiveImg(p => (p === galleryImgs.length - 1 ? 0 : p + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/10">
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Strip bar */}
                <div className="flex items-center gap-0 overflow-hidden bg-blue-50 border border-blue-100 rounded-xl text-xs font-semibold text-gray-700 flex-wrap">
                  <span className="bg-red-500 text-white font-bold px-3 py-2 text-[11px] uppercase tracking-wider h-full flex items-center rounded-l-xl">P13 A3</span>
                  <span className="flex items-center gap-1.5 px-3 py-2 border-r border-blue-200"><Truck className="w-4 h-4 text-gray-800" /> Free Shipping</span>
                  <span className="px-3 py-2">💳 0% Interest Rate under $3000</span>
                </div>

                {/* Package thumbnails (Matches screenshot: Printer Supplies + Smokeless Oven etc depending on variant basically) */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { label: 'Printer Supplies ~$562', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_23fa8ae6-6fb0-4ca2-ba3e-a11804db4ecc.png?v=1758969178' },
                    { label: 'Smokeless Oven', img: 'https://www.procolored.com/cdn/shop/files/6_4fbf9e9f-1f1e-457f-9892-3f9e05764db8_1220x_crop_center.jpg?v=1773828985' },
                  ].map((pkg, i) => (
                    <div key={i} className="flex flex-col items-center bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-center transition hover:shadow-sm">
                      <div className="w-16 h-12 mb-2 flex items-center justify-center bg-white rounded overflow-hidden">
                        <img src={pkg.img} alt={pkg.label} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] text-gray-800 font-bold leading-tight px-1">{pkg.label}</span>
                    </div>
                  ))}
                </div>

                {/* Horizontal thumbnails under the packages */}
                <div className="flex gap-2 overflow-x-auto pb-1 mt-2 hide-scrollbar ps-1">
                  {galleryImgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-14 h-14 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all bg-white p-0.5 ${activeImg === i ? 'border-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}>
                      <img src={img} className="w-full h-full object-contain" alt="" />
                    </button>
                  ))}
                </div>

                {/* Tabs matching screenshot */}
                <div className="flex justify-center gap-6 mt-3 border-b border-gray-100 pb-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[11px] font-bold rounded-full">
                    <span className="text-sm">📦</span> Packages
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-gray-800 text-[11px] font-bold transition-colors">
                    <span className="text-sm">▶</span> Videos
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-gray-800 text-[11px] font-bold transition-colors">
                    <span className="text-sm">🖼</span> Features
                  </button>
                </div>
              </div>

              {/* Right Side Column (Promo banners) - exact match to screenshot 1 & 2 */}
              <div className="hidden md:flex flex-col gap-3 w-[140px] flex-shrink-0">
                <div className="bg-orange-50 border border-orange-100 rounded-xl pt-3 flex flex-col items-center justify-between h-[150px] overflow-hidden text-center sticky top-4 shadow-sm hover:shadow-md transition">
                  <div>
                    <p className="text-[11px] font-black text-orange-900 leading-tight">P13 Exclusive Offer</p>
                    <p className="text-lg font-black text-orange-700 mt-1">Up To <span className="text-xl">$700</span> Off</p>
                  </div>
                  <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/PC__2.jpg?v=1756376420" alt="gift" className="w-[120%] object-cover mt-2 mix-blend-multiply opacity-50" />
                </div>
                
                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-center shadow-sm">
                  <div className="text-orange-500 text-3xl font-black mb-1 tracking-tighter">10%</div>
                  <p className="text-[10px] font-bold text-gray-700 leading-tight">10% Consumables OFF for Your Next Purchase</p>
                </div>

                <div className="bg-black rounded-xl p-3 text-center border-t border-gray-800 shadow-xl overflow-hidden relative group">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-16 h-12 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center p-1">
                      <img src={VARIANTS[0].img} alt="Printer" className="w-full h-full object-contain filter brightness-110 drop-shadow-lg" />
                    </div>
                    <p className="text-[10px] font-bold text-white leading-tight">6-month Printhead Warranty</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
                </div>

                <div className="bg-gray-100 rounded-xl p-3 text-center border-b border-gray-300">
                  <div className="mx-auto bg-black text-white w-12 h-8 rounded mb-2 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-700 leading-tight">14–17 Days (Fast Delivery)</p>
                </div>
              </div>
            </div>


          </div>

          {/* RIGHT — Product Info */}
          <div className="w-full lg:w-[52%] flex flex-col gap-4">

            {/* Title + Stars */}
            <div>
              <h1 className="text-2xl md:text-[1.7rem] font-bold text-gray-900 leading-snug mb-2">
                Procolored P13 DTF Printer 13&quot; A3 XP600
              </h1>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-gray-500">38 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-orange-500">${variant.sale.toLocaleString()}.00 USD</span>
                <s className="text-base text-gray-400">${variant.original.toLocaleString()}.00 USD</s>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 text-xs font-bold text-red-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  🔴 P13 Exclusive Deal (Rs.{variant.saving * 278}.00 PKR Off)
                </span>
              </div>
            </div>

            {/* Low stock */}
            <div className="border border-pink-500 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl px-4 py-3 flex items-center justify-between gap-2 shadow-sm">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">!</span>
                Stock is running low. Don't Miss!
              </span>
              <span className="bg-orange-500 shadow drop-shadow text-white text-[11px] font-black px-3 py-1.5 rounded-full whitespace-nowrap">⏳ Only 10 pcs left!</span>
            </div>

            {/* Promo banner */}
            <div className="bg-gradient-to-r from-pink-300 to-pink-200 text-pink-900 rounded-xl px-4 py-3 text-sm font-bold opacity-90 transition hover:opacity-100 flex items-center gap-2 shadow-sm">
               P13 lowest at $3,599. Limited stock. Perfect home DTF starter.
            </div>

            {/* What's in the box */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setBoxOpen(o => !o)}
                className="w-full flex justify-between items-center px-4 py-3 font-semibold text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                What's In The Box
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${boxOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${boxOpen ? 'max-h-32' : 'max-h-0'}`}>
                <div className="px-4 pb-3 border-t border-gray-100">
                  <ul className="text-xs text-gray-600 space-y-1 mt-2 list-disc list-inside">
                    <li>P13 DTF Printer (XP600)</li>
                  </ul>
                  <button className="text-orange-500 text-xs font-semibold mt-1.5 hover:underline">View More</button>
                </div>
              </div>
            </div>

            {/* Options / Variant selector — matches screenshot exactly */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900 text-sm">Options</p>
                <button className="text-blue-500 text-xs hover:underline">Compare &gt;</button>
              </div>
              <div className="flex flex-col gap-3">
                {VARIANTS.map((v, i) => (
                  <button key={i} onClick={() => setSelectedVar(i)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all bg-white shadow-sm hover:shadow ${selectedVar === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    {/* Orange badge perfectly matched to screenshot */}
                    <span className="absolute -top-[1.5px] -right-[1.5px] bg-orange-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-bl-xl border overflow-hidden rounded-tr-xl">
                      P13 Exclusive Deal
                    </span>
                    <img src={v.img} alt={v.name} className="w-16 h-12 object-contain rounded flex-shrink-0" />
                    <div className="flex flex-1 justify-between items-center min-w-0">
                      <div>
                        <p className="font-bold text-gray-900 text-[13px]">{v.name}</p>
                        <span className="bg-pink-50 text-pink-600 border border-pink-100/50 text-[10px] font-bold px-1.5 py-0.5 rounded inline-block mt-0.5 tracking-tight">
                          Rs.{(v.saving * 278).toLocaleString()}.00 Off
                        </span>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-[10px] leading-none mb-0.5"><s className="text-gray-400 font-medium">Rs.{(v.original * 278).toLocaleString()}.00 PKR</s></p>
                        <p className="text-[13px] font-black text-gray-900 tracking-tight">Rs.{(v.sale * 278).toLocaleString()}.00 PKR</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Version selector */}
            <div>
              <p className="font-bold text-gray-900 text-sm mb-2">Version</p>
              <div className="grid grid-cols-2 gap-2">
                {(['MacOS', 'Windows'] as const).map(os => (
                  <button key={os} onClick={() => setOsTab(os as 'MacOS' | 'Windows')}
                    className={`py-3 rounded-[4px] border border-gray-200 text-sm font-medium transition-all ${osTab === os ? 'border-orange-500 text-orange-600 bg-orange-50' : 'text-gray-800 hover:border-gray-300 shadow-sm'}`}>
                    {os}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <button onClick={handleAddToCart}
                className="w-full border shadow font-medium bg-white border-orange-500 text-orange-500 rounded text-[15px] pt-3 pb-3  transition hover:bg-orange-50">
                Add to cart
              </button>
              <button onClick={handleBuyNow}
                className="w-full bg-[#5a31f4] text-white font-bold rounded py-3.5 hover:bg-[#4a26d1] transition text-[15px]">
                Buy with <span className="font-extrabold tracking-tight ms-0.5">shop</span>
              </button>
              <a href="/checkout" className="text-center text-xs text-gray-500 underline hover:text-gray-700">More payment options</a>
            </div>

            {/* Payment icons */}
            <div className="flex flex-wrap gap-1.5">
              {['Amex','Apple Pay','Google Pay','Mastercard','PayPal','Shop Pay','Visa','Klarna'].map(p => (
                <span key={p} className="text-[10px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-medium text-gray-600">{p}</span>
              ))}
            </div>

            {/* Book a Demo */}
            <div className="bg-orange-500 rounded-2xl p-4 text-white">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">Procolored Product Demo | Free Reserve Now</p>
                  <p className="text-xs text-orange-100 mt-1 leading-relaxed">Try before you buy! Experience Printer features and solve your Startup questions.</p>
                  <button className="mt-2 border border-white text-white font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-white hover:text-orange-500 transition-colors">
                    Book it now
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-orange-400 flex flex-wrap gap-3 text-[11px] text-orange-100">
                <span>📋 Resources</span>
                <span>📦 14–17 Business Days Delivery</span>
                <span>📖 Instruction Manual</span>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Share2 className="w-3.5 h-3.5" /> Share:
              <a href="#" className="flex items-center gap-1 hover:text-blue-600 font-medium"><Facebook className="w-3.5 h-3.5" /> Facebook</a>
              <a href="#" className="hover:text-gray-800 font-medium">𝕏 X</a>
              <a href="#" className="hover:text-pink-600 font-medium">📌 Pinterest</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — FROM GARAGE TO LIVING ROOM
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#FAF6F0' }} className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">From Garage to Living Room</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-8">
            For years, many of our customers started their businesses from their garages or spare rooms, so we want to design a DTF printer that feels more like part of the family, not just a production tool. The living room should be a space where a parent balances work, passion, and family life.
          </p>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src="https://www.procolored.com/cdn/shop/files/1_76bb833d-6f61-4c62-8a96-3b40c4e05471.png?v=1743679940&width=1500"
              alt="From Garage to Living Room" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — NATURAL DESIGN
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#FAF6F0' }} className="py-16 px-4 border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Design Philosophy</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Natural Design for Daily Comfort</h2>
          <p className="text-xl font-semibold text-gray-600 mb-3">Woodgrain warmth, rounded edges</p>
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mb-8">
            Gone are the cold, industrial corners. P13's design echoes your favorite furniture, with woodgrain finish and rounded curves that invite touch. It blends seamlessly into your living space.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/2_0e2a548c-fb52-4bbe-91a0-b5adca85acce.png?v=1743680664&width=800" alt="Design 1" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/3_6dab9b83-c7ae-4db4-8a9f-850e46e073c7.png?v=1743680664&width=800" alt="Design 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 — LARGE VIEWING WINDOW
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Innovation</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Large Viewing Window</h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-2xl mb-8">
            No more lifting lids to check progress. The expansive viewing window lets you glance at prints easily.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-black aspect-video overflow-hidden">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover"
                src="https://cdn.shopify.com/videos/c/o/v/f29e7a10a71d41a89b4361e38079d038.mp4" />
            </div>
            <div className="overflow-hidden">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/4_8f21ed04-0c1b-4293-9e4a-b5817112e205.png?v=1743681108&width=800"
                alt="Viewing Window" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 — LESS NOISE
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#FAF6F0' }} className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Comfort</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Less Noise</h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
            While not whisper-silent, P13 sounds softer. We line cable chains with sound-absorbing foam. 50% quieter than industrial DTF printers.
          </p>
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-video max-w-4xl mx-auto bg-black">
            <HlsVideo
              src="https://www.procolored.com/cdn/shop/videos/c/vp/e5f18bb0c4db46b593ec2f374964b81d/e5f18bb0c4db46b593ec2f374964b81d.m3u8?v=0"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 6 — SAFETY BUILT FOR FAMILY LIFE
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#000000' }} className="py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-3">Safety First</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Safety Built for Family Life</h2>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-3">Smart Emergency Stop</h3>
            <p className="text-gray-400 text-base mb-5 max-w-2xl">
              P13's photoelectric detection system originally designed to detect film errors, instantly halts printing if it senses unexpected contact.
            </p>
            <div className="rounded-3xl overflow-hidden aspect-video max-w-4xl bg-gray-900">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover"
                src="https://cdn.shopify.com/videos/c/o/v/772de1b453244396b04b6f34e6752029.mp4" />
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-3">Gentle Alert</h3>
            <p className="text-gray-400 text-base mb-5 max-w-2xl">
              A built-in waste ink alarm alerts you before spills threaten your floors. No more midnight cleanup surprises.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-3xl overflow-hidden aspect-video bg-gray-900">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover"
                  src="https://cdn.shopify.com/videos/c/o/v/85f004ade09846e5b107f09fd944040b.mp4" />
              </div>
              <div className="rounded-3xl overflow-hidden">
                <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/9_549b3530-68b1-4050-8b8c-eaaaeb94a64a.png?v=1743681805"
                  alt="Gentle Alert" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Modular Design</h3>
            <p className="text-gray-400 text-base mb-5 max-w-2xl">
              No tangled wires, safer and cleaner layouts and every component has its place, making maintenance more simple.
            </p>
            <div className="rounded-3xl overflow-hidden aspect-video max-w-4xl bg-gray-900">
              <HlsVideo
                src="https://www.procolored.com/cdn/shop/videos/c/vp/d0f18d5546744866b06515dadc1cf402/d0f18d5546744866b06515dadc1cf402.m3u8?v=0"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 7 — COLOR CALIBRATION
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 items-center mb-10">
            <div className="lg:w-1/2">
              <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Color Science</p>
              <h2 className="text-4xl font-black text-gray-900 mb-3">Advanced Color Calibration</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                The color curve of the printer has undergone professional field testing, enabling more accurate color reproduction and deliver astonishing outputs.
              </p>
            </div>
            <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-xl">
              <img src="https://www.procolored.com/cdn/shop/files/Normal_curve.jpg?v=1744709659&width=2000"
                alt="Color Curve" className="w-full h-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'ISO12647', sub: 'Standard-compliant Color Experts', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/20250417-163807.png?v=1744879119' },
              { label: 'G7', sub: 'Certified Color Accuracy', img: 'https://cdn.shopify.com/s/files/1/0509/3454/6613/files/20250417-163817.png?v=1744879120' },
            ].map(cert => (
              <div key={cert.label} className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
                <img src={cert.img} alt={cert.label} className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-gray-100 flex-shrink-0" />
                <div>
                  <p className="font-black text-xl text-gray-900">{cert.label}</p>
                  <p className="text-gray-600 text-sm">{cert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 8 — TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Customer Testimonials</h2>
            <div className="flex gap-2">
              <button onClick={() => setTestimonialIdx(i => (i === 0 ? TESTIMONIALS.length - 1 : i - 1))}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setTestimonialIdx(i => (i === TESTIMONIALS.length - 1 ? 0 : i + 1))}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`bg-gray-50 border-2 rounded-2xl p-5 transition-all ${i === testimonialIdx ? 'border-orange-500 shadow-lg' : 'border-gray-200'}`}>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />)}
                </div>
                <p className="font-bold text-gray-900 text-sm mb-2">"{t.title}"</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{t.body}</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-700 text-xs">— {t.name}</p>
                  <a href="#" className="text-orange-500 text-xs font-semibold hover:underline">Learn more &gt;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 9 — PRINT SIZES
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-10">Print Sizes</h2>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 flex justify-center">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/pc_983c0d96-36aa-4c9e-8fff-351b24191a26.png?v=1744254490&width=600"
                alt="Print Sizes" className="max-w-sm w-full drop-shadow-lg" />
            </div>
            <div className="lg:w-1/2 w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm rounded-2xl overflow-hidden shadow-md">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="py-3 px-4 text-left font-bold">DTF Prints</th>
                    <th className="py-3 px-4 text-left font-bold">Common Size</th>
                    <th className="py-3 px-4 text-left font-bold">Print Speed</th>
                  </tr>
                </thead>
                <tbody>
                  {PRINT_SIZES.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                      <td className="py-2.5 px-4 font-semibold text-gray-800">{row.type}</td>
                      <td className="py-2.5 px-4 text-gray-600">{row.size}</td>
                      <td className="py-2.5 px-4 text-gray-600 font-medium">{row.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 10 — OVEN COMPARISON (matches screenshot)
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-8">Procolored Oven Comparison</h2>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-white border-b border-gray-200">
                    <th className="py-4 px-5 text-left font-bold text-gray-700">Specifications</th>
                    {/* Oven images in header — matches screenshot */}
                    <th className="py-4 px-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-14 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          <img src="https://www.procolored.com/cdn/shop/files/2_ec290ef0-a323-43bd-bf38-23001d95002f_1220x_crop_center.jpg?v=1773828985"
                            alt="Smokeless Oven" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">Smokeless Oven</span>
                      </div>
                    </th>
                    <th className="py-4 px-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-14 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          <img src="https://www.procolored.com/cdn/shop/files/4_0509d835-8dd9-4112-a045-524b6aab6293_1220x_crop_center.jpg?v=1773828984"
                            alt="Panda Oven" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">Panda Oven</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Working Area', '13.0"×16.5" (330×420mm)', '13.0"×16.5" (330×420mm)'],
                    ['Heating Temperature', '0–140°C (32–284°F)', '0–130°C (32–266°F)'],
                    ['Heating Type', 'Smokeless infrared circulation', 'Standard heating tube'],
                    ['Gross Weight', '21.4 kg', '9 kg'],
                    ['Sleep Mode', '✅ Yes', '✅ Yes'],
                    ['Air Purifier', '✅ Built-in smoke filtration', '✅ Basic air outlet'],
                    ['Best For', 'Professional DTF printing, odor-free workspace', 'Portable use, small studios'],
                    ['Key Advantage', 'Cleaner, more uniform heating', 'Lightweight, budget-friendly'],
                  ].map(([spec, smokeless, panda], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-5 font-semibold text-gray-800">{spec}</td>
                      <td className="py-3 px-5 text-center text-gray-700 text-xs">{smokeless}</td>
                      <td className="py-3 px-5 text-center text-gray-700 text-xs">{panda}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 11 — PRINTING WORKFLOW (matches screenshot)
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#F5F5F5' }} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-10">Printing Workflow</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {WORKFLOW_STEPS.map(step => (
              <div key={step.num} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="relative">
                  <img src={step.img} alt={step.label} className="w-full h-40 object-cover" />
                  <span className="absolute bottom-2 left-2 bg-white/90 text-gray-900 text-xs font-black px-2 py-0.5 rounded-full shadow">
                    {step.num}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-gray-900 text-sm">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 12 — PROFITABLE SOLUTIONS
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Profitable Printing Solutions</h2>
            <p className="text-base text-gray-600">Choose the right model for your needs and start creating stunning products!</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <img src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/99999.png?v=1743647859&width=500"
                alt="T-Shirt" className="w-full max-w-md mx-auto drop-shadow-xl" />
            </div>
            <div className="lg:w-1/2 bg-gray-900 text-white rounded-3xl p-7 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-orange-400">T-Shirts</h3>
                <span className="bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">[L] Letter Size (8.5"×11")</span>
              </div>
              <p className="text-gray-400 text-xs mb-4">Suitable Business Size: 350+/week</p>
              <div className="space-y-2 text-xs border-t border-gray-700 pt-4">
                {[
                  ['Retail Sell Price', '$21.90'],
                  ['Blank Apparel', '$3.00'],
                  ['Ink Cost', '$0.45'],
                  ['Film Cost', '$0.60'],
                  ['Powder Cost', '$0.06'],
                  ['Equipment Cost (Printer/day)', '$25.29'],
                  ['Equipment Cost (Printhead/day)', '$2.64'],
                  ['Average Waste', '15%'],
                  ['Units per Hour', '8'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-800 pb-1.5">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center">
                <p className="text-gray-400 text-xs">Profit per Day — 5-hour Work Day</p>
                <p className="text-4xl font-black text-orange-400 mt-1">$659.01</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 13 — CUSTOMER REVIEWS
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-4">Customer Reviews</h2>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-orange-400 text-orange-400" />)}
              <span className="text-2xl font-black text-gray-900 ml-1">5.00</span>
              <span className="text-gray-500 text-sm">out of 5</span>
            </div>
            <p className="text-gray-500 text-sm">Based on 2 reviews</p>
            <div className="max-w-xs mx-auto mt-3 space-y-1 text-xs">
              {[5,4,3,2,1].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <span className="w-4 text-right text-gray-600">{s}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full bg-orange-400 ${s === 5 ? 'w-full' : 'w-0'}`} />
                  </div>
                  <span className="w-4 text-gray-500">{s === 5 ? '2' : '0'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <button className="border-2 border-orange-500 text-orange-500 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition text-sm">Write a review</button>
            <button className="border-2 border-gray-300 text-gray-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm">Ask a question</button>
            <select className="border-2 border-gray-300 text-gray-600 rounded-xl px-3 py-2 text-sm bg-white">
              <option>Most Recent ▾</option>
            </select>
          </div>

          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />)}
                  </div>
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{r.title}</p>
                {r.body && <p className="text-xs text-gray-600 leading-relaxed">{r.body}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
