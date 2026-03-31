import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';
import HlsVideoPlayer from '../components/HlsVideoPlayer';

export type V11ProVariant = 'base' | 'jigs' | 'uv-laminator' | 'jigs-uv-laminator';

interface V11ProSharedLayoutProps {
  activeVariant: V11ProVariant;
}

const VARIANTS = {
  'base': {
    id: 'base',
    name: 'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800',
    slug: '/products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800',
    price: 5999.00,
    originalPrice: null,
    image1: 'https://www.procolored.com/cdn/shop/files/V11_Pro_Procolored_6_1220x_crop_center.png?v=1758613379',
    optionName: 'V11 Pro'
  },
  'jigs': {
    id: 'jigs',
    name: 'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800 & Jigs',
    slug: '/products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs',
    price: 6699.00,
    originalPrice: 6839.00,
    image1: 'https://www.procolored.com/cdn/shop/files/V11pro_001_1220x_crop_center.jpg?v=1765251687',
    optionName: 'V11 Pro with Jigs'
  },
  'uv-laminator': {
    id: 'uv-laminator',
    name: 'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800 & UV Laminator',
    slug: '/products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-uv-laminator',
    price: 6699.00,
    originalPrice: null,
    image1: 'https://www.procolored.com/cdn/shop/files/V11_pro_923_1_1220x_crop_center.png?v=1758613165',
    optionName: 'V11 Pro with UV Laminator'
  },
  'jigs-uv-laminator': {
    id: 'jigs-uv-laminator',
    name: 'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800 & Jigs & UV Laminator',
    slug: '/products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs-uv-laminator',
    price: 7399.00,
    originalPrice: null,
    image1: 'https://www.procolored.com/cdn/shop/files/V11_pro_923_2_1220x_crop_center.png?v=1758613379',
    optionName: 'V11 Pro with Jigs & UV Laminator'
  }
};

const COMMON_IMAGES = [
  "https://www.procolored.com/cdn/shop/files/V11_Pro_Procolored_6_1220x_crop_center.png?v=1758613379",
  "https://www.procolored.com/cdn/shop/files/V11_Pro_Procolored_6_1220x_crop_center.png?v=1758613379",
  "https://www.procolored.com/cdn/shop/files/V11_Pro_Procolored_3_1220x_crop_center.png?v=1765251712",
  "https://www.procolored.com/cdn/shop/files/V11_pro_923_7_1220x_crop_center.jpg?v=1765251712",
  "https://www.procolored.com/cdn/shop/files/V11_Pro_zhengmian_1220x_crop_center.png?v=1765251712",
  "https://www.procolored.com/cdn/shop/products/DSC03639_9044bc99-be39-401b-80d3-9652bb694ace_1220x_crop_center.jpg?v=1765251712",
  "https://www.procolored.com/cdn/shop/files/V11_pro_923_4_1220x_crop_center.jpg?v=1765251712",
  "https://www.procolored.com/cdn/shop/files/V11_pro_923_4_1220x_crop_center.jpg?v=1765251712",
  "https://www.procolored.com/cdn/shop/files/V11_pro_923_2_1220x_crop_center.jpg?v=1765251712"
];

const VERSATILE_ITEMS = [
  { name: "Tumbler",        earn: "$15" },
  { name: "Keychains",      earn: "$13" },
  { name: "Ping-pong Ball", earn: "$19" },
  { name: "Canvas Frame",   earn: "$9" },
  { name: "Metal Signs",    earn: "$11" },
  { name: "Coffee Mug",     earn: "$15" },
  { name: "Acrylic Frame",  earn: "$8" },
  { name: "Glass Cup",      earn: "$11" },
  { name: "Pin",            earn: "$23" }
];

// Placeholder images for versatile strip since full URLs weren't explicitly provided,
// but they are standard loop items so we use varied realistic IDs based on standard Procolored loop logic
const VERSATILE_IMAGES = [
  "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/3_1965d26b-a683-47e4-ac73-5ef60901184a.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/4_2f23ae11-8af1-44f7-a002-e269bef943ac.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/8_dedd8724-02d1-4623-9115-8ca10478854f.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/5_a2c16acb-f0c2-48f1-a6d7-fbf21d49e188.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/9_a44683d7-205c-4f7b-b29d-74262edc066c.png?v=1726652212",
  "https://www.procolored.com/cdn/shop/files/10_26417edc-1ce9-413e-b692-f3a97a59f324.png?v=1726652213",
  "https://www.procolored.com/cdn/shop/files/6_0804c85b-117e-4c88-afba-b55229e3e13c.png?v=1726652212"
];

const PRINTING_STEPS = [
  { step: 1, title: 'Set the software', image: 'https://www.procolored.com/cdn/shop/files/20250425-100218.png?v=1745546783&width=375' },
  { step: 2, title: 'Place the printed items on the platform', image: 'https://www.procolored.com/cdn/shop/files/20250425-100225.png?v=1745546801&width=375' },
  { step: 3, title: 'Set software then click print', image: 'https://www.procolored.com/cdn/shop/files/20250425-100229.png?v=1745546821&width=375' },
  { step: 4, title: 'Finish', image: 'https://www.procolored.com/cdn/shop/files/20250425-100232.png?v=1745546834&width=375' }
];

const SPECS = [
  { label: "Printhead", value: "TX800" },
  { label: "Configuration", value: "Dual-Array" },
  { label: "Print Accuracy", value: "720*1440 DPI (16 PASS)" },
  { label: "Print Size", value: "11.3\"x16.5\" (287x420mm)" },
  { label: "Applicable System", value: "Windows" },
  { label: "Print Height", value: "0~5.5\"(0-140mm)" },
  { label: "Color Configuration", value: "CMYKWW+VVVVVV" },
  { label: "Print Speed", value: "Letter/A4: 8~9min" },
  { label: "Software", value: "Pro RIP" },
  { label: "Ink Consumption", value: "Letter/A4: 1.25ml" },
  { label: "Net Weight", value: "154.3 lb(70 kg)" },
  { label: "Product Size", value: "27.2*27.6*21.7\"(69*70*55cm)" }
];

export default function V11ProSharedLayout({ activeVariant }: V11ProSharedLayoutProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const currentProduct = VARIANTS[activeVariant];
  const galleryImages = [currentProduct.image1, ...COMMON_IMAGES];
  
  // Create seamless infinite scroll items by repeating the original list twice
  const stripItems = [...VERSATILE_ITEMS, ...VERSATILE_ITEMS].map((item, i) => ({
    ...item,
    img: VERSATILE_IMAGES[i % VERSATILE_IMAGES.length]
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `procolored-v11-pro-${activeVariant}`,
      name: currentProduct.name,
      price: `$${currentProduct.price.toFixed(2)} USD`,
      image: galleryImages[0],
      quantity: 1,
    });
  };

  return (
    <div className="bg-white font-sans text-[#1a1a1a] overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          PART 1 — PRODUCT HEADER & OPTIONS
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1300px] mx-auto px-4 py-8 lg:py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* ────── Left: Gallery ────── */}
          <div className="sticky top-24 self-start">
            <div
              className="relative border border-gray-100 rounded-xl overflow-hidden bg-white aspect-[4/3] mb-6 group shrink-0 cursor-zoom-in shadow-sm hover:shadow-md transition-shadow"
              ref={imageRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={galleryImages[activeImage]}
                alt="Main product"
                className={`w-full h-full object-contain p-8 transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
              />
              {isZooming && (
                <div
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${galleryImages[activeImage]})`,
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    backgroundSize: '200%',
                    backgroundColor: '#fff'
                  }}
                />
              )}

              {/* Expand icon exactly like reference */}
              <button className="absolute top-4 right-4 w-9 h-9 bg-gray-100/80 hover:bg-white rounded-md flex items-center justify-center shadow-sm text-gray-500 transition border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </button>

              <button
                onClick={() => setActiveImage(activeImage === 0 ? galleryImages.length - 1 : activeImage - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 hover:bg-white shadow text-gray-400 hover:text-gray-800 rounded-full flex items-center justify-center transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImage(activeImage === galleryImages.length - 1 ? 0 : activeImage + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 hover:bg-white shadow text-gray-400 hover:text-gray-800 rounded-full flex items-center justify-center transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar w-full">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-[80px] h-[80px] border rounded transition-all p-1 bg-white
                    ${activeImage === idx ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Tabs matching reference exactly */}
            <div className="flex justify-center gap-6 mt-8">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider">
                📦 Packages
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 text-gray-800 font-bold text-xs uppercase hover:text-black transition tracking-wider">
                ▶ Videos
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 text-gray-800 font-bold text-xs uppercase hover:text-black transition tracking-wider">
                ✨ Features
              </button>
            </div>
          </div>

          {/* ────── Right: Details & Options ────── */}
          <div className="pt-2">
            <h1 className="text-3xl lg:text-[34px] font-extrabold mb-4 tracking-tight leading-tight">
              {currentProduct.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-400">No reviews</span>
            </div>

            <div className="mb-8">
               <div className="flex items-end gap-3 mb-1">
                  <p className="text-2xl font-bold text-[#e1251b]">
                     {formatConverted(convertPrice(currentProduct.price.toString(), currency.divisor))}
                  </p>
                  {currentProduct.originalPrice && (
                     <p className="text-lg text-gray-400 line-through mb-0.5">
                        {formatConverted(convertPrice(currentProduct.originalPrice.toString(), currency.divisor))}
                     </p>
                  )}
               </div>
            </div>

            <div className="mb-10 text-gray-500 text-sm leading-relaxed">
              <p className="font-bold text-gray-700 mb-2 tracking-wide uppercase text-xs">Overview</p>
              The Procolored V11 Pro (Varnish Version) is a cutting-edge UV printer designed for high-quality, versatile printing with a unique dual-head system. One head is dedicated to
              {' '}
              <button
                onClick={() => setOverviewExpanded(!overviewExpanded)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                 View More <ChevronDown className="inline w-3 h-3 ml-0.5" />
              </button>
            </div>

            {/* Options Panel exactly matching screenshot */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-extrabold text-[#111] text-base">Options</h3>
                <button className="text-[#3b82f6] text-sm font-semibold hover:underline">Compare {`>`}</button>
              </div>

              <div className="flex flex-col gap-3">
                {Object.values(VARIANTS).map((v) => {
                  const isActive = activeVariant === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => navigate(v.slug)}
                      className={`relative flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 bg-white
                        ${isActive ? 'border-[#ff8c00] shadow-[0_0_0_1px_#ff8c00]' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 shrink-0 flex items-center justify-center p-1 bg-white">
                          <img src={v.image1} alt={v.optionName} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className={`font-semibold text-sm ${isActive ? 'text-[#111]' : 'text-gray-800'}`}>{v.optionName}</span>
                          {v.originalPrice && (
                             <span className="text-xs font-bold text-[#ff4c4c] bg-red-50 inline-block px-1.5 py-0.5 rounded mt-1 line-through w-max mix-blend-multiply">
                                ${((v.originalPrice - v.price).toFixed(2))} Off
                             </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 min-w-[120px]">
                        {v.originalPrice && isActive && (
                           <p className="text-sm text-gray-400 line-through mb-0.5">{formatConverted(convertPrice(v.originalPrice.toString(), currency.divisor))}</p>
                        )}
                        {v.originalPrice && !isActive && (
                           <p className="text-sm text-gray-300 line-through mb-0.5">{formatConverted(convertPrice(v.originalPrice.toString(), currency.divisor))}</p>
                        )}
                        <p className={`font-bold ${isActive ? 'text-[#111]' : 'text-gray-800'}`}>
                           {formatConverted(convertPrice(v.price.toString(), currency.divisor))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-[4] py-4 bg-white border-2 border-[#ff8c00] text-[#ff8c00] font-bold rounded-lg hover:bg-[#ff8c00] hover:text-white transition-colors"
              >
                Add to cart
              </button>
              <button className="flex-[4] py-4 bg-[#5a31f4] text-white font-bold rounded-lg hover:bg-[#4a24d4] transition-colors flex items-center justify-center gap-2">
                Buy with <span className="font-black italic text-lg tracking-tight">shop</span>
              </button>
            </div>
            
            <div className="text-center mb-8">
               <button className="text-[#3b82f6] text-sm underline hover:text-blue-700 font-medium">More payment options</button>
            </div>

            <div className="mb-6">
               <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-gray-700 shrink-0 border border-gray-300 p-0.5 rounded shadow-sm" />
                  <div>
                     <p className="font-extrabold text-gray-800 mb-1">Shop with Confidence! <span className="text-gray-400 font-normal">ⓘ</span></p>
                     <p className="text-gray-500 font-medium list-disc ml-3 list-outside mb-2"><li>100% Protection Against Shipping Mishaps</li></p>
                     <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Worry-Free Purchase by <span className="text-[#3b82f6] font-black lowercase tracking-tight">seel</span></p>
                  </div>
               </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-1.5 flex-wrap mb-10 pt-6 border-t border-gray-100">
              {[
                { label: "Amex", bg: "#2E77BC", text: "AMEX" },
                { label: "Apple Pay", bg: "#000", text: "Pay" },
                { label: "Discover", bg: "#f9a021", text: "Discover" },
                { label: "Google Pay", bg: "#fff", text: "G Pay", border: true, tcolor: '#333' },
                { label: "Mastercard", bg: "#EB001B", text: "MC" },
                { label: "Visa", bg: "#1A1F71", text: "VISA" },
                { label: "PayPal", bg: "#003087", text: "PayPal" },
                { label: "Shop Pay", bg: "#5a31f4", text: "shop" },
                { label: "Shopify Pay", bg: "#008060", text: "Shopify" },
                { label: "Klarna", bg: "#FFB3C7", text: "Klarna", tcolor: '#111' },
              ].map(icon => (
                <div
                  key={icon.label}
                  title={icon.label}
                  className={`h-6 px-2 rounded-sm flex items-center justify-center text-[9px] font-bold ${icon.border ? 'border border-gray-200' : ''}`}
                  style={{ background: icon.bg, color: icon.tcolor || '#fff' }}
                >
                  {icon.text}
                </div>
              ))}
            </div>

            {/* Bottom links */}
            <div className="flex text-[11px] font-bold text-gray-400 gap-6 uppercase tracking-wider hidden">
               <span className="hover:text-black cursor-pointer">Resources</span>
               <span>1-2 weeks Delivery</span>
               <span className="hover:text-black cursor-pointer">Instruction Manual</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — HERO FULL WIDTH IMAGE (LEFT ALIGN TEXT)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden group">
        <img 
           src="https://www.procolored.com/cdn/shop/files/20250425-110530.jpg?v=1745550360&width=1500" 
           alt="Unlock Greater Possibilities" 
           className="absolute inset-0 w-full h-full object-cover md:object-center object-right"
        />
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 z-10">
           <p className="text-[#00c3ff] font-bold tracking-widest text-xs md:text-sm mb-2 uppercase">Procolored V11Pro</p>
           <h2 className="text-white text-4xl md:text-[56px] font-extrabold leading-[1.1] tracking-tight">
              Unlock Greater<br />Possibilities
           </h2>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 — INFINITE SCROLL APPLICATIONS (LOOP)
          Using the specific animation requested
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white py-24 overflow-hidden border-b border-gray-100">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-[38px] font-extrabold mb-5 tracking-tight">UV Printer for Versatile Applications</h2>
          <p className="text-gray-500 max-w-3xl mx-auto font-medium text-sm leading-relaxed">
            The UV Printer meets your various customization needs, including pins, tumblers, keychains, and canvas frames. It allows you to expand your different customization services business.
          </p>
        </div>
        
        {/* Infinite CSS loop container */}
        <div className="w-full relative py-4">
           {/* Custom css added via <style> to keep component standalone but perfectly match specs */}
           <style>
            {`
               @keyframes customScrollLeft {
                 0%   { transform: translateX(0); }
                 100% { transform: translateX(-50%); }
               }
               .custom-scroll-strip {
                 display: flex;
                 animation: customScrollLeft 30s linear infinite;
                 width: max-content;
               }
               .custom-scroll-strip:hover {
                 animation-play-state: paused;
               }
            `}
           </style>
           <div className="custom-scroll-strip gap-6">
             {stripItems.map((item, i) => (
               <div key={i} className="flex-shrink-0 w-44 md:w-48 group cursor-pointer transition-transform duration-500 mx-3">
                 <div className="aspect-[4/3] rounded bg-gray-50 mb-4 overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
                   <img src={item.img} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <h4 className="font-bold text-[13px] text-gray-800 tracking-wide text-center">{item.name}</h4>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center mt-1">Earn {item.earn}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — PRINT BETTER, GROW FASTER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white py-24 px-4 w-full border-b border-gray-100">
         <h2 className="text-3xl md:text-[38px] font-extrabold mb-16 tracking-tight text-center">Print Better, Grow Faster</h2>
         
         <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
               <img src="https://www.procolored.com/cdn/shop/files/Integrated_Air_Filter-pc.jpg?v=1745544741&width=375" alt="Air Filter" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent flex items-end p-8">
                  <h3 className="text-white font-bold text-xl drop-shadow-md tracking-wide">Integrated Air Filter</h3>
               </div>
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
               <img src="https://www.procolored.com/cdn/shop/files/High-Resolution_Printing-pc.jpg?v=1745544794&width=375" alt="Resolution" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent flex items-end p-8">
                  <h3 className="text-white font-bold text-xl drop-shadow-md tracking-wide">High-Resolution Printing</h3>
               </div>
            </div>
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4 — SUPPORTS STICKER PRINTING (DARK TEXT LEFT)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#1a1a1a] relative w-full overflow-hidden text-white pt-20">
         <div className="max-w-7xl mx-auto px-8 lg:px-16 mb-12 relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-[42px] font-extrabold mb-2 tracking-tight">Supports Sticker Printing</h2>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6">*Additional Laminator Needed</p>
            <p className="text-gray-300 md:max-w-2xl text-sm leading-[1.8] font-medium">
               Supports direct printing on films (additional laminator required for sticker production). Dual print heads provide unparalleled varnish printing capability and significantly increase work speed, offering instant UV printing with a broader range of applications.
            </p>
         </div>
         <img 
            src="https://www.procolored.com/cdn/shop/files/pc_73b2c84f-0ba5-4b36-90ca-4d19e69448cd.jpg?v=1745544874&width=1500" 
            alt="Sticker Printing" 
            className="w-full object-cover aspect-[21/9] block"
         />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — ADJUSTABLE UV LAMP POWER (HLS VIDEO)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-black py-24 px-4 border-b border-gray-900">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 text-white">
               <h2 className="text-3xl md:text-[40px] font-extrabold mb-6 tracking-tight leading-tight">Adjustable UV Lamp Power</h2>
               <p className="text-gray-400 font-medium leading-[1.8] text-sm">
                  The UV lamp features adjustable power, which prevents overheating and extends the lamp's lifespan. This allows for printing on a wider range of materials, including PET film.
               </p>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-video relative">
               <HlsVideoPlayer 
                  src="https://www.procolored.com/cdn/shop/videos/c/vp/552ad2e4a299428ab90d4d74b837c2ed/552ad2e4a299428ab90d4d74b837c2ed.m3u8?v=0"
                  className="w-full h-full object-cover"
               />
            </div>
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6 — INTEGRATED AIR FILTER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-black py-24 px-4 w-full">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 text-white order-2 md:order-1">
               <h2 className="text-3xl md:text-[40px] font-extrabold mb-6 tracking-tight leading-tight">Integrated Air Filter</h2>
               <p className="text-gray-400 font-medium leading-[1.8] text-sm">
                  The integrated air filter reduces over 70% of ink odors, allowing the printer to be used comfortably indoors.
               </p>
            </div>
            <div className="md:w-1/2 w-full order-1 md:order-2">
               <img 
                  src="https://www.procolored.com/cdn/shop/files/Integrated_Air_Filter-pc_08628a18-fb21-4a5b-b933-7285b6a947c1.jpg?v=1745546611&width=750" 
                  alt="Air Filter Tech" 
                  className="w-full rounded-2xl mix-blend-screen"
               />
            </div>
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7 — HIGH-RESOLUTION PRINTING
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white py-24 px-4 flex justify-center">
         <div className="max-w-[1200px] w-full bg-[#f8f9fc] rounded-[30px] overflow-hidden flex flex-col md:flex-row items-center shadow-sm">
            <div className="md:w-[55%]">
               <img 
                  src="https://www.procolored.com/cdn/shop/files/High-Resolution_Printing-pc_3372bc98-839d-4da2-bd69-6edb125e4bb6.jpg?v=1745546652&width=375" 
                  alt="Resolution Graphic" 
                  className="w-full h-full object-cover min-h-[400px]"
               />
            </div>
            <div className="md:w-[45%] p-10 lg:p-16">
               <h2 className="text-3xl font-extrabold mb-6 tracking-tight">High-Resolution Printing</h2>
               <p className="text-gray-600 font-medium leading-[1.8] text-[13px]">
                  Using micro-piezo and smart droplet technology, the printer produces prints with smoother color transitions and precision under 1mm. The printing outputs display rich details and seamless transitions, nearly achieving 100% color reproduction.
               </p>
            </div>
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8 — PRINTHEAD AUTO CLEANING
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white pb-32 pt-8 px-4 flex justify-center border-b border-gray-100">
         <div className="max-w-[1200px] w-full bg-[#f8f9fc] rounded-[30px] overflow-hidden flex flex-col md:flex-row items-center justify-between px-10 lg:px-20 py-16 shadow-sm">
            <div className="md:w-[45%] mb-12 md:mb-0">
               <h2 className="text-3xl font-extrabold mb-6 tracking-tight">Printhead Auto Cleaning</h2>
               <p className="text-gray-600 font-medium leading-[1.8] text-[13px]">
                  The printhead will automatically perform self-cleaning every 10 hours, effectively protecting the printhead and extending the printer's lifespan.
               </p>
            </div>
            <div className="md:w-[50%] flex justify-center">
               <img 
                  src="https://www.procolored.com/cdn/shop/files/Printhead_Auto-Cleaning-pc.jpg?v=1745545247&width=375" 
                  alt="10 Hours Cleaning" 
                  className="w-full max-w-md mix-blend-multiply drop-shadow-xl"
               />
            </div>
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9 — PARAMETERS TABLE
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF9F8] py-24 px-4 w-full border-b border-gray-200">
         <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">Parameters</h2>
         
         <div className="max-w-[1000px] mx-auto rounded-3xl overflow-hidden border border-orange-100 shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
               {SPECS.map((s, i) => (
                  <div key={i} className={`flex ${i%2 === 0 ? '' : 'md:border-l border-orange-50'} border-b border-orange-50 last:border-0 md:[&:nth-last-child(-n+2)]:border-b-0 ${Math.floor(i/2)%2 === 0 ? 'bg-orange-50/30' : 'bg-white'}`}>
                     <div className="w-[45%] py-5 px-6 font-bold text-gray-900 border-r border-orange-50">
                        {s.label}
                     </div>
                     <div className="w-[55%] py-5 px-6 font-medium text-gray-600 flex items-center">
                        {s.value}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10 — PRINTING STEP
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#fbfcff] py-24 px-4">
         <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">Printing Step</h2>
         <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINTING_STEPS.map((s) => (
               <div key={s.step} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col transition-transform hover:-translate-y-1 duration-300">
                  <div className="bg-gray-100 relative aspect-[4/3] flex items-center justify-center p-4">
                     <img src={s.image} alt={s.title} className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-md" />
                  </div>
                  <div className="p-6 flex-1 flex items-start">
                     <div className="font-bold text-[13px] text-gray-800 leading-snug">
                        <span className="font-medium mr-1 border border-gray-800 rounded-full w-4 h-4 inline-flex items-center justify-center text-[9px] mr-1.5">{s.step}</span>
                        {s.title}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 11 — CUSTOMER REVIEWS
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white py-24 border-t border-gray-100">
         <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-10">Customer Reviews</h2>
            
            <div className="flex justify-center text-yellow-500 mb-4 gap-1 mt-6">
               {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
               ))}
            </div>
            
            <p className="font-bold text-lg mb-2 text-gray-800">0.00 out of 5</p>
            <p className="text-sm text-gray-500 font-medium mb-12">Based on 0 reviews</p>

            <div className="max-w-xl mx-auto p-12 bg-gray-50/50 rounded-2xl border border-gray-100 mb-10 shadow-inner">
               <p className="text-gray-600 font-medium pb-2">No reviews yet — be the first to review this product!</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto">
               <button className="flex-1 py-3.5 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition">
                  Write a review
               </button>
               <button className="flex-1 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:border-black hover:text-black transition">
                  Ask a question
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}
