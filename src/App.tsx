import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ScrollToTop } from './components/ScrollToTop';

// Placeholder pages
import F13Product from './pages/F13Product';
import F13ProProduct from './pages/F13ProProduct';
import F13ProStandProduct from './pages/F13ProStandProduct';
import F8PandaProduct from './pages/F8PandaProduct';
import K13LitePage from './pages/K13LitePage';
import Collections from './pages/Collections';
import Showroom from './pages/Showroom';
import Repair from './pages/Repair';
import Warranty from './pages/Warranty';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import InkProduct from './pages/InkProduct';
import P13Product from './pages/P13Product';
import VF13ProUVDTFProduct from './pages/VF13ProUVDTFProduct';

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

// K13 Lite Variant Pages — all redirect to unified /k13-lite page

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
              <Route path="/products/f13-pro" element={<F13ProProduct />} />
              <Route path="/f13-pro" element={<F13ProProduct />} />
              <Route path="/products/f13-pro-stand" element={<F13ProStandProduct />} />
              <Route path="/f13-pro-stand" element={<F13ProStandProduct />} />
              <Route path="f8-panda" element={<F8PandaProduct />} />
              <Route path="k13-lite" element={<K13LitePage />} />
              <Route path="collections/:categoryId" element={<Collections />} />
              <Route path="products/47" element={<InkProduct />} />
              {/* K13 Lite — all old per-variant routes redirect to unified page */}
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-white" element={<Navigate to="/k13-lite" replace />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-pink" element={<Navigate to="/k13-lite" replace />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-white" element={<Navigate to="/k13-lite" replace />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-pink" element={<Navigate to="/k13-lite" replace />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-white" element={<Navigate to="/k13-lite" replace />} />
              <Route path="products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink" element={<Navigate to="/k13-lite" replace />} />
              {/* bare-slug K13 routes (nav dropdown without /products/ prefix) */}
              <Route path="procolored-k13-lite-dtf-printer-13-a3-white" element={<Navigate to="/k13-lite" replace />} />
              <Route path="procolored-k13-lite-dtf-printer-13-a3-pink" element={<Navigate to="/k13-lite" replace />} />
              <Route path="procolored-k13-lite-dtf-printer-13-a3-oven-white" element={<Navigate to="/k13-lite" replace />} />
              <Route path="procolored-k13-lite-dtf-printer-13-a3-oven-pink" element={<Navigate to="/k13-lite" replace />} />
              <Route path="procolored-k13-lite-dtf-printer-13-a3-oven-premium-white" element={<Navigate to="/k13-lite" replace />} />
              <Route path="procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink" element={<Navigate to="/k13-lite" replace />} />
              <Route path="products/p13-dtf-printer" element={<P13Product />} />
              <Route path="p13-dtf-printer" element={<P13Product />} />
              <Route path="products/procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" element={<VF13ProUVDTFProduct />} />
              <Route path="procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" element={<VF13ProUVDTFProduct />} />
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
