import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

// Placeholder pages
import F13Product from './pages/F13Product';
import Collections from './pages/Collections';
import Showroom from './pages/Showroom';
import Repair from './pages/Repair';
import Warranty from './pages/Warranty';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="f13" element={<F13Product />} />
          <Route path="collections/all" element={<Collections />} />
          <Route path="showroom" element={<Showroom />} />
          <Route path="repair" element={<Repair />} />
          <Route path="warranty" element={<Warranty />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
