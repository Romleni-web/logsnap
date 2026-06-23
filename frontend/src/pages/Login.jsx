import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap, Loader2, Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      alert(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm space-y-8 bg-white border border-gray-200 p-10 rounded-xl shadow-sm">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Zap className="text-white fill-white" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black mb-1">Welcome back</h2>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">LogSnap Operator Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase ml-0.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase ml-0.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-gray-100">
          <p className="text-gray-400 text-xs">
            Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
