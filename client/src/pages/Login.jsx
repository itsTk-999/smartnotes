import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle, Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, register } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- CORRECT STATE FOR TOGGLE ---
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let res;
    if (isRegistering) {
      res = await register(name, email, password);
    } else {
      res = await login(email, password);
    }

    setIsLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-bg relative overflow-hidden transition-colors duration-300 p-4">
      
      {/* Aurora Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-warm-orange/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      
      {/* MAIN CARD */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-md bg-white/70 dark:bg-dark-surface/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/10 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-warm-orange to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-4 transform rotate-3 hover:rotate-6 transition-transform">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-black text-primary dark:text-white tracking-tight text-center">
            {isRegistering ? "Join the Hive" : "Welcome Back"}
          </h1>
          <p className="text-secondary dark:text-dark-subtext text-center mt-2 font-medium">
            {isRegistering ? "Start your productivity journey." : "Your workspace is ready."}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-300 text-sm rounded-xl flex items-center gap-3 font-bold"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
          
          {/* Name Field */}
          <AnimatePresence>
            {isRegistering && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-warm-orange transition-colors">
                        <User size={20} />
                    </div>
                    <input 
                    type="text" 
                    required={isRegistering}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-bg rounded-2xl border-2 border-transparent focus:border-warm-orange outline-none text-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all shadow-sm"
                    placeholder="Full Name"
                    />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Field */}
          <div className="relative group">
            <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-warm-orange transition-colors">
                <Mail size={20} />
            </div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-bg rounded-2xl border-2 border-transparent focus:border-warm-orange outline-none text-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all shadow-sm"
              placeholder="user@gmail.com" 
            />
          </div>
          
          {/* Password Field (with Toggle) */}
          <div className="relative group">
            <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-warm-orange transition-colors">
                <Lock size={20} />
            </div>
            <input 
              // --- FIX: Use showPassword state here ---
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-dark-bg rounded-2xl border-2 border-transparent focus:border-warm-orange outline-none text-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all shadow-sm"
              placeholder="••••••••"
            />
            {/* Toggle Button */}
            <button 
                type="button" 
                // --- FIX: Toggle setShowPassword state here ---
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-primary dark:hover:text-white transition-colors p-0 border-none bg-transparent"
            >
                {/* --- FIX: Display icon based on showPassword state --- */}
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          {!isRegistering && (
            <div className="flex justify-center relative z-50">
              <Link to="/forgot-password" className="text-sm text-warm-orange font-bold hover:underline transition-colors cursor-pointer">
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 relative z-20"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                {isRegistering ? "Create Account" : "Sign In"} 
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        {/* Toggle Switch */}
        <div className="mt-8 text-center relative z-20">
          <p className="text-secondary dark:text-dark-subtext text-sm font-medium">
            {isRegistering ? "Already have an account? " : "New here? "}
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(''); 
              }}
              className="text-warm-orange hover:text-orange-600 font-bold hover:underline ml-1 transition-colors"
            >
              {isRegistering ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>

      </motion.div>
      
      {/* Footer Info */}
      <p className="absolute bottom-6 text-xs text-gray-400 dark:text-gray-600 font-medium opacity-50">
        © 2025 Smart Notes. Built for Students.
      </p>
    </div>
  );
};

export default Login;