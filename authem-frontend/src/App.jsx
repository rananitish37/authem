import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProductDetail } from './pages/ProductDetail';
import {Browse} from './pages/Browse';
import {AdminAddProduct} from './pages/AdminAddProduct';
import AdminCatalogManager from './components/admin/AdminCatalogManager';
import SellerCreateAsk from './components/seller/SellerCreateAsk';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
      <ThemeProvider>
    <Router>
     <div className="min-h-screen bg-slate-50 dark:bg-authem-dark text-slate-900 dark:text-slate-100 transition-colors">
       <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/catalog" element={<AdminCatalogManager />} />
            <Route path="/seller/create-ask" element={<SellerCreateAsk />} />

            {/* Fallback Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;