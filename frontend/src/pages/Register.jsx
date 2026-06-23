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
      // The backend calls supabase.auth.sign_up, so we don't call it again on frontend
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-[2.5rem] relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/20 animate-glow">
              <Zap className="text-white fill-white" size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2">Create Account</h2>
          <p className="text-slate-400 font-medium">Elevate your debugging with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <UserPlus size={20} />
                <span className="text-lg">Get Started</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Already a member? <Link to="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-2">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
