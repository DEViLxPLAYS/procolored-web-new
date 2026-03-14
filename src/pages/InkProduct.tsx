import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const variants = [
  { name: 'CMYKWW', price: 65300, image: 'https://www.procolored.com/cdn/shop/files/CMYKWW_16_1220x_crop_center.png?v=1762338853' },
  { name: 'Magenta', price: 16900, image: 'https://www.procolored.com/cdn/shop/files/Magenta_1220x_crop_center.png?v=1762338853' },
  { name: 'Yellow', price: 16900, image: 'https://www.procolored.com/cdn/shop/files/yellow_1220x_crop_center.png?v=1762338853' },
  { name: 'White', price: 16900, image: 'https://www.procolored.com/cdn/shop/files/White_0d2df479-3b68-4cab-abc3-8f352988d5d2_1220x_crop_center.png?v=1762339022' },
  { name: 'Cyan', price: 16900, image: 'https://www.procolored.com/cdn/shop/files/Cyan_1220x_crop_center.png?v=1762338853' },
  { name: 'Black', price: 16900, image: 'https://www.procolored.com/cdn/shop/files/Black_1220x_crop_center.png?v=1762338853' },
];

const faqs = [
  { question: "Which Procolored printers is this ink compatible with?", answer: "This ink is compatible with all Procolored DTF printers including the F8, F13, F13 Pro, P13, K13 Lite, and K Series. It is specifically formulated and tested for use with Procolored printer hardware to ensure optimal performance and print quality." },
  { question: "How many wash cycles can prints withstand?", answer: "Prints made with Procolored DTF ink can withstand 50+ wash cycles while maintaining vibrant color and strong adhesion. For best results, wash garments inside out in cold water and avoid bleach." },
  { question: "What is the shelf life of this ink?", answer: "The ink has a shelf life of 12 months when stored unopened in a cool, dry place between 5°C and 30°C (41°F and 86°F). Once opened, use within 6 months for best results." },
  { question: "Do I need to shake the ink before use?", answer: "Yes — it is recommended to gently shake the ink bottle before filling your printer to ensure the pigments are evenly distributed, especially for the white ink which can settle over time." },
  { question: "Can I mix this ink with other brands?", answer: "No — mixing Procolored ink with other brands is not recommended as it can cause clogging, color inconsistencies, and potential damage to your printhead. Always use Procolored ink exclusively for optimal results." },
  { question: "What fabrics can I print on with this ink?", answer: "This DTF ink can be transferred onto virtually any fabric including cotton, polyester, cotton-polyester blends, nylon, denim, leather, and more. It is suitable for both light and dark colored fabrics." },
  { question: "How do I store the ink properly?", answer: "Store in a cool, dry place away from direct sunlight. Keep bottles tightly sealed when not in use. Avoid storing at temperatures below 5°C or above 30°C as extreme temperatures can affect ink quality." }
];

const reviews = [
  // Page 1
  { name: "Sarah M.", rating: 5, date: "March 8, 2026", text: "Absolutely love this ink! Colors are so vibrant and the prints wash perfectly even after 30+ washes. Been using it for 3 months and very happy." },
  { name: "James K.", rating: 5, date: "March 5, 2026", text: "Best DTF ink I have used so far. Works perfectly with my Procolored F13 Pro. No clogging and the colors are spot on every time." },
  { name: "Priya L.", rating: 4, date: "February 28, 2026", text: "Great quality ink. The white ink in particular is excellent — very opaque. Only reason for 4 stars is the price but you get what you pay for." },
  { name: "Michael T.", rating: 5, date: "February 22, 2026", text: "Incredible color accuracy. My customers keep commenting on how vivid the prints are. Will definitely reorder." },
  { name: "Aisha R.", rating: 5, date: "February 15, 2026", text: "Smooth flow, no clogs, vibrant colors. This ink has transformed my DTF printing business. Highly recommend to anyone using Procolored printers." },
  // Page 2
  { name: "David W.", rating: 5, date: "February 10, 2026", text: "Excellent ink quality. I switched from another brand and the difference is night and day. Colors are more vibrant and prints last much longer." },
  { name: "Emma S.", rating: 4, date: "February 3, 2026", text: "Really good ink. Consistent quality batch after batch. The cyan and magenta are particularly vivid. Very satisfied with the purchase." },
  { name: "Carlos B.", rating: 5, date: "January 28, 2026", text: "Perfect for my Procolored P13. No issues at all — flows perfectly, colors are accurate and the prints are washing brilliantly after multiple cycles." },
  { name: "Lisa H.", rating: 5, date: "January 20, 2026", text: "Top quality product. I have been ordering this for 6 months and every batch is consistently excellent. Fast delivery too." },
  { name: "Omar F.", rating: 4, date: "January 14, 2026", text: "Very good ink quality. The colors are accurate and bright. Only minor feedback is I wish the bottles had better pouring spouts but the ink itself is great." },
  // Page 3
  { name: "Natalie C.", rating: 5, date: "January 8, 2026", text: "Amazing quality ink. My F13 Pro has been running flawlessly since switching to this. Zero clogs and the prints look incredible on dark fabrics." },
  { name: "Ryan P.", rating: 5, date: "January 2, 2026", text: "Highly recommend this ink to any DTF printer owner. Vibrant colors, excellent washability and works seamlessly with Procolored printers." },
  { name: "Fatima A.", rating: 4, date: "December 26, 2025", text: "Great ink. Colors are consistent and prints look professional. Very happy with the quality for the price point." },
  { name: "John D.", rating: 5, date: "December 18, 2025", text: "Best DTF ink on the market for Procolored printers. Tried several brands before settling on this one and I will never go back. Exceptional quality." },
  { name: "Sophie K.", rating: 5, date: "December 10, 2025", text: "Absolutely brilliant ink. Runs smoothly through my printer with zero maintenance issues. Colors are rich, vivid and last through wash after wash." }
];

export default function InkProduct() {
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const { addToCart } = useCart();
  
  const activeImage = variants[activeVariantIdx].image;
  const currentReviews = reviews.slice((reviewPage - 1) * 5, reviewPage * 5);

  const handleAddToCart = () => {
    addToCart({
      id: "47",
      name: `Procolored Direct to Transfer Film Ink 500ml - ${variants[activeVariantIdx].name}`,
      price: `Rs.${variants[activeVariantIdx].price.toLocaleString()}.00`,
      image: activeImage,
      quantity: quantity
    });
  };

  return (
    <div className="bg-white font-sans text-[#1a1a1a]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500 font-medium">
        <Link to="/" className="hover:text-black hover:underline">Home</Link> <span className="mx-2">/</span>
        <Link to="/collections/all" className="hover:text-black hover:underline">Shop</Link> <span className="mx-2">/</span>
        <Link to="/collections/all" className="hover:text-black hover:underline">All</Link> <span className="mx-2">/</span>
        <span className="text-gray-900">Procolored Direct to Transfer Film Ink 500ml</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div>
            <div className="relative border border-gray-100 rounded-xl overflow-hidden mb-4 bg-white flex items-center justify-center p-8 h-[500px] lg:h-[600px] group">
              <img 
                src={activeImage} 
                alt={`Procolored DTF Ink - ${variants[activeVariantIdx].name}`}
                className="w-full h-full object-contain cursor-crosshair transform group-hover:scale-150 transition-transform duration-500 origin-center"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {variants.map((variant, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveVariantIdx(idx)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg p-2 transition-all ${
                    activeVariantIdx === idx ? 'border-blue-600 border-2 scale-105' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={variant.name}
                >
                  <img src={variant.image} alt={variant.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              Procolored Direct to Transfer Film Ink 500ml
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {Array(5).fill("★").map((star, i) => (
                  <span key={i} className="text-xl tracking-tighter">{star}</span>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">135 reviews</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-red-600">Rs.{variants[activeVariantIdx].price.toLocaleString()}.00 PKR</span>
            </div>
            
            <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
              Note: We've recently updated the ink packaging, the old or new packaging will be shipped out randomly.
            </p>

            {/* Discount Code Box */}
            <div className="border border-green-500 bg-green-50/50 rounded-lg p-4 mb-8 flex justify-between items-center relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500" />
              <div className="pl-3">
                <span className="text-green-600 font-bold block mb-1">Exclusive For You</span>
                <span className="text-sm font-medium text-gray-600">Use code <strong className="text-black">PROCOLORED5</strong> for 5% off</span>
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md font-bold tracking-wider relative group-hover:bg-green-500 group-hover:text-white transition-colors cursor-pointer border border-green-200">
                PROCOLORED5
              </div>
            </div>

            {/* Variant Selector */}
            <div className="mb-8">
              <h3 className="font-bold mb-3">Options:</h3>
              <div className="grid grid-cols-2 gap-3">
                {variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVariantIdx(idx)}
                    className={`py-3 px-4 border rounded-md text-sm font-bold text-center transition-all ${
                      activeVariantIdx === idx 
                        ? 'border-orange-500 text-orange-600 shadow-sm relative after:absolute after:-top-px after:-right-px after:-bottom-px after:-left-px after:border-2 after:border-orange-500 after:rounded-md' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {variant.name === 'CMYKWW' ? 'Five-color(CMYK+WW)\n6*500ml' : variant.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex border border-gray-300 rounded-md h-[52px] w-full sm:w-[140px] items-center overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full font-bold text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                >-</button>
                <div className="flex-1 text-center font-bold">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 h-full font-bold text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-[2] bg-white border-2 border-black text-black rounded-full h-[52px] font-bold text-base hover:bg-gray-50 transition-colors"
              >
                Add to cart
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-[2] bg-[#5A31F4] text-white rounded-full h-[52px] font-bold text-base hover:bg-[#4820dc] transition-colors"
              >
                Buy with shop
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer mb-6">
              More payment options
            </div>
            
            {/* Shop Confidence Badges */}
            <div className="bg-gray-50 rounded-lg p-5 mb-6 text-sm">
              <div className="flex items-start gap-2 mb-2 font-bold text-gray-900">
                <CheckCircle2 className="w-5 h-5 text-gray-700" />
                Shop with Confidence!
              </div>
              <ul className="list-disc pl-8 text-gray-600 mb-2 space-y-1">
                <li>100% Protection Against Shipping Mishaps</li>
              </ul>
              <div className="text-xs text-gray-500 uppercase tracking-widest pl-7 mt-3">
                Worry-Free Purchase® by seel
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 font-bold flex gap-2 items-center text-sm">
              <span className="text-gray-400">🎁</span> Earn 229 Points when you buy this item.
            </div>
          </div>
        </div>
      </div>

      {/* Description Section with Exact Banners */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Procolored Direct to Transfer Film Ink 500ml</h2>
          <p className="text-lg text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Premium DTF ink formulated specifically for Procolored DTF printers.
            Delivers vivid, long-lasting colors with exceptional washability and
            adhesion on all fabric types.
          </p>
        </div>

        {/* Storage Life Banner Layout */}
        <div className="mb-16 bg-[#fafafa] rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <img 
                src="https://www.procolored.com/cdn/shop/files/ink_storage_life_1280x_crop_center.png?v=1748227054" 
                alt="PROCOLORED INK Storage Life Image" 
                className="w-full max-w-[400px] h-auto object-contain drop-shadow-sm mix-blend-multiply"
              />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">PROCOLORED INK</p>
              <h3 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 tracking-tight">Storage Life</h3>
              
              <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
                <p>
                  For DTF printing, the inks and materials used are crucial - they need to be 
                  compatible with the printer's transfer curve. The inks typically have a limited 
                  shelf life, after which their performance can start to degrade.
                </p>
                <p>
                  It's a good practice to check the expiration date on the DTF inks you receive 
                  from Procolored. Using expired inks could result in poor print quality, adhesion 
                  issues, or other problems that ruin your final garments. If the inks have expired, 
                  Procolored's promise to provide a replacement or compensation policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Designated Banner Layout */}
        <div className="mb-16 bg-[#F4F8FD] rounded-2xl p-8 lg:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">PROCOLORED INK</p>
              <h3 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 tracking-tight leading-tight">
                Designated for<br />
                Procolored Printer
              </h3>
              
              <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
                <p>
                  With specific chemical components, viscosity setting and drying speed, 
                  Procolored DTF inks are designed to perfectly fit Procolored films and printers.
                </p>
                <p>
                  We highly recommend to use original and genuine Procolored DTF inks to 
                  guarantee a 100% compatibility with your Procolored printers. Applying DTF 
                  inks of other brands may cause irreversible harms to ink-contact printer 
                  components (damper, manifold, printhead, capping station, etc.) and it's 
                  beyond our warranty scope.
                </p>
              </div>
            </div>
            <div className="order-2 flex justify-center md:absolute right-0 top-0 bottom-0 md:w-1/2">
               <img 
                src="https://www.procolored.com/cdn/shop/files/4_a0034b26-a52c-44a0-beb9-36bb867bdaf7_1280x_crop_center.png?v=1719473032" 
                alt="PROCOLORED INK Designated for Procolored Printer" 
                className="w-full h-full object-cover md:object-right mix-blend-multiply"
                style={{ objectPosition: '80% center' }}
              />
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Product Specifications</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <tbody className="text-sm md:text-base font-medium">
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200">Volume</td>
                  <td className="py-4 px-6 text-gray-700">500ml per bottle</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200 bg-gray-50/50">Compatible Printers</td>
                  <td className="py-4 px-6 text-gray-700">All Procolored DTF Printers</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200">Ink Type</td>
                  <td className="py-4 px-6 text-gray-700">Direct to Transfer Film (DTF) Ink</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200 bg-gray-50/50">Colors Available</td>
                  <td className="py-4 px-6 text-gray-700">CMYKWW, Magenta, Yellow, White, Cyan, Black</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200">Washability</td>
                  <td className="py-4 px-6 text-gray-700">Excellent — withstands 50+ wash cycles</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200 bg-gray-50/50">Adhesion</td>
                  <td className="py-4 px-6 text-gray-700">High adhesion on cotton, polyester, blends</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200">Storage Temperature</td>
                  <td className="py-4 px-6 text-gray-700">5°C — 30°C (41°F — 86°F)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200 bg-gray-50/50">Shelf Life</td>
                  <td className="py-4 px-6 text-gray-700">12 months unopened</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-4 px-6 font-bold w-1/3 text-gray-900 border-r border-gray-200">Shake Before Use</td>
                  <td className="py-4 px-6 text-gray-700">Yes — recommended</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50/30 py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
            {/* Review Stats */}
            <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="flex text-yellow-400 text-2xl tracking-tighter mb-2">★★★★★</div>
                <p className="font-bold text-gray-700 mb-1">4.87 out of 5</p>
                <p className="text-gray-500 font-medium text-sm">Based on 135 reviews</p>
              </div>
            </div>

            {/* Simulated Review Bars */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 space-y-2">
                {[
                  { star: 5, w: '93%', count: 126 },
                  { star: 4, w: '5%', count: 4 },
                  { star: 3, w: '2%', count: 3 },
                  { star: 2, w: '0%', count: 1 },
                  { star: 1, w: '0%', count: 1 }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <span className="flex text-yellow-400 tracking-tighter w-16 opacity-80">{Array(5).fill("★").map((_, i) => <span key={i} className={i < s.star ? '' : 'text-gray-300'}>★</span>)}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-sm overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-sm" style={{ width: s.w }} />
                    </div>
                    <span className="w-6 text-right">{s.count}</span>
                  </div>
                ))}
              </div>
              <div className="w-[1px] h-24 bg-gray-200 mx-4 hidden md:block" />
              <div className="w-1/3 flex flex-col gap-3">
                <button className="w-full bg-[#f6c62c] text-white rounded font-bold py-2 px-4 shadow-sm hover:bg-[#eab308] transition-colors text-sm">
                  Write a review
                </button>
                <button className="w-full bg-white border border-[#f6c62c] text-[#f6c62c] rounded font-bold py-2 px-4 hover:bg-gray-50 transition-colors text-sm">
                  Ask a question
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {currentReviews.map((review, idx) => (
              <div key={idx} className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <UserIcon />
                    </div>
                    <div className="font-bold text-[#f6c62c]">{review.name} <span className="bg-[#f6c62c] text-white text-[9px] px-1 rounded uppercase tracking-wider ml-1">Verified</span></div>
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{review.date}</div>
                </div>
                
                <div className="flex text-yellow-400 mb-3 ml-8 text-sm tracking-tighter">
                  {Array(review.rating).fill("★").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                
                <div className="ml-8 font-bold text-base mb-1 text-gray-800">Direct to Transfer Film Ink 500ml</div>
                <p className="ml-8 text-gray-600 font-medium">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>

          {/* Local Pagination */}
          <div className="flex justify-center mt-12 gap-4">
            <button 
              onClick={() => setReviewPage(Math.max(1, reviewPage - 1))}
              disabled={reviewPage === 1}
              className="text-gray-400 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-400 flex items-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {[1, 2, 3].map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setReviewPage(pageNum)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    reviewPage === pageNum 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-orange-500'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setReviewPage(Math.min(3, reviewPage + 1))}
              disabled={reviewPage === 3}
              className="text-gray-400 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-400 flex items-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                openFaq === index ? 'border-gray-300 shadow-md bg-white' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-[#1a1a1a]"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-black' : ''}`} />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'max-h-48 border-t border-gray-100' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-5 text-gray-600 font-medium leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Custom simple user icon component
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
