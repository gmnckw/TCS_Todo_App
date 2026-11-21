export default function EmptyState({ title, description, action = null }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && <p className="max-w-md text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
