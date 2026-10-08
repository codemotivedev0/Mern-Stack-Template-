const AuthSubmitButton = ({ loading, children, loadingText }) => (
  <button
    data-animate
    type="submit"
    disabled={loading}
    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
  >
    {loading && (
      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    )}
    {loading ? loadingText : children}
  </button>
);

export default AuthSubmitButton;
