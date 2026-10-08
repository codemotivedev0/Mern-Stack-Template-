import { request } from '../api.js';

// Resolves to { data: { user, stats, session: { expiresAt } } }
export const getDashboardRequest = () => request('/dashboard');
