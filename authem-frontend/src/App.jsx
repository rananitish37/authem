import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Profile } from './pages/Profile';
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
import { ProtectedRoute } from './components/ProtectedRoute';

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
            <Route path="/browse" element={<Browse />} />
            <Route path="/productdetails/:id" element={<ProductDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                    <Route path="/admin/add-product" element={<AdminAddProduct />} />
                    <Route path="/admin/catalog" element={<AdminCatalogManager />} />
            </Route>
            <Route path="/seller/create-ask" element={<SellerCreateAsk />} />
            <Route path="/profile" element={<Profile />} />

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