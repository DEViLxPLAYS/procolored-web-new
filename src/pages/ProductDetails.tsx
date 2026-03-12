import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ChevronDown, Headphones, BookOpen, Video, HelpCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug || p.id === slug);
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">We couldn't find the product you're looking for.</p>
        <Link to="/collections/all" className="bg-[#E85A24] text-white px-8 py-3 font-bold rounded hover:bg-[#d14b1b] transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const images = [
    product.image,
    "/images/f13-side.webp",
    "/images/f13-top.webp",
    "/images/f13-oven.webp",
    "/images/f13-prints.webp"
  ];
  
  const faqs = [
    { question: "Differences between F13 and F13 Pro?", answer: "F13 Pro has 2 print heads, while F13 only has one, so F13 Pro prints at 2x the speed of F13." },
    { question: "Does the RIP software run on a MacBook?", answer: "No, the RIP software is currently designed to run exclusively on Windows OS. MacBook users may need to use virtualization software like Parallels or BootCamp." },
    { question: "Do I need to pay for the RIP software? Can I edit my design with the RIP software?", answer: "The pro RIP software is included with your purchase. It primarily functions for ripping and basic placement, but we recommend editing designs in Photoshop or Illustrator first." },
    { question: "What is your after-sales warranty policy, where can I get tech support?", answer: "We offer a 12-month warranty on non-ink contacting components and 6 months on the printhead (limited to one replacement). Tech support is available via test@procolored.com." },
    { question: "What is the printing cost for one print?", answer: "The estimated cost for a standard letter/A4 size print is incredibly low, typically between $0.50 and $1.00 depending on ink density." },
    { question: "Can I pay for it with two cards? Do you have a financing option?", answer: "Yes, our checkout supports split payments with multiple cards and we also offer flexible financing options like Klarna/Affirm at checkout." },
    { question: "What is the max length it can print with the roll film?", answer: "Because it uses a roll-fed system, the max print length is practically limitless, constrained only by your media roll length (up to 328ft)." },
    { question: "How fast can it print?", answer: "It prints approximately 6pcs of Letter/A4 size prints per Hour (roughly 7 minutes per A4 size print)." },
    { question: "Is the maintenance process complicated?", answer: "No, the printer features automated cleaning cycles and we provide comprehensive resources to guide you through daily/weekly maintenance to keep the printhead pristine." }
  ];

  const reviews = [
    { name: "Bartolo Rodriguez", date: "03/12/2026", product: "F13 L1800", text: "This product is amazing easy to use and easy to maintain fun making shirts", rating: 5 },
    { name: "Tony", date: "03/10/2026", title: "Great customer service", text: "My printer has gone down 2 times and now I am having to replace the printer head but when I call customer service it usually gets resolved, it is over messenger but they are very good and can get into the computer remotely and figure out the issue. Thanks for all the help.", rating: 5 },
    { name: "EG", date: "03/10/2026", title: "Engineer", text: "Even though I spent almost a whole day trying to resolve an issue I was very satisfied with engineer Lucas. He was so dedicated to helping me that he even skipped his lunch to finish helping me.", rating: 5 },
    { name: "Bianca Oyoque", date: "03/05/2026", title: "Great Tech Support", text: "In needing to replace my print head, tech support was very helpful in walking me through the new installation. Technicians were very patient and sent videos to help me walk through each step.", rating: 5 },
    { name: "Debbi", date: "03/03/2026", title: "Support", text: "Just set up my new DTF printer F13 and was having trouble connecting to the printer. Chatted with tech support and they were amazing! Very helpful and fixed my problem. They responded very quickly.", rating: 5 }
  ];

  const handleAddToCart = () => {
    if (!product.price) {
      alert("This item currently does not have a price listed.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  };

  return (
    <div className="bg-white font-sans">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500 font-medium border-b border-gray-100">
        <Link to="/" className="hover:text-black hover:underline">Home</Link> &gt; {product.name}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <div>
            <div className="relative border border-gray-200 rounded-xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center p-8 h-[500px]">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setActiveImage(activeImage === 0 ? images.length - 1 : activeImage - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setActiveImage(activeImage === images.length - 1 ? 0 : activeImage + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg p-2 transition-all ${activeImage === idx ? 'border-red-600' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Supplied Items Box - Generic render if it's a printer */}
            {product.sections.includes('DTF Printer') && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg mb-4 text-[#1a1a1a]">Printer Supplies</h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="flex flex-col items-center">
                    <img src="/images/product-f13-supplies.png" alt="Supplies" className="h-20 object-contain mb-2" />
                    <span className="text-gray-600 text-center">Printer Supplies Set</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="/images/f13-oven.webp" alt="Oven" className="h-20 object-contain mb-2" />
                    <span className="text-gray-600 text-center">Panda Mini Oven</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-3 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">495 reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-red-600">{product.price || '-'}</span>
              {product.originalPrice && (
                 <span className="text-lg font-medium text-gray-400 line-through mb-1">{product.originalPrice}</span>
              )}
            </div>
            
            {product.badge && product.savings && (
              <p className="text-sm font-semibold text-red-600 mb-6 flex items-center gap-1">
                <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-[10px] transform -translate-y-px">🔥</span>
                {product.badge.replace('⭐ ', '').replace('🆕 ', '')}
                <span className="text-gray-500 font-medium ml-1">(-{product.savings})</span>
              </p>
            )}

            {/* Discount Code Box */}
            <div className="border border-green-500 bg-green-50/50 rounded-lg p-4 mb-6 relative overflow-hidden flex justify-between items-center group">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500" />
              <div className="pl-2">
                <span className="text-green-600 font-bold text-lg block mb-1">Exclusive For You</span>
                <span className="text-sm font-medium text-gray-600">Use code <strong className="text-black">PROCOLORED5</strong> for 5% off</span>
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded border border-green-200 font-bold tracking-wider relative group-hover:bg-green-500 group-hover:text-white transition-colors cursor-pointer" title="Click to copy">
                PROCOLORED5
              </div>
            </div>

            {/* Stock Warning Box */}
            {(product.badge && product.badge.includes("Best Seller") || product.badge?.includes("Sale")) && (
              <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 mb-8 flex justify-between items-center">
                <div>
                  <span className="text-orange-600 font-bold block mb-1">🔥 Stock Is Running Low. Don't Miss!</span>
                  <div className="w-[150px] sm:w-[200px] h-2 bg-orange-200 rounded-full mt-2 overflow-hidden">
                    <div className="w-[85%] h-full bg-orange-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  Only 28 pcs left
                </div>
              </div>
            )}

             <p className="text-[#1a1a1a] mb-8 font-medium leading-relaxed">
               Experience the pinnacle of printing technology with the {product.name}. Designed for 
               high-performance, consistency, and stunning output quality natively synced with the best consumables on the market.
             </p>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex border border-gray-300 rounded-lg h-14 w-full sm:w-auto overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 font-bold text-gray-600 hover:bg-gray-50 transition-colors border-r"
                >-</button>
                <div className="px-6 flex items-center justify-center font-bold bg-white w-20">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 font-bold text-gray-600 hover:bg-gray-50 transition-colors border-l"
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#1a1a1a] text-white rounded-lg h-14 font-bold text-lg hover:bg-[#E85A24] transition-colors shadow-lg active:scale-[0.98]"
              >
                {product.name.includes('Option') ? 'Select Options' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4">
            Explore detailed specifications and see how it outperforms the rest
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Printer Specifications Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Product Specifications</h2>
            <p className="text-[#1a1a1a] font-medium leading-relaxed max-w-2xl mx-auto">
              Here you'll find the key specs that actually matter, so you can quickly see whether this fits 
              your workspace and production needs.
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-900 border-b border-gray-200">
                  <th className="py-4 px-6 font-bold w-1/3">Spec</th>
                  <th className="py-4 px-6 font-bold w-2/3">Detail</th>
                </tr>
              </thead>
              <tbody className="text-[#1a1a1a] font-medium">
                {Object.entries(product.filters).map(([key, val], idx) => (
                   <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 bg-gray-50/50">{key}</td>
                      <td className="py-4 px-6">{val as React.ReactNode}</td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Support Section */}
      <div className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Reliable Support, Wherever You Are</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-bold text-lg text-black">Customer Support</h4>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-bold text-lg text-black">Engineer Support</h4>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-bold text-lg text-black">Video Tutorial</h4>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-bold text-lg text-black">FAQs</h4>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#1a1a1a]">Frequently Asked Questions</h2>
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

      {/* Customer Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#1a1a1a]">Customer Reviews</h2>
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Review Stats */}
          <div className="md:w-1/3">
            <div className="text-center md:text-left mb-8 sticky top-32">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-bold text-xl text-[#1a1a1a] mb-1">4.87 out of 5</p>
              <p className="text-gray-500 font-medium text-sm mb-6">Based on 495 reviews</p>

              <div className="space-y-3 mb-8 w-full max-w-sm mx-auto md:mx-0">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <span className="flex text-yellow-400 tracking-[-2px]">★★★★★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full w-[94%]" />
                  </div>
                  <span className="w-8">465</span>
                </div>
                {/* Simulated remaining stars visually */}
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#1a1a1a] text-white rounded-lg h-12 font-bold hover:bg-gray-900 transition-colors shadow-md">
                  Write a Review
                </button>
                <button className="w-full border-2 border-gray-200 text-[#1a1a1a] rounded-lg h-12 font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  Ask a Question
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:w-2/3">
            <div className="space-y-8">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-gray-500">
                        <span className="text-black">{review.name}</span>
                        <span>—</span>
                        <span>{review.date}</span>
                      </div>
                      <div className="flex text-yellow-400 tracking-[-2px] mb-2 text-sm">
                         {Array(5).fill("★").map((star, i) => <span key={i}>{star}</span>)}
                      </div>
                    </div>
                  </div>
                  
                  {review.product && (
                    <p className="text-sm font-bold text-gray-500 mb-2">
                       {review.product}
                    </p>
                  )}
                  {review.title && (
                    <p className="font-bold text-[#1a1a1a] mb-2 text-base">
                      {review.title}
                    </p>
                  )}
                  
                  <p className="text-gray-700 font-medium leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
            
            {/* Pagination Mock Block */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors text-black font-semibold shadow-sm">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-transparent rounded hover:bg-gray-50 transition-colors text-black font-semibold">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-transparent rounded hover:bg-gray-50 transition-colors text-black font-semibold">
                3
              </button>
              <span className="w-10 h-10 flex items-center justify-center border border-transparent rounded text-black font-semibold">
                ...
              </span>
              <button className="w-10 h-10 flex items-center justify-center border border-transparent rounded hover:bg-gray-50 transition-colors text-black font-semibold">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
