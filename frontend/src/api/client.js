import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Interceptor to add User ID (simplification for MVP)
// In a real app, use JWT from Supabase
client.interceptors.request.use((config) => {
  const userId = localStorage.getItem('logsnap_user_id');
  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  return config;
});

export default client;
