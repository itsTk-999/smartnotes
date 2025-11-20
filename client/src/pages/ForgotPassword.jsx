import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // DIRECT BACKEND CONNECTION
    const URL = "https://smart-notes-kz6i.onrender.com/api/auth/forgot-password";

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message || "Reset link sent successfully!");
    } catch (err) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-bg relative overflow-hidden transition-colors duration-300 p-4">
      
      {/* Aurora Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-warm-orange/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 dark:bg-dark-surface/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/10 relative z-10"
      >
        <Link to="/login" className="absolute top-8 left-8 text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500 mb-4 shadow-sm">
             <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-black text-primary dark:text-white tracking-tight">Reset Password</h1>
          <p className="text-secondary dark:text-dark-subtext mt-2 font-medium">Enter your email to receive a recovery link.</p>
        </div>

        <AnimatePresence mode='wait'>
          {message ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-6 rounded-2xl flex flex-col items-center text-center border border-green-100 dark:border-green-900/50"
            >
              <CheckCircle2 size={40} className="mb-3" />
              <p className="font-bold text-lg">Link Sent!</p>
              <p className="text-sm opacity-80 mt-1">Check your inbox (and spam folder) for the reset link.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
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

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 text-sm rounded-xl flex items-center gap-2 font-bold justify-center">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Send Link"}
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;