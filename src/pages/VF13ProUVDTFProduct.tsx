import { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';
import Hls from 'hls.js';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';

// --- HLS Video Player Component ---
const HlsVideoPlayer = ({ src, className = "" }: { src: string, className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls;
    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls({ startPosition: 0 });
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(() => {
            // Auto-play might be blocked, this is handled gracefully by browsers
          });
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support (Safari)
        videoRef.current.src = src;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(() => {});
        });
      }
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-cover ${className}`}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

export default function VF13ProUVDTFProduct() {
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();

  // Variant State
  const [variant, setVariant] = useState<'with-stand' | 'without-stand'>('with-stand');
  const price = variant === 'with-stand' ? 6899.00 : 6399.00;

  // Gallery State
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Reviews State
  const [reviewPage, setReviewPage] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const images = [
    "https://www.procolored.com/cdn/shop/files/VF13pro___001_1220x_crop_center.png?v=1747819379",
    "https://www.procolored.com/cdn/shop/files/VF13pro___002_1220x_crop_center.png?v=1747819379",
    "https://www.procolored.com/cdn/shop/files/VF13pro_1220x_crop_center.png?v=1747819379",
    "https://www.procolored.com/cdn/shop/files/VF13pro_006350ac-1e69-4944-acb9-9ab412754ef2_1220x_crop_center.png?v=1747819379",
    "https://www.procolored.com/cdn/shop/files/VF13pro_c3a4525e-822e-4e1b-88e9-d37ac38dc855_1220x_crop_center.png?v=1747819379",
    "https://www.procolored.com/cdn/shop/files/VF13pro_3ddd1315-7519-46e4-8da8-699827a2f30d_1220x_crop_center.png?v=1747819379"
  ];

  const handleAddToCart = () => {
    addToCart({
      id: `vf13pro-uv-dtf-${variant}`,
      name: `Procolored VF13 Pro Panda UV DTF Printer 13" A3+ Dual XP600 2-in-1 (${variant === 'with-stand' ? 'With Stand' : 'Without Stand'})`,
      price: `$${price.toFixed(2)} USD`,
      image: images[0],
      quantity: 1
    });
  };



  return (
    <div className="bg-white font-sans text-[#1a1a1a] overflow-x-hidden">
      {/* 🖼️ PART 1 & 2: Header Section & Gallery (White Background) */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Gallery */}
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
                    backgroundSize: '200%' // Zoom level
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

          {/* Right Column: Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Procolored VF13 Pro Panda UV DTF Printer 13" A3+ Dual XP600 2-in-1</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-medium">50 reviews</span>
            </div>

            <p className="text-2xl font-bold text-red-600 mb-6">{formatConverted(convertPrice(price.toString(), currency.divisor))}</p>

            <div className="mb-6">
              <p className="font-bold mb-2 text-sm">What's In The Box</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                <li>VF13 Pro Panda UV DTF Printer</li>
                <li>Full Set of Initial UV DTF Ink (CMYKW 5*250ml)*2</li>
              </ul>
            </div>

            <div className="mb-8">
              <p className="font-bold mb-3 text-sm">Combination:</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setVariant('with-stand')}
                  className={`flex-1 py-3 text-sm font-bold border rounded transition-all ${variant === 'with-stand' ? 'border-[#E85A24] text-[#E85A24] ring-1 ring-[#E85A24]' : 'border-gray-300 hover:border-black'}`}
                >
                  With Stand
                </button>
                <button 
                  onClick={() => setVariant('without-stand')}
                  className={`flex-1 py-3 text-sm font-bold border rounded transition-all ${variant === 'without-stand' ? 'border-[#E85A24] text-[#E85A24] ring-1 ring-[#E85A24]' : 'border-gray-300 hover:border-black'}`}
                >
                  Without Stand
                </button>
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
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 object-contain" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 object-contain" alt="Mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%(2018%).svg" className="h-6 object-contain" alt="Amex" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4 object-contain" alt="Google Pay" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-6 object-contain" alt="Apple Pay" />
            </div>



            {/* Badges Row */}
            <div className="flex items-center gap-6 border-t border-gray-100 pt-6 text-sm flex-wrap font-medium">
              <button className="flex items-center gap-2 hover:text-black text-gray-600"><span className="text-xl">📚</span> Resources</button>
              <div className="flex items-center gap-2 text-gray-600"><span className="text-xl">🚚</span> 1-2 weeks Delivery</div>
              <button className="flex items-center gap-2 hover:text-black text-gray-600"><span className="text-xl">📖</span> Instruction Manual</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mt-8 border-b border-gray-200">
               <button className="pb-3 border-b-2 border-black font-bold">Packages</button>
               <button className="pb-3 border-b-2 border-transparent text-gray-500 font-bold hover:text-black">Videos</button>
               <button className="pb-3 border-b-2 border-transparent text-gray-500 font-bold hover:text-black">Features</button>
            </div>

          </div>
        </div>
      </div>

      {/* 📐 PART 3 & 4: Sections Grid */}

      {/* Section 1 - Full Width Hero Image */}
      <div className="w-full bg-white">
        <img src="https://www.procolored.com/cdn/shop/files/Rectangle_978_1.png?v=1767594203&width=2000" alt="Hero" className="w-full h-auto object-cover" />
      </div>

      {/* Section 2 - Versatile Sticker Printing */}
      <div className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-12 tracking-tight">Versatile Sticker Printing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src="https://www.procolored.com/cdn/shop/files/Versatile_Sticker_Pr.png?v=1747623703&width=375" alt="Sticker 1" className="w-full rounded-2xl shadow-sm hover:-translate-y-1 transition duration-500 object-cover" />
            <img src="https://www.procolored.com/cdn/shop/files/Versatile_Sticker_Pr.png?v=1747623703&width=375" alt="Sticker 2" className="w-full rounded-2xl shadow-sm hover:-translate-y-1 transition duration-500 object-cover" />
            <img src="https://www.procolored.com/cdn/shop/files/Versatile_Sticker_Pr.png?v=1747623703&width=375" alt="Sticker 3" className="w-full rounded-2xl shadow-sm hover:-translate-y-1 transition duration-500 object-cover" />
          </div>
        </div>
      </div>

      {/* Section 3 - Versatile Sticker Maker */}
      <div className="bg-white pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-left">Versatile Sticker Maker</h2>
          <p className="text-gray-700 md:text-lg text-left mb-10 leading-relaxed max-w-3xl">
            This printer produces a wide range of decals that can be applied to flat 
            surfaces, curved objects, metal, plastic, wood, and other materials, 
            delivering custom stickers ideal for branding, packaging, customization, 
            craft supplies, and decorative uses.
          </p>
          <img src="https://www.procolored.com/cdn/shop/files/VF13_pro_52c9c0b8-1825-4a3a-83a7-399fce5a1b12.png?v=1747819301&width=750" alt="Versatile Sticker Maker" className="w-full rounded-3xl" />
        </div>
      </div>

      {/* Section 4 - Simple 3-Step Application */}
      <div className="bg-white pb-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 tracking-tight text-left">Simple 3-step Application！</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-start group">
               <div className="rounded-2xl overflow-hidden mb-4 shadow"><img src="https://www.procolored.com/cdn/shop/files/1_8d2eabe0-6de9-45ff-94b5-4f3f43708801.png?v=1747626989&width=375" alt="Step 1: Cut" className="w-full group-hover:scale-105 transition duration-500" /></div>
               <p className="font-bold text-lg">Step 1: Cut</p>
            </div>
            <div className="flex flex-col items-start group">
               <div className="rounded-2xl overflow-hidden mb-4 shadow"><img src="https://www.procolored.com/cdn/shop/files/2_e6b8279c-a789-47ca-b3be-68fde1c0e3b4.png?v=1747627019&width=375" alt="Step 2: Stick" className="w-full group-hover:scale-105 transition duration-500" /></div>
               <p className="font-bold text-lg">Step 2: Stick</p>
            </div>
            <div className="flex flex-col items-start group">
               <div className="rounded-2xl overflow-hidden mb-4 shadow"><img src="https://www.procolored.com/cdn/shop/files/3_fe7321ca-c72d-4cd5-8b48-c439b435222c.png?v=1747627048&width=375" alt="Step 3: Peel" className="w-full group-hover:scale-105 transition duration-500" /></div>
               <p className="font-bold text-lg">Step 3: Peel</p>
            </div>
            <div className="flex flex-col items-start group">
               <div className="rounded-2xl overflow-hidden mb-4 shadow"><img src="https://www.procolored.com/cdn/shop/files/4_ce8bb0da-e69a-4237-a488-b8d38251ebe1.png?v=1747627086&width=375" alt="Done!" className="w-full group-hover:scale-105 transition duration-500" /></div>
               <p className="font-bold text-lg">Done!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 - User Tutorials of the Machine */}
      <div className="bg-white py-24">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-10 tracking-tight text-center md:whitespace-pre-line leading-tight">
               {"User Tutorials\nof the Machine"}
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
               <HlsVideoPlayer src="https://www.procolored.com/cdn/shop/videos/c/vp/07d2a5d3e85e47189bb341238ff27f09/07d2a5d3e85e47189bb341238ff27f09.m3u8?v=0" className="w-full aspect-video" />
            </div>
         </div>
      </div>

      {/* Section 6 - Dynamic Business Needs */}
      <div className="bg-[#FEF5B5] w-full pt-16 md:pt-24 flex flex-col items-center">
         <div className="max-w-5xl mx-auto px-4 text-center md:text-left md:flex justify-between w-full mb-8 relative z-10 md:px-12">
            <div className="md:w-1/2 md:mt-24">
               <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Dynamic<br/>Business Needs</h2>
               <p className="text-gray-800 text-sm md:text-base font-medium max-w-sm">
                  From small labels to larger, you can print precise<br/>quantities needed and minimize waste.
               </p>
            </div>
         </div>
         <div className="w-full">
            <img src="https://www.procolored.com/cdn/shop/files/VF13pro-Dynamic_Business.jpg?v=1747819799&width=2000" alt="Dynamic Business Needs" className="w-full h-auto object-cover" />
         </div>
      </div>

      {/* Section 7 - Accurate Color Reproduction */}
      <div className="bg-[#0f0f0f] w-full pt-20 pb-12">
         <div className="max-w-4xl mx-auto px-4 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Accurate Color Reproduction</h2>
            <p className="text-gray-300 mb-10 text-sm md:text-base leading-relaxed max-w-3xl font-medium">
               Using micro-piezo and smart droplet technology, the printer produces 
               prints with smoother color transitions and precision under 1 mm. The 
               printing outputs display rich details and seamless transitions, nearly 
               achieving 100% color reproduction.
            </p>
            <img src="https://www.procolored.com/cdn/shop/files/VF13pro_-Accurate_Color_Repro_-pc.jpg?v=1747644296&width=750" alt="Parrot Color Details" className="w-full rounded-2xl shadow-2xl" />
         </div>
      </div>

      {/* Section 8 - Two-in-One: Simultaneous Printing and Laminating */}
      <div className="bg-[#0f0f0f] w-full pb-24 mb-0">
         <div className="max-w-4xl mx-auto px-4 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight md:max-w-2xl leading-tight">
               Two-in-One: Simultaneous<br/>Printing and Laminating<br/>for Efficient Sticker-Making
            </h2>
            <p className="text-gray-300 mb-10 text-sm md:text-base leading-relaxed max-w-3xl font-medium">
               This printer combines printing and laminating into a single seamless<br/>process, simplifying machine setup and accelerating production speed.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
               <HlsVideoPlayer src="https://www.procolored.com/cdn/shop/videos/c/vp/d6c66a72900548a1825a37d4515f0063/d6c66a72900548a1825a37d4515f0063.m3u8?v=0" className="w-full aspect-video" />
            </div>
         </div>
      </div>

      {/* Section 9 - One-rod Design Updated */}
      <div className="bg-white py-24">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-1/2">
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">One-rod Design<br/>Updated</h2>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-md">
                     We change the A film guide rod from 2 to 1, simplifies the 
                     installed process and makes printing smoother.
                  </p>
               </div>
               <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <HlsVideoPlayer src="https://www.procolored.com/cdn/shop/videos/c/vp/603ceb8f022642caa18099118abeb138/603ceb8f022642caa18099118abeb138.m3u8?v=0" className="w-full aspect-square md:aspect-video object-cover" />
               </div>
            </div>
         </div>
      </div>

      {/* Section 10 - Printhead Auto Cleaning */}
      <div className="bg-[#F8F8F8] py-24 border-y border-gray-200">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="md:w-1/2">
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Printhead Auto Cleaning</h2>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-md">
                     The printhead will automatically perform self-cleaning every 10 hours, 
                     effectively protecting the printhead and extending the printer's lifespan.
                  </p>
               </div>
               <div className="md:w-1/2 flex justify-center">
                  <img src="https://www.procolored.com/cdn/shop/files/974788210939fc5e5ad1ff5c506cc45a.jpg?v=1747636493&width=375" alt="10 Hours Graphics" className="w-64 md:w-80 object-contain rounded-2xl" />
               </div>
            </div>
         </div>
      </div>

      {/* Section 11 - Compact Size */}
      <div className="bg-[#F8F8F8] py-24">
         <div className="max-w-6xl mx-auto px-4 text-center pb-12">
            <img src="https://www.procolored.com/cdn/shop/files/Compact_Size-pc.png?v=1754964532" alt="Compact Size" className="w-full max-w-4xl mx-auto" />
         </div>
      </div>



      {/* Section 13 - Customer Reviews */}
      <div className="bg-white py-16 pb-32 border-t border-gray-200">
         <div className="max-w-6xl mx-auto px-4">
            
            <div className="flex flex-col md:flex-row gap-16">
               {/* Left Column: Aggregated Stats */}
               <div className="md:w-1/3">
                  <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                  <div className="flex items-center gap-2 mb-2">
                     <div className="flex text-yellow-500 text-xl tracking-tighter">★★★★★</div>
                     <span className="font-bold text-xl ml-1">4.96 out of 5</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-8 font-medium">Based on 50 reviews</p>
                  
                  <div className="space-y-3 mb-10 w-full">
                     <div className="flex items-center gap-4 text-sm font-semibold">
                        <div className="flex text-yellow-500 w-24">★★★★★</div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#E85A24] rounded-full" style={{ width: '96%' }} />
                        </div>
                        <span className="w-6 text-gray-500">48</span>
                     </div>
                     <div className="flex items-center gap-4 text-sm font-semibold">
                        <div className="flex text-yellow-500 w-24">★★★★<span className="text-gray-300">★</span></div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#E85A24] rounded-full" style={{ width: '4%' }} />
                        </div>
                        <span className="w-6 text-gray-500">2</span>
                     </div>
                     {[3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-4 text-sm font-semibold">
                           <div className="flex text-yellow-500 w-24">{'★'.repeat(stars)}{'<span class="text-gray-300">★</span>'.repeat(5-stars).replace(/<[^>]*>?/gm, '★' )}</div>
                           <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden" />
                           <span className="w-6 text-gray-500">0</span>
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-3">
                     <button className="w-full bg-white border-2 border-[#E85A24] text-[#E85A24] font-bold py-3 hover:bg-orange-50 transition rounded shadow-sm">Write a review</button>
                     <button className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 hover:border-black transition rounded">Ask a question</button>
                  </div>
               </div>

               {/* Right Column: Review List & Filters */}
               <div className="md:w-2/3">
                  <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-bold border-b border-gray-200 pb-4">
                     <button className="border-b-2 border-black pb-1">Most Recent</button>
                     <button className="pb-1 text-gray-500 hover:text-black">Highest Rating</button>
                     <button className="pb-1 text-gray-500 hover:text-black">Lowest Rating</button>
                     <button className="pb-1 text-gray-500 hover:text-black">Only Pictures</button>
                     <button className="pb-1 text-gray-500 hover:text-black">Pictures First</button>
                     <button className="pb-1 text-gray-500 hover:text-black">Videos First</button>
                     <button className="pb-1 text-gray-500 hover:text-black">Most Helpful</button>
                  </div>



                  <div className="space-y-8">
                     {/* Review 1 */}
                     <div className="border-b border-gray-100 pb-8 group">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 border-b border-black">Manny</span>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-green-500 text-xs font-bold uppercase tracking-wider hidden md:inline">Verified</span>
                           </div>
                           <span className="text-gray-400 text-sm">03/24/2026</span>
                        </div>
                        <div className="flex text-yellow-500 tracking-tighter mb-3">★★★★★</div>
                        <h4 className="font-bold text-lg mb-2">First UVDTF machine ive had</h4>
                        <p className="text-gray-600 font-medium leading-relaxed">
                           We've had our UV DTF machine for about 5 months now. The VF13 Pro 
                           and we absolutely love it! We've made cups, badge reels, key chains, 
                           phone case stickers! The amount of custom items you can make is 
                           endless! Set up can be tricky but customer service is a great help! 
                           So far im very happy with my purchase! looking into purchasing a 
                           Procolored DTF printer next!
                        </p>
                     </div>

                     {/* Review 2 */}
                     <div className="border-b border-gray-100 pb-8 group">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 border-b border-black">Fermin</span>
                           </div>
                           <span className="text-gray-400 text-sm">03/05/2026</span>
                        </div>
                        <div className="flex text-yellow-500 tracking-tighter mb-3">★★★★★</div>
                        <h4 className="font-bold text-lg mb-2">Excelente equipo, me ayuda mucho .Es fácil de trabaja y la calidad de los Stickers es insuperable..r</h4>
                        <p className="text-gray-600 font-medium leading-relaxed mb-4">
                           Recomiendo este equipo..Excelente y excelente Postventa.
                        </p>
                     </div>

                     {/* Review 3 */}
                     <div className="border-b border-gray-100 pb-8 group">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 border-b border-black">Gina</span>
                           </div>
                           <span className="text-gray-400 text-sm">03/03/2026</span>
                        </div>
                        <div className="flex text-yellow-500 tracking-tighter mb-3">★★★★★</div>
                        <h4 className="font-bold text-lg mb-2">recommend procolored vf13 pro</h4>
                        <p className="text-gray-600 font-medium leading-relaxed">
                           I have this printer and its worth every penny spent on it the colors 
                           are vibrant customer support is by far the greatest I've encounter i 
                           needed help with downloading the program and get it running they 
                           helped me and it was up and running fast i do recommend Procolored 
                           in fact my next purchase is the DTF one
                        </p>
                     </div>

                     {/* Review 4 */}
                     <div className="border-b border-gray-100 pb-8 group">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 border-b border-black">Manroop Singh</span>
                           </div>
                           <span className="text-gray-400 text-sm">01/30/2026</span>
                        </div>
                        <div className="flex text-yellow-500 tracking-tighter mb-3">★★★★★</div>
                        <h4 className="font-bold text-lg mb-0 text-gray-500">Procolored VF13 Pro Panda UV DTF Printer 13" A3+ Dual XP600 2-in-1</h4>
                     </div>

                     {/* Review 5 */}
                     <div className="border-b border-gray-100 pb-8 group">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 border-b border-black">Shereese Kalawa</span>
                           </div>
                           <span className="text-gray-400 text-sm">01/29/2026</span>
                        </div>
                        <div className="flex text-yellow-500 tracking-tighter mb-3">★★★★★</div>
                        <h4 className="font-bold text-lg mb-2">New to UV DTF</h4>
                        <p className="text-gray-600 font-medium leading-relaxed">
                           I purchased the VF13 Pro UV DTF printer. I am super excited to add 
                           this equipment to my small business and be able to print in-house. 
                           The one sad point about this machine is the inability to print dual 
                           side; however, it is still worth ever penny. I am excited to add 
                           more equipments to my shop.
                        </p>
                     </div>

                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2 mt-12">
                     <button onClick={() => setReviewPage(1)} className={`w-10 h-10 flex items-center justify-center border font-bold text-sm hover:border-black transition ${reviewPage === 1 ? 'border-black' : 'border-gray-200'}`}>1</button>
                     <button onClick={() => setReviewPage(2)} className={`w-10 h-10 flex items-center justify-center border font-bold text-sm hover:border-black transition ${reviewPage === 2 ? 'border-black' : 'border-transparent'}`}>2</button>
                     <button onClick={() => setReviewPage(3)} className={`w-10 h-10 flex items-center justify-center border font-bold text-sm hover:border-black transition ${reviewPage === 3 ? 'border-black' : 'border-transparent'}`}>3</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
