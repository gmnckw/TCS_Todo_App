export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-12 text-slate-600">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
      />
      <span>{label}</span>
    </div>
  );
}
