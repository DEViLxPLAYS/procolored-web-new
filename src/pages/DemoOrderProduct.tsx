import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Zap, FlaskConical } from 'lucide-react';

const DEMO_PRODUCT = {
  id: 'procolored-demo-order-test',
  name: 'Procolored Demo Order (Testing Only)',
  price: '$0.00 USD',
  image: 'https://i.postimg.cc/Y9M7TqxR/logo.webp',
};

export default function DemoOrderProduct() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({
      id: DEMO_PRODUCT.id,
      name: DEMO_PRODUCT.name,
      price: DEMO_PRODUCT.price,
      image: DEMO_PRODUCT.image,
      quantity: 1,
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections/all" className="hover:text-gray-700 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-700">Demo Order (Testing Only)</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center p-16 relative">
              {/* TEST Badge */}
              <div className="absolute top-4 left-4 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                🧪 TEST
              </div>
              <img
                src={DEMO_PRODUCT.image}
                alt="Procolored Demo Order"
                className="w-full h-full object-contain opacity-80"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Alert Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-amber-800">Testing Product Only</div>
                <div className="text-xs text-amber-700 mt-0.5">
                  This product is for testing the order, email, and notification system. No real payment will be charged.
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Procolored Demo Order
            </h1>
            <p className="text-sm text-gray-500 mb-6">Testing Only — For Internal Use</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-black text-amber-500">FREE</span>
              <span className="text-lg text-gray-400 line-through">$0.00</span>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">$0.00 USD</span>
            </div>

            {/* What this tests */}
            <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">What This Demo Tests</div>
              {[
                'Customer order confirmation email (branded)',
                'Admin new order notification email (detailed)',
                'Order saved to database with status: confirmed',
                'Order Success popup appears on screen',
                'No Stripe payment required for $0 total',
                'Full order flow without charging a card',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              id="demo-add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-200"
            >
              <Zap className="w-5 h-5" />
              Add to Cart & Test Order System
            </button>

            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              No payment charged — for testing purposes only
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed">
              <strong className="block mb-1">📧 How to test:</strong>
              1. Click "Add to Cart &amp; Test Order System"<br />
              2. Fill in your email on the checkout page<br />
              3. Click "Confirm Demo Order (Free)"<br />
              4. Check your inbox for the branded confirmation email<br />
              5. Check admin email for the new order notification
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
