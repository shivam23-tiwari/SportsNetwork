/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ScoreStrip from './components/ScoreStrip';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SportCategory from './pages/SportCategory';
import PlayerDetail from './pages/PlayerDetail';
import NewsDetail from './pages/NewsDetail';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import SearchPage from './pages/SearchPage';
import StadiumDetail from './pages/StadiumDetail';
import TheBest from './pages/TheBest';
import MapPage from './pages/MapPage';

import UserAuth from './pages/UserAuth';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#f8f8f8] text-[#111] font-sans">
        <Navbar />
        <ScoreStrip />
        <main className="flex-grow w-full max-w-[1400px] mx-auto w-full px-0 sm:px-4 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/the-best" element={<TheBest />} />
            <Route path="/login" element={<UserAuth />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/stadium/:id" element={<StadiumDetail />} />
            <Route path="/category/:sport" element={<SportCategory />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/news/:id" element={<NewsDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
