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
  "https://www.procolored.com/cdn/shop/files/V6_3_0c6839bf-9c91-465d-8bd9-8b99a9eb60fc_1220x_crop_center.png?v=1749807397",
  "https://www.procolored.com/cdn/shop/files/uv_v6_5_1220x_crop_center.png?v=1749807397"
];

const versatileItems = [
  { name: "Keychains", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/3_1965d26b-a683-47e4-ac73-5ef60901184a.png?v=1726652213" },
  { name: "Ping-pong Ball", earn: "$19", img: "https://www.procolored.com/cdn/shop/files/4_2f23ae11-8af1-44f7-a002-e269bef943ac.png?v=1726652213" },
  { name: "Canvas Frame", earn: "$9", img: "https://www.procolored.com/cdn/shop/files/8_dedd8724-02d1-4623-9115-8ca10478854f.png?v=1726652213" },
  { name: "Metal Signs", earn: "$11", img: "https://www.procolored.com/cdn/shop/files/5_a2c16acb-f0c2-48f1-a6d7-fbf21d49e188.png?v=1726652213" },
  { name: "Coffee Mug", earn: "$14", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" },
  { name: "Acrylic Frame", earn: "$20", img: "https://www.procolored.com/cdn/shop/files/9_a44683d7-205c-4f7b-b29d-74262edc066c.png?v=1726652212" },
  { name: "Glass Cup", earn: "$15", img: "https://www.procolored.com/cdn/shop/files/10_26417edc-1ce9-413e-b692-f3a97a59f324.png?v=1726652213" },
  { name: "Pin", earn: "$25", img: "https://www.procolored.com/cdn/shop/files/6_0804c85b-117e-4c88-afba-b55229e3e13c.png?v=1726652212" },
  { name: "Tumbler", earn: "$24", img: "https://www.procolored.com/cdn/shop/files/7_a7e51997-e638-4808-87ec-17ce37da5794.png?v=1726652213" }
];

const printingSteps = [
  { step: 1, title: "1.Design Arrangement\nArrange designs in the RIP program", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step1_2x_15681324-e1f4-4a62-bd54-32b1792cdbec.png?v=1731567129&width=375" },
  { step: 2, title: "2.Align Items\nAlign the printable items on the printing platform", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step22x.png?v=1731567189&width=375" },
  { step: 3, title: "3.Printing\nConfigurate the printer and start printing", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step22x.png?v=1731567189&width=375" },
  { step: 4, title: "4.Finish\nSee how our design has turned out on your materials", img: "https://www.procolored.com/cdn/shop/files/uv_v6_step42x.png?v=1731567241&width=375" }
];

export default function V6UVPrinterA4() {
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasJig, setHasJig] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const price = hasJig ? 4199.00 : 3599.00;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `procolored-v6-uv-printer-${hasJig ? 'with-jigs' : 'without-jig'}`,
      name: `Procolored V6 Panda UV Printer 6.7" A4 L800${hasJig ? ' (with 4 jigs)' : ''}`,
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
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Procolored V6 Panda UV Printer 6.7" A4 L800</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-medium text-gray-500">32 reviews</span>
            </div>

            <p className="text-2xl font-bold text-red-600 mb-6">{formatConverted(convertPrice(price.toString(), currency.divisor))}</p>

            <div className="mb-8">
              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <h3 className="font-bold text-sm mb-2 uppercase tracking-wide text-gray-500">Overview</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A4 UV printer applies the typical Panda design of Procolored and is upgraded with sleeker and more seamless appearance. It's capable of printing quick-dried UV ink on a wide range of materials with high precision.
                </p>
              </div>
            </div>

            <div className="mb-6">
               <h3 className="font-bold text-sm mb-3">Choose Jig:</h3>
               <div className="flex gap-3">
                  <button 
                     onClick={() => setHasJig(false)}
                     className={`flex-1 py-3 border text-sm font-bold rounded ${!hasJig ? 'border-[#E85A24] text-[#E85A24] bg-orange-50/50' : 'border-gray-300 text-gray-700 hover:border-black'}`}
                  >
                     Without jig
                  </button>
                  <button 
                     onClick={() => setHasJig(true)}
                     className={`flex-1 py-3 border text-sm font-bold rounded ${hasJig ? 'border-[#E85A24] text-[#E85A24] bg-orange-50/50' : 'border-gray-300 text-gray-700 hover:border-black'}`}
                  >
                     4 jigs
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <button 
                 onClick={handleAddToCart} 
                 className={`w-full h-[50px] font-bold text-lg rounded transition-colors ${
                    hasJig 
                    ? 'bg-white border-2 border-[#E85A24] text-[#E85A24] hover:bg-[#E85A24] hover:text-white'
                    : 'bg-white border-2 border-[#E85A24] text-[#E85A24] hover:bg-[#E85A24] hover:text-white' // Making it outline by default
                 }`}>
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

      <div className="w-full">
         <img src="https://www.procolored.com/cdn/shop/files/KV_3be82570-5ac4-4bf4-bf55-7d4b8e293da8.png?v=1731321204&width=1500" alt="Hero" className="w-full object-cover" />
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

      {/* Feature Sections */}
      <div className="bg-white max-w-7xl mx-auto px-4 py-16 space-y-20">
         


         {/* Section: 4.33" Height */}
         <div className="bg-[#1e1e1e] rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-white">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">4.33" Printing Height for<br/>Versatile Applications</h2>
               <p className="text-gray-300 font-medium">The adjustable range now extends up to an impressive 4.33 inches, allowing equipment with various jigs for a wider range of item printing.</p>
            </div>
            <div className="md:w-1/2">
               <img src="https://www.procolored.com/cdn/shop/files/110mm_2x_e2e8b69d-6709-479a-9730-66e8199c52b2.png?v=1731403445&width=750" alt="Height" className="w-full rounded-2xl shadow-2xl" />
            </div>
         </div>

         {/* Section: Air Filter */}
         <div className="bg-[#1e1e1e] rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 text-white">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Air Filter</h2>
               <p className="text-gray-300 font-medium">The integrated air filter reduces over 70% of ink odors, allowing the printer to be used comfortably indoors</p>
            </div>
            <div className="md:w-1/2">
               <img src="https://www.procolored.com/cdn/shop/files/air_purification_2x_pc.png?v=1731461203&width=750" alt="Air Filter" className="w-full rounded-2xl shadow-2xl" />
            </div>
         </div>

         {/* Section: PID Controller */}
         <div className="bg-[#1e1e1e] rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-white">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Intelligent PID controller</h2>
               <p className="text-gray-300 font-medium">The air cooling system for the UV lamps has been upgraded with an intelligent PID controller for better heat dissipation, improving the printer's performance and lifespan.</p>
            </div>
            <div className="md:w-1/2">
               <img src="https://www.procolored.com/cdn/shop/files/cooling_system_2x_pc.png?v=1731461325&width=750" alt="Intelligent PID" className="w-full rounded-2xl shadow-2xl" />
            </div>
         </div>

         {/* Section: Auto Cleaning */}
         <div className="bg-[#fbfcff] rounded-[40px] p-8 flex border border-gray-100 flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 text-black">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Printhead Auto Cleaning</h2>
               <p className="text-gray-600 font-medium">The printhead will automatically perform self-cleaning every 10 hours, effectively protecting the printhead and extending the printer's lifespan.</p>
            </div>
            <div className="md:w-1/2 flex justify-center">
               <img src="https://www.procolored.com/cdn/shop/files/v6__3_2x_6281cdc3-c934-4fd8-be5b-c7bd41a9c771.png?v=1731462500&width=375" alt="Auto Cleaning" className="w-[375px] max-w-full drop-shadow-xl" />
            </div>
         </div>
      </div>

      {/* Parameters */}
      <div className="bg-[#fafafa] py-24 px-4 border-y border-gray-100 mt-16">
        <h2 className="text-4xl font-bold text-center mb-16">Parameters</h2>
        <div className="max-w-5xl mx-auto bg-white rounded-[30px] shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {[
              { label: "Printhead", value: "L800" },
              { label: "Configuration", value: "Single-Array" },
              { label: "Print Accuracy", value: "1440*1400 DPI (8 Pass)" },
              { label: "Print Size", value: "Width: 6.7\"(170mm)" },
              { label: "Applicable System", value: "Windows OS" },
              { label: "Print Speed", value: "Letter/A4: 23min" },
              { label: "Print Height", value: "0-110mm" },
              { label: "Ink Consumption", value: "Letter/A4: 1.25ml" },
              { label: "Software", value: "Pro RIP" },
              { label: "Net Weight", value: "73.9 lbs (33.5kg)" },
              { label: "Prints Per Hour", value: "3 Sets" },
              { label: "Product Size", value: "20*19.69*17.72\"" }
            ].map((param, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                <span className="font-bold text-gray-800">{param.label}</span>
                <span className="text-gray-600 font-medium">{param.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printing Steps */}
      <div className="bg-white py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Printing Step</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {printingSteps.map((s, i) => (
            <div key={i} className="flex flex-col bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
               <div className="p-4 0 w-full flex justify-center">
                   <img src={s.img} alt={s.title} className="max-w-full drop-shadow-md rounded object-contain" />
               </div>
               <div className="p-6 bg-white flex-1 border-t border-gray-100">
                <p className="text-xs font-bold whitespace-pre-line text-gray-800 leading-relaxed text-center">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Customer Reviews Section */}
      <div className="bg-[#fafafa] py-16 pb-32 border-t border-gray-200">
         <div className="max-w-6xl mx-auto px-4">
            
            <div className="flex flex-col md:flex-row gap-16">
               {/* Left Column: Aggregated Stats */}
               <div className="md:w-1/3">
                  <h2 className="text-2xl font-bold mb-6 text-center">Customer Reviews</h2>
                  <div className="flex flex-col items-center gap-2 mb-8">
                     <div className="flex text-yellow-400 text-2xl tracking-tight">★★★★★</div>
                     <span className="font-bold text-xl">5.00 out of 5</span>
                     <p className="text-sm text-gray-500 font-medium">Based on 32 reviews</p>
                  </div>
                  
                  <div className="space-y-3 mb-10 w-full">
                     {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-4 text-xs font-bold text-gray-400">
                           <div className="flex text-yellow-400 w-16">{stars === 5 ? '★★★★★' : '★'.repeat(stars)}</div>
                           <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400" style={{ width: stars === 5 ? '100%' : '0%' }} />
                           </div>
                           <span className="w-4 text-right">{stars === 5 ? '32' : '0'}</span>
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
                  <div className="flex items-center gap-2 mb-8 text-sm font-bold border-b border-gray-200 pb-4">
                     <span className="text-gray-400 capitalize">Most Recent</span>
                     <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="space-y-12">
                     {/* Review 1 */}
                     <div className="group border-b border-gray-100 pb-8 animate-fade-in">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600 text-xs shadow-sm">JS</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-white hover:border-black text-sm transition">JS</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★☆</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">07/29/2025</span>
                        </div>
                        <h4 className="font-bold text-base mb-2">Very difficult to use</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           So far, we have had no luck getting it to print correctly. We keep making adjustments with customer service so hopefully we can get it to work eventually.
                        </p>
                     </div>

                     {/* Review 2 */}
                     <div className="group border-b border-gray-100 pb-8">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">ER</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-white hover:border-black text-sm transition">Eagle Ridge Customs</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">06/03/2025</span>
                        </div>
                        <h4 className="font-bold text-base mb-2">UV printing</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           When I was thinking of getting into UV printing I had picked to go with this printer. Procolored had helped me to learn the basics from running the computer program to the service and any maintenance required for a UV printer. This company is a stand out company in quality and customer service along with always reaching out to help promote my business. Couldn’t have picked a better company to buy from to start my business
                        </p>
                     </div>

                     {/* Review 3 */}
                     <div className="group border-b border-gray-100 pb-8">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600 text-xs shadow-sm">L</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-white hover:border-black text-sm transition">Lily</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">12/20/2024</span>
                        </div>
                        <h4 className="font-bold text-base mb-2">Fully functional machine</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           The functions of the machine are very complete, and the pictures printed out are very good
                        </p>
                     </div>

                     {/* Review 4 */}
                     <div className="group border-b border-gray-100 pb-8">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-xs shadow-sm">J</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-white hover:border-black text-sm transition">Jerry</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">12/20/2024</span>
                        </div>
                        <h4 className="font-bold text-base mb-2">The machine looks beautiful</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           The machine looks beautiful and I like it very much
                        </p>
                     </div>

                     {/* Review 5 */}
                     <div className="group pb-4">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs shadow-sm">N</div>
                              <div>
                                 <span className="font-bold text-gray-800 border-b border-white hover:border-black text-sm transition">NICO</span>
                                 <div className="flex text-yellow-400 text-[10px] mt-1 tracking-tighter">★★★★★</div>
                              </div>
                           </div>
                           <span className="text-gray-400 text-[11px] font-bold">12/20/2024</span>
                        </div>
                        <h4 className="font-bold text-base mb-2">Easy to operate</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                           The machine operation procedure is relatively simple and easy to use
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
