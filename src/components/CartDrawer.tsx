import { useCart } from '../context/CartContext';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency, convertPrice } from '../context/CurrencyContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartCount, cartSubtotal } = useCart();
  const { currency, formatConverted } = useCurrency();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white z-[101] shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black flex items-center gap-1">
            Cart <span className="text-sm font-normal text-gray-500 mb-2">{cartCount}</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>Your cart is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-[#E85A24] font-semibold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <h4 className="text-sm font-medium text-black line-clamp-2">{item.name}</h4>
                      <span className="text-sm font-semibold text-black whitespace-nowrap">{formatConverted(convertPrice(item.price, currency.divisor))}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-xl font-bold text-black">{formatConverted(cartSubtotal)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 font-medium">Taxes and shipping calculated at checkout</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 bg-[#333333] text-white font-bold rounded-full hover:bg-black transition-colors text-[15px]"
              >
                View cart
              </button>
              <button 
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#E85A24] text-white font-bold rounded-full hover:bg-[#d14b1b] transition-colors text-[15px]"
              >
                Checkout
              </button>
            </div>
            
            <div className="mt-4 text-center">
               <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-sm font-semibold text-[#E85A24] hover:underline"
                >
                  Continue shopping
                </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
