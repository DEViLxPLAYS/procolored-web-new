import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type DenomKey = 100 | 300 | 500 | 1000 | 1700;

const DENOMINATIONS: { value: DenomKey; image: string }[] = [
  { value: 100,  image: 'https://www.procolored.com/cdn/shop/files/Procolored_Gift_Card_4_9c9cf7ba-dd3b-4161-aa51-2a0d12d19cfb_1220x_crop_center.png?v=1769590836' },
  { value: 300,  image: 'https://www.procolored.com/cdn/shop/files/Procolored_Gift_Card_6_1220x_crop_center.png?v=1769590836' },
  { value: 500,  image: 'https://www.procolored.com/cdn/shop/files/Procolored_Gift_Card_5_1220x_crop_center.png?v=1769590778' },
  { value: 1000, image: 'https://www.procolored.com/cdn/shop/files/Procolored_Gift_Card_9_1220x_crop_center.png?v=1769590885' },
  { value: 1700, image: 'https://www.procolored.com/cdn/shop/files/Procolored_Gift_Card_8_1220x_crop_center.png?v=1769590885' },
];

export default function GiftCard() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selected, setSelected] = useState<DenomKey>(1700);

  const current = DENOMINATIONS.find(d => d.value === selected)!;

  const handleAddToCart = () => {
    addToCart({ id: `gift-card-${selected}`, name: `Procolored Gift Card — $${selected.toLocaleString()}`, price: `$USD:${selected}`, image: current.image, quantity: 1 });
  };
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>
            {' > '}Procolored Gift Card
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <img src={current.image} alt={`Procolored Gift Card $${selected}`} className="w-full h-[480px] object-contain p-6 transition-all duration-500" />
              </div>
              {/* Thumbnail row */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {DENOMINATIONS.map(d => (
                  <button key={d.value} onClick={() => setSelected(d.value)}
                    className={`w-16 h-16 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${selected === d.value ? 'border-gray-800' : 'border-gray-100 hover:border-gray-300'}`}>
                    <img src={d.image} alt={`$${d.value}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3">
                  Procolored Gift Card
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <span className="text-sm text-gray-500">4 reviews</span>
                </div>
                <div className="text-[2rem] font-extrabold text-red-600">${selected.toLocaleString()}.00 USD</div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Send a Procolored Gift Card for any occasion! Our digital gift cards come in 5 denominations and can be redeemed online. Shopping made easy and convenient!
              </p>

              {/* Denomination Selector */}
              <div>
                <p className="font-extrabold text-gray-900 text-base mb-3">Denomination:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DENOMINATIONS.map(d => (
                    <button key={d.value} onClick={() => setSelected(d.value)}
                      className={`py-3 px-4 rounded-lg border-2 font-bold transition-all text-sm ${selected === d.value ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      US${d.value.toLocaleString()}.00
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-lg transition text-[15px]">
                  Add to cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
                  <span className="text-[15px]">Buy with</span>
                  <span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-10px]">
                <a href="#" className="text-xs text-blue-500 underline hover:text-blue-600 transition">More payment options</a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-xs text-gray-600">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Shop with Confidence!</p>
                  <ul className="list-disc pl-4 space-y-1 mb-2"><li>100% Protection Against Shipping Mishaps</li></ul>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WORRY-FREE PURCHASE® BY <span className="text-blue-500 lowercase font-medium">seel</span></p>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">How Gift Cards Work</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5 font-bold">1.</span><span>Purchase the gift card in your chosen denomination.</span></li>
                  <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5 font-bold">2.</span><span>A unique code is emailed to you or your recipient immediately.</span></li>
                  <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5 font-bold">3.</span><span>Redeem online at checkout on any Procolored product. No expiry.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Denominations Grid */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Available Denominations</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DENOMINATIONS.map(d => (
              <button key={d.value} onClick={() => setSelected(d.value)}
                className={`rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${selected === d.value ? 'border-orange-500 scale-105 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                <img src={d.image} alt={`$${d.value} Gift Card`} className="w-full aspect-square object-cover" />
                <div className="p-3 bg-white text-center">
                  <p className="font-bold text-gray-900">${d.value.toLocaleString()}.00</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
