const VARIANT_CLASSES = Object.freeze({
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-700',
});

export default function Alert({ variant = 'success', children }) {
  const role = variant === 'error' ? 'alert' : 'status';
  return (
    <div role={role} className={`rounded-md border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}>
      {children}
    </div>
  );
}
