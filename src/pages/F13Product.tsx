import { useState } from 'react';
import { ChevronRight, ChevronLeft, Star, Heart, Share2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const f13Reviews = [
  { id: 1, name: "Michael R.", rating: 5, date: "Oct 12, 2024", text: "Incredible detail. Setup was a breeze, and the colors pop off the film. Highly recommend the Panda F13 for anyone starting out." },
  { id: 2, name: "Sarah T.", rating: 5, date: "Nov 05, 2024", text: "The low stock warnings are real! Glad I grabbed mine when I did. This machine has doubled my small business's daily output without missing a beat." },
  { id: 3, name: "David L.", rating: 4, date: "Jan 18, 2025", text: "Prints beautifully. I did have to contact support once to figure out the oven settings, but they were super helpful. Solid machine." },
  { id: 4, name: "Jessica K.", rating: 5, date: "Feb 22, 2025", text: "Used the PROCOLORED5 code and saved a nice chunk of change! Print quality is insanely crisp, even on fine text elements." },
  { id: 5, name: "Marcus P.", rating: 5, date: "Mar 01, 2025", text: "The L1800 printhead makes a massive difference. Smooth gradients, perfectly opaque white layers. Exactly what I needed." },
  { id: 6, name: "Elena V.", rating: 5, date: "Mar 15, 2025", text: "Honestly couldn't be happier. It's compact enough for my spare room but produces commercial-grade results every time." },
  { id: 7, name: "Tom B.", rating: 4, date: "Apr 02, 2025", text: "Fast shipping. The machine is heavy, so get some help lifting it. Once running, it's a workhorse." },
  { id: 8, name: "Rachel M.", rating: 5, date: "Apr 14, 2025", text: "I've tried other brands and Procolored just feels more polished. The included software is intuitive and the results speak for themselves." },
  { id: 9, name: "Kevin J.", rating: 5, date: "May 09, 2025", text: "Absolutely phenomenal printer. The white ink circulation system keeps everything running smoothly without constant manual maintenance." },
  { id: 10, name: "Amanda W.", rating: 5, date: "May 27, 2025", text: "Worth every penny. We use it for our local sports team apparel and the durability of the prints post-wash is fantastic." },
  { id: 11, name: "Chris D.", rating: 5, date: "Jun 11, 2025", text: "Setup took about an hour. The instructions were clear. The detail it can hit on complex artwork is mind-blowing." },
  { id: 12, name: "Lauren C.", rating: 4, date: "Jul 05, 2025", text: "Great support team. Had a minor issue with software licensing initially, but they sorted it out via chat within 10 minutes." },
  { id: 13, name: "Brian S.", rating: 5, date: "Jul 21, 2025", text: "If you're hesitating, don't. The F13 is the sweet spot between affordability and professional capability." },
  { id: 14, name: "Michelle F.", rating: 5, date: "Aug 08, 2025", text: "The PROCOLORED5 discount code worked perfectly. So happy with my purchase. It handles fine lines on dark garments beautifully." },
  { id: 15, name: "Greg O.", rating: 5, date: "Sep 03, 2025", text: "Flawless operation so far. It's refreshing to buy equipment that actually does exactly what the marketing claims it will do." },
];

const faqs = [
  {
    question: "Do you offer financing?",
    answer: "Yes, we offer multiple financing options including Affirm and Klarna to spread the cost over time."
  },
  {
    question: "How long is the warranty on the F13?",
    answer: "The F13 comes with a standard 1-year limited warranty covering major components. The printhead has a 3-month warranty."
  },
  {
    question: "What is included in the box?",
    answer: "You receive the F13 printer, the curing oven, a starter pack of ink (CMYK+W), roll of transfer film, RIP software dongle, maintenance kit, and all necessary cables."
  },
  {
    question: "Is this suitable for beginners?",
    answer: "Absolutely. While it is a professional-grade machine, the setup and operational workflow are designed to be accessible for those new to DTF printing."
  }
];

export default function F13Product() {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = [
    "/images/f13-main.jpg",
    "/images/f13-side.jpg",
    "/images/f13-back.jpg",
    "/images/f13-detail1.jpg",
    "/images/f13-detail2.jpg",
  ];

  const handleQtyChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const reviewsPerPage = 5;
  const currentReviews = f13Reviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black hover:underline transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">Procolored F13 Panda DTF Printer 13" A3 L1800 & Oven</span>
        </div>
      </div>

      {/* Product Top Area */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Images Section */}
          <div className="w-full lg:w-[60%] flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-20 flex-shrink-0">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`border-2 rounded-lg overflow-hidden aspect-square ${currentImage === idx ? 'border-[#E85A24]' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt={`F13 view ${idx + 1}`} className="w-full h-full object-cover bg-gray-50" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-xl relative overflow-hidden aspect-[4/3] flex items-center justify-center">
              <img src={images[currentImage]} alt="F13 Printer Main" className="max-w-full max-h-full object-contain mix-blend-multiply p-8" />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit">BEST SELLER</span>
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full w-fit flex items-center gap-1">
                  📦 Free Shipping
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full w-fit border border-gray-200">
                  💳 0% Interest Rate under $3000
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-[40%]">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Procolored F13 Panda DTF Printer 13" A3 L1800 & Oven
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-[#E85A24] cursor-pointer hover:underline font-medium">494 reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-red-600">Rs.854,900.00 PKR</span>
              <span className="text-lg text-gray-400 line-through mb-1">Rs.997,500.00 PKR</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                ⏱️ Fan Appreciation Sale (Rs.142,600.00 PKR)
              </span>
            </div>

            {/* Discount Code Section (Replacing Member Exclusive per spec) */}
            <div className="border border-green-500 rounded-lg p-4 bg-green-50 mb-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-green-700 block mb-1">SPECIAL OFFER</span>
                <span className="text-sm text-green-800 font-medium">Use code <strong>PROCOLORED5</strong> for 5% off!</span>
              </div>
              <div className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm">
                PROCOLORED5
              </div>
            </div>

            {/* Stock Warning Box matching spec exactly */}
            <div className="border border-red-500 rounded-lg p-4 bg-red-50 mb-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3 z-10 relative">
                <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">⚡</span>
                <span className="font-bold text-black">Stock is running low. Don't Miss!</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 relative z-10">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
              </div>
              
              <div className="flex justify-end z-10 relative">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Only 28 pcs left!
                </span>
              </div>
              
              {/* Background gradient decorative element */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-60"></div>
            </div>

            {/* Promo Banner Banner beneath stock */}
            <div className="bg-gray-100 rounded-lg p-3 mb-8 flex items-center gap-3 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
               <img src="/images/f13-promo-banner.jpg" alt="Promo" className="w-full h-16 object-cover rounded" />
            </div>

            {/* Add to Cart Actions */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg h-12 w-32">
                  <button onClick={() => handleQtyChange(-1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"><Minus className="w-4 h-4" /></button>
                  <input type="text" value={quantity} readOnly className="flex-1 w-full text-center text-sm font-medium outline-none" />
                  <button onClick={() => handleQtyChange(1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                
                <button className="flex-1 bg-white border-2 border-black text-black font-bold h-12 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                  Add To Cart
                </button>
              </div>
              
              <button className="w-full bg-[#E85A24] hover:bg-[#d44e1e] text-white font-bold h-12 rounded-lg transition-colors shadow-md">
                Buy Now
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
               <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black group">
                 <Heart className="w-4 h-4 group-hover:fill-current group-hover:text-red-500 transition-colors" /> Add to wishlist
               </button>
               <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                 <Share2 className="w-4 h-4" /> Share
               </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Customer Reviews</h2>
          
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="text-4xl font-bold">4.9</div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
              </div>
              <div className="text-sm text-gray-500">Based on 494 reviews</div>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            {currentReviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold mr-3">{review.name}</span>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Verified Buyer</span>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={() => setReviewPage(p => Math.max(1, p - 1))}
              disabled={reviewPage === 1}
              className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(3)].map((_, i) => (
              <button
                key={i}
                onClick={() => setReviewPage(i + 1)}
                className={`w-10 h-10 rounded text-sm font-medium transition-colors shadow-sm ${
                  reviewPage === i + 1 
                    ? 'bg-black text-white border border-black' 
                    : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setReviewPage(p => Math.min(3, p + 1))}
              disabled={reviewPage === 3}
              className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-[#E85A24] transition-colors">
              <button 
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-semibold text-[15px]">{faq.question}</span>
                {openFaq === index ? <Minus className="w-4 h-4 text-[#E85A24] flex-shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
