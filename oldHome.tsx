import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Headphones, BookOpen, CreditCard, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const heroSlides = [
  { id: 1, image: "/images/slide-1.webp" },
  { id: 2, image: "/images/slide-2.webp" },
  { id: 3, image: "/images/slide-3.webp" },
  { id: 4, image: "/images/slide-4.webp" },
  { id: 5, image: "/images/slide-5.webp" },
  { id: 6, image: "/images/slide-6.webp" },
  { id: 7, image: "/images/slide-7.webp" },
  { id: 8, image: "/images/slide-8.webp" }
];

const stats = [
  { value: "140+", label: "Global Reach" },
  { value: "30K+", label: "Customer Base" },
  { value: "50+", label: "Service Centers" },
  { value: "45%", label: "R&D Personnel" },
  { value: "300+", label: "Authorized Patents" },
  { value: "10+", label: "Worldwide Logistics" }
];

const popularProducts = [
  { 
    id: "procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink",
    name: "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium - Pink",
    pricePKR: 798000, originalPricePKR: 1140200,
    image: "https://www.procolored.com/cdn/shop/files/K13_lite_Pink__1_1220x_crop_center.jpg?v=1758869972",
    badge: "Save Rs.342,200", badgeColor: "bg-red-500",
    link: "/products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink"
  },
  { 
    id: "procolored-k13-lite-dtf-printer-13-a3-oven-premium-white",
    name: "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium - White",
    pricePKR: 798000, originalPricePKR: 1140200,
    image: "https://www.procolored.com/cdn/shop/files/Procolored_DTF_printer_with_Smokeless_Oven_Bundle_10_1220x_crop_center.jpg?v=1772447536",
    badge: "Save Rs.342,200", badgeColor: "bg-red-500",
    link: "/products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-white"
  },
  { 
    id: "f13-panda",
    name: "Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven",
    pricePKR: 855000, originalPricePKR: 997000,
    image: "https://www.procolored.com/cdn/shop/files/Procolored_F13_Panda_DTF_Printer_1.png?v=1770090526",
    badge: "BEST SELLER", badgeColor: "bg-orange-500",
    link: "/f13"
  },
  { 
    id: "p13-xp600",
    name: "Procolored P13 DTF Printer 13\" A3 XP600 & Oven",
    pricePKR: 1140100, originalPricePKR: 1311200,
    image: "https://www.procolored.com/cdn/shop/files/DTF_Printer_Main_4.png?v=1765787950",
    badge: "NEW ARRIVAL", badgeColor: "bg-green-500",
    link: "/collections/dtf-printer"
  },
  { 
    id: "vf13-pro",
    name: "Procolored VF13 Pro DTF Printer 13\" A3+",
    pricePKR: 1967000, originalPricePKR: 0,
    image: "https://www.procolored.com/cdn/shop/files/VF13_pro_main.png?v=1747819379",
    badge: "NEW ARRIVAL", badgeColor: "bg-green-500",
    link: "/collections/dtf-printer"
  }
];

const categoryTabs = [
  { id: "factory", label: "Small-scale Factory", products: [
    { id: "f1", name: "Procolored F13 Pro", subtitle: "Perfect for Growing Businesses", image: "https://www.procolored.com/cdn/shop/files/F13_Pro_0479da75-8ab0-4338-bffa-583a1c04aa8c.png?v=1765786510" },
    { id: "f2", name: "Procolored P13", subtitle: "Stable Printing Speed", image: "https://www.procolored.com/cdn/shop/files/F13_Pro_0479da75-8ab0-4338-bffa-583a1c04aa8c.png?v=1765786510" },
    { id: "f3", name: "Procolored VF13 Pro", subtitle: "Versatile Applications", image: "https://www.procolored.com/cdn/shop/files/VF13_pro_main.png?v=1747819379" }
  ]},
  { id: "personal", label: "Personal Studio", products: [
    { id: "p1", name: "Procolored K13 Lite", subtitle: "User-friendly", image: "https://www.procolored.com/cdn/shop/files/K13_lite_white_10.png?v=1772447536" },
    { id: "p2", name: "Procolored F13", subtitle: "High-quality and Easy-to-use", image: "https://www.procolored.com/cdn/shop/files/Procolored_F13_Panda_DTF_Printer_1.png?v=1770090526" },
    { id: "p3", name: "Procolored P13", subtitle: "High-Performance Print Head", image: "https://www.procolored.com/cdn/shop/files/DTF_Printer_Main_4.png?v=1765787950" }
  ]},
  { id: "hobbyist", label: "Hobbyist Use", products: [
    { id: "h1", name: "Procolored K13 Lite", subtitle: "Best Value Starter Printer", image: "https://www.procolored.com/cdn/shop/files/K13_lite_pink_10.png?v=1772447536" },
    { id: "h2", name: "Procolored F13", subtitle: "Designed for Creative Makers", image: "https://www.procolored.com/cdn/shop/files/Procolored_F13_Panda_DTF_Printer_1.png?v=1770090526" },
    { id: "h3", name: "Procolored F8", subtitle: "Affordable Entry-level Model", image: "https://www.procolored.com/cdn/shop/files/DTF_Printer_Main_3.png?v=1766052998" }
  ]}
];

const categoryItems = [
  { name: "UV DTF Printer", image: "/images/cat-uv-dtf.jpg", link: "#" },
  { name: "UV Printer", image: "/images/cat-uv.jpg", link: "#" },
  { name: "DTG Printer", image: "/images/cat-dtg.jpg", link: "#" },
  { name: "Equipment", image: "/images/cat-equipment.jpg", link: "#" },
  { name: "Consumables", image: "/images/cat-consumables.jpg", link: "#" },
  { name: "Parts & Accessory", image: "/images/cat-parts.jpg", link: "#" }
];

const craftItemsRow1 = [
  { name: "Apron", image: "/images/craft-apron.jpg" },
  { name: "Metal Signs", image: "/images/craft-metal-signs.jpg" },
  { name: "Thermos", image: "/images/craft-thermos.jpg" },
  { name: "Fabric Posters", image: "/images/craft-posters.jpg" },
  { name: "Jeans", image: "/images/craft-tshirts.jpg" },
  { name: "Candle Mold", image: "/images/craft-mugs.jpg" },
  { name: "Hoodie", image: "/images/craft-hoodie.jpg" },
  { name: "Baby Clothes", image: "/images/craft-baby-clothes.jpg" },
  { name: "Flashcards", image: "/images/craft-posters.jpg" }
];

const craftItemsRow2 = [
  { name: "Polo Shirt", image: "/images/craft-tshirts.jpg" },
  { name: "T-shirts", image: "/images/craft-tshirts.jpg" },
  { name: "Caps", image: "/images/craft-caps.jpg" },
  { name: "Phone Cases", image: "/images/craft-phone-cases.jpg" },
  { name: "Coffee Mugs", image: "/images/craft-mugs.jpg" },
  { name: "Bags", image: "/images/craft-bags.jpg" },
  { name: "School Bags", image: "/images/craft-backpacks.jpg" },
  { name: "Keychains", image: "/images/craft-keychains.jpg" }
];

const testimonials = [
  { name: "Alyssa Boan", description: "Alyssa Boan is from Indiana and she is running a business of shirt designing. She focused on creating new things and exploring the unknown.", youtubeId: "fUQd-CC7k1o" },
  { name: "David DeGraaf", description: "David runs Ash Wood Shop, specializing in custom DTF printing. He chose Procolored's compact F13 DTF printer for its flexibility, low waste, and ease of use.", youtubeId: "mg3oWlQT4T0" },
  { name: "Mr. Kyle", description: "Mr. Kyle is the owner of Lexi-Lium Design in New York. His business has been successfully using Procolored printers since 2022, starting with the dual-head DTF Pro printer.", youtubeId: "vTufzbJaIOo" },
  { name: "Laura Trevino", description: "She enjoys painting, photography and T-shirt designing. Laura continously seeks to exceed customer expectations through the artistry of clothing.", youtubeId: "dlp96Zw6rjw" },
  { name: "Roxana Travieso", description: "Roxana Travieso is a creative YouTuber and social media content creator known for her DIY, crafting, and printing-related videos.", youtubeId: "wNamqcXECFc" }
];

const features = [
  { icon: Headphones, title: "Customer Support", description: "The tech support team and in-person customer service will provide instant and attentive assistance" },
  { icon: BookOpen, title: "Product Training", description: "Tutorials and Training are designed to equip you with the knowledge and skills necessary" },
  { icon: CreditCard, title: "Pay with Ease", description: "Secure payment systems accept major credit/debit cards and offer flexible financing plans" },
  { icon: Shield, title: "Warranty", description: "12-month warranty for most machine components assures every satisfying purchase and experience" }
];

const mediaReviews = [
  { source: "Geeky Gadgets", logo: "Geeky Gadgets", quote: "Whether you are looking to create custom clothing for yourself, involve the family in a creative project, or explore the beginnings of a small T-shirt printing business, this setup delivers a complete and well thought out workflow. It feels capable, reliable, and surprisingly approachable." },
  { source: "techradar", logo: "techradar", quote: "Printing from PC to textiles via transfer film is simplified by this dedicated DTF printer. It can print large eye-catching graphics onto any kind of cloth with an efficiency that will interest both hobbyists and established print shops." },
  { source: "CNET", logo: "CNET", quote: "It works very well to make small batches of products, so using the Panda F8 to print unique clothing items for your Etsy store is better than using a Cricut or sublimation printer, especially for shirts that are not white." }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState("factory");
  const [productScrollPosition, setProductScrollPosition] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const scrollProducts = (direction: 'left' | 'right') => {
    const container = document.getElementById('products-container');
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? Math.max(0, productScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, productScrollPosition + scrollAmount);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setProductScrollPosition(newPosition);
    }
  };

  return (
    <>
      <section className="relative w-full overflow-hidden flex-none" style={{height:'clamp(220px, 45vw, 600px)'}}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={slide.image} 
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>



      <section className="py-12 bg-gray-50 flex-none">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">Most Popular</h2>
            <Link to="/collections/all" className="text-sm text-red-600 hover:underline flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative overflow-hidden">
            <div id="products-container" className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-4" style={{WebkitOverflowScrolling:'touch'}}>
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-shadow block cursor-pointer"
                  style={{width:'clamp(220px, 75vw, 280px)'}}
                  onClick={() => navigate(product.link)}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      referrerPolicy="no-referrer"
                      onError={e => { (e.target as HTMLImageElement).src = '/images/product-f13-panda.jpg'; }}
                    />
                    {product.badge && (
                      <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-white`}>{product.badge}</Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 text-black">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-red-600 font-bold text-sm">{formatPrice(product.pricePKR)}</span>
                      {product.originalPricePKR > 0 && (
                        <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPricePKR)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 border border-[#E85A24] text-[#E85A24] hover:bg-[#E85A24] hover:text-white py-1.5 rounded text-xs font-semibold transition-colors"
                        onClick={e => {
                          e.stopPropagation();
                          addToCart({ id: product.id, name: product.name, price: `Rs.${product.pricePKR.toLocaleString()}.00 PKR`, image: product.image, quantity: 1 });
                        }}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="flex-1 bg-[#E85A24] text-white hover:bg-[#d44e1e] py-1.5 rounded text-xs font-semibold transition-colors"
                        onClick={e => { e.stopPropagation(); navigate(product.link); }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => scrollProducts('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollProducts('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-none">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">Shop By Category</h2>
          <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar pb-1" style={{WebkitOverflowScrolling:'touch'}}>
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`px-5 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategoryTab === tab.id ? 'bg-black text-white rounded-sm' : 'text-black hover:text-[#E85A24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryTabs.find(t => t.id === activeCategoryTab)?.products.map((product) => (
              <div key={product.id} className="text-center">
                <h3 className="font-bold text-lg mb-1 text-black">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 font-medium">{product.subtitle}</p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=' + encodeURIComponent(product.name); }}
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <button className="flex-1 max-w-[120px] text-sm font-medium text-black hover:text-[#E85A24] transition-colors py-2">Learn More</button>
                  <button className="flex-1 max-w-[120px] bg-[#E85A24] hover:bg-[#d44e1e] text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200">Buy Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 flex-none">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categoryItems.map((cat, index) => (
              <a key={index} href={cat.link} className="flex flex-col items-center gap-3 group">
                <div className="w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-black block">{cat.name}</span>
                  <span className="text-xs text-red-600 font-medium">Buy Now &gt;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#fffcf5] flex-none relative overflow-hidden">
        {/* Subtle decorative radial gradient for the background aesthetic */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#fff0e6]/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-[24px] sm:text-[32px] md:text-[38px] font-black text-black tracking-tight leading-[1.3] md:leading-tight">
              Global <img src="https://i.postimg.cc/L6GbPfkf/Chat-GPT-Image-Mar-16-2026-11-58-53-A1M.png" alt="No.1" className="inline-block h-8 sm:h-11 md:h-16 w-auto object-contain mx-1 md:mx-3 align-middle -mt-1 md:-mt-2 flex-shrink-0" /> Desktop DTF Printer Brand
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-left md:px-2">
                <div className="text-2xl md:text-[28px] font-bold text-black mb-1.5">{stat.value}</div>
                <div className="text-[13px] text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center">What You Can Craft with<br />Procolored Printers</h2>
        </div>
        <div className="relative mb-4">
          <div className="marquee-container">
            <div className="marquee-row-1">
              {[...craftItemsRow1, ...craftItemsRow1, ...craftItemsRow1].map((item, index) => (
                <div key={index} className="flex-shrink-0 w-[200px] mx-2">
                  <div className="relative overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="w-full h-[200px] object-cover" />
                  </div>
                  <p className="text-center text-sm font-bold text-black mt-2">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="marquee-container">
            <div className="marquee-row-2">
              {[...craftItemsRow2, ...craftItemsRow2, ...craftItemsRow2].map((item, index) => (
                <div key={index} className="flex-shrink-0 w-[200px] mx-2">
                  <div className="relative overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="w-full h-[200px] object-cover" />
                  </div>
                  <p className="text-center text-sm font-bold text-black mt-2">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 flex-none">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-10">Check Out What Our<br />Customers Are Saying</h2>

          {/* Top row ΓÇö 3 videos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${testimonial.youtubeId}?rel=0&modestbranding=1`}
                    title={testimonial.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 text-black">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{testimonial.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row ΓÇö 2 videos centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.slice(3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${testimonial.youtubeId}?rel=0&modestbranding=1`}
                    title={testimonial.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 text-black">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{testimonial.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-none">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-10">Why Procolored Is Right for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-red-600 text-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 flex-none">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-red-600 mb-4">{mediaReviews[reviewIndex].logo}</h3>
              <p className="text-black text-lg leading-relaxed max-w-2xl mx-auto font-medium">"{mediaReviews[reviewIndex].quote}"</p>
            </div>
            <div className="flex justify-between items-center absolute top-1/2 -translate-y-1/2 w-full px-4">
              <button onClick={() => setReviewIndex((prev) => (prev - 1 + mediaReviews.length) % mediaReviews.length)} className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setReviewIndex((prev) => (prev + 1) % mediaReviews.length)} className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-gray-200">
              {mediaReviews.map((review, index) => (
                <button
                  key={index}
                  onClick={() => setReviewIndex(index)}
                  className={`text-sm font-bold transition-colors ${index === reviewIndex ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {review.logo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
