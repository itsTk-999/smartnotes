import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setIsLoading(true);
    setError('');

    // DIRECT BACKEND CONNECTION
    const URL = `https://smart-notes-kz6i.onrender.com/api/auth/reset-password/${id}/${token}`;

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid or expired link");
      }

      setMessage("Password Reset Successful!");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-bg p-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Aurora Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-warm-orange/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/70 dark:bg-dark-surface/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-black text-primary dark:text-white tracking-tight">New Password</h1>
          <p className="text-secondary dark:text-dark-subtext mt-2 font-medium text-center">Secure your account with a new key.</p>
        </div>

        <AnimatePresence mode='wait'>
          {message ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-green-600 dark:text-green-400 font-bold flex flex-col items-center bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/50"
            >
              <CheckCircle2 size={48} className="mb-4" />
              <span className="text-xl">{message}</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-normal">Redirecting to login...</p>
              <Link to="/login" className="text-sm text-warm-orange font-bold hover:underline mt-4">Go to Login</Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
               
               {/* New Password Input */}
               <div className="relative group">
                 <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-warm-orange transition-colors">
                    <Lock size={20} />
                 </div>
                 <input 
                   type={showNewPassword ? "text" : "password"} 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-12 pr-12 py-4 bg-white dark:bg-dark-bg rounded-2xl border-2 border-transparent focus:border-warm-orange outline-none text-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all shadow-sm"
                   placeholder="New Password"
                 />
                 <button 
                    type="button" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-primary dark:hover:text-white transition-colors p-0 border-none bg-transparent"
                 >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
              </div>
              
              {/* Confirm Password Input */}
              <div className="relative group">
                 <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-warm-orange transition-colors">
                    <Lock size={20} />
                 </div>
                 <input 
                   type={showConfirmPassword ? "text" : "password"} 
                   required
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="w-full pl-12 pr-12 py-4 bg-white dark:bg-dark-bg rounded-2xl border-2 border-transparent focus:border-warm-orange outline-none text-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium transition-all shadow-sm"
                   placeholder="Confirm New Password"
                 />
                 <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-primary dark:hover:text-white transition-colors p-0 border-none bg-transparent"
                 >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 text-sm rounded-xl flex items-center gap-2 font-bold justify-center">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center mt-4 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResetPassword;