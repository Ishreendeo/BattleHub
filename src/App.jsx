import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/layout/LoadingScreen';

import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import LiveMatchCenter from './pages/LiveMatchCenter';
import Schedule from './pages/Schedule';
import Leaderboard from './pages/Leaderboard';
import AIPredictor from './pages/AIPredictor';
import OurTeam from './pages/OurTeam';
import NotFound from './pages/NotFound';

export default function App() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <ThemeProvider>
      <DataProvider>
        <AnimatePresence>{booting && <LoadingScreen />}</AnimatePresence>
        {!booting && (
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-cyan focus:text-void focus:px-3 focus:py-2 focus:rounded-lg">
                Skip to main content
              </a>
              <Navbar />
              <main id="main-content" className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tournaments" element={<Tournaments />} />
                  <Route path="/tournaments/:id" element={<TournamentDetail />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/teams/:id" element={<TeamDetail />} />
                  <Route path="/live" element={<LiveMatchCenter />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/predictor" element={<AIPredictor />} />
                  <Route path="/our-team" element={<OurTeam />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#10152a',
                  color: '#f1f5f9',
                  border: '1px solid rgba(139,92,246,0.3)',
                },
              }}
            />
          </BrowserRouter>
        )}
      </DataProvider>
    </ThemeProvider>
  );
}
