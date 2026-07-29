// API base URL is set via environment variable.
// Local dev: set VITE_API_URL=http://localhost:3000 in frontend/.env
// Production (Render): set VITE_API_URL=https://flexoraa-1.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://flexoraa-1.onrender.com';

