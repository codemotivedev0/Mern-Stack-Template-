import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import useAuth from '../../hooks/auth/useAuth.js';
import useDashboard from '../../hooks/dashboard/useDashboard.js';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import ProfileCard from '../../components/dashboard/ProfileCard.jsx';
import FullPageLoader from '../../components/common/FullPageLoader.jsx';

const DashboardPage = () => {
  const { logout } = useAuth();
  const container = useRef(null);
  // A 401 here ends the session automatically (see AuthProvider)
  const { data: dashboard, error, refetch, isFetching } = useDashboard();
  const ready = Boolean(dashboard);

  // Runs once when the data first arrives, not on every background refetch
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-nav]', { y: -64, autoAlpha: 0, duration: 0.6 })
          .from('[data-hero] > *', { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
          .from('[data-card]', { y: 32, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, '-=0.35')
          .from(
            '[data-count]',
            { textContent: 0, duration: 1.2, ease: 'power2.out', snap: { textContent: 1 } },
            '<'
          );
      });
    },
    { scope: container, dependencies: [ready] }
  );

  const handleLogout = async () => {
    await logout();
    toast.success('You have been logged out');
  };

  if (error && !dashboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-slate-700">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
        >
          {isFetching ? 'Retrying…' : 'Try again'}
        </button>
      </div>
    );
  }

  if (!dashboard) return <FullPageLoader label="Loading your dashboard…" />;

  const { user, stats, session } = dashboard;
  const firstName = user.name.split(' ')[0];

  return (
    <div ref={container} className="min-h-screen bg-slate-50">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div data-hero className="mb-10">
          <p className="text-sm font-medium text-indigo-600">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome, {firstName}
          </h1>
          <p className="mt-2 text-slate-500">
            You&apos;re signed in. Here&apos;s a quick look at your account.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total users"
            value={stats.totalUsers}
            hint="Accounts registered in the app"
            accent="indigo"
          />
          <StatCard
            label="Member for"
            value={stats.daysAsMember}
            suffix={stats.daysAsMember === 1 ? 'day' : 'days'}
            hint={`Since ${new Date(stats.memberSince).toLocaleDateString()}`}
            accent="violet"
          />
          <StatCard
            label="Session expires in"
            value={session.daysLeft ?? '—'}
            suffix={session.daysLeft === 1 ? 'day' : 'days'}
            hint="Kept in a secure httpOnly cookie"
            accent="sky"
          />
        </div>

        <div className="mt-5">
          <ProfileCard user={user} sessionExpiresAt={session.expiresAt} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
