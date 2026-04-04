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
import WhiteInkProduct from './pages/WhiteInkProduct';
import P13Product from './pages/P13Product';
import T8PandaProduct from './pages/T8PandaProduct';
import T11ProProduct from './pages/T11ProProduct';
import VF13ProUVDTFProduct from './pages/VF13ProUVDTFProduct';
import V4UVPrinterA5 from './pages/V4UVPrinterA5';
import V6UVPrinterA4 from './pages/V6UVPrinterA4';
import V11UVPrinter from './pages/V11UVPrinter';
import V11ProUVPrinterBase from './pages/V11ProUVPrinterBase';
import V11ProUVPrinterJigs from './pages/V11ProUVPrinterJigs';
import V11ProUVPrinterUVLaminator from './pages/V11ProUVPrinterUVLaminator';
import V11ProUVPrinterJigsUVLaminator from './pages/V11ProUVPrinterJigsUVLaminator';

// New Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';
import SiphonCirculation from './pages/SiphonCirculation';
import OurBrand from './pages/OurBrand';
import ContactUs from './pages/ContactUs';

// Equipment & Accessory Product Pages
import SmokelessOvenPremium from './pages/SmokelessOvenPremium';
import OvenUpgraded from './pages/OvenUpgraded';
import PowderShakerAllInOne from './pages/PowderShakerAllInOne';
import PrinterBracket from './pages/PrinterBracket';
import UVDTFLaminator from './pages/UVDTFLaminator';
import UVPrinterJigs from './pages/UVPrinterJigs';
import H15HeatPress from './pages/H15HeatPress';
import GarmentJigDTG from './pages/GarmentJigDTG';
import GiftCard from './pages/GiftCard';
import DTFPowder from './pages/DTFPowder';
import DTFInk250ml from './pages/DTFInk250ml';
import UVWhiteInk500ml from './pages/UVWhiteInk500ml';
import UVDTFWhiteInk500ml from './pages/UVDTFWhiteInk500ml';
import UVDTFInk500ml from './pages/UVDTFInk500ml';
import NozzleProtectionLiquid from './pages/NozzleProtectionLiquid';
import DTFCleanerInk from './pages/DTFCleanerInk';
import CleaningKits from './pages/CleaningKits';
import UVCleanerInk from './pages/UVCleanerInk';
import AdhesionPromoter from './pages/AdhesionPromoter';
import UVVarnishInk from './pages/UVVarnishInk';
import UVPrinterInk500ml from './pages/UVPrinterInk500ml';

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
              <Route path="products/white-ink-dtf" element={<WhiteInkProduct />} />
              <Route path="white-ink-dtf" element={<WhiteInkProduct />} />
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
              <Route path="products/procolored-t8-panda-dtg-printer-8-2-a4-l800" element={<T8PandaProduct />} />
              <Route path="procolored-t8-panda-dtg-printer-8-2-a4-l800" element={<T8PandaProduct />} />
              <Route path="products/procolored-t11-pro-dtg-printer-11-8-a3-dual-tx800" element={<T11ProProduct />} />
              <Route path="procolored-t11-pro-dtg-printer-11-8-a3-dual-tx800" element={<T11ProProduct />} />
              <Route path="products/procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" element={<VF13ProUVDTFProduct />} />
              <Route path="procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" element={<VF13ProUVDTFProduct />} />
              <Route path="products/procolored-v4-uv-printer-4-7-a5-l800" element={<V4UVPrinterA5 />} />
              <Route path="procolored-v4-uv-printer-4-7-a5-l800" element={<V4UVPrinterA5 />} />
              <Route path="products/procolored-v6-panda-uv-printer-6-7-a4-l800" element={<V6UVPrinterA4 />} />
              <Route path="procolored-v6-panda-uv-printer-6-7-a4-l800" element={<V6UVPrinterA4 />} />
              <Route path="products/procolored-v11-uv-printer-11-4-a3-r1390" element={<V11UVPrinter />} />
              <Route path="procolored-v11-uv-printer-11-4-a3-r1390" element={<V11UVPrinter />} />
              <Route path="products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800" element={<V11ProUVPrinterBase />} />
              <Route path="procolored-v11-pro-uv-printer-11-4-a3-dual-tx800" element={<V11ProUVPrinterBase />} />
              <Route path="products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs" element={<V11ProUVPrinterJigs />} />
              <Route path="procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs" element={<V11ProUVPrinterJigs />} />
              <Route path="products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-uv-laminator" element={<V11ProUVPrinterUVLaminator />} />
              <Route path="procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-uv-laminator" element={<V11ProUVPrinterUVLaminator />} />
              <Route path="products/procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs-uv-laminator" element={<V11ProUVPrinterJigsUVLaminator />} />
              <Route path="procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs-uv-laminator" element={<V11ProUVPrinterJigsUVLaminator />} />
              {/* Equipment & Accessory Product Pages */}
              <Route path="products/smokeless-oven-premium" element={<SmokelessOvenPremium />} />
              <Route path="smokeless-oven-premium" element={<SmokelessOvenPremium />} />
              <Route path="products/oven-upgraded" element={<OvenUpgraded />} />
              <Route path="oven-upgraded" element={<OvenUpgraded />} />
              <Route path="products/powder-shaker-all-in-one" element={<PowderShakerAllInOne />} />
              <Route path="powder-shaker-all-in-one" element={<PowderShakerAllInOne />} />
              <Route path="products/printer-bracket" element={<PrinterBracket />} />
              <Route path="printer-bracket" element={<PrinterBracket />} />
              <Route path="products/uvdtf-laminator" element={<UVDTFLaminator />} />
              <Route path="uvdtf-laminator" element={<UVDTFLaminator />} />
              <Route path="products/uv-printer-jigs" element={<UVPrinterJigs />} />
              <Route path="uv-printer-jigs" element={<UVPrinterJigs />} />
              <Route path="products/h15-heat-press" element={<H15HeatPress />} />
              <Route path="h15-heat-press" element={<H15HeatPress />} />
              <Route path="products/garment-jig-dtg" element={<GarmentJigDTG />} />
              <Route path="garment-jig-dtg" element={<GarmentJigDTG />} />
              <Route path="products/gift-card" element={<GiftCard />} />
              <Route path="gift-card" element={<GiftCard />} />
              <Route path="products/dtf-powder" element={<DTFPowder />} />
              <Route path="dtf-powder" element={<DTFPowder />} />
              <Route path="products/dtf-ink-250ml" element={<DTFInk250ml />} />
              <Route path="dtf-ink-250ml" element={<DTFInk250ml />} />
              <Route path="products/uv-white-ink-500ml" element={<UVWhiteInk500ml />} />
              <Route path="uv-white-ink-500ml" element={<UVWhiteInk500ml />} />
              <Route path="products/uvdtf-white-ink-500ml" element={<UVDTFWhiteInk500ml />} />
              <Route path="uvdtf-white-ink-500ml" element={<UVDTFWhiteInk500ml />} />
              <Route path="products/uvdtf-ink-500ml" element={<UVDTFInk500ml />} />
              <Route path="uvdtf-ink-500ml" element={<UVDTFInk500ml />} />
              <Route path="products/nozzle-protection-liquid" element={<NozzleProtectionLiquid />} />
              <Route path="nozzle-protection-liquid" element={<NozzleProtectionLiquid />} />
              <Route path="products/dtf-cleaner-ink" element={<DTFCleanerInk />} />
              <Route path="dtf-cleaner-ink" element={<DTFCleanerInk />} />
              <Route path="products/cleaning-kits" element={<CleaningKits />} />
              <Route path="cleaning-kits" element={<CleaningKits />} />
              <Route path="products/uv-cleaner-ink" element={<UVCleanerInk />} />
              <Route path="uv-cleaner-ink" element={<UVCleanerInk />} />
              <Route path="products/adhesion-promoter" element={<AdhesionPromoter />} />
              <Route path="adhesion-promoter" element={<AdhesionPromoter />} />
              <Route path="products/uv-varnish-ink" element={<UVVarnishInk />} />
              <Route path="uv-varnish-ink" element={<UVVarnishInk />} />
              <Route path="products/uv-printer-ink-500ml" element={<UVPrinterInk500ml />} />
              <Route path="uv-printer-ink-500ml" element={<UVPrinterInk500ml />} />
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
