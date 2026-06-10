import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  User,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  /* ===============================
     REAL LOGIN
  =============================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);

      navigate("/home");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
     GUEST LOGIN
  =============================== */
  const handleGuestLogin = () => {
    localStorage.setItem("token", "guest");
    localStorage.setItem("userRole", "guest");
    navigate("/home");
  };

  // Background decorative elements - responsive sizes
  const floatingShapes = [
    { size: 200, x: '10%', y: '20%', delay: 0, duration: 20 },
    { size: 150, x: '80%', y: '10%', delay: 2, duration: 25 },
    { size: 100, x: '70%', y: '70%', delay: 4, duration: 18 },
    { size: 180, x: '20%', y: '75%', delay: 1, duration: 22 },
    { size: 120, x: '50%', y: '50%', delay: 3, duration: 30 },
  ];

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden font-sans">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50" />

        {/* Floating Blobs - responsive sizes */}
        {floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full hidden sm:block"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle diagonal lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="40" x2="40" y2="0" stroke="#000" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalLines)" />
        </svg>
      </div>

      {/* Main Content */}
      <motion.div 
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* Logo & Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 sm:mb-6 shadow-2xl shadow-purple-500/25 relative overflow-hidden"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Text Forensic Analyser
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 flex-shrink-0" />
              <span className="text-center">Sign in to access your forensic dashboard</span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 flex-shrink-0" />
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div 
          className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />

          <div className="p-5 sm:p-6 md:p-8">

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2 sm:gap-2.5"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-700 text-xs sm:text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

              {/* Email Field */}
              <motion.div
                animate={{ 
                  scale: focusedField === 'email' ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 sm:mb-2 block">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail 
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-purple-500' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 
                      transition-all duration-200 outline-none
                      focus:bg-white focus:border-purple-400 focus:shadow-[0_0_0_4px_rgba(147,51,234,0.08)]
                      hover:border-slate-300 min-h-[44px] sm:min-h-[52px]"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: focusedField === 'email' ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                animate={{ 
                  scale: focusedField === 'password' ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 sm:mb-2 block">
                  Password
                </label>
                <div className="relative group">
                  <Lock 
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-purple-500' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className="w-full pl-10 sm:pl-11 pr-11 sm:pr-12 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 
                      transition-all duration-200 outline-none
                      focus:bg-white focus:border-purple-400 focus:shadow-[0_0_0_4px_rgba(147,51,234,0.08)]
                      hover:border-slate-300 min-h-[44px] sm:min-h-[52px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 -m-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    )}
                  </button>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: focusedField === 'password' ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-xs sm:text-sm font-medium text-purple-500 hover:text-purple-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg shadow-purple-500/25
                  transition-all duration-200
                  hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-600 hover:to-indigo-700
                  active:scale-[0.98]
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
                  flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[52px]"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 sm:gap-4 my-5 sm:my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            {/* Guest Login Button */}
            
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-purple-50/50 border-t border-purple-100 text-center">
            <p className="text-slate-500 text-xs sm:text-sm">
              Don't have an account?
              <Link 
                to="/register" 
                className="text-purple-500 font-semibold ml-1.5 sm:ml-2 hover:text-purple-600 transition-colors inline-flex items-center gap-1 group"
              >
                Create one
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Bottom decorative dots */}
        <div className="flex justify-center gap-1.5 mt-6 sm:mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-purple-300"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.2,
                repeat: Infinity 
              }}
            />
          ))}
        </div>

        {/* Footer text */}
        <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-3 sm:mt-4 px-4">
          Secure authentication powered by Text Forensic Analyser
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;