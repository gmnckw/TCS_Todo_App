export default function ErrorState({ message, onRetry = null }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
