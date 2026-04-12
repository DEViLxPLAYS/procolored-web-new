import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

// INSTRUCTIONS FOR OWNER: 
// To change the price, edit the "price" value below. 
// Note: The price is in CENTS. So 100 = $1.00. 
// When you want to revert to original pricing:
// - Change 250ml from 100 to 4900 ($49.00)
// - Change 500ml from 100 to 5900 ($59.00)
const variants = [
  {
    size: '250ml',
    price: 4900, // $49.00 USD
    image: 'https://www.procolored.com/cdn/shop/files/250ml_cdfd861c-62b6-4d98-9331-934d56bfe03e_1220x_crop_center.png?v=1762339048'
  },
  {
    size: '500ml',
    price: 5900, // $59.00 USD
    image: 'https://www.procolored.com/cdn/shop/files/White_0d2df479-3b68-4cab-abc3-8f352988d5d2_1220x_crop_center.png?v=1762339022'
  }
];

// Related products
const relatedProducts = [
  { name: 'Procolored Direct to Transfer Film Powder', price: 4900, image: 'https://www.procolored.com/cdn/shop/files/powder_1220x_crop_center.png?v=1762338853' },
  { name: 'Procolored Direct to Transfer Film Ink 6x500ml', price: 22900, image: 'https://www.procolored.com/cdn/shop/files/CMYKWW_16_1220x_crop_center.png?v=1762338853' },
  { name: 'Procolored DTF PET Transfer Film Roll', price: 10900, image: 'https://www.procolored.com/cdn/shop/files/roll_1220x_crop_center.png?v=1762338853' }
];

const reviews = [
  { name: "Victor Gomez", rating: 5, date: "03/11/2026", text: "Procolored White Ink for DTF Printing" },
  { name: "Alexander Domnenkov", rating: 5, date: "03/10/2026", text: "Procolored White Ink for DTF Printing" },
  { name: "Kristy Thomas", rating: 5, date: "03/06/2026", text: "Supreme Customer Service" },
  { name: "VICTOR CORTES", rating: 5, date: "02/24/2026", text: "Procolored White Ink for DTF Printing" },
  { name: "Beverly", rating: 5, date: "02/23/2026", text: "Procolored White Ink for DTF Printing" }
];

export default function WhiteInkProduct() {
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [quantity] = useState(1);
  const [reviewPage] = useState(1);
  const { addToCart } = useCart();
  const { formatPrice: fmt } = useCurrency();
  const navigate = useNavigate();

  const activeImage = variants[activeVariantIdx].image;
  const currentReviews = reviews.slice((reviewPage - 1) * 5, reviewPage * 5);

  const handleAddToCart = () => {
    addToCart({
      id: "white-ink-dtf",
      name: `Procolored White Ink for DTF Printing - ${variants[activeVariantIdx].size}`,
      price: fmt(variants[activeVariantIdx].price),
      image: activeImage,
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="bg-[#f9f9f9] font-sans text-[#1a1a1a]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500 font-medium">
        <Link to="/" className="hover:text-black hover:underline">Home</Link> <span className="mx-2">/</span>
        <span className="text-gray-900">Procolored White Ink for DTF Printing</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 bg-white mb-10 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 p-6">
          {/* Left Column: Image Gallery */}
          <div>
            <div className="relative border border-gray-100 rounded-xl overflow-hidden mb-4 bg-white flex items-center justify-center p-8 h-[500px] lg:h-[600px] group">
              <img
                src={activeImage}
                alt={`Procolored White Ink - ${variants[activeVariantIdx].size}`}
                className="w-full h-full object-contain cursor-crosshair transform group-hover:scale-150 transition-transform duration-500 origin-center"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-4 hidden">
              {variants.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVariantIdx(idx)}
                  className={`w-4 h-4 rounded-full transition-all ${activeVariantIdx === idx ? 'bg-gray-400' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              Procolored White Ink for DTF Printing
            </h1>

            <div className="flex items-center gap-2 mb-6 cursor-pointer hover:underline text-gray-800" onClick={() => window.scrollTo({ top: document.getElementById('reviews')?.offsetTop, behavior: 'smooth' })}>
              <div className="flex text-yellow-400">
                {Array(5).fill("★").map((star, i) => (
                  <span key={i} className="text-xl tracking-tighter">{star}</span>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">54 reviews</span>
            </div>

            <div className="mb-6 flex gap-3 items-end">
              <span className="text-3xl font-bold text-red-600">{fmt(variants[activeVariantIdx].price)}</span>
            </div>

            <p className="text-sm text-gray-700 font-medium leading-relaxed mb-8">
              Note: We've recently updated the ink packaging, the old or new packaging will be shipped out randomly.
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="font-bold mb-3">Size:</h3>
              <div className="grid grid-cols-2 gap-4">
                {variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVariantIdx(idx)}
                    className={`py-3 px-4 border rounded-md text-sm font-bold text-center transition-all ${activeVariantIdx === idx
                        ? 'border-orange-500 text-orange-600 shadow-sm relative after:absolute after:-top-px after:-right-px after:-bottom-px after:-left-px after:border-2 after:border-orange-500 after:rounded-md'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={handleAddToCart}
                className="flex-[2] bg-white border border-orange-500 text-orange-500 rounded text-center py-4 font-bold text-base hover:bg-orange-50 transition-colors"
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-[2] bg-[#5A31F4] text-white rounded text-center py-4 font-bold text-base hover:bg-[#4820dc] transition-colors"
              >
                Buy with shop
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer mb-8">
              More payment options
            </div>

            {/* Shop Confidence Badges */}
            <div className="bg-gray-50/50 rounded-lg p-5 mb-4 text-sm border border-gray-100">
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



            <div className="mt-8 pt-6 border-t border-gray-100 text-sm font-medium text-gray-500 flex gap-4">
              <span>Share:</span>
              <span className="text-gray-400 cursor-pointer hover:text-black">f</span>
              <span className="text-gray-400 cursor-pointer hover:text-black">t</span>
              <span className="text-gray-400 cursor-pointer hover:text-black">p</span>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-2 text-center text-[#1a1a1a]">You may also like</h2>
        <p className="text-center text-gray-500 mb-10 text-sm">Combine your style with these products</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {relatedProducts.map((prod, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-full aspect-square mb-4 p-4 border border-gray-50 rounded bg-white">
                <img src={prod.image} className="w-full h-full object-contain" alt={prod.name} />
              </div>
              <h4 className="font-bold text-sm text-gray-800 text-center mb-2 line-clamp-2 h-10">{prod.name}</h4>
              <p className="text-red-500 font-bold mb-4">{fmt(prod.price)} USD</p>
              <button
                className="w-full bg-[#f8981d] text-white py-2 rounded-full font-bold hover:bg-[#df8516] transition-colors shadow"
                onClick={() => {
                  addToCart({ id: `rel-${idx}`, name: prod.name, price: fmt(prod.price), image: prod.image, quantity: 1 });
                }}
              >
                Select Opts
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="bg-[#fbfcfa] py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#1a1a1a]">Customer Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
            {/* Review Stats */}
            <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="flex text-yellow-400 text-2xl tracking-tighter mb-2">★★★★★</div>
                <p className="font-bold text-[#1a1a1a] mb-1">4.91 out of 5</p>
                <p className="text-gray-500 font-medium text-sm">Based on 54 reviews</p>
              </div>
            </div>

            {/* Simulated Review Bars */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 space-y-2">
                {[
                  { star: 5, w: '93%', count: 50 },
                  { star: 4, w: '5%', count: 3 },
                  { star: 3, w: '1%', count: 1 },
                  { star: 2, w: '0%', count: 0 },
                  { star: 1, w: '0%', count: 0 }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#b4b4b4]">
                    <span className="flex text-[#f6c62c] tracking-tighter w-16 opacity-80">{Array(5).fill("★").map((_, i) => <span key={i} className={i < s.star ? '' : 'text-gray-200'}>★</span>)}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-sm overflow-hidden">
                      <div className="h-full bg-[#f6c62c] rounded-sm" style={{ width: s.w }} />
                    </div>
                    <span className="w-6 text-right font-medium">{s.count}</span>
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

          {/* Photo banner placeholder style based on screenshot */}
          <div className="flex flex-wrap gap-2 mb-12">
            <div className="flex-1 bg-white p-4 border border-[#e5e5e5] rounded shadow-sm flex items-center justify-between">
              <div className="flex text-sm font-medium text-gray-500 items-center">
                Customer photos & videos
              </div>
              <div className="flex gap-2 h-14">
                <img src="https://www.procolored.com/cdn/shop/files/White_0d2df479-3b68-4cab-abc3-8f352988d5d2_1220x_crop_center.png?v=1762339022" className="h-full w-14 object-cover border border-gray-200" alt="review" />
                <img src="https://www.procolored.com/cdn/shop/files/250ml_cdfd861c-62b6-4d98-9331-934d56bfe03e_1220x_crop_center.png?v=1762339048" className="h-full w-14 object-cover border border-gray-200" alt="review" />
                <div className="h-full px-4 border border-gray-200 flex items-center justify-center text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  See<br />more
                </div>
              </div>
            </div>

            {/* Badges section from screenshot */}
            <div className="flex gap-4 px-6 items-center">
              <img src="https://judge.me/badges/medal-gold.svg" alt="Gold" className="w-16" />
              <img src="https://judge.me/badges/medal-bronze.svg" alt="Bronze" className="w-16" />
              <div className="flex flex-col text-gray-400 text-xs">▲<br />| <br />▼</div>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6 pb-2">
            <span className="text-[#f6c62c] font-bold text-sm cursor-pointer flex items-center gap-1">Most Recent <ChevronDown className="w-4 h-4" /></span>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {currentReviews.map((review, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center text-[#f6c62c]">
                      <UserIcon />
                    </div>
                    <div className="font-bold text-[#f6c62c] flex items-center gap-2">
                      {review.name}
                      <span className="bg-[#f6c62c] text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" /> Verified
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 text-[13px] font-medium">{review.date}</div>
                </div>

                <div className="flex text-[#f6c62c] mb-3 ml-9 text-sm tracking-tighter">
                  {Array(review.rating).fill("★").map((s, i) => <span key={i}>{s}</span>)}
                </div>

                <div className="ml-9 text-gray-700 font-bold text-sm">
                  {review.text === "Supreme Customer Service" ? "Supreme Customer Service" : ""}
                </div>
                {review.text === "Supreme Customer Service" && (
                  <p className="ml-9 text-[15px] mt-1 text-gray-700">
                    {review.text}
                  </p>
                )}
                {review.text !== "Supreme Customer Service" && (
                  <p className="ml-9 text-[15px] text-gray-700 mt-1">
                    {review.text}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Local Pagination */}
          <div className="flex justify-center mt-12 gap-2 text-sm font-bold text-gray-400">
            <span className="text-gray-800 border-b-2 border-black w-6 text-center">1</span>
            <span className="w-6 text-center hover:text-black cursor-pointer text-[#f6c62c]">2</span>
            <span className="w-6 text-center hover:text-black cursor-pointer text-[#f6c62c]">3</span>
            <span className="w-6 text-center hover:text-black cursor-pointer text-[#f6c62c]">&gt;</span>
            <span className="w-6 text-center hover:text-black cursor-pointer text-[#f6c62c]">&raquo;</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom simple user icon component
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
