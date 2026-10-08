const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

const DashboardNavbar = ({ user, onLogout }) => (
  <header
    data-nav
    className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg"
  >
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
          M
        </span>
        <span className="font-semibold text-slate-900">MERN Auth</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
          {getInitials(user?.name)}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  </header>
);

export default DashboardNavbar;
