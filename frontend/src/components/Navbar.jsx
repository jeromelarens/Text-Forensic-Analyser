import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  LayoutDashboard,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for dynamic glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/home', 
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    { 
      label: 'History', 
      path: '/history', 
      icon: <Clock className="w-5 h-5" />
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-purple-100/20 border-b border-purple-100/50' 
          : 'bg-white/70 backdrop-blur-md border-b border-purple-100/30'
      }`}>
        <div className="h-20 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-500">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors duration-300">
                Text Forensic Analyser
              </h1>
              <p className="text-[10px] font-semibold text-purple-500/70 uppercase tracking-wider -mt-0.5 hidden sm:block">Forensic Intelligence</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-purple-50/50 backdrop-blur-sm p-1.5 rounded-2xl border border-purple-100/50">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-white hover:shadow-sm'
                }`}
                whileHover={{ scale: isActive(item.path) ? 1.02 : 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={isActive(item.path) ? 'text-white' : 'text-purple-500'}>{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Logout Button - Desktop */}
            <motion.button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 border border-slate-200 hover:border-transparent hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Logout</span>
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-3 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed top-20 right-4 left-4 z-50 md:hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-purple-100 overflow-hidden">
              <div className="p-2 space-y-1">
                {navItems.map((item, idx) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-5 py-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center gap-4 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                        : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className={isActive(item.path) ? 'text-white' : 'text-purple-500'}>{item.icon}</span>
                    {item.label}
                    {isActive(item.path) && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </motion.button>
                ))}

                <div className="pt-2 mt-2 border-t border-purple-100">
                  <motion.button
                    onClick={handleLogout}
                    className="w-full px-5 py-4 rounded-2xl text-base font-bold text-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
}