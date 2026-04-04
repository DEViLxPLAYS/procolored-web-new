import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type WeightKey = '0.5kg' | '1kg' | '2kg';
const PRICES: Record<WeightKey, number> = { '0.5kg': 38, '1kg': 55, '2kg': 99 };
const IMAGE = 'https://www.procolored.com/cdn/shop/files/Procolored_Direct_to_Transfer_Film_Powder_1220x_crop_center.jpg?v=1755765661';

const REVIEWS = [
  { name: 'Jake M.', date: '03/18/2026', title: 'No oil return at all', text: 'This powder cures perfectly and flicks off any excess super easily. I\'ve used other brands and this is noticeably cleaner to work with. No oily residue on the film after curing.', rating: 5 },
  { name: 'TinaB_DTF', date: '03/05/2026', title: 'Great washability', text: 'After 40+ washes my transfers are still vivid and the bond is holding up. Worth paying for quality powder — it really does make a difference in durability.', rating: 5 },
  { name: 'Rio_Prints', date: '02/20/2026', title: '1kg lasts long, good value', text: 'Running the 1kg size and it lasts me about 3 weeks of full production. Consistent application, easy separation after curing. Compatible with my F13 Pro and K13 without any adjustments.', rating: 5 },
];

export default function DTFPowder() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [weight, setWeight] = useState<WeightKey>('1kg');

  const handleAddToCart = () => addToCart({ id: `dtf-powder-${weight}`, name: `Procolored Direct to Transfer Film Powder ${weight}`, price: `$USD:${PRICES[weight]}`, image: IMAGE, quantity: 1 });
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>{' > '}Procolored Direct to Transfer Film Powder
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <img src={IMAGE} alt="DTF Powder" className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">Procolored Direct to Transfer Film Powder</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">5.0 out of 5 — 3 reviews</a>
                </div>
                <div className="text-[2rem] font-extrabold text-red-600">${PRICES[weight]}.00 USD</div>
              </div>

              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Size:</p>
                <div className="flex gap-3">
                  {(['0.5kg','1kg','2kg'] as WeightKey[]).map(w => (
                    <button key={w} onClick={() => setWeight(w)}
                      className={`px-6 py-2.5 rounded-lg border-2 font-bold transition-all text-sm ${weight === w ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {w} — ${PRICES[w]}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                Note: We've recently updated the powder packaging. The old or new packaging will be shipped out randomly.
              </p>

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">Add to cart</button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span><span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]"><a href="#" className="text-xs text-blue-500 underline hover:text-blue-600 transition">More payment options</a></div>

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
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Information</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <p className="font-bold text-gray-900 mb-1">Outlined</p>
              <p className="text-gray-600 text-sm">Pure TPU210 hot melt powder</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <p className="font-bold text-gray-900 mb-2">Description</p>
              <p className="text-gray-600 text-sm leading-relaxed">This powder product is a hot seller in Europe and the United States. It can be quickly cured without oil return and can be easily flicked away when it's excessively applied. It helps achieve easy separation of the cured film hence heightening productivity.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <p className="font-bold text-gray-900 mb-2">Compatibility</p>
              <p className="text-gray-600 text-sm">Compatible printer: Apply for all DTF printers, including F8, F13, F13 Pro, P13, K8, K13 printers.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <p className="font-bold text-gray-900 mb-3">Technical Specification</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                {[
                  ['Pressing time','8–12s'], ['Pressing temperature','145–160°C'], ['Components','Polyurethane'],
                  ['Appearance','Transparent powder'], ['Particle size range','100–220pm'],
                  ['40°C water washability','Rating 4'], ['60°C water washability','Rating 3'], ['Dry clean','Rating 4'],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-100 py-2">
                    <span className="font-semibold text-gray-700">{k}</span>
                    <span className="text-gray-600">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Benefits</h2>
          <ul className="space-y-4">
            {[
              ['Extensive Material Compatibility', 'Suitable for use on a diverse range of substrates, including canvas, cotton, and more, giving you the freedom to explore endless design possibilities.'],
              ['Universal Machine Compatibility', 'Can be used with a variety of DTF printers, including the F8, F13, F13 Pro, P13, K8, K13, ensuring a smooth and hassle-free production experience.'],
              ['Vibrant Colors, Lasting Impressions', 'The adhesive powder ensures brilliant, long-lasting colors that withstand the test of time, even after repeated washes.'],
            ].map(([title, desc], i) => (
              <li key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">{title}</p>
                <p className="text-gray-600 text-sm">{desc}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-6">
            Check out the powder package when you receive it. If there are any damage or moisture-related issues, Procolored promises to provide a replacement or compensation.
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on 3 reviews</p>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {[[5,'100%',3],[4,'0%',0],[3,'0%',0],[2,'0%',0],[1,'0%',0]].map(([stars,pct,count],i) => (
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
            {REVIEWS.map((r,i) => (
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
