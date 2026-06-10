import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  /* ===============================
     REGISTER FUNCTION
  =============================== */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      if (res.data?.message) {
        navigate("/login");
      }

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Background decorative elements — responsive sizes
  const floatingShapes = [
    { size: 200, x: '10%', y: '20%', delay: 0, duration: 20 },
    { size: 150, x: '80%', y: '10%', delay: 2, duration: 25 },
    { size: 100, x: '70%', y: '70%', delay: 4, duration: 18 },
    { size: 180, x: '20%', y: '75%', delay: 1, duration: 22 },
    { size: 120, x: '50%', y: '50%', delay: 3, duration: 30 },
  ];

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden font-sans">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50" />

        {/* Floating Blobs — hidden on mobile for performance */}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg relative z-10"
      >

        {/* Back Button — responsive positioning */}
        <motion.button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-500 transition-colors text-xs sm:text-sm group mb-4 sm:mb-0 sm:absolute sm:-top-12 sm:left-0"
          whileHover={{ x: -3 }}
        >
          <div className="p-1.5 sm:p-2 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-purple-50 group-hover:border-purple-200 transition-all">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-medium">Back to Login</span>
        </motion.button>

        {/* Header */}
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
              Create Account
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 flex-shrink-0" />
              <span className="text-center">Join the Text Forensic Analyser platform</span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 flex-shrink-0" />
            </p>
          </motion.div>
        </div>

        {/* Card */}
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

            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">

              {/* Name Field */}
              <motion.div
                animate={{ 
                  scale: focusedField === 'name' ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 sm:mb-2 block">
                  Full Name
                </label>
                <div className="relative group">
                  <User 
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-200 ${
                      focusedField === 'name' ? 'text-purple-500' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 
                      transition-all duration-200 outline-none
                      focus:bg-white focus:border-purple-400 focus:shadow-[0_0_0_4px_rgba(147,51,234,0.08)]
                      hover:border-slate-300 min-h-[44px] sm:min-h-[52px]"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: focusedField === 'name' ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

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
                    placeholder="name@company.com"
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
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {password && (
                  <motion.div 
                    className="mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex gap-1.5 mb-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 h-2 sm:h-1.5 rounded-full transition-all duration-300 ${
                            level <= passwordStrength 
                              ? strengthColors[passwordStrength - 1] 
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Password strength: 
                        <span className={`font-semibold ml-1 ${
                          passwordStrength === 4 ? 'text-green-600' :
                          passwordStrength === 3 ? 'text-yellow-600' :
                          passwordStrength === 2 ? 'text-orange-600' : 'text-red-500'
                        }`}>
                          {strengthLabels[passwordStrength - 1]}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Register Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg shadow-purple-500/25
                  transition-all duration-200
                  hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-600 hover:to-indigo-700
                  active:scale-[0.98]
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
                  flex items-center justify-center gap-2 mt-2 min-h-[44px] sm:min-h-[52px]"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

            </form>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-purple-50/50 border-t border-purple-100 text-center">
            <p className="text-slate-500 text-xs sm:text-sm">
              Already have an account?
              <Link 
                to="/login" 
                className="text-purple-500 font-semibold ml-1.5 sm:ml-2 hover:text-purple-600 transition-colors inline-flex items-center gap-1 group"
              >
                Sign in
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>

        </motion.div>

        {/* Terms Footer */}
        <motion.div 
          className="mt-6 sm:mt-8 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-400 text-[10px] sm:text-xs flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            <span className="text-center">By registering, you agree to our Terms of Service and Privacy Policy</span>
          </p>
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
          Secure registration powered by Text Forensic Analyser
        </p>

      </motion.div>
    </div>
  );
};

export default Register;