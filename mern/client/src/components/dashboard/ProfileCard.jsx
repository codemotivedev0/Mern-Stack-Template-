const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const Row = ({ label, children }) => (
  <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
    <dt className="text-sm text-slate-500">{label}</dt>
    <dd className="break-all text-sm font-medium text-slate-900">{children}</dd>
  </div>
);

const ProfileCard = ({ user, sessionExpiresAt }) => (
  <section data-card className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
    <h2 className="text-base font-semibold text-slate-900">Your profile</h2>
    <p className="mt-1 text-sm text-slate-500">
      Loaded from a protected API route using your session cookie.
    </p>

    <dl className="mt-4 divide-y divide-slate-100">
      <Row label="Name">{user.name}</Row>
      <Row label="Email">{user.email}</Row>
      <Row label="User ID">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{user._id}</code>
      </Row>
      <Row label="Joined">{formatDate(user.createdAt)}</Row>
      {sessionExpiresAt && (
        <Row label="Session expires">{new Date(sessionExpiresAt).toLocaleString()}</Row>
      )}
    </dl>
  </section>
);

export default ProfileCard;
