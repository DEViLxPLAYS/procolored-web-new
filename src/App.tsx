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
import InkProduct from './pages/InkProduct';

// New Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';
import SiphonCirculation from './pages/SiphonCirculation';
import OurBrand from './pages/OurBrand';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="f13" element={<F13Product />} />
            <Route path="collections/:categoryId" element={<Collections />} />
            <Route path="products/47" element={<InkProduct />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="showroom" element={<Showroom />} />
            <Route path="repair" element={<Repair />} />
            <Route path="warranty" element={<Warranty />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="pages/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="pages/shipping-policy" element={<ShippingPolicy />} />
            <Route path="pages/refund-policy" element={<RefundPolicy />} />
            <Route path="pages/terms-of-service" element={<TermsOfService />} />
            <Route path="pages/procolored-siphon-circulation" element={<SiphonCirculation />} />
            <Route path="pages/our-brand" element={<OurBrand />} />
            <Route path="pages/contact-us" element={<ContactUs />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
