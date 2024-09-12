import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ItemsPage from './pages/Items';
import LoginPage from './pages/Login';
import OrdersPage from './pages/Orders';
import "./fonts.css";
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<ItemsPage />} />} />
          <Route path="/products" element={<ProtectedRoute element={<ItemsPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orders" element={<ProtectedRoute element={<OrdersPage />} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;