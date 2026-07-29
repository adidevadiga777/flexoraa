const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const envUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = (envUrl && (isLocalhost || !envUrl.includes('localhost')))
    ? envUrl
    : 'https://flexoraa-1.onrender.com';


