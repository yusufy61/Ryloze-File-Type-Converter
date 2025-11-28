import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import LandingPage from './pages/LandingPage';
import ConverterPage from './pages/ConverterPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/converter" element={<ConverterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
