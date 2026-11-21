export default function FormField({ id, label, error, hint = null, children }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const INPUT_CLASSES =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 aria-[invalid=true]:border-red-500 disabled:bg-slate-100';
