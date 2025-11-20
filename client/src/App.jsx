import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Flashcards from './pages/Flashcards';
import Library from './pages/Library';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Components
import ZenPlayer from './components/UI/ZenPlayer';
import DesktopSidebar from './components/Layout/DesktopSidebar'; // <--- Import Desktop Nav
import MobileNav from './components/Layout/MobileNav'; // <--- Keep this imported

function App() {
  const location = useLocation();
  
  const isAuthPage = ['/login', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password');
  
  if (isAuthPage) {
    return (
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        </Routes>
      </AnimatePresence>
    );
  }

  // --- DESKTOP LAYOUT RENDER ---
  return (
    <div className="flex">
      
      <DesktopSidebar /> {/* <--- Renders Sidebar on desktop */}

      {/* Main Content Area (Pushed over by the sidebar) */}
      <main className="flex-1 min-h-screen"> 
        <ZenPlayer /> 

        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/study" element={<Flashcards />} />
            <Route path="/resources" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
        
        {/* Mobile Nav is included in every page component, but we will hide it on desktop */}
      </main>
    </div>
  );
}

export default App;