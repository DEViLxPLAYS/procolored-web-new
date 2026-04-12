import { useState, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';

const images = [
  "https://www.procolored.com/cdn/shop/files/V4_Printer_11_1220x_crop_center.png?v=1743066234",
  "https://www.procolored.com/cdn/shop/files/V4_Printer_5_1220x_crop_center.png?v=1743066234",
  "https://www.procolored.com/cdn/shop/files/V4_Printer_4_1220x_crop_center.png?v=1743066234",
  "https://www.procolored.com/cdn/shop/files/V4_Printer_6_1220x_crop_center.png?v=1743066223"
];

const versatileItems = [
  { name: "Coffee Mugs", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" },
  { name: "Acrylic Frame", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/9_a44683d7-205c-4f7b-b29d-74262edc066c.png?v=1726652212" },
  { name: "Glass Cup", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/10_26417edc-1ce9-413e-b692-f3a97a59f324.png?v=1726652213" },
  { name: "Pin", earn: "$21", img: "https://www.procolored.com/cdn/shop/files/6_0804c85b-117e-4c88-afba-b55229e3e13c.png?v=1726652212" },
  { name: "Tumbler", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" }, // reusing mugs as placeholder for missing tumbler
  { name: "Keychains", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/3_1965d26b-a683-47e4-ac73-5ef60901184a.png?v=1726652213" },
  { name: "Ping-pong Ball", earn: "$19", img: "https://www.procolored.com/cdn/shop/files/4_2f23ae11-8af1-44f7-a002-e269bef943ac.png?v=1726652213" },
  { name: "Canvas Frame", earn: "$9", img: "https://www.procolored.com/cdn/shop/files/8_dedd8724-02d1-4623-9115-8ca10478854f.png?v=1726652213" },
  { name: "Metal Signs", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/5_a2c16acb-f0c2-48f1-a6d7-fbf21d49e188.png?v=1726652213" }
];

const printingSteps = [
  { step: 1, title: "Set the software", img: "https://www.procolored.com/cdn/shop/files/A5_UV_printer_print_step1_690x_crop_center.jpg?v=1708506421" },
  { step: 2, title: "Place the printed items on the platform", img: "https://www.procolored.com/cdn/shop/files/A5_UV_printer_print_step2_690x_crop_center.jpg?v=1708506422" },
  { step: 3, title: "Set software then click print", img: "https://www.procolored.com/cdn/shop/files/A5_UV_printer_print_step3_690x_crop_center.jpg?v=1708506421" },
  { step: 4, title: "Finish", img: "https://www.procolored.com/cdn/shop/files/A5_UV_printer_print_step3_690x_crop_center.jpg?v=1708506421" }
];

export default function V4UVPrinterA5() {
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const price = 2299.00;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      id: "procolored-v4-uv-printer-a5",
      name: "Procolored V4 UV Printer 4.7\" A5 L800",
      price: `$${price.toFixed(2)} USD`,
      image: images[0],
      quantity: 1
    });
  };

  return (
    <div className="bg-white font-sans text-[#1a1a1a] overflow-x-hidden">
      {/* Gallery & Title Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Gallery */}
          <div>
            <div className="relative border border-gray-100 rounded-lg overflow-hidden bg-white aspect-square mb-4 group shrink-0"
                 ref={imageRef}
                 onMouseEnter={() => setIsZooming(true)}
                 onMouseLeave={() => setIsZooming(false)}
                 onMouseMove={handleMouseMove}>
              
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
                <button key={idx} onClick={() => setActiveImage(idx)} className={`flex-shrink-0 w-20 h-20 border-2 rounded ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-200'} transition-all`}>
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain bg-gray-50 mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Procolored V4 UV Printer 4.7" A5 L800</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-medium">5 reviews</span>
            </div>

            <p className="text-2xl font-bold text-red-600 mb-6">{formatConverted(convertPrice(price.toString(), currency.divisor))}</p>

            <div className="mb-8">
              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <h3 className="font-bold text-sm mb-2 uppercase tracking-wide text-gray-500">Overview</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Procolored A5 UV printer is designed for printing phone cases.
                  This UV printing machine will smoothly help you start a small business with its compact size and high-precision UV printing capability on a variety of materials.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <button onClick={handleAddToCart} className="w-full h-[50px] border-2 border-[#E85A24] text-[#E85A24] font-bold text-lg rounded hover:bg-[#E85A24] hover:text-white transition-colors bg-white">
                Add to cart
              </button>
              <button className="w-full h-[50px] bg-[#5a31f4] text-white font-bold text-lg rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                 Buy with shop
              </button>
              <div className="text-center">
                 <a href="#" className="text-blue-600 text-sm hover:underline">More payment options</a>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Shop with Confidence!</p>
                  <p className="text-gray-500">✅ 100% Protection Against Shipping Mishaps</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Worry-Free Purchase by <span className="text-blue-500 font-bold lowercase">seel</span></p>
                </div>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-2 mb-8 opacity-70 flex-wrap">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 object-contain" alt="Paypal" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 object-contain" alt="Mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4 object-contain" alt="Google Pay" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-6 object-contain" alt="Apple Pay" />
            </div>



            <div className="flex items-center gap-6 border-t border-gray-100 pt-6 text-sm flex-wrap font-medium">
              <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-black">📄 Resources</div>
              <div className="flex items-center gap-2 text-gray-600">🚚 1-2 weeks Delivery</div>
              <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-black">📖 Instruction Manual</div>
            </div>

            <div className="flex gap-6 mt-8">
               <span className="text-xs font-bold text-gray-400">Share:</span>
               <div className="flex gap-4">
                 <button className="text-gray-400 hover:text-black transition">f</button>
                 <button className="text-gray-400 hover:text-black transition">𝕏</button>
                 <button className="text-gray-400 hover:text-black transition">P</button>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="mt-20">
        {/* Small Size, Big Function */}
        <div className="bg-[#fbfcff] py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-3/5">
              <img src="https://www.procolored.com/cdn/shop/files/A5_UV_PRINTER_SIZE_2762x_crop_center.jpg?v=1640338302" alt="Small size" className="w-full rounded-3xl shadow-xl" />
            </div>
            <div className="md:w-2/5">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Small Size, Big Function</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold">
                Don't take up space, put in any small corner can start custom small business .
              </p>
            </div>
          </div>
        </div>

        {/* Continuous Supply Ink System */}
        <div className="bg-white py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <img src="https://www.procolored.com/cdn/shop/files/A5_UV_printer_ink_sac_2762x_crop_center.jpg?v=1640338302" alt="Ink System" className="w-full rounded-2xl shadow-lg" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Continuous Supply Ink System</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold">
                Continuous ink supply, uninterrupted printing.
              </p>
            </div>
          </div>
        </div>

        {/* Precise Printing */}
        <div className="bg-gray-50 py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img src="https://www.procolored.com/cdn/shop/files/a5_uv_printer_flatbed_2762x_crop_center.jpg?v=1640338302" alt="Precise Printing" className="w-full rounded-2xl shadow-lg" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Precise Printing</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold">
                Printing size is 120*170 mm, and the printing height is 15mm, enough for any size and material phone case precise printing .
              </p>
            </div>
          </div>
        </div>

        {/* Cleaning Unit */}
        <div className="bg-white py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <img src="https://www.procolored.com/cdn/shop/files/A5_UV_PRINTER_cart_2762x_crop_center.jpg?v=1640338302" alt="Cleaning Unit" className="w-full rounded-2xl shadow-lg" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Cleaning Unit</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold">
                Effectively clean excess ink and protect the print head.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-white py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Parameters</h2>
        <div className="max-w-5xl mx-auto bg-[#FEF6F3] rounded-[30px] p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {[
              { label: "Printhead", value: "L800" },
              { label: "Configuration", value: "Single-Array" },
              { label: "Print Accuracy", value: "1440*1400 DPI (8 Pass)" },
              { label: "Print Width", value: "Width: 6.7\"(170mm)" },
              { label: "Applicable System", value: "Windows OS" },
              { label: "Print Speed", value: "Letter/A4: 23min" },
              { label: "Print Height", value: "0~0.6\"" },
              { label: "Ink Consumption", value: "Letter/A4: 1.25ml" },
              { label: "Software", value: "Pro RIP" },
              { label: "Net Weight", value: "44 lbs (20kg)" },
              { label: "Prints Per Hour", value: "3 Sets" },
              { label: "Product Size", value: "19.7*14.6*10.6\"" }
            ].map((param, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-white/50 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                <span className="font-bold text-gray-800">{param.label}</span>
                <span className="text-gray-600 font-medium">{param.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Versatile Applications (Infinite Scroll) */}
      <div className="bg-white py-24 overflow-hidden">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">UV Printer for Versatile Applications</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">The UV Printer meets your various customization needs, including pins, tumblers, keychains, and canvas frames. It allows you to expand your different customization services business.</p>
        </div>
        
        <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused]">
          {[...versatileItems, ...versatileItems].map((item, i) => (
            <div key={i} className="flex-shrink-0 w-48 md:w-56 group cursor-pointer transition-all duration-500">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <h4 className="font-bold text-sm mb-1">{item.name}</h4>
              <p className="text-xs text-gray-400 font-bold">Earn {item.earn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Printing Steps */}
      <div className="bg-[#f8f9fb] py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Printing Step</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {printingSteps.map((s, i) => (
            <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">{s.step}</div>
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-gray-800 leading-snug">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Customer Reviews Section */}
      <div className="bg-white py-16 pb-32 border-t border-gray-200">
         <div className="max-w-6xl mx-auto px-4">
            
            <div className="flex flex-col md:flex-row gap-16">
               {/* Left Column: Aggregated Stats */}
               <div className="md:w-1/3">
                  <h2 className="text-2xl font-bold mb-6 text-center">Customer Reviews</h2>
                  <div className="flex flex-col items-center gap-2 mb-8">
                     <div className="flex text-yellow-400 text-2xl tracking-tight">★★★★★</div>
                     <span className="font-bold text-xl">5.00 out of 5</span>
                     <p className="text-sm text-gray-500 font-medium">Based on 5 reviews</p>
                  </div>
                  
                  <div className="space-y-3 mb-10 w-full">
                     {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-4 text-xs font-bold text-gray-400">
                           <div className="flex text-yellow-400 w-16">{stars === 5 ? '★★★★★' : '★'.repeat(stars)}</div>
                           <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400" style={{ width: stars === 5 ? '100%' : '0%' }} />
                           </div>
                           <span className="w-4 text-right">{stars === 5 ? '5' : '0'}</span>
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-3">
                     <button className="w-full bg-[#FFD147] text-white font-bold py-3.5 hover:bg-[#ffc821] transition rounded-lg shadow-sm">Write a review</button>
                     <button className="w-full bg-white border border-gray-200 text-gray-500 font-bold py-3.5 hover:border-black hover:text-black transition rounded-lg">Ask a question</button>
                  </div>
               </div>

               {/* Right Column: Review List */}
               <div className="md:w-2/3">
                  <div className="flex items-center gap-2 mb-8 text-sm font-bold border-b border-gray-100 pb-4">
                     <span className="text-gray-400 capitalize">Most Recent</span>
                     <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="space-y-12">
                     {/* Review 1 */}
                     <div className="group animate-fade-in">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs shadow-inner">A</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-black text-sm">Anonymous</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">01/13/2026</span>
                        </div>
                        <h4 className="font-bold text-base mb-2">Excellent customer service</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           After having a little trouble with initial setup, the procolored support chat was very helpful and I was able to successfully perform a few test prints, as well as our calibration sheet.<br/>
                           Very helpful customer service and support.<br/>
                           Thank you
                        </p>
                     </div>

                     {/* Review 2 */}
                     <div className="group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">V</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-black text-sm">Valentin Cattoen</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">05/19/2023</span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           Good printer (quality and user-friendly) AND a really really good service !
                        </p>
                     </div>

                     {/* Review 3 */}
                     <div className="group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">J</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-black text-sm">J.</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">12/30/2021</span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-2">Reviewed in Chile on November 6, 2021</p>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           todo ok
                        </p>
                     </div>

                     {/* Review 4 */}
                     <div className="group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">C</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-black text-sm">Customer</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">12/30/2021</span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-2">Reviewed in Germany on November 27, 2021</p>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           Good Printer - good service
                        </p>
                     </div>

                     {/* Review 5 */}
                     <div className="group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">C</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-black text-sm">Customer</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">12/30/2021</span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-2">Reviewed in the Spanish on October 8, 2021</p>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           Despite high shipping costs, the printer arrived 7 days late because there was festival in China (bad luck). We 've been testing it for a few days and everything is perfect, there are some mistakes but your service has fixed it very well for me. Thank you so much for everything! Recommended!
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
