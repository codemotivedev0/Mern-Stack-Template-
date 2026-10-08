import { useQuery } from '@tanstack/react-query';
import { getDashboardRequest } from '../../services/dashboard/dashboard.service.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export const dashboardKeys = {
  all: ['dashboard'],
};

// Dashboard data, plus how many days are left in the session
// (the server reports the expiry, the token itself is unreadable here)
const useDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.all,
    queryFn: async () => {
      const { data } = await getDashboardRequest();
      const expiresAt = data.session?.expiresAt ?? null;
      const daysLeft = expiresAt
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / DAY_MS))
        : null;
      return { ...data, session: { expiresAt, daysLeft } };
    },
  });

export default useDashboard;
