import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import BrowseItemsPage from './pages/BrowseItemsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ReportItemModal from './components/items/ReportItemModal';
import './App.css';

// Automatically scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Navbar onOpenReportModal={() => setReportModalOpen(true)} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<LandingPage onOpenReportModal={() => setReportModalOpen(true)} />}
          />
          <Route path="/items" element={<BrowseItemsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={<LandingPage onOpenReportModal={() => setReportModalOpen(true)} />}
          />
        </Routes>
      </main>

      <Footer />

      {/* Global Quick Report Modal accessible from Navbar */}
      <ReportItemModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportSuccess={(_newItem) => {
          // If on /items, local list can update or user can navigate
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
