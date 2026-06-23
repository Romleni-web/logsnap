import React, { useState } from 'react';
import client from '../api/client';
import { CreditCard, Zap, Crown, CheckCircle2, Loader2, Phone } from 'lucide-react';

export default function SubscriptionCard({ user, stats }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const isFree = !stats?.plan || stats?.plan === 'free';

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Please enter your M-Pesa phone number");
    if (!user?.id) return alert("Authentication error: Please log in again.");

    setLoading(true);
    try {
      console.log("Initiating STK Push for user:", user.id, "phone:", phone);
      const response = await client.post('/api/auth/stk-push', {
        user_id: user.id,
        phone: phone
      });

      if (response.data.ResponseCode === "0") {
        alert("STK Push Sent. Please enter your PIN on your phone to complete the upgrade.");
      } else {
        alert("M-Pesa initialization failed. Please try again.");
      }
    } catch (err) {
      alert("Terminal Error: Secure payment uplink failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded-md">
            <Crown className="text-blue-600" size={18} />
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Plan</span>
        </div>

        <h3 className="text-2xl font-bold text-black mb-1 italic uppercase tracking-tight">
          {isFree ? 'FREE' : 'PRO'}<span className="text-blue-600 font-bold"> TIER</span>
        </h3>

        <p className="text-xs text-gray-500 mb-6 font-medium">
          {isFree
            ? `${stats?.remaining_runs || 0} debug cycles available.`
            : 'Enterprise-grade neural processing active.'}
        </p>

        <div className="space-y-3 mb-6">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 tracking-wide">
              <CheckCircle2 size={12} className="text-blue-600" />
              {isFree ? 'Basic AI Analytics' : 'Priority Neural Engine'}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 tracking-wide">
              <CheckCircle2 size={12} className="text-blue-600" />
              {isFree ? '10 Runs / Month' : '1000 Runs / Month'}
           </div>
        </div>

        {isFree && (
          <form onSubmit={handleUpgrade} className="space-y-3 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">M-Pesa Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  required
                  placeholder="2547XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Zap size={14} className="fill-white" />
                  <span>UPGRADE VIA M-PESA (KES 2900)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Safe Payment Terminal</span>
        <CreditCard size={12} className="text-gray-300" />
      </div>
    </div>
  );
}
