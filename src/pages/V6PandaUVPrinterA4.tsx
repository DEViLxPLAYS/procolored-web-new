import { useState, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';

const images = [
  "https://www.procolored.com/cdn/shop/files/Procolored_V6_Panda_UV_Printer_6.7_A4_L800_1_1220x_crop_center.png?v=1742957321",
  "https://www.procolored.com/cdn/shop/files/Procolored_V6_Panda_UV_Printer_6.7_A4_L800_4_1220x_crop_center.png?v=1742957321",
  "https://www.procolored.com/cdn/shop/files/V6_1_39a71996-4695-4f2d-bf71-29aaecf59bc1_1220x_crop_center.png?v=1749807397",
  "https://www.procolored.com/cdn/shop/files/V6_2_ccf17913-2b42-41f4-b18a-2196c6173b0f_1220x_crop_center.png?v=1749807397",
  "https://www.procolored.com/cdn/shop/files/V6_3_0c6839bf-9c91-465d-8bd9-8b99a9eb60fc_1220x_crop_center.png?v=1749807397",
  "https://www.procolored.com/cdn/shop/files/uv_v6_5_1220x_crop_center.png?v=1749807397"
];

const versatileItems = [
  { name: "Keychains", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/3_1965d26b-a683-47e4-ac73-5ef60901184a.png?v=1726652213" },
  { name: "Ping-pong Ball", earn: "$19", img: "https://www.procolored.com/cdn/shop/files/4_2f23ae11-8af1-44f7-a002-e269bef943ac.png?v=1726652213" },
  { name: "Canvas Frame", earn: "$9", img: "https://www.procolored.com/cdn/shop/files/8_dedd8724-02d1-4623-9115-8ca10478854f.png?v=1726652213" },
  { name: "Metal Signs", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/5_a2c16acb-f0c2-48f1-a6d7-fbf21d49e188.png?v=1726652213" },
  { name: "Coffee Mugs", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" },
  { name: "Acrylic Frame", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/9_a44683d7-205c-4f7b-b29d-74262edc066c.png?v=1726652212" },
  { name: "Glass Cup", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/10_26417edc-1ce9-413e-b692-f3a97a59f324.png?v=1726652213" },
  { name: "Pin", earn: "$21", img: "https://www.procolored.com/cdn/shop/files/6_0804c85b-117e-4c88-afba-b55229e3e13c.png?v=1726652212" },
  { name: "Tumbler", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" }
];

const printingSteps = [
  { step: 1, title: "1.Design Arrangement", desc: "Arrange designs in the RIP program", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step1_2x_15681324-e1f4-4a62-bd54-32b1792cdbec.png?v=1731567129&width=375" },
  { step: 2, title: "2.Align Items", desc: "Align the printable items on the printing platform", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step22x.png?v=1731567189&width=375" },
  { step: 3, title: "3.Printing", desc: "Configurate the printer and start printing", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step22x.png?v=1731567189&width=375" },
  { step: 4, title: "4.Finish", desc: "See how our design has turned out on your materials", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step42x.png?v=1731567241&width=375" }
];

export default function V6PandaUVPrinterA4() {
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState<'without_jigs' | 'with_4_jigs'>('without_jigs');
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const price = variant === 'without_jigs' ? 3599.00 : 4199.00;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `v6-panda-uv-printer-${variant}`,
      name: `Procolored V6 Panda UV Printer 6.7" A4 L800 (${variant === 'without_jigs' ? 'Without Jig' : '4 Jigs'})`,
      price: `$${price.toFixed(2)} USD`,
      image: images[0],
      quantity: 1
    });
  };

  return (
    <div className="bg-white font-sans text-[#1a1a1a] overflow-x-hidden">
      {/* Product Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
        <div className="text-sm mb-6 text-gray-500">
          Home / Procolored V6 Panda UV Printer 6.7" A4 L800
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <div 
              className="relative border border-gray-100 rounded-lg overflow-hidden bg-white aspect-square mb-4 group shrink-0 shadow-sm"
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
                    backgroundSize: '200%'
                  }}
                />
              )}

              <button onClick={() => setActiveImage(activeImage === 0 ? images.length - 1 : activeImage - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 shadow rounded-full flex items-center justify-center hover:bg-white text-gray-500 hover:text-black transition">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => setActiveImage(activeImage === images.length - 1 ? 0 : activeImage + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 shadow rounded-full flex items-center justify-center hover:bg-white text-gray-500 hover:text-black transition">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)} 
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-200'} transition-all`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain bg-gray-50 mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Procolored V6 Panda UV Printer 6.7" A4 L800</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-[#facc15] text-[#facc15]" />)}
              </div>
              <span className="text-sm font-medium text-gray-400">32 reviews</span>
            </div>

            <p className="text-2xl font-bold text-[#E85A24] mb-6">{formatConverted(convertPrice(price.toString(), currency.divisor))}</p>

            <div className="p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
              <h3 className="font-bold text-xs mb-2 uppercase tracking-wide text-gray-500">Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                A4 UV printer applies the typical Panda design of Procolored and is upgraded with sleeker and more seamless appearance. It's capable of printing quick-dried...
                <button className="text-gray-400 font-bold ml-1 hover:text-black transition">View More <ChevronDown className="inline w-3 h-3" /></button>
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-sm mb-4">Choose Jig:</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setVariant('without_jigs')}
                  className={`px-8 py-3 rounded-lg border-2 font-bold text-sm transition-all duration-200 ${variant === 'without_jigs' ? 'border-[#E85A24] text-[#E85A24] bg-white' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  Without Jig
                </button>
                <button 
                  onClick={() => setVariant('with_4_jigs')}
                  className={`px-8 py-3 rounded-lg border-2 font-bold text-sm transition-all duration-200 ${variant === 'with_4_jigs' ? 'border-[#E85A24] text-[#E85A24] bg-white' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  4 jigs
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <button onClick={handleAddToCart} className="w-full h-[52px] border-2 border-[#E85A24] text-[#E85A24] font-bold text-lg rounded-lg hover:bg-[#E85A24] hover:text-white transition-all bg-white active:scale-[0.98]">
                Add to cart
              </button>
              <button className="w-full h-[52px] bg-[#5a31f4] text-white font-bold text-lg rounded-lg hover:bg-[#4a21e4] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                 Buy with shop
              </button>
              <div className="text-center">
                 <button className="text-blue-600 text-[13px] font-bold hover:underline">More payment options</button>
              </div>
            </div>

            <div className="mb-6 space-y-4">
               <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-800">Shop with Confidence! <span className="text-gray-400 font-normal ml-1">ⓘ</span></p>
                    <p className="text-gray-500 font-medium leading-relaxed mt-1">100% Protection Against Shipping Mishaps</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Worry-Free Purchase by <span className="text-blue-500 font-black lowercase">seel</span></p>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-[#f8f9fb] rounded-xl mb-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" className="w-4 h-4 opacity-70" alt="points" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 tracking-tight">Earn {variant === 'without_jigs' ? '3,599' : '4,199'} Points when you buy this item.</span>
               </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-2 mb-8 opacity-60 flex-wrap">
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 object-contain" alt="Mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-6 object-contain" alt="Apple Pay" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 object-contain" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4 object-contain" alt="Google Pay" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 object-contain" alt="Paypal" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Debit_logo.svg" className="h-6 object-contain" alt="Visa Debit" />
            </div>

            <h4 className="font-bold text-sm mb-4">Book a Demo</h4>
            <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#E85A24] rounded-xl shrink-0 flex items-center justify-center mt-1 shadow-lg shadow-orange-200">
                   <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" className="w-7 h-7 invert" alt="demo" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#E85A24] mb-1">Procolored Product Demo | Free Reserve Now</h4>
                  <p className="text-[11px] text-gray-600 mb-3 font-semibold leading-relaxed">Try before you buy | Experience Printer features and solve your Startup questions.</p>
                  <button className="bg-white border-2 border-[#E85A24] text-[#E85A24] text-[10px] font-black px-4 py-1.5 rounded-lg active:scale-95 transition">Book it now</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-gray-100 pt-6 text-[13px] flex-wrap font-bold text-gray-400">
              <div className="flex items-center gap-2 cursor-pointer hover:text-black transition">📄 Resources</div>
              <div className="flex items-center gap-2">🚚 1-2 weeks Delivery</div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-black transition">📖 Instruction Manual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Hero Image */}
      <div className="w-full mt-24">
         <img src="https://www.procolored.com/cdn/shop/files/KV_3be82570-5ac4-4bf4-bf55-7d4b8e293da8.png?v=1731321204&width=1500" alt="KV" className="w-full" />
      </div>

      {/* Versatile Applications (Infinite Scroll) */}
      <div className="bg-white py-24 overflow-hidden border-b border-gray-100">
        <div className="text-center mb-16 px-4">
          <h2 className="text-[32px] font-extrabold mb-4 tracking-tight">UV Printer for Versatile Applications</h2>
          <p className="text-gray-500 max-w-3xl mx-auto font-bold text-xs leading-relaxed uppercase tracking-wider">The UV Printer meets your various customization needs, including pins, tumblers, keychains, and canvas frames. It allows you to expand your different customization services business.</p>
        </div>
        
        <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused]">
          {[...versatileItems, ...versatileItems].map((item, i) => (
            <div key={i} className="flex-shrink-0 w-40 group cursor-pointer transition-all duration-500 text-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 group-hover:-translate-y-1 transition-all duration-500">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <h4 className="font-bold text-[13px] mb-0.5">{item.name}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic opacity-60">From {item.earn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Print Better, Grow Faster Section */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-[32px] font-extrabold text-center mb-20 tracking-tight">Print Better, Grow Faster</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               {/* 2x2 Image Grid Left */}
               <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="aspect-square rounded-[30px] overflow-hidden bg-[#f8f9fb]">
                        <img src="https://www.procolored.com/cdn/shop/files/automatic_cleaning.png?v=1731394223&width=375" alt="cleaning" className="w-full h-full object-cover" />
                     </div>
                  ))}
               </div>

               {/* Feature Cards Right */}
               <div className="flex flex-col gap-4">
                  <div className="bg-[#f0f5ff] rounded-[30px] p-10 flex flex-col justify-between aspect-[16/9] relative overflow-hidden group">
                     <div className="relative z-10">
                        <h3 className="font-bold text-2xl mb-4 text-[#1a365d]">Auto-Cleaning<br/>Prolonged Printhead<br/>Lifespan</h3>
                     </div>
                     <img src="https://www.procolored.com/cdn/shop/files/v6__3_2x_6281cdc3-c934-4fd8-be5b-c7bd41a9c771.png?v=1731462500&width=375" className="absolute right-0 bottom-0 w-1/2 group-hover:scale-105 transition-transform duration-700" alt="cleaning" />
                  </div>
                  <div className="bg-[#e8f5fb] rounded-[30px] p-10 flex flex-col justify-between aspect-[16/10] relative overflow-hidden group border border-blue-50/50">
                     <div className="relative z-10 w-2/3">
                        <h3 className="font-bold text-2xl mb-4">Air Filter<br/>Comfortable Workspace</h3>
                     </div>
                  </div>
                  <div className="bg-[#e7f1f9] rounded-[30px] p-10 flex flex-col justify-between aspect-[16/8] relative overflow-hidden group">
                     <div className="relative z-10">
                        <h3 className="font-bold text-2xl">4.33" Printing<br/>Height for Versatile<br/>Applications</h3>
                     </div>
                  </div>
               </div>
            </div>

            {/* PID Controller Dark Card */}
            <div className="mt-8 bg-[#1a1a1a] rounded-[30px] p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
               <div className="md:w-1/2 relative z-10">
                  <h3 className="text-white font-extrabold text-3xl mb-4 leading-tight tracking-tight">Intelligent PID controller</h3>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-sm">The air cooling system for the UV lamps has been upgraded with an intelligent PID controller for better heat dissipation, improving the printer's performance and lifespan.</p>
               </div>
               <div className="md:w-1/2 flex justify-end">
                  <img src="https://www.procolored.com/cdn/shop/files/cooling_system_2x_pc.png?v=1731461325&width=750" className="w-4/5 group-hover:scale-110 transition-transform duration-1000 origin-center" alt="cooling" />
               </div>
               <div className="absolute top-0 right-0 p-8 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl rounded-full" />
            </div>
         </div>
      </div>

      {/* Adjustable Height Section */}
      <div className="bg-[#1a1a1a] py-24 px-4 overflow-hidden">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-white text-[32px] font-extrabold mb-4 tracking-tighter">4.33" Printing Height for<br/>Versatile Applications</h2>
            <p className="text-gray-400 font-bold text-[13px] mb-12 max-w-lg leading-relaxed">The adjustable range now extends up to an impressive 4.33 inches, allowing equipment with various jigs for a wider range of item printing.</p>
            <div className="relative group">
               <img src="https://www.procolored.com/cdn/shop/files/110mm_2x_e2e8b69d-6709-479a-9730-66e8199c52b2.png?v=1731403445&width=750" className="w-full rounded-[40px] group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl" alt="height" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[40px]" />
            </div>
         </div>
      </div>

      {/* Air Filter Dark Section */}
      <div className="bg-[#1a1a1a] py-24 px-4 border-t border-white/5">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-white text-[32px] font-extrabold mb-4 tracking-tighter">Air Filter</h2>
            <p className="text-gray-400 font-bold text-[13px] mb-12 max-w-lg leading-relaxed italic">The integrated air filter reduces over 70% of ink odors, allowing the printer to be used comfortably indoors</p>
            <div className="relative group">
               <img src="https://www.procolored.com/cdn/shop/files/air_purification_2x_pc.png?v=1731461203&width=750" className="w-full rounded-[40px] group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl" alt="filter" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[40px]" />
            </div>
         </div>
      </div>

      {/* Auto Cleaning Section */}
      <div className="bg-[#fbfcff] py-24 px-4 relative overflow-hidden group">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="md:w-1/2">
               <img src="https://www.procolored.com/cdn/shop/files/v6__3_2x_6281cdc3-c934-4fd8-be5b-c7bd41a9c771.png?v=1731462500&width=375" alt="Auto Cleaning" className="w-full rounded-[40px] hover:rotate-2 transition-all duration-700 shadow-xl" />
            </div>
            <div className="md:w-1/2">
               <h2 className="text-[32px] font-extrabold mb-6 tracking-tight">Printhead Auto Cleaning</h2>
               <p className="text-sm font-bold text-gray-500 leading-relaxed italic">The printhead will automatically perform self-cleaning every 10 hours, effectively protecting the printhead and extending the printer's lifespan.</p>
            </div>
         </div>
         <div className="absolute -right-20 top-0 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Parameters Table */}
      <div className="bg-white py-24 px-4">
        <h2 className="text-[32px] font-extrabold text-center mb-16 tracking-tight">Parameters</h2>
        <div className="max-w-5xl mx-auto bg-[#FEF6F3] rounded-[40px] p-8 md:p-14 shadow-sm border border-[#fff1ed]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
            {[
              { label: "Printhead", value: "L800", isLeft: true },
              { label: "Configuration", value: "Single-Array", isLeft: false },
              { label: "Print Accuracy", value: "1440*1400 DPI (8 Pass)", isLeft: true },
              { label: "Print Size", value: "Width: 6.7\"(170mm)", isLeft: false },
              { label: "Applicable System", value: "Windows OS", isLeft: true },
              { label: "Print Speed", value: "Letter/A4: 23min", isLeft: false },
              { label: "Print Height", value: "0~110mm", isLeft: true },
              { label: "Ink Consumption", value: "Letter/A4: 1.25ml", isLeft: false },
              { label: "Software", value: "Pro RIP", isLeft: true },
              { label: "Net Weight", value: "73.9 lbs (33.5kg)", isLeft: false },
              { label: "Prints Per Hour", value: "3 Sets", isLeft: true },
              { label: "Product Size", value: "20*19.69*17.72\"", isLeft: false }
            ].map((param, i) => (
              <div key={i} className={`flex justify-between items-center py-5 border-b border-white/80 group transition-all duration-300 hover:px-2 ${i >= 10 ? 'border-none' : ''}`}>
                <span className="font-extrabold text-black text-[13px] group-hover:text-[#E85A24] transition-colors">{param.label}</span>
                <span className="text-[#6d6d6d] font-bold text-[13px]">{param.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printing Steps */}
      <div className="bg-[#f8f9fb] py-24 px-4">
        <h2 className="text-[32px] font-extrabold text-center mb-20 tracking-tight">Printing Step</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {printingSteps.map((s, i) => (
            <div key={i} className="flex flex-col bg-white rounded-[40px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="p-8">
                <h4 className="font-extrabold text-base mb-2 group-hover:text-[#E85A24] transition-colors">{s.title}</h4>
                <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Footer Suggestions (Add to cart products) */}
      <div className="bg-white pt-24 px-4 max-w-7xl mx-auto">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-extrabold">You may also like</h3>
            <div className="flex gap-2">
               <ChevronLeft className="w-5 h-5 text-gray-300 cursor-not-allowed" />
               <ChevronRight className="w-5 h-5 text-black cursor-pointer hover:text-[#E85A24] transition" />
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {/* Suggestion 1 */}
            <div className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-500 p-4 border border-gray-50">
                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative">
                   <img src="https://www.procolored.com/cdn/shop/files/uvink_cleaner_2_1220x_crop_center.png?v=1735181741" className="w-full h-full object-contain group-hover:scale-105 transition duration-500" alt="cleaner" />
                </div>
                <h4 className="font-bold text-sm mb-2 group-hover:text-[#E85A24] transition line-clamp-2">Procolored Ink Cleaner (UV) UV Cleaner Ink 500ml</h4>
                <p className="text-[#E85A24] font-extrabold mb-4">$69.00 USD</p>
                <button className="w-full bg-[#E85A24] text-white py-2.5 rounded-lg font-bold text-sm active:scale-[0.98] transition">Add to cart</button>
            </div>
            {/* Suggestion 2 */}
            <div className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-500 p-4 border border-gray-50 uppercase">
                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative">
                   <img src="https://www.procolored.com/cdn/shop/files/V4_Printer_11_1220x_crop_center.png?v=1743066234" className="w-full h-full object-contain group-hover:scale-105 transition duration-500" alt="v4" />
                </div>
                <h4 className="font-bold text-sm mb-2 group-hover:text-[#E85A24] transition line-clamp-2">Procolored V4 UV Printer 4.7" A5 L800</h4>
                <p className="text-[#E85A24] font-extrabold mb-4">$2,299.00 USD</p>
                <button className="w-full bg-[#E85A24] text-white py-2.5 rounded-lg font-bold text-sm active:scale-[0.98] transition">Add to cart</button>
            </div>
         </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white py-24 pb-32 border-t border-gray-100">
         <div className="max-w-6xl mx-auto px-4">
            
            <div className="flex flex-col md:flex-row gap-20">
               {/* Left Column: Aggregated Stats */}
               <div className="md:w-[32%]">
                  <h2 className="text-2xl font-black mb-8 tracking-tighter">Customer Reviews</h2>
                  <div className="flex flex-col items-center gap-2 mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                     <span className="font-black text-4xl tracking-tighter">5.00 <span className="text-sm font-bold text-gray-300">/ 5</span></span>
                     <div className="flex text-[#facc15] text-xl tracking-tight">★★★★★</div>
                     <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mt-1">Based on 32 reviews</p>
                  </div>
                  
                  <div className="space-y-3 mb-12 w-full px-2">
                     {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-4 text-[10px] font-black text-gray-400">
                           <span className="w-4">{stars}</span>
                           <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#facc15]" style={{ width: stars === 5 ? '100%' : '0%' }} />
                           </div>
                           <span className="w-8 text-right font-bold text-gray-300">{stars === 5 ? '32' : '0'}</span>
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-3">
                     <button className="w-full bg-[#E85A24] text-white font-black py-4 transition rounded-xl shadow-lg shadow-orange-100 active:scale-95 text-[15px]">Write a review</button>
                     <button className="w-full bg-white border-2 border-gray-100 text-gray-400 font-bold py-4 hover:border-black hover:text-black transition rounded-xl text-[15px] active:scale-95">Ask a question</button>
                  </div>

                  <div className="mt-12 flex flex-col items-center">
                     <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" className="w-16 h-16 opacity-10 mb-4" alt="badge" />
                     <p className="text-[10px] text-center text-gray-300 font-bold leading-relaxed italic">Judge.me Diamond Transparent Shop medal 100.0</p>
                  </div>
               </div>

               {/* Right Column: Review List */}
               <div className="md:w-[68%]">
                  <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100 font-black text-[11px] uppercase tracking-[0.2em] text-gray-300">
                     <span>Review list</span>
                     <div className="flex items-center gap-4 cursor-pointer hover:text-black transition">
                        <span>Most Recent</span>
                        <ChevronDown className="w-4 h-4" />
                     </div>
                  </div>

                  <div className="space-y-16">
                     {/* JS */}
                     <div className="animate-fade-in">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center font-black text-white text-xs shadow-lg">JS</div>
                              <div>
                                 <span className="font-extrabold text-black text-sm tracking-tight border-b-2 border-orange-100 pb-0.5 uppercase">JS</span>
                                 <div className="flex text-[#facc15] text-[10px] mt-1.5 tracking-tight">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">07/29/2025</span>
                        </div>
                        <h4 className="font-extrabold text-lg mb-3 tracking-tighter italic">Very difficult to use</h4>
                        <p className="text-[#666666] font-bold text-sm leading-relaxed max-w-2xl">
                           So far, we have had no luck getting it to print correctly. We keep making adjustments with customer service so hopefully we can get it to work eventually.
                        </p>
                     </div>

                     {/* Eagle Ridge Customs */}
                     <div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-[#E85A24] text-[10px] shadow-sm">ER</div>
                              <div>
                                 <span className="font-extrabold text-black text-sm tracking-tight border-b-2 border-orange-100 pb-0.5 uppercase">Eagle Ridge Customs</span>
                                 <div className="flex text-[#facc15] text-[10px] mt-1.5 tracking-tight">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">06/03/2025</span>
                        </div>
                        <h4 className="font-extrabold text-lg mb-3 tracking-tighter italic">UV printing</h4>
                        <p className="text-[#666666] font-bold text-sm leading-relaxed max-w-2xl">
                           When I was thinking of getting into UV printing I had picked to go with this printer. Procolored had helped me to learn the basics from running the computer program to the service and any maintenance required for a UV printer. This company is a stand out company in quality and customer service along with always reaching out to help promote my business. Couldn't have picked a better company to buy from to start my business
                        </p>
                     </div>

                     {/* Lily */}
                     <div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-300 text-[10px]">L</div>
                              <div>
                                 <span className="font-extrabold text-black text-sm tracking-tight border-b-2 border-orange-100 pb-0.5 uppercase">Lily</span>
                                 <div className="flex text-[#facc15] text-[10px] mt-1.5 tracking-tight">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">12/20/2024</span>
                        </div>
                        <h4 className="font-extrabold text-lg mb-3 tracking-tighter italic">Fully functional machine</h4>
                        <p className="text-[#666666] font-bold text-sm leading-relaxed max-w-2xl">
                           The functions of the machine are very complete, and the pictures printed out are very good
                        </p>
                     </div>

                     {/* Jerry */}
                     <div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-300 text-[10px]">J</div>
                              <div>
                                 <span className="font-extrabold text-black text-sm tracking-tight border-b-2 border-orange-100 pb-0.5 uppercase">Jerry</span>
                                 <div className="flex text-[#facc15] text-[10px] mt-1.5 tracking-tight">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">12/20/2024</span>
                        </div>
                        <h4 className="font-extrabold text-lg mb-3 tracking-tighter italic">The machine looks beautiful</h4>
                        <p className="text-[#666666] font-bold text-sm leading-relaxed max-w-2xl">
                           The machine looks beautiful and I like it very much
                        </p>
                     </div>

                     {/* NICO */}
                     <div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-300 text-[10px]">N</div>
                              <div>
                                 <span className="font-extrabold text-black text-sm tracking-tight border-b-2 border-orange-100 pb-0.5 uppercase">NICO</span>
                                 <div className="flex text-[#facc15] text-[10px] mt-1.5 tracking-tight">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">12/20/2024</span>
                        </div>
                        <h4 className="font-extrabold text-lg mb-3 tracking-tighter italic">Easy to operate</h4>
                        <p className="text-[#666666] font-bold text-sm leading-relaxed max-w-2xl">
                           The machine operation procedure is relatively simple and easy to usev
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
