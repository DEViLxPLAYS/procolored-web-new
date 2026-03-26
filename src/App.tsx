import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ScrollToTop } from './components/ScrollToTop';

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

import NewsletterPopup from './components/NewsletterPopup';
import AdminDashboard from './pages/AdminDashboard';

// K13 Lite Variant Pages
import K13LiteWhite from './pages/K13LiteWhite';
import K13LitePink from './pages/K13LitePink';
import K13LiteOvenWhite from './pages/K13LiteOvenWhite';
import K13LiteOvenPink from './pages/K13LiteOvenPink';
import K13LiteOvenPremiumWhite from './pages/K13LiteOvenPremiumWhite';
import K13LiteOvenPremiumPink from './pages/K13LiteOvenPremiumPink';

function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <NewsletterPopup />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="f13" element={<F13Product />} />
              <Route path="collections/:categoryId" element={<Collections />} />
              <Route path="products/47" element={<InkProduct />} />
              {/* K13 Lite routes — must come before the generic :slug route */}
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-white" element={<K13LiteWhite />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-pink" element={<K13LitePink />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-white" element={<K13LiteOvenWhite />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-pink" element={<K13LiteOvenPink />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-white" element={<K13LiteOvenPremiumWhite />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink" element={<K13LiteOvenPremiumPink />} />
              <Route path="products/:slug" element={<ProductDetails />} />
              {/* Support pages - with /pages/ prefix */}
              <Route path="pages/showroom" element={<Showroom />} />
              <Route path="pages/repair" element={<Repair />} />
              <Route path="pages/warranty" element={<Warranty />} />
              <Route path="pages/pre-sales-consult" element={<ContactUs />} />
              <Route path="pages/after-sales-service" element={<ContactUs />} />
              <Route path="pages/feedback" element={<ContactUs />} />
              {/* Legacy short paths for footer links */}
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
            {/* Admin panel — standalone, no public link, no layout wrapper */}
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/AdminDashboard/*" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </CartProvider>
    </CurrencyProvider>
  );
}

export default App;
