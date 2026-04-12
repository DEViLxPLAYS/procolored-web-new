import { useState, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';

const images = [
  "https://www.procolored.com/cdn/shop/files/ProcoloredV11UVPrinter10.6A3R13902_d9596966-57f3-45ea-8960-caef564eb42b_1220x_crop_center.png?v=1742957438",
  "https://www.procolored.com/cdn/shop/files/A3-PRO-2_1220x_crop_center.png?v=1742957438",
  "https://www.procolored.com/cdn/shop/files/products/DSC03636_71fcfb82-9b2d-4fee-883b-7e4e4affae2c_1220x_crop_center.jpg?v=1742957438",
  "https://www.procolored.com/cdn/shop/files/V11_a9f1f790-e4fb-4e7a-800b-ef6ede574455_1220x_crop_center.png?v=1762162962",
];

const versatileItems = [
  { name: "Coffee Mug",     earn: "$15", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" },
  { name: "Acrylic Frame",  earn: "$8",  img: "https://www.procolored.com/cdn/shop/files/9_a44683d7-205c-4f7b-b29d-74262edc066c.png?v=1726652212" },
  { name: "Glass Cup",      earn: "$11", img: "https://www.procolored.com/cdn/shop/files/10_26417edc-1ce9-413e-b692-f3a97a59f324.png?v=1726652213" },
  { name: "Pin",            earn: "$23", img: "https://www.procolored.com/cdn/shop/files/6_0804c85b-117e-4c88-afba-b55229e3e13c.png?v=1726652212" },
  { name: "Tumbler",        earn: "$15", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" },
  { name: "Keychains",      earn: "$13", img: "https://www.procolored.com/cdn/shop/files/3_1965d26b-a683-47e4-ac73-5ef60901184a.png?v=1726652213" },
  { name: "Ping-pong Ball", earn: "$19", img: "https://www.procolored.com/cdn/shop/files/4_2f23ae11-8af1-44f7-a002-e269bef943ac.png?v=1726652213" },
  { name: "Canvas Frame",   earn: "$9",  img: "https://www.procolored.com/cdn/shop/files/8_dedd8724-02d1-4623-9115-8ca10478854f.png?v=1726652213" },
  { name: "Metal Signs",    earn: "$11", img: "https://www.procolored.com/cdn/shop/files/5_a2c16acb-f0c2-48f1-a6d7-fbf21d49e188.png?v=1726652213" },
];

const printingSteps = [
  {
    step: 1,
    title: "Software Configuration",
    img: "https://www.procolored.com/cdn/shop/files/uv_v6_step1_2x_15681324-e1f4-4a62-bd54-32b1792cdbec.png?v=1731567129&width=375",
  },
  {
    step: 2,
    title: "Place the printed item on the platform",
    img: "https://www.procolored.com/cdn/shop/files/uv_v6_step22x.png?v=1731567189&width=375",
  },
  {
    step: 3,
    title: "Configurate and print",
    img: "https://www.procolored.com/cdn/shop/files/cooling_system_2x_pc.png?v=1731461325&width=375",
  },
  {
    step: 4,
    title: "Wait for printing to finish",
    img: "https://www.procolored.com/cdn/shop/files/uv_v6_step42x.png?v=1731567241&width=375",
  },
];

const specs = [
  { label: "Printhead",       value: "R1390" },
  { label: "Configuration",   value: "Single-Array" },
  { label: "Print Accuracy",  value: "1440*1400 DPI (8 Pass)" },
  { label: "Print Height",    value: "0~5.5\"" },
  { label: "Print Size",      value: "11.3\" × 16.5\" (287×420mm)" },
  { label: "Applicable System", value: "Windows OS" },
  { label: "Print Speed",     value: "Letter/A4: 14min" },
  { label: "Ink Consumption", value: "Letter/A4: 1.25ml" },
  { label: "Prints Per Hour", value: "4 Sets" },
  { label: "Product Size",    value: "26*26*19.7\"" },
  { label: "Software",        value: "Pro RIP" },
  { label: "Net Weight",      value: "108 lbs (49kg)" },
];

export default function V11UVPrinter() {
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasJig, setHasJig] = useState(false);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const price = hasJig ? 5899.00 : 5199.00;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `procolored-v11-uv-printer-${hasJig ? 'with-5-jigs' : 'without-jig'}`,
      name: `Procolored V11 UV Printer 11.4" A3 R1390${hasJig ? ' (5 Jigs)' : ''}`,
      price: `$${price.toFixed(2)} USD`,
      image: images[0],
      quantity: 1,
    });
  };

  const reviews = [
    {
      initials: "AB", color: "bg-pink-100 text-pink-600",
      name: "April B.", date: "05/09/2025", stars: 5,
      title: "Fantastic Service",
      text: "After experiencing some difficulties while setting up my new UV ProColored TX800 printer, I reached out to the After-Sales Department for assistance. I had the pleasure of working with Engineer Carl Liu, who was exceptionally patient and addressed all of my concerns with professionalism and care. His support made a significant difference in my experience.\n\nI am highly satisfied with ProColored and the quality of their products. I truly appreciate the dedication and effort the team invests to ensure customer satisfaction. Based on this positive experience, I will continue to do business with ProColored in the future.",
    },
    {
      initials: "RM", color: "bg-blue-100 text-blue-600",
      name: "R.M.", date: "01/18/2022", stars: 5,
      title: "Reviewed in Canada on September 16, 2021",
      text: "parfait merci",
    },
    {
      initials: "V", color: "bg-green-100 text-green-600",
      name: "V.", date: "01/05/2022", stars: 5,
      title: "Reviewed in the United States on November 15, 2021",
      text: "on time delivery, good communication, perfect printer",
    },
    {
      initials: "C", color: "bg-purple-100 text-purple-600",
      name: "C.", date: "01/05/2022", stars: 5,
      title: "Reviewed in South Korea on August 23, 2021",
      text: "Fast delivery I will leave a review after using friendly consultation",
    },
    {
      initials: "RJ", color: "bg-orange-100 text-orange-600",
      name: "Rick Johnson", date: "01/05/2022", stars: 5,
      title: "Reviewed in Saudi Arabia July 19, 2021",
      text: "The seller's evaluation is five stars, I hope everyone can deal with it",
    },
  ];

  return (
    <div className="bg-white font-sans text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          PART 1 — PRODUCT HEADER: GALLERY + DETAILS
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Left: Gallery ── */}
          <div>
            {/* Main image */}
            <div
              className="relative border border-gray-100 rounded-lg overflow-hidden bg-white aspect-square mb-4 group shrink-0 cursor-zoom-in"
              ref={imageRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={images[activeImage]}
                alt="Main product"
                className={`w-full h-full object-contain transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
              />
              {isZooming && (
                <div
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${images[activeImage]})`,
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    backgroundSize: '220%',
                  }}
                />
              )}

              {/* Badges on image */}
              <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                <span className="bg-[#E85A24] text-white text-[10px] font-bold px-2 py-1 rounded">V11</span>
                <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">🚚 Free Shipping</span>
                <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">0% Interest Rate under $3,000</span>
              </div>

              {/* Expand icon */}
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded flex items-center justify-center shadow text-gray-500 hover:text-black transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </button>

              {/* Nav arrows */}
              <button
                onClick={() => setActiveImage(activeImage === 0 ? images.length - 1 : activeImage - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 shadow rounded-full flex items-center justify-center hover:bg-white text-gray-500 hover:text-black transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImage(activeImage === images.length - 1 ? 0 : activeImage + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 shadow rounded-full flex items-center justify-center hover:bg-white text-gray-500 hover:text-black transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded transition-all ${activeImage === idx ? 'border-[#E85A24]' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain bg-gray-50" />
                </button>
              ))}
            </div>

            {/* Tab buttons */}
            <div className="flex gap-3 mt-5">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full">📦 Packages</button>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-full hover:border-black transition">▶ Videos</button>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-full hover:border-black transition">✨ Features</button>
            </div>
          </div>

          {/* ── Right: Product Details ── */}
          <div>
            {/* Title */}
            <h1 className="text-2xl md:text-[28px] font-bold mb-2 tracking-tight leading-snug">
              Procolored V11 UV Printer 11.4" A3 R1390
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-medium text-[#0073e6] underline cursor-pointer">5 reviews</span>
            </div>

            {/* Price */}
            <p className="text-[28px] font-bold text-[#E85A24] mb-5">
              {formatConverted(convertPrice(price.toString(), currency.divisor))}
            </p>

            {/* Overview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Procolored{' '}
                <a href="#" className="text-[#0073e6] underline">UV printer</a>{' '}
                A3-PRO is one of our best selling medium-sized desktop printer, with our exclusive patented technology. This{' '}
                <a href="#" className="text-[#0073e6] underline">flatbed UV printer</a>{' '}
                {overviewExpanded
                  ? ' provides you with a high-definition printing resolution of 1440×1400 DPI, and supports printing on a wide variety of substrates. It is perfect for your small business needs.'
                  : ' provides you with...'
                }
                {' '}
                <button
                  className="text-[#0073e6] font-semibold hover:underline"
                  onClick={() => setOverviewExpanded(!overviewExpanded)}
                >
                  {overviewExpanded ? 'View Less ↑' : 'Read More →'}
                </button>
              </p>
            </div>

            {/* Jig variant selector */}
            <div className="mb-5">
              <h3 className="font-bold text-sm mb-3">Choose Jig:</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setHasJig(false)}
                  className={`flex-1 py-3 border text-sm font-bold rounded-lg transition ${!hasJig ? 'border-[#E85A24] text-[#E85A24] bg-orange-50' : 'border-gray-300 text-gray-700 hover:border-gray-500'}`}
                >
                  Without Jig
                </button>
                <button
                  onClick={() => setHasJig(true)}
                  className={`flex-1 py-3 border text-sm font-bold rounded-lg transition ${hasJig ? 'border-[#E85A24] text-[#E85A24] bg-orange-50' : 'border-gray-300 text-gray-700 hover:border-gray-500'}`}
                >
                  5 Jigs
                </button>
              </div>
            </div>

            {/* Add to cart / Buy with shop */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-[50px] border-2 border-[#E85A24] text-[#E85A24] font-bold rounded-lg hover:bg-[#E85A24] hover:text-white transition-colors"
                >
                  Add to cart
                </button>
                <button className="flex-1 h-[50px] bg-[#5a31f4] text-white font-bold rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-1">
                  Buy with <span className="font-black italic">shop</span>
                </button>
              </div>
              <div className="text-center">
                <a href="#" className="text-[#0073e6] text-sm hover:underline">More payment options</a>
              </div>
            </div>

            {/* Shop with confidence */}
            <div className="flex items-start gap-3 mb-4 p-3 border border-gray-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-gray-800 mb-0.5">Shop with Confidence! <span className="text-gray-400 font-normal">ⓘ</span></p>
                <p className="text-gray-600">• 100% Protection Against Shipping Mishaps</p>
                <p className="text-gray-400 uppercase tracking-wide font-semibold mt-1">
                  Worry-Free Purchase by <span className="text-[#0073e6] font-bold normal-case">seel</span>
                </p>
              </div>
            </div>



            {/* Payment icons row */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {[
                { label: "Amex", bg: "#2E77BC", text: "AMEX" },
                { label: "Apple Pay", bg: "#000", text: "⌘Pay" },
                { label: "Google Pay", bg: "#fff", text: "G Pay", border: true },
                { label: "Visa", bg: "#1A1F71", text: "VISA" },
                { label: "Mastercard", bg: "#EB001B", text: "MC" },
                { label: "PayPal", bg: "#003087", text: "PP" },
                { label: "Shop Pay", bg: "#5a31f4", text: "Shop" },
                { label: "Klarna", bg: "#FFB3C7", text: "Klarna" },
              ].map(icon => (
                <div
                  key={icon.label}
                  title={icon.label}
                  className={`h-7 px-2 rounded flex items-center justify-center text-[9px] font-black ${icon.border ? 'border border-gray-300' : ''}`}
                  style={{ background: icon.bg, color: icon.bg === '#fff' ? '#333' : '#fff', minWidth: 36 }}
                >
                  {icon.text}
                </div>
              ))}
            </div>



            {/* Bottom badges */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-xs font-medium text-gray-600 flex-wrap">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">📚 Resources</div>
              <div className="flex items-center gap-1.5">🚚 14–17 Business Days Delivery</div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">📖 Instruction Manual</div>
            </div>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — VISIBLE WINDOWS
          Layout: big image left | text right (white bg)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src="https://www.procolored.com/cdn/shop/files/visable_windows_of_A3pro_dtg_printer_direct_to_garment_dtg_printing_2720x_crop_center.png?v=1639549155"
              alt="Visible Windows"
              className="w-full object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visible Windows</h2>
            <p className="text-gray-600 leading-relaxed">
              Visible printer working situations ; convenient for printer maintenance, assembly and disassembly.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — FILTRATION SYSTEM
          Layout: text left | image grid right (white bg)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Filtration System</h2>
            <p className="text-[#0073e6] text-sm leading-relaxed">
              Filtering the dust in the air to make the surface of printed products smooth and blemish-free.
            </p>
          </div>
          <div className="md:w-3/5 relative">
            {/* Main filtration image with labels */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute top-2 left-2 bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded shadow border-l-2 border-gray-800">| Vacuum Cleaner System</span>
                  <img
                    src="https://www.procolored.com/cdn/shop/files/filtering_system_of_A3Pro_dtg_printer_direct_to_garment_UV_printer_2878x_crop_center.png?v=1639548682"
                    alt="Filtration System - Vacuum Cleaner"
                    className="w-full object-cover rounded-lg"
                  />
                  <span className="absolute bottom-2 left-2 bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded shadow border-l-2 border-gray-800">| Fast Printing Speed</span>
                </div>
                <div className="relative w-2/5">
                  <span className="absolute top-2 left-2 bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded shadow border-l-2 border-gray-800">| User Friendly Design</span>
                  <img
                    src="https://www.procolored.com/cdn/shop/files/A3-PRO-2_1220x_crop_center.png?v=1742957438"
                    alt="Filtration System - Control Panel"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — ADJUSTABLE UV LAMP POWER (GIF)
          Layout: image/gif left | text right (white bg)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            {/* Animated GIF — plays automatically via <img> tag */}
            <img
              src="https://www.procolored.com/cdn/shop/files/uv_lamp5_1280x_crop_center.gif?v=1639640709"
              alt="Adjustable UV Lamp Power"
              className="w-full object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Adjustable UV lamp power</h2>
            <p className="text-[#0073e6] text-sm leading-relaxed">
              The power of UV lamp can be adjusted and protected against overheating, prolong the lamp life, so you can print more material products, like polyester film.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — INK CIRCULATION / PREVENT NOZZLE CLOGGING
          Layout: text left | diagram image right (white bg)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Ink Circulation, Prevent Nozzle Clogging
            </h2>
            <p className="text-[#0073e6] text-sm leading-relaxed">
              The ink circulation system is our patent technology, the continuous circulation system effectively prevent the nozzle from clogging, thus extend print head lifetime 50% compared to traditional printers.
            </p>
          </div>
          <div className="md:w-3/5">
            <div className="relative">
              <img
                src="https://www.procolored.com/cdn/shop/files/uv_6090-4_1280x_crop_center.webp?v=1708503724"
                alt="Ink Circulation Diagram"
                className="w-full object-contain"
              />
              {/* Comparison labels */}
              <div className="flex justify-around mt-2">
                <span className="text-sm font-bold text-gray-700 text-center">Procolored</span>
                <span className="text-sm font-bold text-gray-700 text-center">Others</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — INFRARED AUTOMATIC HEIGHT ADJUSTMENT (GIF)
          Layout: image/gif left | text right (white bg)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            {/* Animated GIF — plays automatically via <img> tag */}
            <img
              src="https://www.procolored.com/cdn/shop/files/uv_printer_Infrared_automatic_height_adjustment_1280x_crop_center.gif?v=1639641334"
              alt="Infrared Automatic Height Adjustment"
              className="w-full object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Infrared automatic height adjustment
            </h2>
            <p className="text-[#0073e6] text-sm leading-relaxed">
              Omron infrared allows UV printer automatic adjust printing height. Imported Omron infrared sensor with new upgrade four-axis positioning system can automatically adjust the height to protects the print head in order to improve the printing efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — HIGH-DEFINITION PRINTING RESOLUTION
          Layout: text left | HD gecko image right (white bg)
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              High-Definition Printing Resolution
            </h2>
            <p className="text-[#0073e6] text-sm leading-relaxed">
              Using micro-voltage and intelligent inkdrop technology, the machine produces printings with more smoothly color transition and with accuracy less than 1mm. The output image shows rich details, seamless transitions, and almost achieves 100% restored effect.
            </p>
          </div>
          <div className="md:w-3/5">
            <img
              src="https://www.procolored.com/cdn/shop/files/HD_23dd208c-9a8f-4bfa-8d3c-047ded60ca74_2282x_crop_center.png?v=1639646212"
              alt="High-Definition Printing Resolution"
              className="w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — PARAMETERS TABLE
          Background: Light grey #F8F8F8
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-[#F8F8F8] py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Parameters</h2>
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {specs.map((spec, i) => (
              <div
                key={i}
                className={`flex items-center px-6 py-4 border-b border-gray-100 ${i % 2 === 0 ? '' : 'md:border-l border-gray-100'}`}
              >
                <span className="font-bold text-gray-800 w-40 shrink-0 text-sm">{spec.label}</span>
                <span
                  className={`text-sm font-medium ${
                    ['R1390', 'Single-Array', '1440*1400 DPI (8 Pass)', '11.3\" × 16.5\" (287×420mm)', 'Letter/A4: 14min', 'Letter/A4: 1.25ml', '4 Sets', 'Pro RIP'].includes(spec.value)
                      ? 'text-[#E85A24]'
                      : 'text-gray-600'
                  }`}
                >
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — UV PRINTER FOR VERSATILE APPLICATIONS
          Infinite scroll animation — white bg
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-20 overflow-hidden">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">UV Printer for Versatile Applications</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            The UV Printer meets your various customization needs, including pins, tumblers, keychains, and canvas frames. It allows you to expand your different customization services business.
          </p>
        </div>
        <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused] px-4">
          {[...versatileItems, ...versatileItems].map((item, i) => (
            <div key={i} className="flex-shrink-0 w-44 md:w-52 group cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="font-bold text-sm">{item.name}</p>
              <p className="text-xs text-gray-400 font-bold">Earn {item.earn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — PRINTING STEPS
          Background: Light grey #F5F5F5
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-[#F5F5F5] py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Printing Steps</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {printingSteps.map((s) => (
            <div key={s.step} className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
              {/* Image */}
              <div className="relative">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full aspect-video object-cover"
                />
                {/* Red numbered badge — bottom right corner of image */}
                <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#E85A24] rounded-full flex items-center justify-center text-white text-xs font-black shadow-md">
                  {s.step}
                </div>
              </div>
              {/* Text */}
              <div className="p-4">
                <p className="text-xs font-bold text-gray-800 leading-snug">
                  <span className="text-gray-400 font-black mr-1">⓪{s.step}</span>
                  {s.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 10 — CUSTOMER REVIEWS
          Background: White #FFFFFF
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white py-20 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">

            {/* ── Left: Stats ── */}
            <div className="md:w-1/3">
              <h2 className="text-2xl font-bold mb-6 text-center">Customer Reviews</h2>
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex text-yellow-400 text-2xl">★★★★★</div>
                <span className="font-bold text-xl">5.00 out of 5</span>
                <p className="text-sm text-gray-500">Based on 5 reviews</p>
              </div>

              {/* Rating bars */}
              <div className="space-y-3 mb-10 w-full">
                {[5,4,3,2,1].map(s => (
                  <div key={s} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <div className="text-yellow-400 w-14 shrink-0">{'★'.repeat(s)}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E85A24] rounded-full" style={{ width: s === 5 ? '100%' : '0%' }} />
                    </div>
                    <span className="w-4 text-right">{s === 5 ? '5' : '0'}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#FFD147] text-white font-bold py-3 rounded-lg hover:bg-[#ffc821] transition shadow-sm">
                  Write a review
                </button>
                <button className="w-full border border-gray-300 text-gray-600 font-bold py-3 rounded-lg hover:border-black hover:text-black transition">
                  Ask a question
                </button>
              </div>
            </div>

            {/* ── Right: Reviews ── */}
            <div className="md:w-2/3">
              {/* Sort */}
              <div className="flex items-center gap-2 mb-8 text-sm font-bold border-b border-gray-200 pb-4 text-gray-500 cursor-pointer">
                Most Recent <ChevronDown className="w-4 h-4" />
              </div>

              <div className="space-y-10">
                {reviews.map((r, i) => (
                  <div key={i} className={`pb-8 ${i !== reviews.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${r.color}`}>
                          {r.initials}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 text-sm">{r.name}</span>
                          <div className="flex text-yellow-400 text-[10px] mt-0.5 tracking-tight">
                            {'★'.repeat(r.stars)}
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-[11px] font-bold">{r.date}</span>
                    </div>
                    <h4 className="font-bold text-sm mb-2">{r.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-10">
                <button className="w-9 h-9 bg-gray-900 text-white font-bold rounded flex items-center justify-center text-sm">
                  1
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
