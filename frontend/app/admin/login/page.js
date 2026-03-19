'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
    text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] font-inter">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
          bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4 bg-white/5 backdrop-blur border border-white/10
          rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animated-gradient">
            MaDycloud
          </h1>
          <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30
            rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required className={inputCls} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-black font-bold
              hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
