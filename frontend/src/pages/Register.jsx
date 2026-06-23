import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap, Loader2, Mail, Lock, UserPlus } from 'lucide-react';
import client from '../api/client';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register with backend (this handles Supabase + our DB)
      await client.post('/api/auth/register', { email, password });

      // Attempt login immediately after registration
      const { error: loginError } = await signIn(email, password);

      if (loginError) {
        alert("Account created! Please check your email for a confirmation link before logging in.");
        navigate('/login');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail;
      if (errorMsg?.includes('429') || err.message?.includes('429')) {
        alert("Too many requests. Please wait a few minutes before trying again or check if you already have an account.");
      } else {
        alert(errorMsg || "Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-10 glass-card p-12 rounded-[2.5rem] relative z-10 border-t-4 border-t-blue-600">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 p-5 rounded-[2rem] shadow-[0_0_40px_rgba(59,130,246,0.5)] animate-glow">
              <Zap className="text-white fill-white" size={40} />
            </div>
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter text-white mb-2 italic uppercase">OPERATOR ENROLLMENT</h2>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] uppercase">Initialize New Profile // V27.5</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase ml-1">ASSIGN IDENTIFIER</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="ID_000@LOGSNAP.AI"
                  className="w-full bg-black/40 border border-slate-800 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-sm tracking-tight text-white"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase ml-1">GENERATE ACCESS KEY</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-slate-800 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-sm text-white"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg italic font-black shadow-blue-600/30 active:scale-95 transition-transform"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <UserPlus size={20} />
                <span>START COMMISSION</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-slate-800/50">
          <p className="text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase">
            EXISTING OPERATOR? <Link to="/login" className="text-blue-500 hover:text-blue-400 underline underline-offset-8 decoration-2 ml-2 transition-colors">LOGIN HERE</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
