import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface ConsumableVariant {
  key: string;
  label: string;
  price: number;
  originalPrice?: number;
}

export interface ConsumableProductData {
  id: string;
  title: string;
  image: string;
  subtitle?: string;
  variants: ConsumableVariant[];
  infoSections: { label: string; content: string }[];
  note?: string;
  badge?: string;
  reviews?: { name: string; date: string; title: string; text: string; rating: number }[];
}

const DEFAULT_REVIEWS = [
  { name: 'Alex R.', date: '03/15/2026', title: 'Exactly as described', text: 'Great product, does exactly what it says. Arrived quickly and in perfect condition. Will order again.', rating: 5 },
  { name: 'Maria T.', date: '02/28/2026', title: 'High quality', text: 'Very impressed with the quality. My print results improved noticeably after switching to this product. Highly recommend for any Procolored printer owner.', rating: 5 },
  { name: 'PrintShop_LA', date: '02/10/2026', title: 'Good value for money', text: 'Solid product that does the job well. Consistent performance batch after batch. No complaints at all.', rating: 5 },
];

export default function ConsumableProduct({ data }: { data: ConsumableProductData }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [variantKey, setVariantKey] = useState(data.variants[0]?.key ?? '');
  const variant = data.variants.find(v => v.key === variantKey) ?? data.variants[0];
  const reviews = data.reviews ?? DEFAULT_REVIEWS;

  const handleAddToCart = () => addToCart({
    id: `${data.id}-${variantKey}`,
    name: `${data.title}${variant ? ` — ${variant.label}` : ''}`,
    price: `$USD:${variant?.price ?? 0}`,
    image: data.image,
    quantity: 1,
  });
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>{' > '}{data.title}
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <img src={data.image} alt={data.title} className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                {data.badge && <span className="absolute top-4 left-4 bg-[#E85A24] text-white text-xs font-bold px-3 py-1 rounded">{data.badge}</span>}
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">{data.title}</h1>
                {data.subtitle && <p className="text-sm text-gray-500 mb-4 font-medium">{data.subtitle}</p>}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.0 — {reviews.length} reviews</a>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[2rem] font-extrabold text-red-600">${variant?.price ?? 0}.00 USD</span>
                  {variant?.originalPrice && <s className="text-xl text-gray-400 font-medium">${variant.originalPrice}.00 USD</s>}
                </div>
              </div>

              {/* Variants */}
              {data.variants.length > 1 && (
                <div>
                  <p className="font-extrabold text-gray-900 text-base mb-3">Options:</p>
                  <div className={`grid gap-2 ${data.variants.length <= 2 ? 'grid-cols-2' : data.variants.length <= 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {data.variants.map(v => (
                      <button key={v.key} onClick={() => setVariantKey(v.key)}
                        className={`text-left px-4 py-3 rounded-lg border-2 font-semibold transition-all text-sm flex justify-between items-center gap-2 ${variantKey === v.key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        <span className="leading-tight">{v.label}</span>
                        <span className="font-bold text-xs whitespace-nowrap flex-shrink-0">${v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {data.note && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">{data.note}</p>
              )}

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">Add to cart</button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span><span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]"><a href="#" className="text-xs text-blue-500 underline hover:text-blue-600">More payment options</a></div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-xs text-gray-600">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Shop with Confidence!</p>
                  <ul className="list-disc pl-4 space-y-1 mb-2"><li>100% Protection Against Shipping Mishaps</li></ul>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WORRY-FREE PURCHASE® BY <span className="text-blue-500 lowercase font-medium">seel</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Info */}
      {data.infoSections.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Information</h2>
            <div className="space-y-0 border border-gray-200 rounded-2xl overflow-hidden bg-white">
              {data.infoSections.map((s, i) => (
                <div key={i} className="flex gap-0 border-b border-gray-100 last:border-0">
                  <div className="w-48 flex-shrink-0 bg-gray-50 px-6 py-4 font-bold text-gray-900 text-sm border-r border-gray-100">{s.label}</div>
                  <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">{s.content}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {[[5,'100%',reviews.length],[4,'0%',0],[3,'0%',0],[2,'0%',0],[1,'0%',0]].map(([stars,pct,count],i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s<=(stars as number)?'fill-yellow-400 text-yellow-400':'text-gray-300'}`} />)}</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="bg-yellow-400 h-full rounded-full" style={{width:pct as string}} /></div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-sm transition rounded">Write a review</button>
              <button className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold text-sm transition rounded">Ask a question</button>
            </div>
          </div>
          <div className="flex justify-start mb-6 border-b border-gray-200 pb-2">
            <button className="text-sm text-yellow-500 font-bold flex items-center gap-1">Most Recent <ChevronDown className="w-4 h-4" /></button>
          </div>
          <div className="divide-y divide-gray-100">
            {reviews.map((r, i) => (
              <div key={i} className="py-6 flex flex-col md:flex-row gap-4 md:gap-12 w-full">
                <div className="w-full md:w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s<=r.rating?'fill-yellow-400 text-yellow-400':'text-gray-300'}`} />)}</div>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-2">{r.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
