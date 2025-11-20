import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import Hook

const Login = () => {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-white/50"
      >
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-warm-orange rounded-xl mx-auto mb-4 shadow-lg shadow-orange-200 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-secondary mt-2">Your study space is waiting.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
             <div>
             <label className="block text-sm font-medium text-secondary mb-1">Name</label>
             <input 
               type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-warm-orange outline-none transition-all"
             />
           </div>
          )}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-warm-orange outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-warm-orange outline-none transition-all"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                {isRegistering ? "Sign Up" : "Sign In"} 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-secondary">
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-primary font-bold cursor-pointer hover:underline"
          >
            {isRegistering ? "Sign In" : "Sign Up"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;