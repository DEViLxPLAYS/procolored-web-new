import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';

// Placeholder pages
import F13Product from './pages/F13Product';
import Collections from './pages/Collections';
import Showroom from './pages/Showroom';
import Repair from './pages/Repair';
import Warranty from './pages/Warranty';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="f13" element={<F13Product />} />
            <Route path="collections/:categoryId" element={<Collections />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="showroom" element={<Showroom />} />
            <Route path="repair" element={<Repair />} />
            <Route path="warranty" element={<Warranty />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
