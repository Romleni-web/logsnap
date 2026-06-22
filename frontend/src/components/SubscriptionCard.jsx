import React from 'react';
import client from '../api/client';

export default function SubscriptionCard({ user, stats }) {
  const handleUpgrade = async () => {
    try {
      const response = await client.post('/api/auth/create-checkout', { user_id: user.id });
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe
      }
    } catch (err) {
      alert("Checkout failed. Manual upgrade via invoice is available.");
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-bold mb-2">Current Plan: {stats?.plan?.toUpperCase() || 'FREE'}</h3>
      <p className="text-slate-400 mb-6">
        {stats?.plan === 'free'
          ? `${stats?.remaining_runs} runs remaining this month.`
          : 'You have unlimited debug runs. Enjoy!'}
      </p>

      {stats?.plan === 'free' && (
        <button
          onClick={handleUpgrade}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
        >
          Upgrade to Pro ($29/mo)
        </button>
      )}
    </div>
  );
}
