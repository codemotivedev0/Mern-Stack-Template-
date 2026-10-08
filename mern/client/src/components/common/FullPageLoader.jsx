const FullPageLoader = ({ label = 'Loading…' }) => (
  <div className="flex min-h-screen items-center justify-center" role="status">
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <span className="size-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
      <span className="text-sm">{label}</span>
    </div>
  </div>
);

export default FullPageLoader;
